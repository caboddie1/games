import { motion } from "motion/react";
import { useEffect, useRef } from "react"
import { Direction } from "./types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { resetState, updateDirection, updateGameOver, updateHighScore, updatePosition, updatePowerUp, updateScore } from "@/state/snake/snakeSlice";
import { Button } from "reactstrap";
import { Breakpoint } from "@/utils/breakpoint";





type PosModifier = {
    [key in Direction]: {
        x: number;
        y: number;
    }
}

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

interface Touch {
    start: {
        x: number;
        y: number;
    }
    end?: {
        x: number;
        y: number;
    }
}

export default function Snake() {

    const breakpointState = useSelector((state: RootState) => state.breakpoint.value)
    const breakpoint = new Breakpoint(breakpointState);
    const gridSize: number = breakpoint.isBelow('md') ? 20 : 30;

    const grid = Array.from({ length: gridSize }, () => {
        return Array.from({ length: gridSize }, () => {
            return null
        })
    });

    const { direction, position, gameOver, powerUp, score, highScore } = useSelector((state: RootState) => state.snake);
    const dispatch = useDispatch<AppDispatch>();

    const posIntervalRef = useRef<NodeJS.Timeout>(null);
    const touchRef = useRef<null | Touch>(null);

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

    function updateGameState() {

        const xMod = posModifier[direction].x;
        const yMod = posModifier[direction].y;
        const currentHeadPos = position[position.length - 1];
        const nextHeadPos = {
            x: currentHeadPos.x + xMod,
            y: currentHeadPos.y + yMod
        }

        const conditions = [
            nextHeadPos.x > gridSize - 1, 
            nextHeadPos.x < 0, 
            nextHeadPos.y > gridSize - 1, nextHeadPos.y < 0,
            position.some(pos => pos.x === nextHeadPos.x && pos.y === nextHeadPos.y)
        ]

        if (conditions.some(condition => condition)) {
            dispatch(updateGameOver(true));
            if (score > highScore) {
                dispatch(updateHighScore(score));
            }
            return;
        }

        let grow = false;

        if (nextHeadPos.x === powerUp.x && nextHeadPos.y === powerUp.y) {
            dispatch(updateScore());
            dispatch(updatePowerUp(generateRandPowerUpPos()));
            grow = true;
        }

        dispatch(updatePosition({
            pos: {
                x: xMod,
                y: yMod
            },
            grow
        }));

    }

    useEffect(() => {
        if (posIntervalRef.current) {
            clearInterval(posIntervalRef.current)
        }

        if (!gameOver) {
            posIntervalRef.current = setInterval(() => {
                updateGameState();
            }, 80);
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

            updateSnakeDirection(newDirection)
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
                    <div
                        className="position-relative"
                        style={{ 
                            width: squareSize * gridSize,
                            height: squareSize * gridSize,
                            border: '5px solid #777',
                            boxSizing: 'content-box',
                            margin: '0 auto'
                        }}
                    >
                        {grid.map((row, y) => (
                            <div key={`y${y}`} className="">
                                {row.map((_, x) => (
                                    <div 
                                        key={`y${y}x${x}`} 
                                        style={{ 
                                            width: squareSize, 
                                            height: squareSize,
                                            position: 'absolute',
                                            top: y * squareSize,
                                            left: x * squareSize
                                        }}
                                    >

                                    </div>
                                ))}
                            </div>
                        ))}
                        {position.map((pos) => (
                            <motion.div 
                                key={`x${pos.x}y${pos.y}`}
                                style={{
                                    borderRadius: 3,
                                    background: '#777',
                                    height: squareSize,
                                    width: squareSize,
                                    position: 'absolute',
                                    top: pos.y * squareSize,
                                    left: pos.x * squareSize,
                                    paddingLeft: 5,
                                    paddingRight: 5,
                                    boxSizing: 'border-box'
                                }} 
                            />
                        ))}
                        <div style={{
                            top: powerUp.y * squareSize,
                            left: powerUp.x * squareSize,
                            width: squareSize,
                            height: squareSize,
                            borderRadius: '50%',
                            backgroundColor: 'blue',
                            position: 'absolute'
                        }} />

                    </div>
                    <div>
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
