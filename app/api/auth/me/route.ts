import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const user = await User.findById(auth.id).select('-password');
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
