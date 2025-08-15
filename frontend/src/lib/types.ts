export type TaskStatus = "Sin Empezar" | "Empezada" | "Finalizada";


export interface Task {
  id: number;
  text: string;
  creation_date: string; // ISO date string
  end_date: string; // ISO date string
  status: TaskStatus;
  id_category: number;
  id_user: number;
  category: Category;
  user: User;
}


export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface User {
  id: number;
  username: string;
}
