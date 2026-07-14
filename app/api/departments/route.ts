import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Department from '@/models/Department';

export async function GET() {
  try {
    await dbConnect();
    const departments = await Department.find().sort({ code: 1 });
    return NextResponse.json(departments);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const newDept = await Department.create({
      name: body.name,
      code: body.code.toUpperCase(),
      description: body.description,
    });
    return NextResponse.json(newDept, { status: 201 });
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
    const updated = await Department.findByIdAndUpdate(
      id,
      {
        name: body.name,
        code: body.code.toUpperCase(),
        description: body.description,
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
    await Department.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 400 });
  }
}
