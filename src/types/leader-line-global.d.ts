// src/types/leader-line-global.d.ts
interface LeaderLineOptions {
  path?: string;
  startPlug?: string;
  endPlug?: string;
  color?: string;
  size?: number;
  startSocket?: string;
  endSocket?: string;
  startPlugColor?: string;
  endPlugColor?: string;
  startPlugSize?: number;
  endPlugSize?: number;
  dropShadow?: {
    dx?: number;
    dy?: number;
    blur?: number;
  };
}

declare class LeaderLine {
  constructor(start: Element, end: Element, options?: LeaderLineOptions);
  position(): void;
  remove(): void;
  setOptions(options: Partial<LeaderLineOptions>): void;
}
