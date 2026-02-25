import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Observable, Subject, combineLatest, of } from 'rxjs';
import { catchError, distinctUntilChanged, finalize, map, shareReplay, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { TaskService, Task, TaskStatus, PagedResponse } from '../../core/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<Task[]>;
  isLoading$ = new BehaviorSubject<boolean>(false);
  errorMessage$ = new BehaviorSubject<string | null>(null);
  selectedStatus$ = new BehaviorSubject<string | null>(null);
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(10);
  
  pageInfo$ = new BehaviorSubject<{
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }>({
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  private refresh$ = new Subject<void>();

  deleteConfirmationId: number | null = null;
  statuses: Array<'all' | TaskStatus> = ['all', 'Todo', 'In Progress', 'Done'];

  private destroy$ = new Subject<void>();

  constructor(private taskService: TaskService) {
    this.tasks$ = combineLatest([
      this.selectedStatus$.pipe(distinctUntilChanged()),
      this.currentPage$.pipe(distinctUntilChanged()),
      this.pageSize$.pipe(distinctUntilChanged()),
      this.refresh$.pipe(startWith(void 0))
    ]).pipe(
      switchMap(([status, pageIndex, pageSize]) => this.loadTasks(status, pageIndex, pageSize)),
      shareReplay(1)
    );
  }

  ngOnInit(): void {
    this.loadInitialTasks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTasks(status: string | null, pageIndex: number, pageSize: number): Observable<Task[]> {
    setTimeout(() => this.isLoading$.next(true), 0);
    this.errorMessage$.next(null);

    return this.taskService.getAll(status || undefined, pageIndex, pageSize).pipe(
      tap((response: PagedResponse<Task>) => {
        this.pageInfo$.next({
          totalCount: response.totalCount,
          totalPages: response.totalPages,
          hasNextPage: response.hasNextPage,
          hasPreviousPage: response.hasPreviousPage
        });
      }),
      map((response: PagedResponse<Task>) => response.items ?? []),
      catchError(error => {
        console.error('Error loading tasks:', error);
        this.errorMessage$.next('Failed to load tasks');
        this.pageInfo$.next({
          totalCount: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false
        });
        return of([] as Task[]);
      }),
      finalize(() => setTimeout(() => this.isLoading$.next(false), 0))
    );
  }

  private loadInitialTasks(): void {
    this.selectedStatus$.next(null);
  }

  onStatusFilterChange(status: string): void {
    this.deleteConfirmationId = null;
    // Reset to first page when filtering
    this.currentPage$.next(1);
    // Defer to next tick to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.selectedStatus$.next(status === 'all' ? null : status);
    }, 0);
  }

  onNextPage(): void {
    const pageInfo = this.pageInfo$.value;
    if (pageInfo.hasNextPage) {
      this.currentPage$.next(this.currentPage$.value + 1);
    }
  }

  onPreviousPage(): void {
    const pageInfo = this.pageInfo$.value;
    if (pageInfo.hasPreviousPage) {
      this.currentPage$.next(this.currentPage$.value - 1);
    }
  }

  goToPage(pageIndex: number): void {
    const pageInfo = this.pageInfo$.value;
    // Convert 0-based page index to 1-based for internal state
    const oneBased = pageIndex + 1;
    if (oneBased >= 1 && oneBased <= pageInfo.totalPages) {
      this.currentPage$.next(oneBased);
    }
  }

  onDeleteClick(taskId: number): void {
    this.deleteConfirmationId = taskId;
  }

  onConfirmDelete(taskId: number): void {
    this.isLoading$.next(true);
    this.taskService.delete(taskId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.deleteConfirmationId = null;
          this.refresh$.next();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.isLoading$.next(false);
          this.errorMessage$.next('Failed to delete task');
          this.deleteConfirmationId = null;
        }
      });
  }

  onCancelDelete(): void {
    this.deleteConfirmationId = null;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Todo':
        return 'badge-warning';
      case 'InProgress':
        return 'badge-info';
      case 'Done':
        return 'badge-success';
      default:
        return 'badge-default';
    }
  }

  getPageNumbers(totalPages: number): number[] {
    const maxPagesToShow = 5;
    const currentPageZeroBased = this.currentPage$.value - 1;
    const pages: number[] = [];

    if (totalPages <= maxPagesToShow) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0);

      let startPage = Math.max(1, currentPageZeroBased - 1);
      let endPage = Math.min(totalPages - 1, currentPageZeroBased + 1);

      if (startPage > 1) {
        pages.push(-1); 
      }

      // Add pages around current
      for (let i = startPage; i <= endPage; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 2) {
        pages.push(-1); // -1 represents ellipsis
      }

      // Always show last page
      if (!pages.includes(totalPages - 1)) {
        pages.push(totalPages - 1);
      }
    }

    return pages;
  }
}
