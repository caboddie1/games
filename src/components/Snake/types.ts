
export type Direction = 'up' | 'down' | 'left' | 'right';

export type PosModifier = {
    [key in Direction]: {
        x: number;
        y: number;
    }
}

export interface Touch {
    start: {
        x: number;
        y: number;
    }
    end?: {
        x: number;
        y: number;
    }
}

export type Variant = 'Snake' | 'Snake II';