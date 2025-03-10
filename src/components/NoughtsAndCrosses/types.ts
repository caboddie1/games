export type GamePiece = 'X' | '0';
export type GridRow = [GamePiece | null, GamePiece | null, GamePiece | null];

export type Grid = [
    GridRow,
    GridRow,
    GridRow
]

export type Player = 1 | 2;
export type Coordinate = 0 | 1 | 2;
export type WinCoordinateItem = [Coordinate, Coordinate]
export type WinCoordinate = [WinCoordinateItem, WinCoordinateItem, WinCoordinateItem]

export type Scores = {
    'Player 1': number;
    'Player 2': number;
}