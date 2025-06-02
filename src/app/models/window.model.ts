export interface WindowModel {
  isActive: boolean;
  id: number;
  title: string;
  component: any;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isDarkMode?: boolean;
  zIndex: number;
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
