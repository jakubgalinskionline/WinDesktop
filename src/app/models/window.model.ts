export interface WindowPrevState {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowModel {
  id: number;
  title: string;
  component: any;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized?: boolean;
  isMaximized?: boolean;
  prevState?: WindowPrevState;
  zIndex: number;
}
