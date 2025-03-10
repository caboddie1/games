import { GridState } from "./WordSearch"

interface Props {
    gridState: GridState;
    getIsFound: (word: string) => boolean;
}

export default function WordList({ gridState, getIsFound }: Props) {
    return (
        <div>
            {gridState.words.map(item => (
                <div 
                    key={item.word} 
                    className={getIsFound(item.word) ? 'text-decoration-line-through' : ''}
                >
                    {item.word}
                </div>
            ))}
        </div>
    )
}