import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pomodoro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.css']
})
export class PomodoroComponent implements OnInit, OnDestroy {
  timeLeft: number = 25 * 60; // 25 minutes in seconds
  isRunning: boolean = false;
  isBreak: boolean = false;
  private timer: any;

  readonly WORK_TIME = 25 * 60;
  readonly BREAK_TIME = 5 * 60;

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.stopTimer();
  }

  toggleTimer(): void {
    if (this.isRunning) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  resetTimer(): void {
    this.stopTimer();
    this.timeLeft = this.isBreak ? this.BREAK_TIME : this.WORK_TIME;
  }

  private startTimer(): void {
    this.isRunning = true;
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.switchMode();
      }
    }, 1000);
  }

  private stopTimer(): void {
    this.isRunning = false;
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private switchMode(): void {
    this.isBreak = !this.isBreak;
    this.timeLeft = this.isBreak ? this.BREAK_TIME : this.WORK_TIME;
    // Play notification sound or show notification here
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
