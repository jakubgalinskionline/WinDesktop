export interface WindowStyles {
  /**
   * Transformacja CSS do pozycjonowania okna
   */
  '--window-transform': string;

  /**
   * Szerokość okna w pikselach
   */
  '--window-width': string;

  /**
   * Wysokość okna w pikselach
   */
  '--window-height': string;

  /**
   * Indeks Z do określenia kolejności wyświetlania okien
   */
  '--window-z-index': number;

  /**
   * Wysokość pasku zadań
   */
  '--taskbar-height': string;

  /**
   * Pozycja X pasku zadań
   */
  '--taskbar-position-x': string;

  /**
   * Pozycja Y pasku zadań
   */
  '--taskbar-position-y': string;

  [key: string]: string | number;
}
