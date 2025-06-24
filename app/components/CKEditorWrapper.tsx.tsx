'use client';
import { Editor } from 'primereact/editor';
import { useEffect, useState } from 'react';

export default function CKEditorWrapper() {
    const [text, setText] = useState('');

    useEffect(()=> {
      console.log(text);
    },[text]);

    return (
        <div className="flex justify-center">
            <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} className='w-[800px] h-[300px]' />
        </div>
    );
}
