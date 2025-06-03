import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface WindowMessage {
  fromId: number;
  toId?: number;  // jeśli undefined, wiadomość jest do wszystkich okien
  type: string;
  data: any;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class WindowCommunicationService {
  private messageSubject = new BehaviorSubject<WindowMessage | null>(null);

  sendMessage(message: Omit<WindowMessage, 'timestamp'>) {
    this.messageSubject.next({
      ...message,
      timestamp: Date.now()
    });
  }

  getMessages(windowId: number): Observable<WindowMessage> {
    return this.messageSubject.pipe(
      filter((msg): msg is WindowMessage => msg !== null),
      filter(msg =>
        msg.toId === windowId ||
        msg.toId === undefined
      )
    );
  }

  broadcast(fromId: number, type: string, data: any) {
    this.sendMessage({
      fromId,
      type,
      data
    });
  }

  sendDirectMessage(fromId: number, toId: number, type: string, data: any) {
    this.sendMessage({
      fromId,
      toId,
      type,
      data
    });
  }
}
