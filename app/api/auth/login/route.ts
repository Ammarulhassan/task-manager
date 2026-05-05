import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

    const token = await signToken(user._id.toString());
    const res = NextResponse.json({
      user: { _id: user._id, name: user.name, email: user.email }
    });
    res.cookies.set('token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    return NextResponse.json({ message: 'Server error', detail: String(err) }, { status: 500 });
  }
}
