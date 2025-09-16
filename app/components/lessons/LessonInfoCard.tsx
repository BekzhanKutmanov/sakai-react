'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { useState } from 'react';

export default function LessonInfoCard({
    type,
    icon,
    title,
    description,
    documentUrl,
    link,
    video_link,
    videoStart,
    test
}: {
    type: string;
    icon: string;
    title?: string;
    description?: string;
    documentUrl?: { document: string | null; document_path: string };
    link?: string;
    video_link?: string;
    videoStart?: (id: string) => void;
    test?: { content: string; answers: { id: number | null; text: string; is_correct: boolean }[]; score: number | null };
}) {
    const { id_kafedra } = useParams();
    // console.log(id_kafedra);

    const media = useMediaQuery('(max-width: 640px)');

    const [testCall, setTestCall] = useState(false);
    const [practicaCall, setPracticaCall] = useState(false);

    const docCard = (
        <div className="w-full flex items-center gap-2 border-t-1 border-[gray]">
            <div className="p-2 bg-[var(--mainColor)] w-[36px] h-[36px] flex justify-center items-center rounded">
                <i className={`${icon} text-white`}></i>
            </div>
            <div className="flex flex-col justify-center gap-1">
                {documentUrl?.document_path ? (
                    documentUrl?.document_path?.length > 0 ? (
                        <a href={documentUrl?.document_path ? (documentUrl?.document_path?.length > 0 ? String(documentUrl?.document_path) : '#') : '#'} className="max-w-[800px] text-[16px] text-wrap break-all hover:underline" download target="_blank" rel="noopener noreferrer">
                            {title}
                        </a>
                    ) : (
                        <span className="max-w-[800px] text-[16px] text-wrap break-all ">{title}</span>
                    )
                ) : (
                    <span className="max-w-[800px] text-[16px] text-wrap break-all">{title}</span>
                )}
                <p className="max-w-[800px] text-wrap break-all text-[12px]">{description}</p>
            </div>
        </div>
    );

    const linkCard = (
        <div className="w-full flex items-center gap-2 py-1 border-t-1 border-[gray]">
            <div className="p-2 bg-[var(--greenColor)] w-[36px] h-[36px] flex justify-center items-center rounded">
                <i className={`${icon} text-white`}></i>
            </div>
            <div className="flex flex-col justify-center gap-1 max-w-[800px] text-wrap break-all">
                <a href={link ? String(link) : '#'} className="max-w-[800px] text-[16px] text-wrap break-all hover:underline" target="_blank">
                    {title}
                </a>

                <p className="max-w-[800px] text-wrap break-all text-[12px]">{description}</p>
            </div>
        </div>
    );

    const videoCard = (
        <div className="w-full flex items-center gap-2 py-1 border-t-1 border-[gray]">
            <div className="p-2 bg-[#f7634d] w-[36px] h-[36px] flex justify-center items-center rounded">
                <i className={`${icon} text-white`}></i>
            </div>
            <div className="flex flex-col justify-center gap-1 max-w-[800px] text-wrap break-all">
                <span onClick={() => videoStart && videoStart(video_link || '')} className="cursor-pointer max-w-[800px] text-[16px] text-wrap break-all hover:underline">
                    {title}
                </span>

                <p className="max-w-[800px] text-wrap break-all text-[12px]">{description}</p>
            </div>
        </div>
    );

    const testCard = (
        <div className="w-full flex items-center gap-2 py-1 border-t-1 border-[gray]">
            <div className="p-2 bg-[#c38598] w-[36px] h-[36px] flex justify-center items-center rounded">
                <i className={`${icon} text-white`}></i>
            </div>
            <div className="flex flex-col justify-center gap-1 max-w-[800px] text-wrap break-all">
                <span onClick={() => setTestCall(true)} className="cursor-pointer max-w-[800px] text-[16px] text-wrap break-all hover:underline">
                    Тест
                </span>
            </div>
        </div>
    );

    const testInfo = (
        <div className="flex items-center gap-2">
            {test?.answers && (
                <div className="flex flex-col justify-center gap-2">
                    <div className="flex gap-1 items-center flex-col md:flex-row">
                        <b className="cursor-pointer max-w-[800px] sm:text-xl text-wrap break-all">{test?.content}</b>
                        <div className="flex items-center justify-center">
                            <span className="text-[var(--mainColor)]">{!media && '/'} Балл: </span>
                            <b className="text-[16px] sm:text-[18px]">{`${test?.score}`}</b>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center">
                        {test?.answers.map((item) => {
                            return (
                                <div key={item.id}>
                                    <label className="custom-radio opacity-[60%]">
                                        <input disabled type="radio" name="radio" checked={item.is_correct} />
                                        <span className="radio-mark min-w-[18px]"></span>
                                        <span>{item.text}</span>
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );

    const practicaCard = (
        <div className="w-full flex items-center gap-2 py-1 border-t-1 border-[gray]">
            <div className="p-2 bg-[var(--yellowColor)] w-[36px] h-[36px] flex justify-center items-center rounded">
                <i className={`${icon} text-white`}></i>
            </div>
            <span onClick={() => setPracticaCall(true)} className="cursor-pointer max-w-[800px] text-[16px] text-wrap break-all hover:underline">
                Практическое задание
            </span>
        </div>
    );

    const docuemntPath = documentUrl && documentUrl?.document_path;

    const practicaInfo = (
        <div className="flex flex-col justify-between gap-4">
            <div className='flex flex-col justify-center gap-1'>
                <b className="cursor-pointer max-w-[800px] sm:text-xl text-wrap break-all">{title}</b>
                <p className="max-w-[800px] text-wrap break-all text-[12px]">{description}</p>
            </div>
            <div className="flex flex-col gap-2 justify-center">
                {documentUrl ? (
                    documentUrl.document && documentUrl.document?.length > 0 ? (
                        <a className="flex gap-2" href={documentUrl.document} download target="_blank" rel="noopener noreferrer">
                            <span className="text-[var(--mainColor)] text-[13px]">Документ: </span>
                            <span className="max-w-[800px] text-wrap break-all text-[13px]">{docuemntPath}</span>
                        </a>
                    ) : (
                        <div className="flex gap-2">
                            <span className="text-[var(--mainColor)] text-[13px]">Документ: </span>
                            <span className="max-w-[800px] text-wrap break-all text-[13px]">{docuemntPath}</span>
                        </div>
                    )
                ) : (
                    <div className="flex gap-2">
                        <span className="text-[var(--mainColor)] text-[13px]">Документ: </span>
                        <span className="max-w-[800px] text-wrap break-all text-[13px]">{docuemntPath}</span>
                    </div>
                )}
                <div className="flex gap-2">
                    <span className="text-[var(--mainColor)] text-[13px]">Ссылка: </span>
                    <a href={link ? String(link) : '#'} className="max-w-[800px] text-[13px] text-wrap break-all" target="_blank">
                        {link}
                    </a>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <Dialog
                header={'Тест'}
                className="p-2 sm:w-[500px] h-[300px]"
                visible={testCall}
                onHide={() => {
                    if (!testCall) return;
                    setTestCall(false);
                }}
            >
                <div className="flex justify-center items-center">{testInfo}</div>
            </Dialog>
            <Dialog
                header={'Практическое задание'}
                className="p-2 sm:w-[500px] h-[300px]"
                visible={practicaCall}
                onHide={() => {
                    if (!practicaCall) return;
                    setPracticaCall(false);
                }}
            >
                <div className="flex justify-center items-center">{practicaInfo}</div>
            </Dialog>
            <div className="flex items-center">{type === "document" && docCard}</div>
            <div className="flex items-center">{type === 'link' && linkCard}</div>
            <div className="flex items-center">{type === 'video' && videoCard}</div>
            <div className="flex items-center">{type === 'test' && testCard}</div>
            <div className="flex items-center">{type === 'practical' && practicaCard}</div>
        </div>
    );
}
