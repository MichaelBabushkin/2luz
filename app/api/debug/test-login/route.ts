import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const hasPassword = !!user.password;
    const passwordValue = user.password;
    const passwordLength = user.password?.length || 0;
    
    let comparisonResult = false;
    if (user.password) {
      comparisonResult = await bcrypt.compare(password, user.password);
    }

    return NextResponse.json({ 
      hasPassword,
      passwordLength,
      passwordStartsWith: passwordValue?.substring(0, 7),
      inputPassword: password,
      comparisonResult,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
