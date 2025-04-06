import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task } from '../models/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor() {}

  private getTasksFromStorage(): Task[] {
    const savedTasks = localStorage.getItem('tasks');
    if (!savedTasks) return [];
    
    const tasks = JSON.parse(savedTasks);
    // Convert string dates back to Date objects
    return tasks.map((task: any) => ({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      createdAt: task.createdAt ? new Date(task.createdAt) : new Date()
    }));
  }

  private saveTasksToStorage(tasks: Task[]): void {
    // Convert Date objects to ISO strings for storage
    const tasksToSave = tasks.map(task => ({
      ...task,
      dueDate: task.dueDate?.toISOString(),
      createdAt: task.createdAt?.toISOString()
    }));
    localStorage.setItem('tasks', JSON.stringify(tasksToSave));
  }

  getTasks(): Observable<Task[]> {
    return of(this.getTasksFromStorage());
  }

  addTask(task: Omit<Task, 'id' | 'createdAt'>): Observable<Task> {
    const tasks = this.getTasksFromStorage();
    const newTask = {
      ...task,
      id: Date.now(),
      createdAt: new Date()
    };
    
    tasks.push(newTask);
    this.saveTasksToStorage(tasks);
    
    return of(newTask);
  }

  updateTask(task: Task): Observable<Task> {
    const tasks = this.getTasksFromStorage();
    const index = tasks.findIndex(t => t.id === task.id);
    
    if (index !== -1) {
      tasks[index] = task;
      this.saveTasksToStorage(tasks);
    }
    
    return of(task);
  }

  deleteTask(id: number): Observable<void> {
    const tasks = this.getTasksFromStorage();
    const filteredTasks = tasks.filter(task => task.id !== id);
    this.saveTasksToStorage(filteredTasks);
    
    return of(void 0);
  }

  toggleTaskComplete(id: number): void {
    const tasks = this.getTasksFromStorage();
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasksToStorage(tasks);
    }
  }
}
