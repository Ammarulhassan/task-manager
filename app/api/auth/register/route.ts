import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json({ message: 'All fields required' }, { status: 400 });

    const exists = await User.findOne({ email });
    if (exists)
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });

    const user = await User.create({ name, email, password });
    const token = await signToken(user._id.toString());

    const res = NextResponse.json({ message: 'Registered successfully' }, { status: 201 });
    res.cookies.set('token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (err) {
    console.error('[REGISTER ERROR]', err);
    return NextResponse.json({ message: 'Server error', detail: String(err) }, { status: 500 });
  }
}
