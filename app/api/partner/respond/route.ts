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

    const { requestId, action } = await req.json();

    if (!requestId || !action) {
      return NextResponse.json({ error: 'Request ID and action are required' }, { status: 400 });
    }

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json({ error: 'Action must be "approve" or "reject"' }, { status: 400 });
    }

    // Find the request
    const request = await PartnerRequest.findById(requestId);

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Verify this user is the recipient
    if (request.toUserId.toString() !== session.userId) {
      return NextResponse.json({ error: 'Unauthorized to respond to this request' }, { status: 403 });
    }

    // Check if request is still pending
    if (request.status !== 'pending') {
      return NextResponse.json({ error: 'Request has already been processed' }, { status: 400 });
    }

    if (action === 'approve') {
      // Update both users' partnerId
      await User.findByIdAndUpdate(session.userId, { partnerId: request.fromUserId });
      await User.findByIdAndUpdate(request.fromUserId, { partnerId: session.userId });
      
      // Mark request as approved
      request.status = 'approved';
      await request.save();

      return NextResponse.json({ 
        message: 'Partner request approved! You are now linked.',
        status: 'approved'
      }, { status: 200 });

    } else {
      // Mark request as rejected
      request.status = 'rejected';
      await request.save();

      return NextResponse.json({ 
        message: 'Partner request rejected',
        status: 'rejected'
      }, { status: 200 });
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
