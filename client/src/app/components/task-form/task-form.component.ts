import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService, Task, TaskStatus, TaskUpsertInput } from '../../core/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isLoading = false;
  isEditMode = false;
  taskId: number | null = null;
  errorMessage: string | null = null;
  submitAttempted = false;

  statuses: TaskStatus[] = ['Todo', 'In Progress', 'Done'];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.taskId = +params['id'];
        if (this.taskId) {
          this.loadTask(this.taskId);
        }
      }
    });
  }

  private initializeForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: ['Todo', Validators.required],
      dueDate: ['', [Validators.required, this.pastDateValidator.bind(this)]]
    });
  }

  private pastDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return { 'pastDate': true };
    }
    return null;
  }

  private loadTask(id: number): void {
    this.isLoading = true;
    this.taskService.getById(id).subscribe({
      next: (task: Task) => {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          status: task.status,
          dueDate: new Date(task.dueDate ?? new Date()).toISOString().split('T')[0]
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading task:', error);
        this.errorMessage = 'Failed to load task';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitAttempted = true;

    if (this.taskForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formData = this.taskForm.value as TaskUpsertInput;

    const operation = this.isEditMode && this.taskId
      ? this.taskService.update(this.taskId, formData)
      : this.taskService.create(formData);

    operation.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        console.error('Error saving task:', error);
        this.errorMessage = 'Failed to save task. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }

  get title() {
    return this.taskForm.get('title');
  }

  get description() {
    return this.taskForm.get('description');
  }

  get status() {
    return this.taskForm.get('status');
  }

  get dueDate() {
    return this.taskForm.get('dueDate');
  }
}
