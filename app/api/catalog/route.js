import { NextResponse } from 'next/server';
import { STONE_CATALOG } from '@/app/data/catalog';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: STONE_CATALOG,
  });
}
