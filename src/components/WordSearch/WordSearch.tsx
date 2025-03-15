import { useState } from "react";
import { Button, Col, Row } from "reactstrap";
import { useSelector } from "react-redux";

import Grid from "./Grid";
import WordList from "./WordList";

import { WordSearch as _WordSearch } from "@/utils/wordSearch";
import { Breakpoint } from "@/utils/breakpoint";

import { CoordinateObj, Tuple } from "@/hooks/grid"
import { HighlightItem, WordState } from "@/utils/wordSearch";
import { RootState } from "@/state/store";

export interface GridState {
    grid: Tuple<Tuple<string | null, number>, number>;
    words: WordState[];
}

export interface HighlightState {
    start: CoordinateObj | null;
    coords: HighlightItem | null;
}


export default function WordSearch() {

    function initState() {
        const wordSearch = new _WordSearch();
        return wordSearch.getState();
    }

    const [gridState, setGridState] = useState<GridState>(initState);

    const [foundState, setFoundState] = useState<WordState[]>([]);
    const [highlightState, setHighlightState] = useState<HighlightState>({ start: null, coords: null });

    const highlightedWord = highlightState?.coords?.coords.map(({ x, y }) => {
        return gridState.grid[y][x];
    }).join('') || null;

    const breakpointState = useSelector((state: RootState) => state.breakpoint.value);
    const breakpoint = new Breakpoint(breakpointState);

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
            const selectedCoordinates = _WordSearch.getSelectedCoordinates(highlightState.start, coords)?.coords;
            if (!selectedCoordinates) {
                setHighlightState({
                    start: null,
                    coords: null
                })
                return;
            };
            
            const wordLength = _WordSearch.getWordLength(highlightState.start, coords);
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
    }

    function getIsFound(word: string) {
        return foundState.some(row => row.word === word);
    }

    function onSquareHover(coords: CoordinateObj) {
        if (highlightState.start) {
            const highlightedCoordinates = _WordSearch.getSelectedCoordinates(highlightState.start, coords);
            setHighlightState(state => ({
                ...state,
                coords: highlightedCoordinates
            }))
        }
    }

    function onResetClick() {
        setGridState(initState());
        setFoundState([]);
    }


    return (
        <Row className="mt-5">
            <Col 
                xl={6}
                sm={10}
                xs={12}
            >
                <Grid 
                    {...{
                        gridState,
                        foundState,
                        highlightState,
                        highlightedWord,
                        isComplete,
                        onSquareClick,
                        onSquareHover,
                        gridSize: breakpoint.isBelow('md') ? 25 : 30
                    }}
                /> 
                <Button 
                    onClick={() => onResetClick() }
                    color="primary"
                    className="mt-3"
                    >
                    Reset
                </Button>
            </Col>
            <Col 
                xl={4}
                sm={2}
                xs={12}
                
            >
                <h5>Words ({foundState.length} of {gridState.words.length})</h5>
                <WordList 
                    gridState={gridState}
                    getIsFound={getIsFound}
                />

            </Col>
        </Row>
    )
}

