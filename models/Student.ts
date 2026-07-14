import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  user: mongoose.Types.ObjectId;
  studentId: string;
  roll: number;
  phone: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: Date;
  class: mongoose.Types.ObjectId;
  section: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    studentId: { type: String, required: true, unique: true, trim: true },
    roll: { type: Number, required: true },
    phone: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    dateOfBirth: { type: Date },
    class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    section: { type: String, required: true, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

const Student = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
export default Student;
