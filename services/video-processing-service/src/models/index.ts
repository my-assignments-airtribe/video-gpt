// src/models/VideoProcessingResult.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IVideoProcessingResult extends Document {
  username: string;
  videoUrl: string;
  transcript: string;
  keywords: string[];
}

const videoProcessingResultSchema: Schema = new Schema({
  username: { type: String, required: true },
  videoUrl: { type: String, required: true },
  transcript: { type: String, required: true },
  keywords: [{ type: String }],
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

export default mongoose.model<IVideoProcessingResult>('VideoProcessingResult', videoProcessingResultSchema);
