export interface WindowModel {
  id: number;
  title: string;
  component: any;
  componentRef?: any; // Referencja do instancji komponentu
  componentInput?: {[key: string]: any}; // Dane wejściowe dla komponentu
  componentOutput?: {[key: string]: Function}; // Handlery dla zdarzeń komponentu
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
