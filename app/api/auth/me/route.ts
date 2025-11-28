import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    await dbConnect();
    const user = await User.findById(session.userId).select('name email partnerCode partnerId');
    
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ 
      user: {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        partnerCode: user.partnerCode,
        partnerId: user.partnerId?.toString() || null,
      }
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
