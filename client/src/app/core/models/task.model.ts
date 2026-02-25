export type TaskStatus = 'Todo' | 'In Progress' | 'Done';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string | Date;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
}

export interface TaskUpsertInput {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string | Date | null;
}

export interface PagedResponse<T> {
  items: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
