import mongoose from 'mongoose';
import User from '../models/User';
import Class from '../models/Class';
import Subject from '../models/Subject';
import Department from '../models/Department';
import Teacher from '../models/Teacher';
import Student from '../models/Student';
import StudentAttendance from '../models/StudentAttendance';
import TeacherAttendance from '../models/TeacherAttendance';

// Mock generators
const FIRST_NAMES = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Matthew', 'Lisa',
  'Anthony', 'Betty', 'Mark', 'Margaret', 'Donald', 'Sandra', 'Steven', 'Ashley'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez'
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomName(): string {
  return `${getRandomElement(FIRST_NAMES)} ${getRandomElement(LAST_NAMES)}`;
}

export async function seedDemoData() {
  console.log('--- STARTING UNIVERSITY CAPSTONE SEEDING ---');

  try {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
      console.log('✓ Dropped existing database to avoid index/schema conflicts.');
    }

    // 1. Seed Super Admin
    let admin = await User.findOne({ email: 'admin@school.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Super Admin',
        email: 'admin@school.com',
        password: 'Admin123',
        role: 'super_admin',
        status: 'active',
      });
      console.log('✓ Super Admin created.');
    } else {
      console.log('✓ Super Admin already exists.');
    }

    // 2. Seed 4 Departments
    const deptsData = [
      { name: 'Computer Science', code: 'CS', description: 'Department of Computer Science and Engineering' },
      { name: 'Electrical Engineering', code: 'EE', description: 'Department of Electrical & Electronic Engineering' },
      { name: 'Sciences', code: 'SCI', description: 'Department of Physics, Chemistry & Natural Sciences' },
      { name: 'Humanities', code: 'HUM', description: 'Department of English, Literature & Social Sciences' },
    ];
    const seededDepts = [];
    for (const d of deptsData) {
      let dept = await Department.findOne({ code: d.code });
      if (!dept) {
        dept = await Department.create(d);
        console.log(`✓ Department "${d.name}" created.`);
      }
      seededDepts.push(dept);
    }

    // 3. Seed 6 Classes
    const classesData = [
      { name: 'Class 1', section: 'A', roomNo: 'Room 101' },
      { name: 'Class 2', section: 'A', roomNo: 'Room 102' },
      { name: 'Class 3', section: 'A', roomNo: 'Room 103' },
      { name: 'Class 4', section: 'A', roomNo: 'Room 104' },
      { name: 'Class 5', section: 'A', roomNo: 'Room 105' },
      { name: 'Class 6', section: 'A', roomNo: 'Room 106' },
    ];
    const seededClasses = [];
    for (const c of classesData) {
      let cls = await Class.findOne({ name: c.name, section: c.section });
      if (!cls) {
        cls = await Class.create(c);
        console.log(`✓ Class "${c.name}" created.`);
      }
      seededClasses.push(cls);
    }

    // 4. Seed 15 Teachers
    const seededTeachers = [];
    for (let i = 1; i <= 15; i++) {
      const empId = `TCH${1000 + i}`;
      let teacherProfile = await Teacher.findOne({ employeeId: empId });
      if (!teacherProfile) {
        const name = generateRandomName();
        const email = `${name.toLowerCase().replace(' ', '.')}@school.com`;
        
        let teacherUser = await User.findOne({ email });
        if (!teacherUser) {
          teacherUser = await User.create({
            name,
            email,
            password: 'Teacher123',
            role: 'teacher',
            status: 'active',
          });
        }

        const dept = getRandomElement(seededDepts);
        teacherProfile = await Teacher.create({
          user: teacherUser._id,
          employeeId: empId,
          phone: `555-01${10 + i}`,
          department: dept._id,
          assignedSubjects: [],
          status: 'active',
        });
        console.log(`✓ Teacher "${name}" [${empId}] created.`);
      }
      seededTeachers.push(teacherProfile);
    }

    // 5. Seed 10 Subjects
    const subjectsData = [
      { name: 'Introduction to Programming', code: 'CS101' },
      { name: 'Calculus I', code: 'MATH101' },
      { name: 'Physics I', code: 'PHYS101' },
      { name: 'English Literature', code: 'ENG101' },
      { name: 'Database Systems', code: 'CS201' },
      { name: 'Linear Algebra', code: 'MATH201' },
      { name: 'Chemistry I', code: 'CHEM101' },
      { name: 'World History', code: 'HIST101' },
      { name: 'Data Structures', code: 'CS301' },
      { name: 'Discrete Mathematics', code: 'MATH301' },
    ];
    const seededSubjects = [];
    for (let i = 0; i < subjectsData.length; i++) {
      const sub = subjectsData[i];
      let subject = await Subject.findOne({ code: sub.code });
      if (!subject) {
        const cls = seededClasses[i % seededClasses.length];
        const teacher = seededTeachers[i % seededTeachers.length];
        
        subject = await Subject.create({
          name: sub.name,
          code: sub.code,
          assignedClass: cls._id,
          assignedTeacher: teacher.user, // reference to user
          status: 'active',
        });

        // Add to teacher's assigned subjects list
        await Teacher.findByIdAndUpdate(teacher._id, {
          $addToSet: { assignedSubjects: subject._id }
        });

        console.log(`✓ Subject "${sub.name}" [${sub.code}] created.`);
      }
      seededSubjects.push(subject);
    }

    // 6. Seed 100 Students
    const seededStudents = [];
    for (let i = 1; i <= 100; i++) {
      const stdId = `STD${10000 + i}`;
      let studentProfile = await Student.findOne({ studentId: stdId });
      if (!studentProfile) {
        const name = generateRandomName();
        const email = `${name.toLowerCase().replace(' ', '.')}@school.com`;

        let studentUser = await User.findOne({ email });
        if (!studentUser) {
          studentUser = await User.create({
            name,
            email,
            password: 'Student123',
            role: 'student',
            status: 'active',
          });
        }

        const cls = seededClasses[i % seededClasses.length];
        const genders: ('male' | 'female' | 'other')[] = ['male', 'female', 'other'];
        studentProfile = await Student.create({
          user: studentUser._id,
          studentId: stdId,
          roll: i,
          phone: `555-02${10 + (i % 90)}`,
          gender: i % 2 === 0 ? 'female' : 'male',
          dateOfBirth: new Date(`2008-0${(i % 9) + 1}-15`),
          class: cls._id,
          section: cls.section,
          status: 'active',
        });
        console.log(`✓ Student "${name}" [${stdId}] created.`);
      }
      seededStudents.push(studentProfile);
    }

    // 7. Seed Student Attendance (30 days logs)
    const studentCount = await StudentAttendance.countDocuments();
    if (studentCount === 0) {
      console.log('Generating 30 days of Student Attendance logs...');
      const logs = [];
      const now = new Date();
      for (let day = 0; day < 30; day++) {
        const date = new Date();
        date.setDate(now.getDate() - day);
        // Skip Sundays
        if (date.getDay() === 0) continue;

        for (const student of seededStudents) {
          const rand = Math.random();
          const status = rand > 0.9 ? 'Absent' : rand > 0.8 ? 'Late' : 'Present';
          logs.push({
            student: student._id,
            class: student.class,
            date,
            status,
          });
        }
      }
      // Chunk inserts for speed
      const chunkSize = 1000;
      for (let i = 0; i < logs.length; i += chunkSize) {
        await StudentAttendance.insertMany(logs.slice(i, i + chunkSize));
      }
      console.log(`✓ Generated Student Attendance logs.`);
    }

    // 8. Seed Teacher Attendance (30 days logs)
    const teacherCount = await TeacherAttendance.countDocuments();
    if (teacherCount === 0) {
      console.log('Generating 30 days of Teacher Attendance logs...');
      const logs = [];
      const now = new Date();
      for (let day = 0; day < 30; day++) {
        const date = new Date();
        date.setDate(now.getDate() - day);
        // Skip Sundays
        if (date.getDay() === 0) continue;

        for (const teacher of seededTeachers) {
          const rand = Math.random();
          const status = rand > 0.95 ? 'Absent' : rand > 0.9 ? 'Late' : 'Present';
          logs.push({
            teacher: teacher._id,
            date,
            status,
          });
        }
      }
      await TeacherAttendance.insertMany(logs);
      console.log(`✓ Generated Teacher Attendance logs.`);
    }

    console.log('--- DATABASE SEEDING COMPLETED SUCCESS ---');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}

export async function seedDefaultAdmin() {
  await seedDemoData();
}
