import { Schema, model } from 'mongoose';
const UserSchema = new Schema({ email: String, passwordHash: String, createdAt: { type: Date, default: Date.now } });
export default model('User', UserSchema);
