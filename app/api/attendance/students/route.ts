import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import StudentAttendance from '@/models/StudentAttendance';

export async function GET() {
  try {
    await dbConnect();
    const logs = await StudentAttendance.find()
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name' },
      })
      .populate('class')
      .sort({ date: -1, createdAt: -1 });
    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json(); // { date, logs: { studentId, classId, status }[] }
    
    if (!body.date || !body.logs || !Array.isArray(body.logs)) {
      return NextResponse.json({ message: 'Missing required parameters date or logs array' }, { status: 400 });
    }

    const date = new Date(body.date);
    date.setHours(12, 0, 0, 0); // Normalize time

    const results = [];
    for (const log of body.logs) {
      if (!log.studentId || !log.classId || !log.status) {
        return NextResponse.json({ message: 'Invalid log record payload' }, { status: 400 });
      }
      const record = await StudentAttendance.findOneAndUpdate(
        { student: log.studentId, class: log.classId, date },
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
