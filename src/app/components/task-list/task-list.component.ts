import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.interface';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Omit<Task, 'id' | 'createdAt'> = {
    title: '',
    description: '',
    completed: false,
    dueDate: undefined
  };
  selectedTime: string = '';
  editingTask: Task | null = null;
  isEditing: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = this.sortTasks(tasks);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.errorMessage = 'Failed to load tasks. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  getTaskTitle(): string {
    return this.isEditing ? this.editingTask?.title || '' : this.newTask.title;
  }

  setTaskTitle(value: string): void {
    if (this.isEditing && this.editingTask) {
      this.editingTask.title = value;
    } else {
      this.newTask.title = value;
    }
  }

  getTaskDescription(): string {
    return this.isEditing ? this.editingTask?.description || '' : this.newTask.description;
  }

  setTaskDescription(value: string): void {
    if (this.isEditing && this.editingTask) {
      this.editingTask.description = value;
    } else {
      this.newTask.description = value;
    }
  }

  getTaskDueDate(): Date | undefined {
    return this.isEditing ? this.editingTask?.dueDate : this.newTask.dueDate;
  }

  setTaskDueDate(value: Date | undefined): void {
    if (this.isEditing && this.editingTask) {
      this.editingTask.dueDate = value;
    } else {
      this.newTask.dueDate = value;
    }
  }

  addTask(): void {
    if (!this.newTask.title.trim()) {
      this.errorMessage = 'Task title is required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.selectedTime) {
      const [hours, minutes] = this.selectedTime.split(':');
      const dueDate = new Date(this.newTask.dueDate || new Date());
      dueDate.setHours(parseInt(hours), parseInt(minutes));
      this.newTask.dueDate = dueDate;
    }

    console.log('Adding new task:', this.newTask);
    this.taskService.addTask(this.newTask).subscribe({
      next: () => {
        console.log('Task added successfully');
        this.loadTasks();
        this.resetForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error adding task:', error);
        this.errorMessage = 'Failed to add task. Please try again.';
        this.isLoading = false;
      }
    });
  }

  editTask(task: Task): void {
    this.editingTask = { ...task };
    this.isEditing = true;
    if (task.dueDate) {
      this.selectedTime = task.dueDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    }
  }

  saveEdit(): void {
    if (!this.editingTask || !this.editingTask.title.trim()) {
      this.errorMessage = 'Task title is required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.selectedTime) {
      const [hours, minutes] = this.selectedTime.split(':');
      const dueDate = new Date(this.editingTask.dueDate || new Date());
      dueDate.setHours(parseInt(hours), parseInt(minutes));
      this.editingTask.dueDate = dueDate;
    }

    this.taskService.updateTask(this.editingTask).subscribe({
      next: () => {
        this.loadTasks();
        this.cancelEdit();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating task:', error);
        this.errorMessage = 'Failed to update task. Please try again.';
        this.isLoading = false;
      }
    });
  }

  cancelEdit(): void {
    this.editingTask = null;
    this.isEditing = false;
    this.selectedTime = '';
    this.errorMessage = '';
  }

  deleteTask(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.loadTasks();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.errorMessage = 'Failed to delete task. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private resetForm(): void {
    this.newTask = {
      title: '',
      description: '',
      completed: false,
      dueDate: undefined
    };
    this.selectedTime = '';
    this.errorMessage = '';
  }

  private sortTasks(tasks: Task[]): Task[] {
    return tasks.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  }
}
