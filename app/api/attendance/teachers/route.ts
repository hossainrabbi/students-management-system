import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import TeacherAttendance from '@/models/TeacherAttendance';

export async function GET() {
  try {
    await dbConnect();
    const logs = await TeacherAttendance.find()
      .populate({
        path: 'teacher',
        populate: { path: 'user', select: 'name' },
      })
      .sort({ date: -1, createdAt: -1 });
    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json(); // { date, logs: { teacherId, status }[] }
    
    if (!body.date || !body.logs || !Array.isArray(body.logs)) {
      return NextResponse.json({ message: 'Missing required parameters date or logs array' }, { status: 400 });
    }

    const date = new Date(body.date);
    date.setHours(12, 0, 0, 0); // Normalize time

    const results = [];
    for (const log of body.logs) {
      if (!log.teacherId || !log.status) {
        return NextResponse.json({ message: 'Invalid log record payload' }, { status: 400 });
      }
      const record = await TeacherAttendance.findOneAndUpdate(
        { teacher: log.teacherId, date },
        { status: log.status },
        { new: true, upsert: true }
      );
      results.push(record);
    }

    return NextResponse.json(results, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 400 });
  }
}
