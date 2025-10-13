'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useState } from 'react';

export default function LessonInfoCard({
    contentType,
    totalScore,
    type,
    icon,
    title,
    description,
    documentUrl,
    link,
    video_link,
    videoStart,
    test,
    getValues,
    answerList
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
    contentType?: string;
    totalScore?: number | null;
    answerList?: { answer_id: number | null; file: string };
    getValues: () => void;
}) {
    const media = useMediaQuery('(max-width: 640px)');

    const [testCall, setTestCall] = useState(false);
    const [docCall, setDocCall] = useState(false);
    const [practicaCall, setPracticaCall] = useState(false);
    const [linkCall, setLinkCall] = useState(false);

    const hasPdf = /pdf/i.test(documentUrl?.document_path || ''); // true

    const docCard = (
        <div className="w-full flex items-start sm:items-center gap-2 py-1">
            <div className="p-2 bg-[var(--mainColor)] min-w-[36px] min-h-[36px] w-[36px] h-[36px] flex justify-center items-center rounded">
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

            {contentType === 'check' && (
                <div className="flex items-center gap-2">
                    <Button
                        label={'Проверить'}
                        onClick={() => {
                            getValues();
                            setDocCall(true);
                        }}
                    />
                </div>
            )}
        </div>
    );

    const docSection = (
        <div className="flex flex-col justify-between gap-4 w-full">
            <div className="flex flex-col gap-1 w-full">
                {documentUrl ? (
                    documentUrl.document_path && hasPdf ? (
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
                {/* <p className="max-w-[800px] text-wrap break-all">{description}</p> */}
                {description && description !== 'null' && <div dangerouslySetInnerHTML={{ __html: description }} />}
            </div>
            <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-1">
                    <span className="text-[var(--mainColor)] text-[13px]">Документ: </span>
                    {documentUrl && documentUrl.document_path && hasPdf ? (
                        <a className={`flex gap-2 pi pi-file-arrow-up text-xl text-white bg-[var(--mainColor)] p-1 rounded`} href={documentUrl && documentUrl.document_path} download target="_blank" rel="noopener noreferrer"></a>
                    ) : (
                        <span className={`flex gap-2 pi pi-file-arrow-up text-xl text-white bg-[gray] p-1 rounded`} rel="noopener noreferrer"></span>
                    )}
                </div>
            </div>
        </div>
    );

    const linkCard = (
        <div className="w-full flex items-start sm:items-center gap-2 py-1">
            <div className="p-2 bg-[var(--greenColor)] w-[36px] h-[36px] flex justify-center items-center rounded">
                <i className={`${icon} text-white`}></i>
            </div>
            <div className="flex flex-col justify-center gap-1 max-w-[800px] text-wrap break-all">
                <a href={link ? String(link) : '#'} className="max-w-[800px] text-[16px] text-wrap break-all hover:underline" target="_blank">
                    {title}
                </a>

                <p className="max-w-[800px] text-wrap break-all text-[12px]">{description !== 'null' && description}</p>
            </div>
            {contentType === 'check' && (
                <div className="flex items-center gap-2">
                    <Button
                        label={'Проверить'}
                        onClick={() => {
                            getValues();
                            setLinkCall(true);
                        }}
                    />
                </div>
            )}
        </div>
    );

    const linkSection = (
        <div className="w-full flex items-start sm:items-center gap-2 py-1">
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
    );

    const videoCard = (
        <div className="w-full flex items-start sm:items-center gap-2 py-1">
            <div className="p-2 bg-[#f7634d] w-[36px] h-[36px] flex justify-center items-center rounded">
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
        <div className="w-full flex items-start sm:items-center gap-2 py-1">
            <div className="p-2 bg-[#c38598] w-[36px] h-[36px] flex justify-center items-center rounded">
                <i className={`${icon} text-white`}></i>
            </div>
            <div className="flex flex-col justify-center gap-1 max-w-[800px] text-wrap break-all">
                <span onClick={() => setTestCall(true)} className="cursor-pointer max-w-[800px] text-[16px] text-wrap break-all hover:underline">
                    Тест
                </span>
            </div>

            {contentType === 'check' && (
                <div className="flex items-center gap-2">
                    <div>
                        <span>Балл: 0 / </span> <span>{totalScore}</span>
                    </div>
                    <Button
                        label={'Проверить'}
                        onClick={() => {
                            getValues();
                            setTestCall(true);
                        }}
                    />
                </div>
            )}
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

    const testCheckInfo = (
        <div className="flex items-center gap-2 w-full">
            {test?.answers && (
                <div className="flex flex-col justify-center gap-2 w-full">
                    <div className="flex gap-1 items-center flex-col md:flex-row border-b-1 pb-1 border-[var(--borderBottomColor)]">
                        <span className="max-w-[800px] text-wrap break-all">{test?.content}</span>
                    </div>
                    <div className="flex flex-col gap-1 justify-center">
                        {test?.answers.map((item, idx) => {
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
                    <div className="flex items-center gap-1">
                        <span className="text-[var(--mainColor)]">Ответ студента: </span>
                        <b className="">
                            {test?.answers?.map((item, idx) => {
                                const answer = item.id === answerList?.answer_id ? item?.text : null;
                                console.log(item, answerList?.answer_id);
                                console.log(answer);

                                return <div>{answer}</div>;
                            })}
                        </b>
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
        <div className="w-full flex items-start sm:items-center gap-2 py-1">
            <div className="p-2 bg-[var(--yellowColor)] w-[36px] h-[36px] flex justify-center items-center rounded">
                <i className={`${icon} text-white`}></i>
            </div>
            <span onClick={() => setPracticaCall(true)} className="cursor-pointer max-w-[800px] text-[16px] text-wrap break-all hover:underline">
                Практическое задание
            </span>

            {contentType === 'check' && (
                <div className="flex items-center gap-2">
                    <div>
                        <span>Балл:</span> <span>{totalScore}</span>
                    </div>
                    <Button
                        label={'Проверить'}
                        onClick={() => {
                            getValues();
                            setPracticaCall(true);
                        }}
                    />
                </div>
            )}
        </div>
    );

    const practicaInfo = (
        <div className="flex flex-col justify-between gap-4 w-full">
            <div className="flex flex-col gap-1 w-full">
                {documentUrl ? (
                    documentUrl.document_path && hasPdf ? (
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
                {/* <p className="max-w-[800px] text-wrap break-all">{description}</p> */}
                {description && description !== 'null' && <div dangerouslySetInnerHTML={{ __html: description }} />}
            </div>
            <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-1">
                    <span className="text-[var(--mainColor)] text-[13px]">Документ: </span>
                    {documentUrl && documentUrl.document_path && hasPdf ? (
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

                <div className="flex items-center gap-1">
                    <span className="text-[var(--mainColor)]">Ответ студента: </span>
                    <span className="text-sm max-w-[400px] break-words">
                        {answerList?.file && answerList?.file && hasPdf && (
                            <a className={`flex gap-2 pi pi-file-arrow-up text-xl text-white bg-[var(--mainColor)] p-1 rounded`} href={answerList?.file && answerList?.file} download target="_blank" rel="noopener noreferrer"></a>
                        )}
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <Dialog
                header={contentType === 'check' ? 'Проверка теста' : 'Тест'}
                className="p-2 w-[90%] sm:w-[600px] max-h-[400px]"
                visible={testCall}
                onHide={() => {
                    if (!testCall) return;
                    setTestCall(false);
                }}
            >
                <div className="flex items-center w-full">{contentType === 'check' ? testCheckInfo : testInfo}</div>
            </Dialog>
            <Dialog
                header={'Практическое задание'}
                className="p-2 w-[90%] sm:w-[600px] max-h-[400px]"
                visible={practicaCall}
                onHide={() => {
                    if (!practicaCall) return;
                    setPracticaCall(false);
                }}
            >
                <div className="flex items-center">{practicaInfo}</div>
            </Dialog>
            <Dialog
                header={'Проверить документ'}
                className="p-2 w-[90%] sm:w-[600px] max-h-[400px]"
                visible={docCall}
                onHide={() => {
                    if (!docCall) return;
                    setDocCall(false);
                }}
            >
                <div className="flex items-center">{docSection}</div>
            </Dialog>
            <Dialog
                header={'Проверить ссылку'}
                className="p-2 w-[90%] sm:w-[600px] max-h-[400px]"
                visible={linkCall}
                onHide={() => {
                    if (!linkCall) return;
                    setLinkCall(false);
                }}
            >
                <div className="flex items-center">{linkSection}</div>
            </Dialog>
            <div className="flex items-center">{type === 'document' && docCard}</div>
            <div className="flex items-center">{type === 'link' && linkCard}</div>
            <div className="flex items-center">{type === 'video' && videoCard}</div>
            <div className="flex items-center">{type === 'test' && testCard}</div>
            <div className="flex items-center">{type === 'practical' && practicaCard}</div>
        </div>
    );
}
