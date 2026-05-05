import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Task from '@/lib/models/Task';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const tasks = await Task.find({ user: auth.id }).sort({ createdAt: -1 });
    return NextResponse.json({ tasks });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const body = await req.json();
    const task = await Task.create({ ...body, user: auth.id });
    return NextResponse.json({ task }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
