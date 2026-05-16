export type Category = '仕事' | '学習' | '家事' | 'その他';

export const CATEGORIES: Category[] = ['仕事', '学習', '家事', 'その他'];

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  category: Category;
  dueDate?: string; // YYYY-MM-DDTHH:MM (ISO datetime, local time)
};
