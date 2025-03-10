import { useState } from "react";


export type Tuple<TItem, TLength extends number> = [ ...TItem[] ] & { length: TLength }

export interface Props<TRow extends number = number, TColumn extends number = number, TData = null> {
    rows: TRow;
    columns: TColumn;
    initialState?: () => Tuple<Tuple<TData | null, TRow>, TColumn>;
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
    columns,
    initialState
}: Props<TRow, TColumn>) {

    type Row = Tuple<TData | null, TRow>;
    type Grid = Tuple<Row, TColumn>;

    function generateDefaultInitialState(): Grid {
        return Array.from({ length: rows }, () => {
            return Array.from({ length: columns }, () => {
                return null;
            }) 
        }) as Grid;
    }

    const [grid, setGrid] = useState<Grid>(initialState ? initialState : generateDefaultInitialState);

    function isGridItemAvailable({ x, y }: CoordinateObj) {
        return grid[y][x] === null;
    }

    function updateGrid({ x, y }: CoordinateObj, gamePiece: TData): Grid {
        const newState = JSON.parse(JSON.stringify(grid));

        newState[y][x] = gamePiece;
        setGrid(newState);
        return newState;
    }

    function bulkUpdate(grid: Grid) {
        const newState = JSON.parse(JSON.stringify(grid));
        setGrid(newState);
        return newState;
    }

    function resetGrid() {
        setGrid(initialState ? initialState() : generateDefaultInitialState());
    }

    return {
        grid,
        setGrid,
        generateInitialState : initialState ? initialState : generateDefaultInitialState,
        updateGrid,
        bulkUpdate,
        isGridItemAvailable,
        resetGrid
    }

}