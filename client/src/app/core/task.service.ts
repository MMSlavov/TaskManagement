import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task, TaskStatus, TaskUpsertInput, PagedResponse } from './models/task.model';

interface TaskUpsertPayload {
  title: string;
  description: string;
  status: number;
  dueDate: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

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
    let tasks = this.http.get<PagedResponse<Task>>(this.apiUrl, { params });
    console.log('API Response:', );
    return tasks;
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
