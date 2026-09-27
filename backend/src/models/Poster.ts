import mongoose, { Schema, Document } from 'mongoose';

export interface IPoster extends Document {
  userId: mongoose.Types.ObjectId;
  templateId: mongoose.Types.ObjectId;
  formData: Record<string, unknown>;
  uploadedPhotoUrls: string[];
  generatedImageUrl?: string;
  generatedPdfUrl?: string;
  status: 'draft' | 'generating' | 'completed' | 'failed' | 'flagged';
  aiLayout?: Record<string, unknown>;
  moderation?: { flagged: boolean; reasons: string[] };
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IPoster>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  templateId: { type: Schema.Types.ObjectId, ref: 'Template', required: true },
  formData: { type: Schema.Types.Mixed, required: true },
  uploadedPhotoUrls: { type: [String], default: [] },
  generatedImageUrl: String,
  generatedPdfUrl: String,
  status: { type: String, enum: ['draft', 'generating', 'completed', 'failed', 'flagged'], default: 'draft', index: true },
  aiLayout: Schema.Types.Mixed,
  moderation: Schema.Types.Mixed
}, { timestamps: true });

export const Poster = mongoose.model<IPoster>('Poster', schema);
