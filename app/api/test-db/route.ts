import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ status: 'success', message: 'Connected to MongoDB!' }, { status: 200 });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
