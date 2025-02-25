import { useState } from "react";


export type Tuple<TItem, TLength extends number> = [ ...TItem[] ] & { length: TLength }

export interface Props<TRow = number, TColumn = number> {
    rows: TRow;
    columns: TColumn;
}

export interface CoordinateObj {
    x: number;
    y: number;
}

export function useGrid<
    TRow extends number, 
    TColumn extends number,
    TData 
>({ 
    rows, 
    columns 
}: Props<TRow, TColumn>) {

    type Row = Tuple<TData | null, TRow>;
    type Grid = Tuple<Row, TColumn>;

    function generateInitialState(): Grid {
        return Array.from({ length: rows }, () => {
            return Array.from({ length: columns }, () => {
                return null;
            }) 
        }) as Grid;
    }

    const [grid, setGrid] = useState<Grid>(generateInitialState);

    function isGridItemAvailable({ x, y }: CoordinateObj) {
        return grid[y][x] === null;
    }

    function updateGrid({ x, y }: CoordinateObj, gamePiece: TData): Grid {
        const newState = JSON.parse(JSON.stringify(grid));

        newState[y][x] = gamePiece;
        setGrid(newState);
        return newState;
    }

    function resetGrid() {
        setGrid(generateInitialState());
    }

    return {
        grid,
        setGrid,
        generateInitialState,
        updateGrid,
        isGridItemAvailable,
        resetGrid
    }

}