import mongoose, { Schema, Document } from 'mongoose';

export type PhotoSlot = { x: number; y: number; w: number; h: number; radius?: number };

export interface ITemplate extends Document {
  title: string;
  occasionType: string;
  thumbnailUrl: string;
  layoutConfig: {
    width: number;
    height: number;
    background: string;
    accent: string;
    headlineColor: string;
    footerColor: string;
    photoSlots: PhotoSlot[];
    decorations: string[];
  };
  isActive: boolean;
  createdAt: Date;
}

const schema = new Schema<ITemplate>({
  title: { type: String, required: true },
  occasionType: { type: String, required: true, index: true },
  thumbnailUrl: { type: String, default: '' },
  layoutConfig: { type: Schema.Types.Mixed, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const Template = mongoose.model<ITemplate>('Template', schema);
