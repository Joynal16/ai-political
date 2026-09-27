import mongoose, { Schema, Document } from 'mongoose';

export interface IGenerationLog extends Document {
  posterId: mongoose.Types.ObjectId;
  geminiPromptUsed: string;
  tokensUsed?: number;
  latencyMs: number;
  success: boolean;
  createdAt: Date;
}

const schema = new Schema<IGenerationLog>({
  posterId: { type: Schema.Types.ObjectId, ref: 'Poster', required: true },
  geminiPromptUsed: String,
  tokensUsed: Number,
  latencyMs: Number,
  success: Boolean,
  createdAt: { type: Date, default: Date.now }
});

export const GenerationLog = mongoose.model<IGenerationLog>('GenerationLog', schema);
