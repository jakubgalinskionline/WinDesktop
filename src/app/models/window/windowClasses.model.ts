export interface WindowClasses {
    /**
     * Określa, czy okno jest aktualnie aktywne (na pierwszym planie)
     * @type {boolean}
     * @default false
     */
    active: boolean;

    /**
     * Określa, czy okno jest zminimalizowane do paska zadań
     * @type {boolean}
     * @default false
     */
    minimized: boolean;

    /**
     * Określa, czy okno jest zmaksymalizowane na pełny ekran
     * @type {boolean}
     * @default false
     */
    maximized: boolean;

    /**
     * Określa, czy okno jest aktualnie przeciągane przez użytkownika
     * @type {boolean}
     * @default false
     */
    dragging: boolean;
}
