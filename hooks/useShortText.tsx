'use client';

import { useEffect, useState } from 'react';
import { Tooltip } from 'primereact/tooltip';

export default function useShortText(text: string, textLength: number) {
    const [resultText, setResultText] = useState('');
    const [isLength, setIsLength] = useState<boolean>(false);

    useEffect(() => {
        if (text?.length > textLength) {
            setIsLength(true);
            return setResultText(text.slice(0, textLength));
        } else {
            setResultText(text);
            setIsLength(false);
        }
    }, [text]);

    return (
        <>
            <Tooltip target=".hasTooltip" />
            {isLength ? (
                <div className="hasTooltip flex justify-center items-end gap-1" data-pr-tooltip={text} data-pr-position="right">
                    {resultText}
                    <i className="pi pi-ellipsis-h"></i>
                </div>
            ) : (
                <div>{resultText}</div>
            )}
        </>
    );
}
