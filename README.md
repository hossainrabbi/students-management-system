# EduManager (Students Management System)

This is a clean, modern, and professional Students Management System built using Next.js (App Router), React 19, TypeScript, Tailwind CSS v4, Mongoose/MongoDB, and Redux Toolkit.

---

## Super Admin Credentials

For testing and verification, log in using these credentials:

- **Email**: `admin@school.com`
- **Password**: `Admin123`

---

## Modules Included

The system implements strictly the following core modules:

1. **Dashboard Overview**: Total stats, 7-day student attendance area chart, and recent students/teachers registry feeds.
2. **Academic Management**:
   - **Classes**: Name, section, room allocation, and status.
   - **Subjects**: Code, name, class assignment, teacher assignment, and status.
3. **User Management**:
   - **Students**: Roll numbers, student IDs, name, email, phone, gender, date of birth, class, and status.
   - **Departments**: Academic departments, codes, and descriptions.
   - **Teachers**: Employee IDs, name, email, phone, department, assigned courses, and status.
4. **Attendance Tracking**:
   - **Student Attendance**: Log, view, and mark present/absent/late attendance.
   - **Teacher Attendance**: Log, view, and mark present/absent/late attendance.

---

## Auto-Seeded Dataset

The database auto-seeds the following dataset on first run:

- **Classes**: 6 classes (Class 1 to Class 6)
- **Subjects**: 10 curriculum subjects
- **Departments**: 4 departments (CS, EE, Sciences, Humanities)
- **Teachers**: 15 teachers
- **Students**: 100 students
- **Attendance**: 30 days of student and teacher attendance history logs

---

## How to Run & Verify

1. **Install Dependencies**:

   ```bash
   pnpm install
   ```

2. **Seed Database**:

   ```bash
   pnpm seed
   ```

3. **Start Dev Server**:

   ```bash
   pnpm run dev
   ```

4. **Compile Production Build**:
   ```bash
   pnpm run build
   ```
