import { useEffect, useMemo, useRef } from "react"
import { Direction, PosModifier, Touch, Variant } from "./types";
import { AppDispatch } from "@/state/store";
import { resetState, updateDirection, updateGameOver, updateHighScore, updatePosition, updatePowerUp, updateScore, updateSpecialPowerUp } from "@/state/snake/snakeSlice";
import { Button } from "reactstrap";
import { Breakpoint } from "@/utils/breakpoint";
import { updateGameMode } from "@/state/game/gameSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import styled, { CSSObject } from "@emotion/styled";
import { CoordinateObj } from "@/hooks/grid";
import Grid from "./Grid";

const posModifier: PosModifier = {
    up: {
        y: -1,
        x: 0,
    },
    down: {
        y: 1,
        x: 0
    },
    left: {
        y: 0,
        x: -1
    },
    right: {
        y: 0,
        x: 1
    }
}

const codeMap: { [key: string]: Direction } = {
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'ArrowLeft': 'left',
    'ArrowRight': 'right'
}

const squareSize: number = 20;

interface Props {
    variant: Variant;
}

export default function Snake({ variant }: Props) {

    const breakpointState = useAppSelector(state => state.breakpoint.value)
    const screen = useAppSelector(state => state.breakpoint.screen);
    const gameMode = useAppSelector(state => state.game.gameMode);
    const breakpoint = new Breakpoint(breakpointState);
    const gridSize: number = breakpoint.isBelow('md') ? Math.floor(Math.min(screen.height, screen.width) / 20) - 2 : 30;

    const grid = useMemo(() => {
        return Array.from({ length: gridSize }, () => {
            return Array.from({ length: gridSize }, () => {
                return null;
            })
        });
    }, [gridSize]);

    const { 
        direction, 
        position, 
        gameOver, 
        powerUp, 
        specialPowerUp,
        score, 
        highScore, 
    } = useAppSelector(state => state.snake);

    const dispatch = useAppDispatch<AppDispatch>();

    const posIntervalRef = useRef<NodeJS.Timeout>(null);
    const touchRef = useRef<null | Touch>(null);
    const specialPowerUpRef = useRef<NodeJS.Timeout | null>(null);

    function getRandomSpecialPowerUpPos() {
        const possiblePositions = [ ...Array(gridSize - 1)]
            .flatMap((_, yIndex) => {
                const array: CoordinateObj[][] = []
                
                let outOfBounds = false;
                let xIndex = 0;

                while (!outOfBounds) {
                    if (xIndex >= gridSize - 1 || yIndex >= gridSize - 1) {
                        outOfBounds = true;
                        continue;
                    }
                    array.push([{
                        y: yIndex,
                        x: xIndex
                    },
                    {
                        y: yIndex,
                        x: xIndex + 1
                    },
                    {
                        y: yIndex + 1,
                        x: xIndex
                    },
                    {
                        y: yIndex + 1,
                        x: xIndex + 1
                    }
                    ])
                    xIndex += 1;
                }

                return array;
            })
            .filter(arr => {
                return !position.some(pos => {
                    return arr.some(coord => coord.x === pos.x && coord.y === pos.y)
                })
            })


        const randomNumber = Math.floor(Math.random() * possiblePositions.length);

        return possiblePositions[randomNumber];
    }

    function generateRandPowerUpPos() {

        const gridArray = grid
            .flatMap((_, y) => {
                return grid.map((_, x) => ({
                    x,
                    y
                }))
            })
            .filter(gridPos => {
                return !position.some(snakePos => snakePos.x === gridPos.x && snakePos.y === gridPos.y)
            });

        const randomNumber = Math.floor(Math.random() * gridArray.length);

        return gridArray[randomNumber];

    }

    function hasEatenPowerUp(pos: CoordinateObj) {
        return pos.x === powerUp.position.x && pos.y === powerUp.position.y;
    }

    function hasEatenSpecialPowerUp(pos: CoordinateObj) {
        if (!specialPowerUp.position) return false;
        return specialPowerUp.position.some((powerUpPos) => {
            return pos.x === powerUpPos.x && pos.y === powerUpPos.y;
        })
    }

    function getSpecialPowerUpTime() {
        if (specialPowerUp.position && specialPowerUp.unixStartTime) {
            const currentUnixTime = Date.now();

            const diff = Math.floor((currentUnixTime - specialPowerUp.unixStartTime) / 1000);

            return 10 - diff;
        }
    }

    getSpecialPowerUpTime();

    function updateGameState() {

        const xMod = posModifier[direction].x;
        const yMod = posModifier[direction].y;
        const currentHeadPos = position[position.length - 1];
        const nextHeadPos = {
            x: (currentHeadPos.x + xMod) % gridSize,
            y: (currentHeadPos.y + yMod) % gridSize
        }

        if (variant === 'Snake II') {
            if (nextHeadPos.x < 0) {
                nextHeadPos.x = gridSize - 1;
            }
            if (nextHeadPos.y < 0) {
                nextHeadPos.y = gridSize -1;
            }
        }
        const snakeGameOverConditions = [
            nextHeadPos.x >= gridSize - 1, 
            nextHeadPos.x < 0, 
            nextHeadPos.y >= gridSize - 1, 
            nextHeadPos.y < 0,
        ]

        const gameOverConditions = [
            ...(variant === 'Snake' ? snakeGameOverConditions : []),
            position.some(pos => pos.x === nextHeadPos.x && pos.y === nextHeadPos.y)
        ]

        if (gameOverConditions.some(condition => condition)) {
            dispatch(updateGameOver(true));
            if (score > highScore) {
                dispatch(updateHighScore(score));
            }
            return;
        }

        let grow = false;

        if (hasEatenPowerUp(nextHeadPos)) {
            dispatch(updateScore(10));
            dispatch(updatePowerUp(generateRandPowerUpPos()));
            grow = true;

            if (variant === 'Snake II' && powerUp.count > 1 && (powerUp.count + 1) % 5 === 0) {
                const unixStartTime = Date.now();
                dispatch(updateSpecialPowerUp({
                    position: getRandomSpecialPowerUpPos(),
                    unixStartTime
                }));
                specialPowerUpRef.current = setTimeout(() => {
                    dispatch(updateSpecialPowerUp({
                        position: null,
                        unixStartTime: null
                    }));
                }, 10 * 1000);
            }
        }

        if (hasEatenSpecialPowerUp(nextHeadPos)) {
            dispatch(updateSpecialPowerUp({
                position: null,
                unixStartTime: null
            }));
            if (specialPowerUpRef.current) {
                clearTimeout(specialPowerUpRef.current);
            }
            const bonusScore = 10 - Math.floor((Date.now() - (specialPowerUp.unixStartTime || 0)) / 1000);
            dispatch(updateScore( bonusScore * 10 ));
        }

        dispatch(updatePosition({
            pos: nextHeadPos,
            grow
        }));

    }
    const testRef = useRef<number>(1);
    useEffect(() => {

        if (posIntervalRef.current) {
            clearInterval(posIntervalRef.current)
        }

        if (!gameOver) {

            if (!gameMode) dispatch(updateGameMode(true));
            posIntervalRef.current = setInterval(() => {
                testRef.current += 1;
                updateGameState();
            }, 80);
        } else {
            if (gameMode) dispatch(updateGameMode(false));
        }

        return () => {
            posIntervalRef.current && clearInterval(posIntervalRef.current);
        }
    }, [direction, gameOver, position]);

    useEffect(() => {

        function updateSnakeDirection(newDirection: Direction | undefined) {
            if (newDirection) {
                if (newDirection === 'left' && direction === 'right') return;
                if (newDirection === 'right' && direction === 'left') return;
                if (newDirection === 'down' && direction === 'up') return;
                if (newDirection === 'up' && direction === 'down') return;
                dispatch(updateDirection(newDirection));
            }
        }

        function onKeyPress(e: KeyboardEvent) {
            const key = e.code;

            const newDirection: Direction | undefined = codeMap[key];

            if (newDirection) {
                updateSnakeDirection(newDirection)
            }

        }

        function onTouchStart(e: TouchEvent) {
            touchRef.current = {
                start: {
                    x: e.changedTouches[0].screenX,
                    y: e.changedTouches[0].screenY,
                },

            }
        }

        function onTouchEnd(e: TouchEvent) {
            if (touchRef.current) {
                touchRef.current.end = {
                    x: e.changedTouches[0].screenX,
                    y: e.changedTouches[0].screenY
                }
            }
            const direction = getSwipeDirection();

            if (direction) {
                updateSnakeDirection(direction)
            }
            
        }

        function getSwipeDirection(): Direction | undefined {
            if (!touchRef.current) return undefined;

            const { start, end } = touchRef.current;

            if (!end) return undefined;
            const xDiff = Math.abs(end?.x - start.x);
            const yDiff = Math.abs(end.y - start.y)

            switch (true) {
                case end.x < start.x && xDiff > yDiff:
                    return 'left';
                case end.x > start.x && xDiff > yDiff:
                    return 'right';
                case end.y < start.y && yDiff > xDiff:
                    return 'up';
                case end.y > start.y && yDiff > xDiff:
                    return 'down';
                default:
                    return undefined;
            }
        }

        window.addEventListener('keydown', onKeyPress);
        window.addEventListener('touchstart', onTouchStart);
        window.addEventListener('touchend', onTouchEnd);

        return () => {
            window.removeEventListener('keydown', onKeyPress);
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchend', onTouchEnd);
        }
    });

    return (
        <div className="text-center">
            {!gameOver ?
                <>
                    <GridWrapper 
                        className="position-relative"
                        gridSize={gridSize}
                    >
                        <Grid
                            squareSize={squareSize}
                            gridSize={gridSize}
                            grid={grid}
                            variant={variant}
                        />
                        {position.map((pos) => (
                            <SnakeBody 
                                key={`x${pos.x}y${pos.y}`}
                                pos={pos}
                            />
                        ))}
                        <PowerUp
                            pos={powerUp.position}
                        />
                        {specialPowerUp.position &&
                            <SpecialPowerUp 
                                pos={specialPowerUp.position[0]}
                                type="grid"
                            />
                        }
                    </GridWrapper>
                    <div className="mt-3">
                        <div className="d-flex" style={{ justifyContent: 'center', alignItems: 'center'}}>
                            {specialPowerUp.position &&
                                <>
                                    <SpecialPowerUp
                                        type="display"
                                        className="me-2"
                                    />
                                    <h1>{getSpecialPowerUpTime() || 99}</h1>
                                </>
                            }
                        </div>
                        <h5>Score {score}</h5>
                        <h5>High Score {highScore}</h5>
                    </div>
                </>
            : 
                <div className="p-5 text-center">
                    <h1>Game Over!</h1>
                    <p>Score: {score}</p>
                    <p>High Score {highScore}</p>
                    <Button 
                        color="primary"
                        onClick={() => dispatch(resetState())}
                    >
                        Play Again
                    </Button>
                </div>
            }
        </div>
    )
}

interface GridWrapperProps {
    gridSize: number;
}

const GridWrapper = styled('div')<GridWrapperProps>(({ gridSize }) => ({
    width: gridSize * squareSize,
    height: gridSize * squareSize,
    margin: '0 auto'
}));

interface SnakeBodyProps {
    pos: CoordinateObj;
}

function getPosition({ x, y }: CoordinateObj): CSSObject {
    return {
        top: y * squareSize,
        left: x * squareSize
    }
}

function getSize(count: number = 1): CSSObject {
    return {
        height: squareSize * count,
        width: squareSize * count
    }
}

const SnakeBody = styled('div')<SnakeBodyProps>(({ pos }) => ({
    ...getPosition(pos),
    ...getSize(),
    borderRadius: 3,
    background: '#777',
    position: 'absolute',
    paddingLeft: 5,
    paddingRight: 5,
    boxSizing: 'border-box'
} as CSSObject));

interface PowerUpProps extends SnakeBodyProps {}

const PowerUp = styled('div')<PowerUpProps>(({ pos }) => ({
    ...getPosition(pos),
    ...getSize(),
    borderRadius: '50%',
    backgroundColor: 'blue',
    position: 'absolute'
}))

type SpecialPowerUpProps = 
    | {
        type: 'grid';
        pos: CoordinateObj;
    }
    | {
        type: 'display'
    }

const SpecialPowerUp = styled('div')<SpecialPowerUpProps>((props) => ({
    ...getSize(2),
    background: 'green',
    borderRadius: '50%',
    ...(props.type === 'display' ? {} : {
        ...getPosition(props.pos),
        position: 'absolute'
    })
}));