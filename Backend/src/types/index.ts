export interface IUser {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// types.ts
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
