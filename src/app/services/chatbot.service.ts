import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../models/chat-message.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private messages: ChatMessage[] = [];
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);

  // Mock responses for demo purposes
  private mockResponses: { [key: string]: string } = {
    'hello': 'Hello! How can I help you today?',
    'help': 'I can help you manage your tasks and provide productivity tips.',
    'tasks': 'You can add, edit, and delete tasks using the task list.',
    'pomodoro': 'The Pomodoro timer helps you stay focused with 25-minute work sessions.',
    'default': 'I\'m not sure about that. Could you please rephrase your question?'
  };

  constructor() {
    // Add welcome message
    this.addBotMessage('Hello! I\'m your task management assistant. How can I help you?');
  }

  getMessages(): Observable<ChatMessage[]> {
    return this.messagesSubject.asObservable();
  }

  sendMessage(content: string): void {
    // Add user message
    this.addUserMessage(content);

    // Simulate bot response after a short delay
    setTimeout(() => {
      const response = this.getBotResponse(content.toLowerCase());
      this.addBotMessage(response);
    }, 1000);
  }

  private addUserMessage(content: string): void {
    const message: ChatMessage = {
      id: Date.now(),
      content,
      isUser: true,
      timestamp: new Date()
    };
    this.messages.push(message);
    this.updateMessages();
  }

  private addBotMessage(content: string): void {
    const message: ChatMessage = {
      id: Date.now(),
      content,
      isUser: false,
      timestamp: new Date()
    };
    this.messages.push(message);
    this.updateMessages();
  }

  private getBotResponse(userMessage: string): string {
    // Check for keywords in the message
    for (const [key, response] of Object.entries(this.mockResponses)) {
      if (userMessage.includes(key)) {
        return response;
      }
    }
    return this.mockResponses['default'];
  }

  private updateMessages(): void {
    this.messagesSubject.next(this.messages);
  }
}
