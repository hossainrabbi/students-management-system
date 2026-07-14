import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Class from '@/models/Class';

export async function GET() {
  try {
    await dbConnect();
    const classes = await Class.find().sort({ name: 1, section: 1 });
    return NextResponse.json(classes);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const newClass = await Class.create({
      name: body.name,
      section: body.section,
      roomNo: body.roomNo,
      status: body.status || 'active',
    });
    return NextResponse.json(newClass, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ message: 'Missing ID' }, { status: 400 });
    const body = await req.json();
    const updated = await Class.findByIdAndUpdate(
      id,
      {
        name: body.name,
        section: body.section,
        roomNo: body.roomNo,
        status: body.status,
      },
      { new: true }
    );
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ message: 'Missing ID' }, { status: 400 });
    await Class.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 400 });
  }
}
