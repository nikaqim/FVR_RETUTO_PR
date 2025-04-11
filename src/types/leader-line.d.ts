declare class LeaderLine {
    constructor(
      start: HTMLElement,
      end: HTMLElement,
      options?: Partial<LeaderLineOptions>
    );
  
    position(): void;
    remove(): void;
    hide(): void;
    show(): void;
    setOptions(options: Partial<LeaderLineOptions>): void;
  }
  
  interface LeaderLineOptions {
    color?: string;
    size?: number;
    dash?: boolean;
    path?: 'straight' | 'arc' | 'fluid' | 'magnet';
    startPlug?: string;
    endPlug?: string;
    startSocket?: string;
    endSocket?: string;
    startPlugColor?: string;
    endPlugColor?: string;
    startPlugSize?: number;
    endPlugSize?: number;
    dropShadow?: boolean;
    // Add more as needed
  }