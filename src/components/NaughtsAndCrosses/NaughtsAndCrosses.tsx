import { useState } from "react";
import { Button, Col, Container, Row } from "reactstrap";
import styled from "@emotion/styled";

import { 
    Scores, 
    Player, 
    Coordinate, 
    GamePiece 
} from "./types";
import { useGrid } from "../../hooks/grid";
import { getCombos } from "../../utils/gridCombo";

const winningCombos = getCombos({ rows: 3, columns: 3, streak: 3 });

export default function NaughtsAndCrosses() {

    const { grid, updateGrid, resetGrid, isGridItemAvailable } = useGrid<3, 3, GamePiece>({ rows: 3, columns: 3 }) 

    const [playerTurn, setPlayerTurn] = useState<Player>(1);
    const [win, setWin] = useState<boolean>(false);
    const [scores, setScores] = useState<Scores>({
        'Player 1': 0,
        'Player 2': 0
    })

    function checkWin(newGridState: typeof grid, currentGamePiece: GamePiece) {
        return winningCombos.some(combo => {
            return combo.every(([y, x]) => newGridState[y][x] === currentGamePiece);
        })
    }

    function isGameWinless() {
        return grid.every(row => row.every(item => item));
    }


    function onGridItemClick(x: Coordinate, y: Coordinate): void {
        if (!isGridItemAvailable({ x, y })) return;

        const gamePiece: GamePiece = playerTurn === 1 ? '0' : 'X';

        const newState = updateGrid({ x, y }, gamePiece);

        if (checkWin(newState, gamePiece)) {
            setWin(true);
            setScores(state => {
                const currentPlayer: keyof Scores = `Player ${playerTurn}`;
                const currentScore = state[currentPlayer];
                return {
                    ...state,
                    [currentPlayer]: currentScore + 1 
                }
            })
            return;
        }

        setPlayerTurn(state => state === 1 ? 2 : 1);

    }

    function onResetClick() {
        setPlayerTurn(1);
        resetGrid();
        setWin(false);
    }

    return (
        <Container className="pt-5">
            <Row className="">
                <Col xl={6}>
                    {grid.map((row, y) => (
                        <Row key={`row-${y}`}>
                            {row.map((item, x) => (
                                <GridItem 
                                    key={`row-${y}-item-${x}`}
                                    className="border"
                                    isAvailable={!win && isGridItemAvailable({ x, y })}
                                    onClick={() => !win ? onGridItemClick(x as Coordinate, y as Coordinate) : null}
                                >
                                    {item || ''}
                                </GridItem>
                            ))}
                        </Row>
                    ))}
                    <div className="mt-3 text-start">
                        {isGameWinless() ?
                            `No Winner!`
                        :
                            `Player ${playerTurn}${win ? ' wins' : 's Turn'}`
                        }
                    </div>
                    <Button 
                        className="mt-3"
                        color="primary"
                        onClick={() => onResetClick()}
                    >
                        Reset
                    </Button>
                </Col>
                <Col xl={6} className="text-start">
                    {Array.from(Object.entries(scores).map(([player, score]) => (
                        <div key={player}>
                            {player}: {score}
                        </div>
                    )))}
                </Col>
            </Row>
        </Container>
    )
}

interface GridItemProps {
    isAvailable: boolean;
}

const GridItem = styled('button')<GridItemProps>(({ isAvailable }) => ({
    height: 50,
    width: 50,
    marginLeft: -1,
    marginTop: -1,
    background: 'none',
    ...(isAvailable) ? {} : {
        opacity: 0.4,
        pointerEvents: 'none'
    }
}))