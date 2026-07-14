import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacherAttendance extends Document {
  teacher: mongoose.Types.ObjectId;
  date: Date;
  status: 'Present' | 'Absent' | 'Late';
  createdAt: Date;
  updatedAt: Date;
}

const TeacherAttendanceSchema = new Schema<ITeacherAttendance>(
  {
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true },
  },
  { timestamps: true }
);

// Index to avoid duplicate attendance entry for same teacher and date
TeacherAttendanceSchema.index({ teacher: 1, date: 1 }, { unique: true });

const TeacherAttendance =
  mongoose.models.TeacherAttendance ||
  mongoose.model<ITeacherAttendance>('TeacherAttendance', TeacherAttendanceSchema);

export default TeacherAttendance;
