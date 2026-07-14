import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Student from '@/models/Student';

export async function GET() {
  try {
    await dbConnect();
    const students = await Student.find()
      .populate('user', '-password')
      .populate('class')
      .sort({ studentId: 1 });
    return NextResponse.json(students);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // 1. Create User Account
    const user = await User.create({
      name: body.name,
      email: body.email,
      password: body.password || 'Student123',
      role: 'student',
      status: body.status || 'active',
    });

    // 2. Create Student Profile
    const student = await Student.create({
      user: user._id,
      studentId: body.studentId,
      roll: Number(body.roll),
      phone: body.phone,
      gender: body.gender,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
      class: body.class,
      section: body.section,
      status: body.status || 'active',
    });

    const populated = await Student.findById(student._id)
      .populate('user', '-password')
      .populate('class');

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
    const student = await Student.findById(id);
    if (!student) {
      return NextResponse.json({ message: 'Student profile not found' }, { status: 404 });
    }

    // Update User Auth info
    await User.findByIdAndUpdate(student.user, {
      name: body.name,
      email: body.email,
      status: body.status,
    });

    // Update Student info
    const updated = await Student.findByIdAndUpdate(
      id,
      {
        studentId: body.studentId,
        roll: Number(body.roll),
        phone: body.phone,
        gender: body.gender,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
        class: body.class,
        section: body.section,
        status: body.status,
      },
      { new: true }
    )
      .populate('user', '-password')
      .populate('class');

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

    const student = await Student.findById(id);
    if (student) {
      await User.findByIdAndDelete(student.user);
      await Student.findByIdAndDelete(id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 400 });
  }
}
