import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    const user = await User.findOne({ email: "michael@test.com" });
    
    if (!user) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    return NextResponse.json({ 
      exists: true,
      user: {
        name: user.name,
        email: user.email,
        hasPassword: !!user.password,
        passwordLength: user.password?.length || 0,
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
