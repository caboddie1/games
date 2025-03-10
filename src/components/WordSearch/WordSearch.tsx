import { CoordinateObj, Tuple } from "../../hooks/grid"
import { getSelectedCoordinates, getWordLength, HighlightItem, populateGrid, WordState } from "../../utils/wordSearch";
import { useState } from "react";
import { Button, Col, Row } from "reactstrap";
import Grid from "./Grid";
import WordList from "./WordList";

const gridSize = { rows: 15 as 15, columns: 15 as 15 };


const blankGrid = [ ...Array(gridSize.rows) ].map(() => {
    return [ ...Array(gridSize.columns) ].map(() => null);
})


export interface GridState {
    grid: Tuple<Tuple<string | null, number>, number>;
    words: WordState[];
}

export interface HighlightState {
    start: CoordinateObj | null;
    coords: HighlightItem | null;
}


export default function WordSearch() {

    const [gridState, setGridState] = useState<GridState>(populateGrid(blankGrid, { x: 15, y: 15 }));
    const [foundState, setFoundState] = useState<WordState[]>([]);
    const [highlightState, setHighlightState] = useState<HighlightState>({ start: null, coords: null });

    const highlightedWord = highlightState?.coords?.coords.map(({ x, y }) => {
        return gridState.grid[y][x];
    }).join('') || null;

    const isComplete = gridState.words.length === foundState.length;
 
    function onSquareClick(coords: CoordinateObj) {

        if (highlightState.start === null) {
            setHighlightState({
                coords: {
                    direction: 'horizontal',
                    coords: [{ ...coords }]
                }, 
                start: coords
            });
        } else {
            const selectedCoordinates = getSelectedCoordinates(highlightState.start, coords)?.coords;
            if (!selectedCoordinates) {
                setHighlightState({
                    start: null,
                    coords: null
                })
                return;
            };

            const wordLength = getWordLength(highlightState.start, coords);
            const wordMatch = gridState.words
                .filter(row => row.word.length === wordLength)
                .find(row => {
                    return row.coords.every(({ x, y }, i) => {
                        return x === selectedCoordinates[i].x && y === selectedCoordinates[i].y;
                    })
                });
            if (wordMatch && !foundState.map(r => r.word).includes(wordMatch.word)) {
                setFoundState(currentState => [ ...currentState, wordMatch ]);
            }

            setHighlightState({
                start: null,
                coords: null
            })
        }

        /*if (startRef.current === null) {
            startRef.current = coords;
        } else {
            console.log(`startRef is not null`)
            const selectedCoordinates = getSelectedCoordinates(startRef.current, coords)?.coords;
            console.log(selectedCoordinates)
            if (!selectedCoordinates) {
                return startRef.current = null;
            };

            const wordLength = getWordLength(startRef.current, coords);
            console.log('word length: ', wordLength)

            const wordMatch = gridState.words
                .filter(row => row.word.length === wordLength)
                .find(row => {
                    return row.coords.every(({ x, y }, i) => {
                        return x === selectedCoordinates[i].x && y === selectedCoordinates[i].y;
                    })
                });

            if (wordMatch && !foundState.map(r => r.word).includes(wordMatch.word)) {
                setFoundState(currentState => [ ...currentState, wordMatch ]);
            }
            startRef.current = null;
        }*/
    }

    function getIsFound(word: string) {
        return foundState.some(row => row.word === word);
    }

    function onSquareHover(coords: CoordinateObj) {
        if (highlightState.start) {
            const highlightedCoordinates = getSelectedCoordinates(highlightState.start, coords);
            setHighlightState(state => ({
                ...state,
                coords: highlightedCoordinates
            }))
        }
    }

    function onResetClick() {
        setGridState(populateGrid(blankGrid, { x: 15, y: 15 }));
        setFoundState([]);
    }


    return (
        <Row className="mt-5">
            <Col xl={6}>
                <Grid 
                    {...{
                        gridState,
                        foundState,
                        highlightState,
                        highlightedWord,
                        isComplete,
                        onSquareClick,
                        onSquareHover
                    }}
                /> 
            </Col>
            <Col xl={4}>
                <WordList 
                    gridState={gridState}
                    getIsFound={getIsFound}
                />
                <Button 
                    onClick={() => onResetClick() }
                    color="primary"
                    className="mt-3"
                    >
                    Reset
                </Button>
            </Col>
        </Row>
    )
}

