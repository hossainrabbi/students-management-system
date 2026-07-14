import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  code: string;
  assignedClass: mongoose.Types.ObjectId;
  assignedTeacher?: mongoose.Types.ObjectId;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    assignedClass: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    assignedTeacher: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

const Subject = mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);
export default Subject;
