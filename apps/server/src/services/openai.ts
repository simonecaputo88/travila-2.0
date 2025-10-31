import OpenAI from 'openai';
import { env } from '../env';

export const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export const OPENAI_MODEL = env.OPENAI_MODEL; // es. 'gpt-4o-mini'

export async function generateText(prompt: string){
  const res = await openai.chat.completions.create({
    model: 'gpt-5-turbo',
    messages: [{ role: 'system', content: 'You are a helpful travel planner.' }, { role: 'user', content: prompt }],
    temperature: 0.7,
  });
  return res.choices[0]?.message?.content || '';
}
