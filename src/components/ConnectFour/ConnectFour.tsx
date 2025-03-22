import { Button } from "reactstrap";
import styled, { CSSObject } from "@emotion/styled";
import { useState } from "react";
import { motion } from "motion/react"

import { getCombos } from "@/utils/gridCombo";
import { useGrid } from "@/hooks/grid"

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
        <div 
            className="mt-5"
        >
            <GameWrapper 
                className="position-relative"
                height={grid.length * 50}
            >

                {grid.map((row, rowI) => (
                    <div key={`row-${rowI}`}>
                        {row.map((column, columnI) => (
                            <GridItem 
                                key={`row-${rowI}-column${columnI}`}
                                className="border py-1"
                                onClick={() => win ? null : onItemClick(columnI)}
                                aria-label={`y${rowI}x${columnI}`}
                                x={columnI * 50}
                                y={rowI * 50}
                            >
                                <Circle />
                                {column &&
                                    <GamePiece
                                        gamePiece={column}
                                        initial={{ top: (rowI + 1) * 50 * -1 }}
                                        animate={{ top: 3 }}
                                    />
                                }
                            </GridItem>
                        ))}
                    </div>
                ))}
            </GameWrapper>
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

interface GameWrapperProps {
    height: number;
}

const GameWrapper = styled('div')<GameWrapperProps>(({ height }) => ({
    height,
    marginTop: 50
}));

interface GridItemProps {
    x: number;
    y: number;
}

const GridItem = styled('button')<GridItemProps>(({ x, y }) => ({
    position: 'absolute',
    height: 50,
    width: 50,
    background: 'none',
    marginTop: -1,
    marginRight: -1,
    backgroundColor: 'blue',
    top: y,
    zIndex: 3,
    left: x

}))


const Circle = styled('div')(() => ({
    borderRadius: '50%',
    background: 'gray',
    width: '100%',
    height: '100%',
}));

interface GamePieceProps {
    gamePiece: GamePiece | null;
}

const GamePiece = styled(motion.div)<GamePieceProps>(({ gamePiece }) => ({
    width: '90%',
    height: '90%',
    background: gamePiece === 'Red' ? '#ff4444' : '#ebed52',
    zIndex: 2,
    borderRadius: '50%',
    position: 'absolute',
    left: '3px'
} as CSSObject))