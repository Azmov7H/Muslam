import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    reference: { type: String, required: true },
    content: { type: String, required: true },
    speaker: { type: String }, 
    type: {
      type: String,
      enum: ['تفسير', 'حديث', 'فتوى', 'دورة', 'مقالة'],
      required: true,
    },
    author: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('posts', PostSchema);
