import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  name: string;
  section: string;
  roomNo: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema = new Schema<IClass>(
  {
    name: { type: String, required: true, trim: true },
    section: { type: String, required: true, trim: true },
    roomNo: { type: String, required: true, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

// Composite unique key for class + section
ClassSchema.index({ name: 1, section: 1 }, { unique: true });

const Class = mongoose.models.Class || mongoose.model<IClass>('Class', ClassSchema);
export default Class;
