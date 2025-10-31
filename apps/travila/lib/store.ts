import { create } from 'zustand';
interface SessionState { token?: string; setToken: (t?: string) => void }
export const useSession = create<SessionState>((set)=>({ token: undefined, setToken: (t)=>set({token:t}) }));
