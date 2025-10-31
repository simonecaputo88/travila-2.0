import mongoose from 'mongoose';
import { env } from './env';
export async function connect(){
  await mongoose.connect(env.MONGODB_URI);
}
