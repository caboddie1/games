import { Props as GridSize } from '../hooks/grid';

type Coordinate = [number, number];

export function getLineCombos({ rows, columns }: GridSize ) {
    const horizontal = Array.from({ length: rows }, (_,rowI) => {
        return Array.from({ length: columns }, (_, columnI) => {
            return [rowI, columnI];
        });
    });

    const vertical = Array.from({ length: columns }, (_,rowI) => {
        return Array.from({ length: rows}, (_, columnI) => {
            return [columnI, rowI];
        });
    });

    return [ ...horizontal, ...vertical];
}

interface GetComboArgs extends GridSize {
    streak: number;
}

export function getDiagonalCombos({ rows, columns, streak }: GetComboArgs) {
    const loops = columns - streak + 1;
    const totalCombos = loops * 4;
    const combos = Array.from({ length: totalCombos }, (_, i) => {
        
        const posIndex = i % (totalCombos / 2);

        let x = posIndex < loops ? i % loops : columns - 1 - i % loops;
        let y = i < totalCombos / 2 ? 0 : rows - 1;

        const result: Coordinate[] = []

        while (x < columns && x >= 0 && y < rows && y >=0) {
            result.push([y, x]);
            posIndex < loops ? x++ : x--;
            i < totalCombos / 2 ? y++ : y--;
        }
        return result;
    });
    return combos;
}

export function getCombos({ rows, columns, streak }: GetComboArgs) {
    return [
        ...getLineCombos({ rows, columns }),
        ...getDiagonalCombos({ rows, columns, streak })
    ]
}