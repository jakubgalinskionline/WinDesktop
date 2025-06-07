export interface WindowModel {
  id: number;
  title: string;
  component: any;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  isActive: boolean;
  themeMode: boolean;
  isDraggable: boolean;
  prevState?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowState extends WindowPosition, WindowSize {
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}
