import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

// GET /api/reports/empleado?empleadoId=1&periodo=mes
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const empleadoId = Number(searchParams.get('empleadoId'));
    const periodo = searchParams.get('periodo') || 'mes';
    if (!empleadoId) {
      return NextResponse.json({ error: 'Falta el parámetro empleadoId' }, { status: 400 });
    }

    // Rango de fechas según periodo
    const now = new Date();
    let start: Date, end: Date;
    if (periodo === 'dia') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(start); end.setDate(start.getDate() + 1);
    } else if (periodo === 'semana') {
      const day = now.getDay() || 7;
      start = new Date(now); start.setDate(now.getDate() - day + 1);
      start.setHours(0,0,0,0);
      end = new Date(start); end.setDate(start.getDate() + 7);
    } else if (periodo === 'año') {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear() + 1, 0, 1);
    } else { // mes
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    // Obtener datos de asistencia del empleado en el rango
    const entradas = await prisma.entradas.findMany({
      where: {
        empleado_id: empleadoId,
        hora_entrada: { gte: start, lt: end },
      },
      include: {
        empleado: true,
        asistencia: { include: { salidas: true } },
      },
      orderBy: { hora_entrada: 'asc' },
    });

    // Construir filas de la tabla
    const rows = entradas.map((entrada) => {
      const salida = entrada.asistencia?.salidas?.[0];
      return [
        entrada.empleado?.nombre || '-',
        entrada.hora_entrada ? new Date(entrada.hora_entrada).toLocaleDateString() : '-',
        entrada.hora_entrada ? new Date(entrada.hora_entrada).toLocaleTimeString() : '-',
        salida?.hora_salida ? new Date(salida.hora_salida).toLocaleTimeString() : '-',
        entrada.ubicacion || '-',
        salida?.ubicacion || '-',
      ];
    });

    // Leer plantilla base desde public
    const templatePath = path.join(process.cwd(), 'public', 'Membrete S.C..pdf');
    const templateBytes = await fs.readFile(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);
    const page = pdfDoc.getPages()[0];
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Título principal
    page.drawText('Reporte por Empleado', {
      x: 200, y: 690, size: 15, font, color: rgb(0.6, 0.1, 0.1)
    });

    // Coordenadas y estilos para la tabla
    const startX = 45, startY = 500, rowHeight = 22, colWidths = [90, 70, 70, 70, 80, 80];
    const headers = ['Empleado', 'Fecha', 'Hora Entrada', 'Hora Salida', 'Ubicación Entrada', 'Ubicación Salida'];
    let y = startY;
    // Dibujar fondo rojo de encabezado
    let x = startX;
    page.drawRectangle({ x, y: y - rowHeight, width: colWidths.reduce((a, b) => a + b, 0), height: rowHeight, color: rgb(0.7, 0.1, 0.1) });
    // Dibujar líneas verticales del encabezado
    let colX = startX;
    for (let i = 0; i <= headers.length; i++) {
      page.drawLine({ start: { x: colX, y: y }, end: { x: colX, y: y - rowHeight }, thickness: 1, color: rgb(0.5,0.5,0.5) });
      if (i < headers.length) colX += colWidths[i];
    }
    // Dibujar encabezados centrados
    x = startX;
    headers.forEach((header, i) => {
      const textWidth = font.widthOfTextAtSize(header, 9);
      const colCenter = x + colWidths[i] / 2;
      page.drawText(header, { x: colCenter - textWidth / 2, y: y - rowHeight/2 + 3, size: 9, font, color: rgb(1,1,1) });
      x += colWidths[i];
    });
    // Dibujar filas
    y -= rowHeight;
    rows.forEach((row, rowIdx) => {
      x = startX;
      // Fondo zebra
      if (rowIdx % 2 === 0) {
        page.drawRectangle({ x, y: y - rowHeight, width: colWidths.reduce((a, b) => a + b, 0), height: rowHeight, color: rgb(0.98, 0.98, 0.98) });
      }
      // Líneas verticales de la fila
      let colX = startX;
      for (let i = 0; i <= headers.length; i++) {
        page.drawLine({ start: { x: colX, y: y }, end: { x: colX, y: y - rowHeight }, thickness: 1, color: rgb(0.8,0.8,0.8) });
        if (i < headers.length) colX += colWidths[i];
      }
      // Texto de la fila
      x = startX;
      row.forEach((cell, i) => {
        let cellText = cell;
        if (i === 4 || i === 5) {
          cellText = String(cell).length > 18 ? String(cell).slice(0, 17) + '…' : cell;
        }
        const textWidth = font.widthOfTextAtSize(cellText, 8.5);
        const colCenter = x + colWidths[i] / 2;
        page.drawText(cellText, { x: colCenter - textWidth / 2, y: y - rowHeight/2 + 2, size: 8.5, font, color: rgb(0.2,0.2,0.2) });
        x += colWidths[i];
      });
      // Línea horizontal inferior de la fila
      page.drawLine({ start: { x: startX, y: y - rowHeight }, end: { x: startX + colWidths.reduce((a, b) => a + b, 0), y: y - rowHeight }, thickness: 1, color: rgb(0.8,0.8,0.8) });
      y -= rowHeight;
    });
    // Línea horizontal superior de la tabla
    page.drawLine({ start: { x: startX, y: startY }, end: { x: startX + colWidths.reduce((a, b) => a + b, 0), y: startY }, thickness: 1, color: rgb(0.5,0.5,0.5) });

    // Generar PDF final
    const pdfBytes = await pdfDoc.save();
    return new Response(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="reporte-empleado.pdf"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
