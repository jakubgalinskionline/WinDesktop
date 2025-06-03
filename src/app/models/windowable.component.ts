import { Input, Directive } from '@angular/core';
import { WindowMessage } from '../services/window-communication.service';

@Directive()
export abstract class WindowableComponent {
  @Input() windowId!: number;
  
  abstract onWindowMessage(message: WindowMessage): void;
  
  protected getWindowComponent(): any {
    return (window as any).windowComponents?.[this.windowId];
  }
  
  protected sendMessage(type: string, data: any, toId?: number) {
    const windowComponent = this.getWindowComponent();
    if (windowComponent?.sendMessage) {
      windowComponent.sendMessage(type, data, toId);
    }
  }
}
