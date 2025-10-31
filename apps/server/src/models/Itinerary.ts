import { Schema, model } from 'mongoose';
const ItinerarySchema = new Schema({ userId: String, city: String, days: Number, mode: { type: String, enum: ['FAST','PRO'] }, content: Object, createdAt: { type: Date, default: Date.now } });
export default model('Itinerary', ItinerarySchema);
