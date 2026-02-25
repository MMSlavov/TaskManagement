import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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

interface TaskUpsertPayload {
  title: string;
  description: string;
  status: number;
  dueDate: string | null;
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

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'https://localhost:7206/api/tasks';

  constructor(private http: HttpClient) { }

  getAll(status?: string, pageIndex?: number, pageSize?: number): Observable<PagedResponse<Task>> {
    let params = new HttpParams();
    if (status) {
      const statusValue = this.mapStatusToValue(status as TaskStatus);
      params = params.set('status', statusValue.toString());
    }
    if (pageIndex !== undefined) {
      params = params.set('pageIndex', pageIndex.toString());
    }
    if (pageSize !== undefined) {
      params = params.set('pageSize', pageSize.toString());
    }
    return this.http.get<PagedResponse<Task>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  create(data: TaskUpsertInput): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, this.toUpsertPayload(data));
  }

  update(id: number, data: TaskUpsertInput): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, this.toUpsertPayload(data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private toUpsertPayload(data: TaskUpsertInput): TaskUpsertPayload {
    return {
      title: data.title,
      description: data.description,
      status: this.mapStatusToValue(data.status),
      dueDate: this.formatDateOnly(data.dueDate)
    };
  }

  private mapStatusToValue(status: TaskStatus): number {
    switch (status) {
      case 'Todo':
        return 0;
      case 'In Progress':
        return 1;
      case 'Done':
        return 2;
      default:
        return 0;
    }
  }

  private formatDateOnly(value?: string | Date | null): string | null {
    if (!value) {
      return null;
    }

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return null;
    }

    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
