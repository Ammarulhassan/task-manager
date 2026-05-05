import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Task from '@/lib/models/Task';
import { getAuthUser } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const task = await Task.findOneAndUpdate({ _id: id, user: auth.id }, body, { new: true });
    if (!task) return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    return NextResponse.json({ task });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const { id } = await params;
    const task = await Task.findOneAndDelete({ _id: id, user: auth.id });
    if (!task) return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    return NextResponse.json({ message: 'Task deleted' });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
