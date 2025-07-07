'use client';
import useTypingEffect from '@/hooks/useTypingEffect';
import { Editor } from 'primereact/editor';
import { useEffect, useState } from 'react';
import { EditorTextChangeEvent } from 'primereact/editor';

export default function CKEditorWrapper({textValue, insideValue}: {textValue: (e: string)=> void, insideValue: string | null}) {
    const [text, setText] = useState<string>('');
    const [toggleTyping, setToggleTyping] = useState(true);
    
    // const typedText = useTypingEffect(
    //     'Текстти ушул жерге жазыныз',
    //     toggleTyping
    // );

    useEffect(()=> {
        textValue(text);
    },[text]);

    return (
        <div className="flex justify-center">
            {insideValue ? 
                <Editor value={insideValue} onTextChange={(e) => setText((e.htmlValue as any))} className='w-[800px] h-[300px]'/>
                : <Editor value={text} onTextChange={(e: EditorTextChangeEvent) => setText(e.htmlValue)} className='w-[800px] h-[300px]'/>
            }
        </div>
    );
}
