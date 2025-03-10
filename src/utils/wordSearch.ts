import _default from "@emotion/styled";
import { CoordinateObj, Tuple } from "../hooks/grid";
import { randomWords } from "../components/WordSearch/words";

export type Direction = 'horizontal' | 'vertical' | 'diagonal-right' | 'diagonal-left';

type CoordModifiers = {
    [key in Direction]: {
        x: number;
        y: number;
    }
}

const coordModifiers: CoordModifiers = {
    'horizontal': {
        x: 1,
        y: 0
    },
    'vertical': {
        x: 0,
        y: 1
    },
    'diagonal-left': {
        x: -1,
        y: 1
    },
    'diagonal-right': {
        x: 1,
        y: 1
    }
}

interface WordCoordArgs {
    word: string;
    direction: Direction;
    startCoords: CoordinateObj;
}

export function getWord(): string {
    const _randomWords = randomWords.filter(word => word.length >= 5);
    const wordsLen = _randomWords.length;
    const index = Math.floor(Math.random() * wordsLen);

    return _randomWords[index];
}

export interface GridSize {
    x: number;
    y: number;
}

export function getRandomDirection() {
    return Math.floor(Math.random() * Object.entries(coordModifiers).length);
}

export function getRandomGridPosition(gridSize: GridSize): CoordinateObj {
    const y = Math.floor(Math.random() * gridSize.y);
    const x = Math.floor(Math.random() * gridSize.x);

    return { x, y };
}

interface WordStateItem extends CoordinateObj {
    letter: string;

}

export interface WordState {
    word: string;
    coords: WordStateItem[];
    direction: Direction;
}

function getWordCoords({
    word,
    direction,
    startCoords
}: WordCoordArgs): WordStateItem[] {
    const modifiers = coordModifiers[direction];
    return word
        .split('')
        .map((letter, index) => {
            return {
                letter,
                x: startCoords.x + (index * modifiers.x),
                y: startCoords.y + (index * modifiers.y)
            }
        });
}

interface WordFitsArgs {
    word: string;
    state: Tuple<Tuple<string | null, number>, number>;
    startCoords: CoordinateObj;
    gridSize: GridSize;
    direction: Direction;
}

export function getWordFits({
    word,
    state,
    startCoords,
    gridSize,
    direction
}: WordFitsArgs): boolean {
    const modifiers = coordModifiers[direction];

    // End x and y positions
    const endX = word.length * modifiers.x + startCoords.x;
    const endY = word.length * modifiers.y + startCoords.y;
    // Max x and y positions
    const maxX = gridSize.x - 1;
    const maxY = gridSize.y - 1;
    // check if word will fall out of bounds
    if (endX > maxX || endX < 0 || endY > maxY) return false;
    // Array containing letter coordinates
    const wordCoords = getWordCoords({ word, direction, startCoords });
    // check if every position is available
    return wordCoords.every(({ x, y, letter }) => {
        // Current position should be null or the current letter to be valid
        return state[y][x] === null || state[y][x] === letter;
    });
}

function updateGrid(currentState: Tuple<Tuple<string | null, number>, number>, coords: WordStateItem[]) {
    const newState = [ ...currentState ];

    coords.forEach(({ x, y, letter }) => {
        newState[y][x] = letter;
    });

    return newState;
}

function getRandomLetter() {
    const letters = Array.from({ length: 26 }, (_, i) => {
        return String.fromCharCode(97 + i)
    });
    const index = Math.floor(Math.random() * letters.length);
    return letters[index];
}

type Grid = Tuple<Tuple<string | null, number>, number>

export function getWordLength(start: CoordinateObj, end: CoordinateObj) {
    const xDiff = end.x - start.x;
    const yDiff = end.y - start.y;
    // max difference from start position
    const diff = Math.max(xDiff, yDiff);

    return diff === 0 ? 0 : diff + 1;
}


export interface HighlightItem {
    direction: Direction;
    coords: CoordinateObj[];
}

export function getSelectedCoordinates(start: CoordinateObj, end: CoordinateObj): HighlightItem | null {

    const wordLength = getWordLength(start, end);

    if (wordLength === 0) return null;

    // Array of possible moves for each direction
    const posibleMoves = Object.entries(coordModifiers).map(([direction, modifier]) => {
        // Generate an array of length diff + 1 for each possible direction
        // Add 1 because it is inclusive of start and end
        return {
            direction: direction as Direction,
            coords: Array.from({ length: wordLength }, (_, index) => {
                return {
                    x: index * modifier.x + start.x,
                    y: index * modifier.y + start.y
                }
            })
        }
    })


    // return the correct coordinates or null if there is no match
    return posibleMoves.find(row => {
        const lastIndex = row.coords.length - 1;
        // return the array where the end coords match the given end coords
        return row.coords[lastIndex]?.x === end.x && row.coords[lastIndex]?.y === end.y;
    }) || null;

}

export function populateGrid(
    grid: Grid, 
    gridSize: GridSize
): { grid: Grid, words: WordState[] } {
    
    const wordState: WordState[] = []; 
    let currentState: Grid = JSON.parse(JSON.stringify(grid));
    let loops = 0;
    let failedAttempts = 0;
    while (wordState.length <= 25) {
        const randPos = getRandomGridPosition({ x: 15, y: 15 });
        const randWord = getWord();
        const randDirection = Object.keys(coordModifiers)[getRandomDirection()] as Direction;

        const wordFitBaseArgs = {
            word: randWord,
            direction: randDirection,
            startCoords: randPos,
        }

        const wordFits = getWordFits({
            ...wordFitBaseArgs,
            state: currentState,
            gridSize,
        });

        if (wordFits && !wordState.map(r => r.word).includes(randWord)) {
            const wordCoords = getWordCoords(wordFitBaseArgs);
            currentState = updateGrid(currentState, wordCoords)

            wordState.push({
                word: randWord,
                coords: wordCoords,
                direction: randDirection
            });
            failedAttempts = 0;
        } else {
            failedAttempts++;
        }
        loops++;
    }

    getRandomLetter()
    wordState.sort((a, b) => {
        if (a.word < b.word) {
            return -1;
        } 
        if (a.word > b.word) {
            return 1;
        }
        return 0;
    });

    return {
        words: wordState,
        grid: currentState.map(row => {
            return row.map(value => value === null ? getRandomLetter() : value)
        })
    }

}