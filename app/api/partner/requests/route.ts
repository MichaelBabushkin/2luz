import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PartnerRequest from '@/models/PartnerRequest';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get incoming pending requests (requests sent TO this user)
    const incomingRequests = await PartnerRequest.find({
      toUserId: session.userId,
      status: 'pending'
    }).populate('fromUserId', 'name email partnerCode');

    // Get outgoing pending requests (requests sent BY this user)
    const outgoingRequests = await PartnerRequest.find({
      fromUserId: session.userId,
      status: 'pending'
    }).populate('toUserId', 'name email');

    return NextResponse.json({
      incoming: incomingRequests.map(req => ({
        id: req._id,
        from: {
          id: (req.fromUserId as any)._id,
          name: (req.fromUserId as any).name,
          email: (req.fromUserId as any).email,
        },
        createdAt: req.createdAt
      })),
      outgoing: outgoingRequests.map(req => ({
        id: req._id,
        to: {
          id: (req.toUserId as any)._id,
          name: (req.toUserId as any).name,
        },
        createdAt: req.createdAt
      }))
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
