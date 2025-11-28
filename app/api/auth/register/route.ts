import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a short unique code for partner linking
    const partnerCode = nanoid(6).toUpperCase();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      partnerCode,
    });

    // Create session
    await createSession({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    return NextResponse.json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        partnerCode: user.partnerCode,
      }
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
