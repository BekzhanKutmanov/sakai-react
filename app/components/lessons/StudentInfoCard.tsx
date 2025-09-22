'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useState } from 'react';

export default function StudentInfoCard({
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
        <div className="w-full flex items-start gap-2 py-1 flex-col sm:flex-row">
            <div className="w-full flex flex-col sm:flex-row gap-1">
                <div className="block sm:hidden">
                    <span className="text-center block text-sm w-full">Выполнено:</span>
                    <div className="p-1 bg-white w-full sm:w-[140px]">
                        <ProgressBar value={10} className="w-full sm:w-[140px]" style={{ backgroundColor: '', color: 'black', height: '20px', fontSize: '12px' }}></ProgressBar>
                    </div>
                </div>
                <div className="w-full flex items-start gap-2">
                    <div className="p-2 bg-[var(--mainColor)] min-w-[38px] min-h-[38px] w-[38px] h-[38px] flex justify-center items-center rounded">
                        <i className={`${icon} text-white`}></i>
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                        {documentUrl?.document_path ? (
                            documentUrl?.document_path?.length > 0 ? (
                                <a
                                    href={documentUrl?.document_path ? (documentUrl?.document_path?.length > 0 ? String(documentUrl?.document_path) : '#') : '#'}
                                    className="max-w-[800px] text-[16px] text-wrap break-all hover:underline"
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {title}
                                </a>
                            ) : (
                                <span className="max-w-[800px] text-[16px] text-wrap break-all ">{title}</span>
                            )
                        ) : (
                            <span className="max-w-[800px] text-[16px] text-wrap break-all">{title}</span>
                        )}
                        <p className="max-w-[800px] text-wrap break-all text-[12px]">{description !== 'null' && description}</p>
                    </div>
                </div>
            </div>
            <div className='w-full flex flex-col'>
                <div className="hidden sm:block w-[190px] p-1">
                    <span className="text-center block text-sm w-full">Выполнено:</span>
                    <div className="p-1 bg-white w-full sm:w-[140px]">
                        <ProgressBar value={10} className="w-full sm:w-[140px]" style={{ backgroundColor: '', color: 'black', height: '', width: '130px',fontSize: '12px' }}></ProgressBar>
                    </div>  
                </div>
                <div className="w-full flex justify-end gap-1 items-center">
                    <div className="">
                        <Link href={`/pdf/${'documentUrl?.document_path'}`}><Button icon='pi pi-eye' className='mini-button'/></Link>
                        {/* {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />} */}
                    </div>

                    <a href={'urlForDownload'} download target="_blank" rel="noopener noreferrer">
                        {' '}
                        <Button icon="pi pi-file-arrow-up" className="mini-button" />
                    </a>
                </div>
            </div>
        </div>
    );

    const linkCard = (
        <div className="w-full flex items-center gap-2 py-1 my-border-top">
            <div className="p-2 bg-[var(--greenColor)] w-[38px] h-[38px] flex justify-center items-center rounded">
                <i className={`${icon} text-white`}></i>
            </div>
            <div className="flex flex-col justify-center gap-1 max-w-[800px] text-wrap break-all">
                <a href={link ? String(link) : '#'} className="max-w-[800px] text-[16px] text-wrap break-all hover:underline" target="_blank">
                    {title}
                </a>
                <p className="max-w-[800px] text-wrap break-all text-[12px]">{description !== 'null' && description}</p>
            </div>
        </div>
    );

    const videoCard = (
        <div className="w-full flex items-center gap-2 py-1 my-border-top">
            <div className="p-2 bg-[#f7634d] w-[38px] h-[38px] flex justify-center items-center rounded">
                <i className={`${icon} text-white`}></i>
            </div>
            <div className="flex flex-col justify-center gap-1 max-w-[800px] text-wrap break-all">
                <span onClick={() => videoStart && videoStart(video_link || '')} className="cursor-pointer max-w-[800px] text-[16px] text-wrap break-all hover:underline">
                    {title}
                </span>

                <p className="max-w-[800px] text-wrap break-all text-[12px]">{description !== 'null' && description}</p>
            </div>
        </div>
    );

    const testCard = (
        <div className="w-full flex items-center gap-2 py-1">
            <div className="p-2 bg-[#c38598] w-[38px] h-[38px] flex justify-center items-center rounded">
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
        <div className="flex items-center gap-2 w-full">
            {test?.answers && (
                <div className="flex flex-col justify-center gap-2 w-full">
                    <div className="flex gap-1 items-center flex-col md:flex-row border-b-1 pb-1 border-[var(--borderBottomColor)]">
                        <span className="cursor-pointer max-w-[800px] text-wrap break-all">{test?.content}</span>
                    </div>
                    <div className="flex flex-col gap-1 justify-center">
                        {test?.answers.map((item) => {
                            return (
                                <div key={item.id}>
                                    <label className="custom-radio opacity-[60%]">
                                        <input disabled type="radio" name="radio" />
                                        <span className="radio-mark min-w-[18px]"></span>
                                        <span>{item.text}</span>
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-1 justify-center w-full">
                        <span className="text-[var(--mainColor)]">Балл за тест: </span>
                        <b className="">{`${test?.score}`}</b>
                    </div>
                </div>
            )}
        </div>
    );

    const practicaCard = (
        <div className="w-full flex items-center gap-2 py-1">
            <div className="p-2 bg-[var(--yellowColor)] w-[38px] h-[38px] flex justify-center items-center rounded">
                <i className={`${icon} text-white`}></i>
            </div>
            <span onClick={() => setPracticaCall(true)} className="cursor-pointer max-w-[800px] text-[16px] text-wrap break-all hover:underline">
                Практическое задание
            </span>
        </div>
    );

    const practicaInfo = (
        <div className="flex flex-col justify-between gap-4 w-full">
            <div className="flex flex-col gap-1 w-full">
                {documentUrl ? (
                    documentUrl.document_path && documentUrl.document_path?.length > 0 ? (
                        <a className="flex gap-2" href={documentUrl.document_path} download target="_blank" rel="noopener noreferrer">
                            <span className="max-w-[800px] text-wrap break-all font-bold hover:underline">{title}</span>
                        </a>
                    ) : (
                        <div className="flex gap-2">
                            <span className="max-w-[800px] text-wrap break-all font-bold">{title}</span>
                        </div>
                    )
                ) : (
                    <div className="flex gap-2">
                        <span className="max-w-[800px] text-wrap break-all font-bold">{title}</span>
                    </div>
                )}
                <p className="max-w-[800px] text-wrap break-all">{description !== 'null' && description}</p>
            </div>
            <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-1">
                    <span className="text-[var(--mainColor)] text-[13px]">Документ: </span>
                    {documentUrl && documentUrl.document_path && documentUrl.document_path?.length > 0 ? (
                        <a className={`flex gap-2 pi pi-file-arrow-up text-xl text-white bg-[var(--mainColor)] p-1 rounded`} href={documentUrl && documentUrl.document_path} download target="_blank" rel="noopener noreferrer"></a>
                    ) : (
                        <span className={`flex gap-2 pi pi-file-arrow-up text-xl text-white bg-[gray] p-1 rounded`} rel="noopener noreferrer"></span>
                    )}
                </div>

                <div className="flex gap-2 items-center">
                    <span className="text-[var(--mainColor)] text-[13px]">Ссылка: </span>
                    {link ? (
                        <a href={link ? String(link) : ''} className="max-w-[800px] text-[13px] text-wrap break-all" target="_blank">
                            {link}
                        </a>
                    ) : (
                        <span className={``} rel="noopener noreferrer">
                            ?
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className='w-full'>
            <Dialog
                header={'Тест'}
                className="p-2 sm:w-[600px] max-h-[400px]"
                visible={testCall}
                onHide={() => {
                    if (!testCall) return;
                    setTestCall(false);
                }}
            >
                <div className="flex items-center w-full">{testInfo}</div>
            </Dialog>
            <Dialog
                header={'Практическое задание'}
                className="p-2 sm:w-[600px] max-h-[400px]"
                visible={practicaCall}
                onHide={() => {
                    if (!practicaCall) return;
                    setPracticaCall(false);
                }}
            >
                <div className="flex items-center">{practicaInfo}</div>
            </Dialog>
            <div className="flex items-center">{type === 'document' && docCard}</div>
            <div className="flex items-center">{type === 'link' && linkCard}</div>
            <div className="flex items-center">{type === 'video' && videoCard}</div>
            <div className="flex items-center">{type === 'test' && testCard}</div>
            <div className="flex items-center">{type === 'practical' && practicaCard}</div>
        </div>
    );
}
