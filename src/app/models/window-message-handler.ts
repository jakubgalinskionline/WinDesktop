import { WindowMessage } from '../services/window-communication.service';

export interface WindowMessageHandler {
  onWindowMessage(message: WindowMessage): void;
}
