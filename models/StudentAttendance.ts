import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentAttendance extends Document {
  student: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  date: Date;
  status: 'Present' | 'Absent' | 'Late';
  createdAt: Date;
  updatedAt: Date;
}

const StudentAttendanceSchema = new Schema<IStudentAttendance>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true },
  },
  { timestamps: true }
);

// Index to avoid duplicate attendance entry for same student, class, and date
StudentAttendanceSchema.index({ student: 1, class: 1, date: 1 }, { unique: true });

const StudentAttendance =
  mongoose.models.StudentAttendance ||
  mongoose.model<IStudentAttendance>('StudentAttendance', StudentAttendanceSchema);

export default StudentAttendance;
