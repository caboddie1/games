import { generate } from "random-words";

import { CoordinateObj, Tuple } from "@/hooks/grid";
import { GridState } from "@/components/WordSearch/WordSearch";

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

export interface GridSize {
    x: number;
    y: number;
}

interface WordStateItem extends CoordinateObj {
    letter: string;

}

export interface WordState {
    word: string;
    coords: WordStateItem[];
    direction: Direction;
}

type Grid = Tuple<Tuple<string | null, number>, number>

export interface HighlightItem {
    direction: Direction;
    coords: CoordinateObj[];
}

interface WordSearchConfig {
    gridSize?: number;
    numWords?: number;
}

export class WordSearch {
    public gridSize: number = 15;
    public wordState: WordState[] = [];
    public grid: Grid = this.generateGrid();
    private numWords: number = 25;

    constructor(config?: WordSearchConfig) {
        if (config?.gridSize) {
            this.gridSize = config.gridSize;
        }

        if (config?.numWords) {
            this.numWords = config.numWords
        }
        this.populateGrid();
    }

    private static getWord(): string {
        return generate({ exactly: 1, minLength: 5, maxLength: 10 })[0] as string;
    }

    private static getRandomLetter(): string {
        const letters = Array.from({ length: 26 }, (_, i) => {
            return String.fromCharCode(97 + i)
        });
        const index = Math.floor(Math.random() * letters.length);
        return letters[index];
    }

    public static getSelectedCoordinates(start: CoordinateObj, end: CoordinateObj): HighlightItem | null {

        const wordLength = WordSearch.getWordLength(start, end);

        if (wordLength === 0) return null;

        // Array of possible moves for each direction
        const posibleMoves = Object.entries(coordModifiers).map(([direction, modifier]) => {
            // Generate an array of length diff + 1 for each possible direction
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

    private static getWordCoords({
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

    private static getRandomDirection() {
        return Math.floor(Math.random() * Object.entries(coordModifiers).length);
    }

    public static getWordLength(start: CoordinateObj, end: CoordinateObj) {
        const xDiff = end.x - start.x;
        const yDiff = end.y - start.y;
        // max difference from start position
        const diff = Math.max(xDiff, yDiff);

        return diff === 0 ? 0 : diff + 1;
    }

    private getRandomGridPosition() {
        const y = Math.floor(Math.random() * this.gridSize);
        const x = Math.floor(Math.random() * this.gridSize);

        return { x, y };
    }

    private generateGrid(): (null | string)[][] {
        return Array.from({ length: this.gridSize }, () => {
            return Array.from({ length: this.gridSize }, () => null)
        })
    }

    private updateGrid(coords: WordStateItem[]) {
        coords.forEach(({ x, y, letter }) => {
            this.grid[y][x] = letter;
        });
    }

    private sortWordState() {
        this.wordState.sort((a, b) => {
            if (a.word < b.word) {
                return -1;
            } 
            if (a.word > b.word) {
                return 1;
            }
            return 0;
        });
    }

    private fillEmptySquares() {
        for (const y in this.grid) {
            for (const x in this.grid[y]) {
                if (this.grid[y][x] === null) {
                    this.grid[y][x] = WordSearch.getRandomLetter();
                }
            }
        }
    }

    private getWordFits({
    word,
    startCoords,
    direction
}: WordCoordArgs): boolean {
    const modifiers = coordModifiers[direction];
    // End x and y positions
    const endX = word.length * modifiers.x + startCoords.x;
    const endY = word.length * modifiers.y + startCoords.y;
    // Max x and y positions
    const maxX = this.gridSize - 1;
    const maxY = this.gridSize - 1;
    // check if word will fall out of bounds
    if (endX > maxX || endX < 0 || endY > maxY) return false;
    // Array containing letter coordinates
    const wordCoords = WordSearch.getWordCoords({ word, direction, startCoords });
    // check if every position is available
    return wordCoords.every(({ x, y, letter }) => {
        // Current position should be null or the current letter to be valid
        return this.grid[y][x] === null || this.grid[y][x] === letter;
    });
}

    private populateGrid() {
        let loops = 0;
        let failedAttempts = 0;
        while (this.wordState.length < this.numWords) {
            const randPos = this.getRandomGridPosition();
            const randWord = WordSearch.getWord();
            const randDirection = Object.keys(coordModifiers)[WordSearch.getRandomDirection()] as Direction;

            const wordFitBaseArgs = {
                word: randWord,
                direction: randDirection,
                startCoords: randPos,
            }

            const wordFits = this.getWordFits({
                ...wordFitBaseArgs,
            });

            if (wordFits && !this.wordState.map(r => r.word).includes(randWord)) {
                const wordCoords = WordSearch.getWordCoords(wordFitBaseArgs);
                this.updateGrid(wordCoords)

                this.wordState.push({
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

        this.sortWordState();
        this.fillEmptySquares();
    }

    public getState(): GridState {
        return {
            grid: this.grid,
            words: this.wordState
        }
    }
}