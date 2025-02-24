import { useState } from "react";
import { Button, Col, Container, Row } from "reactstrap";
import styled from "@emotion/styled";

import { 
    Grid, 
    GridRow, 
    WinCoordinate, 
    WinCoordinateItem, 
    Scores, 
    Player, 
    Coordinate, 
    GamePiece 
} from "./types";

const row: GridRow = [null, null, null];

const defaultGridState: Grid = [row, row, row];

const straightLineCombos: WinCoordinate[] = [ ...Array(6) ].map((_, i) => {
    return [ ...Array(3) ].map((_, j) => {
        return i < 3 ? [i, j] : [j, i % 3] as WinCoordinateItem
    }) as WinCoordinate
});

const winningCombos: WinCoordinate[] = [
    ...straightLineCombos,
    [ [0,0], [1,1], [2,2] ],
    [ [0,2], [1,1], [2,0] ],
]

export default function NaughtsAndCrosses() {

    const [gridState, setGridState] = useState<Grid>(defaultGridState);
    const [playerTurn, setPlayerTurn] = useState<Player>(1);
    const [win, setWin] = useState<boolean>(false);
    const [scores, setScores] = useState<Scores>({
        'Player 1': 0,
        'Player 2': 0
    })

    function checkWin(newGridState: Grid, currentGamePiece: GamePiece) {
        return winningCombos.some(combo => {
            return combo.every(([y, x]) => newGridState[y][x] === currentGamePiece);
        })
    }

    function isGameWinless() {
        return gridState.every(row => row.every(item => item));
    }

    function isGridItemAvailable(x: Coordinate, y: Coordinate) {
        return gridState[y][x] === null;
    }

    function onGridItemClick(x: Coordinate, y: Coordinate): void {
        if (!isGridItemAvailable(x, y)) return;

        const gamePiece: GamePiece = playerTurn === 1 ? '0' : 'X';

        const newGridState: Grid = JSON.parse(JSON.stringify(gridState));
        newGridState[y][x] = gamePiece;
        setGridState(newGridState);
        if (checkWin(newGridState, gamePiece)) {
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
        setGridState(defaultGridState);
        setWin(false);
    }

    return (
        <Container className="pt-5">
            <Row className="">
                <Col xl={6}>
                    {gridState.map((row, y) => (
                        <Row key={`row-${y}`}>
                            {row.map((item, x) => (
                                <GridItem 
                                    key={`row-${y}-item-${x}`}
                                    className="border"
                                    isAvailable={!win && isGridItemAvailable(x as Coordinate, y as Coordinate)}
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