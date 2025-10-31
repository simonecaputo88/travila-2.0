import { Schema, model } from 'mongoose';
const GuideSchema = new Schema({ userId: String, city: String, modules: [String], content: Object, createdAt: { type: Date, default: Date.now } });
export default model('Guide', GuideSchema);
