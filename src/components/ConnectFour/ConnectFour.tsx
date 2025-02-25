import styled from "@emotion/styled";
import { useGrid } from "../../hooks/grid"
import { useState } from "react";
import { getCombos } from "../../utils/gridCombo";
import { Button } from "reactstrap";

type GamePiece = 'Red' | 'Yellow';

const winningCombos = getCombos({ rows: 6, columns: 7, streak: 4 });

export default function ConnectFour() {

    const gridSize = { rows: 6 as 6, columns: 7 as 7 }
    const { grid, updateGrid, resetGrid } = useGrid<6, 7, GamePiece>(gridSize);
    const [playerTurn, setPlayerTurn] = useState<number>(1);
    const [ win, setWin ] = useState<boolean>(false);

    function getDroppedCounterY(x: number): number | null {
        const bottomRowIndex = gridSize.rows - 1;
        let newY: number | null = null;
        for (let i = bottomRowIndex; i >= 0; i--) {
            if (grid[i][x] === null) {
                newY = i;
                break;
            }
        }
        return newY;
    }

    function checkWin(gridState: typeof grid, gamePiece: GamePiece) {
        return winningCombos.some(combo => {
            let streak = 0;
            for (const [ y, x ] of combo) {
                if (gridState[y][x] === gamePiece) {
                    streak++;
                } else {
                    streak = 0
                }

                if (streak >= 4) {
                    break;
                }
            };
            return streak >= 4;
        });
    }

    function onItemClick(x: number) {

        const droppedYPos = getDroppedCounterY(x);

        if (droppedYPos === null) return;

        const currentPlayer: GamePiece = playerTurn === 1 ? 'Red' : 'Yellow';
        const newState = updateGrid({ x, y: droppedYPos }, currentPlayer);

        if (checkWin(newState, currentPlayer)) {
            setWin(true);
            return;
        }
        setPlayerTurn(playerTurn === 1 ? 2 : 1);
    }

    function onResetClick() {
        setPlayerTurn(1);
        setWin(false);
        resetGrid();
    }

    return (
        <div className="mt-5">
            {grid.map((row, rowI) => (
                <div key={`row-${rowI}`}>
                    {row.map((column, columnI) => (
                        <GridItem 
                            key={`row-${rowI}-column${columnI}`}
                            className="border py-1"
                            onClick={() => win ? null : onItemClick(columnI)}
                        >
                            <Circle 
                                gamePiece={column}
                            />
                        </GridItem>
                    ))}
                </div>
            ))}
            <div>
                {win ?
                    `player ${playerTurn} has won`
                :
                    `player ${playerTurn}s turn`
                }
            </div>
            <Button 
                className="mt-3"
                color="primary"
                onClick={() => onResetClick()}
            >
                Reset
            </Button>
        </div>
    )
}

const GridItem = styled('button')(() => ({
    height: 50,
    width: 50,
    background: 'none',
    marginTop: -1,
    marginRight: -1,
    backgroundColor: 'blue'
}))

interface CircleProps {
    gamePiece: GamePiece | null;
}

const Circle = styled('div')<CircleProps>(({ gamePiece }) => ({
    borderRadius: '50%',
    background: 'gray',
    width: '100%',
    height: '100%',
    ...!gamePiece ? {} : {
        background: gamePiece === 'Red' ? 'red' : 'yellow'
    }
}));