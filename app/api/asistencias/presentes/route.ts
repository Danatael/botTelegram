import { NextResponse } from 'next/server';
import { getPresentesHoy } from '@/lib/asistencia-service';

export async function GET() {
  const count = await getPresentesHoy();
  return NextResponse.json({ presentes: count });
}
