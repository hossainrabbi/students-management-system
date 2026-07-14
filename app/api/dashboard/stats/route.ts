import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import Class from '@/models/Class';
import Subject from '@/models/Subject';
import Department from '@/models/Department';
import StudentAttendance from '@/models/StudentAttendance';
import TeacherAttendance from '@/models/TeacherAttendance';

export async function GET() {
  try {
    await dbConnect();

    // 1. Core tallies
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const totalClasses = await Class.countDocuments();
    const totalSubjects = await Subject.countDocuments();

    // 2. Today's logs
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayStudentAttendance = await StudentAttendance.countDocuments({
      date: { $gte: startOfToday, $lte: endOfToday }
    });

    const todayTeacherAttendance = await TeacherAttendance.countDocuments({
      date: { $gte: startOfToday, $lte: endOfToday }
    });

    // 3. Student Attendance Trend (last 30 days)
    const trendData = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);

      // Skip Sundays from trend graph
      if (d.getDay() === 0) continue;

      const presentCount = await StudentAttendance.countDocuments({
        date: { $gte: start, $lte: end },
        status: 'Present'
      });
      const absentCount = await StudentAttendance.countDocuments({
        date: { $gte: start, $lte: end },
        status: 'Absent'
      });
      const lateCount = await StudentAttendance.countDocuments({
        date: { $gte: start, $lte: end },
        status: 'Late'
      });

      trendData.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        Present: presentCount,
        Absent: absentCount,
        Late: lateCount,
      });
    }

    // 4. Attendance Distribution (Present, Absent, Late)
    const totalPresent = await StudentAttendance.countDocuments({ status: 'Present' });
    const totalAbsent = await StudentAttendance.countDocuments({ status: 'Absent' });
    const totalLate = await StudentAttendance.countDocuments({ status: 'Late' });
    const distributionData = [
      { name: 'Present', value: totalPresent, color: '#10b981' },
      { name: 'Absent', value: totalAbsent, color: '#ef4444' },
      { name: 'Late', value: totalLate, color: '#f59e0b' },
    ];

    // 5. Students by Class (Class 1 to Class 6)
    const classesList = await Class.find().sort({ name: 1 });
    const studentsByClass = await Promise.all(
      classesList.map(async (cls) => {
        const count = await Student.countDocuments({ class: cls._id });
        return {
          name: cls.name,
          Students: count,
        };
      })
    );

    // 6. Teachers by Department
    const deptsList = await Department.find().sort({ name: 1 });
    const teachersByDept = await Promise.all(
      deptsList.map(async (dept) => {
        const count = await Teacher.countDocuments({ department: dept._id });
        return {
          name: dept.name,
          Teachers: count,
        };
      })
    );

    // 7. Recent Students (latest 5)
    const recentStudents = await Student.find()
      .populate('user', 'name email status')
      .populate('class', 'name section')
      .sort({ createdAt: -1 })
      .limit(5);

    // 8. Recent Teachers (latest 5)
    const recentTeachers = await Teacher.find()
      .populate('user', 'name email status')
      .populate('department', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // 9. Recent Student Attendance (latest 10)
    const recentStudentAttendance = await StudentAttendance.find()
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name' },
      })
      .populate('class', 'name')
      .sort({ date: -1, createdAt: -1 })
      .limit(10);

    // 10. Recent Teacher Attendance (latest 10)
    const recentTeacherAttendance = await TeacherAttendance.find()
      .populate({
        path: 'teacher',
        populate: { path: 'user', select: 'name' },
      })
      .sort({ date: -1, createdAt: -1 })
      .limit(10);

    return NextResponse.json({
      totalStudents,
      totalTeachers,
      totalClasses,
      totalSubjects,
      todayStudentAttendance,
      todayTeacherAttendance,
      trendData,
      distributionData,
      studentsByClass,
      teachersByDept,
      recentStudents,
      recentTeachers,
      recentStudentAttendance,
      recentTeacherAttendance,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
