import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Teacher from '@/models/Teacher';

export async function GET() {
  try {
    await dbConnect();
    const teachers = await Teacher.find()
      .populate('user', '-password')
      .populate('department')
      .populate('assignedSubjects')
      .sort({ employeeId: 1 });
    return NextResponse.json(teachers);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // 1. Create User
    const user = await User.create({
      name: body.name,
      email: body.email,
      password: body.password || 'Teacher123',
      role: 'teacher',
      status: body.status || 'active',
    });

    // 2. Create Teacher profile
    const teacher = await Teacher.create({
      user: user._id,
      employeeId: body.employeeId,
      phone: body.phone,
      department: body.department,
      assignedSubjects: body.assignedSubjects || [],
      status: body.status || 'active',
    });

    const populated = await Teacher.findById(teacher._id)
      .populate('user', '-password')
      .populate('department')
      .populate('assignedSubjects');
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
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return NextResponse.json({ message: 'Teacher profile not found' }, { status: 404 });
    }

    // Update User Auth info
    await User.findByIdAndUpdate(teacher.user, {
      name: body.name,
      email: body.email,
      status: body.status,
    });

    // Update Teacher info
    const updated = await Teacher.findByIdAndUpdate(
      id,
      {
        employeeId: body.employeeId,
        phone: body.phone,
        department: body.department,
        assignedSubjects: body.assignedSubjects || [],
        status: body.status,
      },
      { new: true }
    )
      .populate('user', '-password')
      .populate('department')
      .populate('assignedSubjects');

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

    const teacher = await Teacher.findById(id);
    if (teacher) {
      await User.findByIdAndDelete(teacher.user);
      await Teacher.findByIdAndDelete(id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 400 });
  }
}
