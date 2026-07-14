import mongoose, { Schema, Document } from 'mongoose';

export interface IParent extends Document {
  user: mongoose.Types.ObjectId;
  phone: string;
  occupation?: string;
  address?: string;
  children: mongoose.Types.ObjectId[]; // Ref User or Student profiles
  createdAt: Date;
  updatedAt: Date;
}

const ParentSchema = new Schema<IParent>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    phone: { type: String, required: true, trim: true },
    occupation: { type: String, trim: true },
    address: { type: String, trim: true },
    children: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
  },
  { timestamps: true }
);

const Parent =
  mongoose.models.Parent ||
  mongoose.model<IParent>('Parent', ParentSchema);

export default Parent;
