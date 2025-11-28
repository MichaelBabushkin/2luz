import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import PartnerRequest from '@/models/PartnerRequest';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { partnerCode } = await req.json();

    if (!partnerCode) {
      return NextResponse.json({ error: 'Partner code is required' }, { status: 400 });
    }

    // Find the partner by their code
    const partner = await User.findOne({ partnerCode: partnerCode.toUpperCase() });

    if (!partner) {
      return NextResponse.json({ error: 'Invalid partner code' }, { status: 404 });
    }

    // Can't link to yourself
    if (partner._id.toString() === session.userId) {
      return NextResponse.json({ error: 'You cannot link to yourself' }, { status: 400 });
    }

    // Check if already linked
    const currentUser = await User.findById(session.userId);
    if (currentUser?.partnerId) {
      return NextResponse.json({ error: 'You are already linked to a partner' }, { status: 400 });
    }

    if (partner.partnerId) {
      return NextResponse.json({ error: 'This user is already linked to someone else' }, { status: 400 });
    }

    // Check for existing pending request (either direction)
    const existingRequest = await PartnerRequest.findOne({
      $or: [
        { fromUserId: session.userId, toUserId: partner._id, status: 'pending' },
        { fromUserId: partner._id, toUserId: session.userId, status: 'pending' }
      ]
    });

    if (existingRequest) {
      return NextResponse.json({ error: 'A pending request already exists' }, { status: 400 });
    }

    // Create the partner request
    const request = await PartnerRequest.create({
      fromUserId: session.userId,
      toUserId: partner._id,
      status: 'pending'
    });

    return NextResponse.json({ 
      message: 'Partner request sent successfully',
      request: {
        id: request._id,
        partnerName: partner.name,
        status: request.status
      }
    }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
