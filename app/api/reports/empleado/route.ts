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
    let page = pdfDoc.getPages()[0];
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Título principal
    page.drawText('Reporte por Empleado', {
      x: 200, y: 690, size: 15, font, color: rgb(0.6, 0.1, 0.1)
    });

    // Coordenadas y estilos para la tabla
    // Ajuste: tabla más pequeña y centrada
    const colWidths = [100, 70, 70, 70, 90, 90]; // antes: [130, 90, 90, 90, 110, 110]
    const totalTableWidth = colWidths.reduce((a, b) => a + b, 0);
    const startX = 45; // antes: 25
    const startY = 500, rowHeight = 22;
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
    // Utilidad para dividir texto en varias líneas según ancho máximo
    function splitTextToLines(text: string, maxWidth: number, font: any, fontSize: number) {
      const words = String(text).split(' ');
      let lines: string[] = [];
      let currentLine = '';
      for (let word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    }
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
      // Calcular la altura máxima de la fila según el contenido
      let maxLines = 1;
      const cellLinesArr = row.map((cell, i) => {
        const cellStr = String(cell);
        let lines: string[] = [];
        if (i === 0) { // Nombres: salto de línea especial entre segundo nombre y primer apellido
          const nameParts = cellStr.trim().split(/\s+/);
          if (nameParts.length >= 4) {
            // Primer y segundo nombre en la primera línea, apellidos en la segunda
            lines = [nameParts.slice(0, 2).join(' '), nameParts.slice(2).join(' ')];
          } else if (nameParts.length === 3) {
            // Un nombre y dos apellidos
            lines = [nameParts[0], nameParts.slice(1).join(' ')];
          } else {
            // Nombre corto, usar lógica de ajuste por ancho
            lines = splitTextToLines(cellStr, colWidths[i] - 12, font, 8.5);
          }
        } else if (i === 4 || i === 5) { // 4/5: ubicaciones
          const parts = cellStr.split(/,| /).filter(Boolean);
          let currentLine = '';
          for (let part of parts) {
            const testLine = currentLine ? currentLine + (cellStr.includes(',') ? ',' : ' ') + part : part;
            const testWidth = font.widthOfTextAtSize(testLine, 8.5);
            if (testWidth > colWidths[i] - 8 && currentLine) {
              lines.push(currentLine);
              currentLine = part;
            } else {
              currentLine = testLine;
            }
          }
          if (currentLine) lines.push(currentLine);
        } else {
          lines = splitTextToLines(cellStr, colWidths[i] - 8, font, 8.5);
        }
        if (lines.length > maxLines) maxLines = lines.length;
        return lines;
      });
      const actualRowHeight = rowHeight * maxLines;
      // Redibujar fondo y líneas si la fila es más alta
      if (maxLines > 1) {
        if (rowIdx % 2 === 0) {
          page.drawRectangle({ x: startX, y: y - actualRowHeight, width: colWidths.reduce((a, b) => a + b, 0), height: actualRowHeight, color: rgb(0.98, 0.98, 0.98) });
        }
        let colX2 = startX;
        for (let i = 0; i <= headers.length; i++) {
          page.drawLine({ start: { x: colX2, y: y }, end: { x: colX2, y: y - actualRowHeight }, thickness: 1, color: rgb(0.8,0.8,0.8) });
          if (i < headers.length) colX2 += colWidths[i];
        }
      }
      // Dibujar texto de cada celda, línea por línea
      x = startX;
      row.forEach((cell, i) => {
        const lines = cellLinesArr[i];
        const colCenter = x + colWidths[i] / 2;
        lines.forEach((line, lineIdx) => {
          const textWidth = font.widthOfTextAtSize(line, 8.5);
          page.drawText(line, {
            x: colCenter - textWidth / 2,
            y: y - rowHeight/2 + 2 - (lineIdx * rowHeight),
            size: 8.5,
            font,
            color: rgb(0.2,0.2,0.2)
          });
        });
        x += colWidths[i];
      });
      // Línea horizontal inferior de la fila
      page.drawLine({ start: { x: startX, y: y - actualRowHeight }, end: { x: startX + colWidths.reduce((a, b) => a + b, 0), y: y - actualRowHeight }, thickness: 1, color: rgb(0.8,0.8,0.8) });
      y -= actualRowHeight;
      // --- Salto de página si la siguiente fila se sale del margen inferior ---
      if (y - actualRowHeight < 80 && rowIdx < rows.length - 1) {
        // Nueva página
        const newPage = pdfDoc.addPage([page.getWidth(), page.getHeight()]);
        page = newPage;
        y = startY;
        // Redibujar encabezado de tabla en la nueva página
        x = startX;
        page.drawRectangle({ x, y: y - rowHeight, width: colWidths.reduce((a, b) => a + b, 0), height: rowHeight, color: rgb(0.7, 0.1, 0.1) });
        let colX = startX;
        for (let i = 0; i <= headers.length; i++) {
          page.drawLine({ start: { x: colX, y: y }, end: { x: colX, y: y - rowHeight }, thickness: 1, color: rgb(0.5,0.5,0.5) });
          if (i < headers.length) colX += colWidths[i];
        }
        x = startX;
        headers.forEach((header, i) => {
          const textWidth = font.widthOfTextAtSize(header, 9);
          const colCenter = x + colWidths[i] / 2;
          page.drawText(header, { x: colCenter - textWidth / 2, y: y - rowHeight/2 + 3, size: 9, font, color: rgb(1,1,1) });
          x += colWidths[i];
        });
        y -= rowHeight;
      }
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
