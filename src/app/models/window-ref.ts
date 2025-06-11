import { InjectionToken } from '@angular/core';

export interface WindowData {
  cellValue?: string;
  [key: string]: any;
}

export const WINDOW_DATA = new InjectionToken<WindowData>('WindowData');
