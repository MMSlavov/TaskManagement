import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/tasks';

  constructor(private http: HttpClient) { }

  /**
   * Get all tasks, optionally filtered by status
   * @param status Optional status filter (e.g., 'pending', 'completed')
   */
  getAll(status?: string): Observable<Task[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Task[]>(this.apiUrl, { params });
  }

  /**
   * Get a task by ID
   * @param id Task ID
   */
  getById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new task
   * @param data Task data to create
   */
  create(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, data);
  }

  /**
   * Update an existing task
   * @param id Task ID
   * @param data Updated task data
   */
  update(id: number, data: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Delete a task
   * @param id Task ID
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
