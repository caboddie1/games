import styled from "@emotion/styled";
import { Direction, WordState } from "../../utils/wordSearch";

interface Props {
    baseSize: number;
    wordState: WordState;
}

type RotateTable = {
    [key in Direction]: string;
}

const Highlight = styled('div')<Props>(({ wordState, baseSize }) => {
    const startPos = wordState.coords[0];

    const height = wordState.direction === 'vertical' ? wordState.word.length * baseSize : baseSize - 10;
    let width = wordState.direction === 'vertical' ? baseSize - 10 : wordState.word.length * baseSize;

    let top = startPos.y * baseSize;
    let left = startPos.x * baseSize;

    if (wordState.direction === 'vertical' || wordState.direction.includes('diagonal')) left += 5;
    if (wordState.direction === 'horizontal' || wordState.direction.includes('diagonal')) top += 5;

    if (wordState.direction.includes('diagonal')) width *= 1.38

    const rotateTable: RotateTable = {
        'horizontal': '0',
        'vertical': '0',
        'diagonal-left': '135',
        'diagonal-right': '45'
    };

    return {
        position: 'absolute',
        transform: `rotate(${rotateTable[wordState.direction]}deg)`,
        ...!wordState.direction.includes('diagonal') ? {} : { 
            transformOrigin: wordState.direction === 'diagonal-right' ? '15px 0' : '14px 8px'
        },
        background: '#e87e45',
        width,
        height,
        top,
        left,
        opacity: 0.5,
        borderRadius: 20,
        pointerEvents: 'none'
    }
});

export default Highlight;