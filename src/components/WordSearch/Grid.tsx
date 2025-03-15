import styled from "@emotion/styled";
import { Alert } from "reactstrap";

import Highlight from "./Highlight";

import { GridState, HighlightState } from "./WordSearch";
import { WordState } from "@/utils/wordSearch";
import { CoordinateObj } from "@/hooks/grid";

interface Props {
    gridState: GridState;
    gridSize?: number;
    highlightState: HighlightState;
    highlightedWord: string | null;
    isComplete: Boolean;
    foundState: WordState[];
    onSquareClick: (coords: CoordinateObj) => void;
    onSquareHover: (coords: CoordinateObj) => void;
}

export default function Grid({ 
    gridState,
    gridSize = 30,
    foundState,
    highlightState,
    highlightedWord,
    isComplete,
    onSquareHover, 
    onSquareClick,
}: Props) {



    return (
        <div className="position-relative">
            {gridState.grid.map((row, y) => (
                <div key={y} style={{ height: gridSize }}>
                    {row.map((column, x) => (
                        <Square 
                            key={`row-${y}-column-${x}`}
                            className="border m-0"
                            onClick={() => onSquareClick({ x, y })}
                            onMouseOver={() => onSquareHover({ x, y })}
                            aria-label={`y${y}x${x}`}
                            gridSize={gridSize}
                        >
                            {column}
                        </Square>
                    ))}
                </div>
            ))}
            {highlightState.coords?.coords &&
                <Highlight 
                    wordState={{
                        word: highlightState.coords.coords.map(() => ' ').join(''),
                        coords: highlightState.coords.coords.map(r => ({ ...r, letter: '' })),
                        direction: highlightState.coords.direction
                    }}
                    baseSize={gridSize}
                />
            }
            {foundState.map(row => (
                <Highlight 
                    key={row.word}
                    wordState={row}
                    baseSize={gridSize}
                />
            ))}
            <div className="mt-3 w-50">
                {highlightedWord ?
                    <Alert color="success">
                        {highlightedWord}
                    </Alert>
                : highlightState.start ?
                    <Alert color="danger">
                        Selection not valid
                    </Alert>
                :
                    ''
                }
            </div>
            {isComplete &&
                <Alert color="success" className="mt-3">
                    Well Done!
                </Alert>
            }
        </div>
    )
}

interface SquareProps {
    gridSize: number;
}

const Square = styled('button')<SquareProps>(({ gridSize }) => ({
    width: gridSize, 
    height: gridSize,
    marginTop: -2,
    marginLeft: -1,
    background: 'none',
    fontSize: '1rem'
}));