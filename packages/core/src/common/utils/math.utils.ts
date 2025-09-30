import { ValueTransformer } from 'typeorm';

export interface Point {
    x: number;
    y: number;
}

export class PointTransformer implements ValueTransformer {
    to(data: Point): string | null {
        if (!data) return null;
        return `(${data.x},${data.y})`;
    }

    from(data: string): Point | null {
        if (!data) return null;
        const [x, y] = data.replace(/[()]/g, '').split(',');
        return { x: parseFloat(x), y: parseFloat(y) };
    }
}