import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Subject from '@/models/Subject';

export async function GET() {
  try {
    await dbConnect();
    const subjects = await Subject.find()
      .populate('assignedClass')
      .populate('assignedTeacher', 'name')
      .sort({ code: 1 });
    return NextResponse.json(subjects);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const newSubject = await Subject.create({
      name: body.name,
      code: body.code.toUpperCase(),
      assignedClass: body.assignedClass,
      assignedTeacher: body.assignedTeacher || undefined,
      status: body.status || 'active',
    });
    const populated = await Subject.findById(newSubject._id)
      .populate('assignedClass')
      .populate('assignedTeacher', 'name');
    return NextResponse.json(populated, { status: 201 });
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
    const updated = await Subject.findByIdAndUpdate(
      id,
      {
        name: body.name,
        code: body.code.toUpperCase(),
        assignedClass: body.assignedClass,
        assignedTeacher: body.assignedTeacher || undefined,
        status: body.status,
      },
      { new: true }
    )
      .populate('assignedClass')
      .populate('assignedTeacher', 'name');
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
    await Subject.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 400 });
  }
}
