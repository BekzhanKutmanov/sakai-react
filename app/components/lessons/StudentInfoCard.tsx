'use client';

import useErrorMessage from '@/hooks/useErrorMessage';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { chillsUpdate } from '@/services/studentMain';
import { lessonType } from '@/types/lessonType';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ProgressBar } from 'primereact/progressbar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useState } from 'react';

export default function StudentInfoCard({
    type,
    icon,
    title,
    description,
    documentUrl,
    link,
    streams,
    lesson,
    stepId,
    subjectId,
    chills,
    fetchProp
}: {
    type: string;
    icon: string;
    title?: string;
    description?: string;
    documentUrl?: { document: string | null; document_path: string };
    link?: string;
    // video_link?: string;
    // videoStart?: (id: string) => void;
    // test?: { content: string; answers: { id: number | null; text: string; is_correct: boolean }[]; score: number | null };
    streams: { id: number; connections: { subject_type: string; id: number; user_id: number | null; id_stream: number }[]; title: string; description: string; user: { last_name: string; name: string; father_name: string }; lessons: lessonType[] };
    lesson: number;
    stepId: number;
    subjectId?: string;
    chills: boolean;
    fetchProp: () => void;
}) {
    const { id_kafedra } = useParams();
    // console.log(id_kafedra);

    const media = useMediaQuery('(max-width: 640px)');

    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);

    const [testCall, setTestCall] = useState(false);
    const [practicaCall, setPracticaCall] = useState(false);
    const [progressSpinner, setProgressSpinner] = useState(false);

    const handleChills = async () => {
        const newChills = !chills;
        setProgressSpinner(true);
        const data = await chillsUpdate(stepId, streams?.connections[0]?.id_stream, newChills);
        console.log(data);
        if (data?.success) {
            setProgressSpinner(false);
            setMessage({
                state: true,
                value: { severity: 'success', summary: '', detail: data?.message }
            });
            fetchProp();
        } else {
            setProgressSpinner(false);
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
    };

    const cheelseBtn = (type: string) => (
        <div>
            {chills ? (
                <div className="flex items-center gap-1">
                    {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                    {type === 'test' || type === 'practical' ? (
                        <Link href={`/teaching/lessonView/${lesson}/${subjectId}/${streams.connections[0].id_stream}/${stepId}`}>
                            <Button disabled={progressSpinner} label="Выполнено" icon="pi pi-check" size="small" className={`w-full success-button px-2 py-1 ${progressSpinner && 'opacity-50'} ${media ? 'mini-button' : ''}`} />
                        </Link>
                    ) : (
                        <Button disabled={progressSpinner} label="Выполнено" icon="pi pi-check" onClick={handleChills} size="small" className={`w-full success-button px-2 py-1 ${progressSpinner && 'opacity-50'} ${media ? 'mini-button' : ''}`} />
                    )}
                </div>
            ) : (
                <div className="flex items-center gap-1">
                    {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                    {type === 'test' || type === 'practical' ? (
                        <Link href={`/teaching/lessonView/${lesson}/${subjectId}/${streams.connections[0].id_stream}/${stepId}`}>
                            <Button disabled={progressSpinner} label="Отметить как выполненный" size="small" className={`w-full px-2 py-1 ${progressSpinner && 'opacity-50'} ${media ? 'mini-button' : ''}`} />
                        </Link>
                    ) : (
                        <Button disabled={progressSpinner} label="Отметить как выполненный" onClick={handleChills} size="small" className={`w-full px-2 py-1 ${progressSpinner && 'opacity-50'} ${media ? 'mini-button' : ''}`} />
                    )}
                </div>
            )}
        </div>
    );

    const docCard = (
        <div className="w-full flex items-end gap-2 sm:gap-1 py-1 flex-col">
            <div className="w-full flex flex-col sm:flex-row gap-1">
                <div className="w-full flex items-center gap-2">
                    <div className="p-2 bg-[var(--mainColor)] min-w-[38px] min-h-[38px] w-[38px] h-[38px] flex justify-center items-center rounded">
                        <i className={`${icon} text-white`}></i>
                    </div>
                    <Link
                        href={`/teaching/lessonView/${lesson}/${subjectId}/${streams.connections[0].id_stream}/${stepId}`}
                        // onClick={() => videoStart && videoStart(video_link || '')}
                        className="cursor-pointer max-w-[800px] text-[16px] break-words hover:underline"
                    >
                        {title}
                    </Link>
                </div>
            </div>
            <div className="w-full flex justify-center sm:justify-end">{cheelseBtn('')}</div>
            {/* <div className="flex gap-1 flex-col items-end">
                <div className="w-full flex justify-end gap-1 items-center">
                    {documentUrl?.document && (
                        <div className="flex items-center">
                            <Link onClick={() => progressToggle()} href={`${progressSpinner ? '#' : `/pdf/${documentUrl?.document}`}`} className={`${progressSpinner && 'opacity-50 '}`}>
                                <Button icon="pi pi-eye" className="mini-button small-p-button" />
                            </Link>
                            {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                        </div>
                    )}

                    {documentUrl?.document_path && (
                        <>
                            <a href={documentUrl?.document_path} download target="_blank" rel="noopener noreferrer">
                                {' '}
                                <Button icon="pi pi-file-arrow-up" className="mini-button small-p-button text-[8px] " />
                            </a>
                        </>
                    )}
                </div>
            </div> */}
        </div>
    );

    const linkCard = (
        <div className="w-full py-1 flex items-center flex-col gap-1">
            <div className="w-full flex sm:flex-row gap-2">
                <div className="p-2 bg-[var(--greenColor)] min-w-[38px] w-[38px] min-h-[38px] h-[38px] flex justify-center items-center rounded">
                    <i className={`${icon} text-white`}></i>
                </div>
                <div className="flex flex-col justify-center gap-1 max-w-[800px] break-words">
                    <Link
                        href={`/teaching/lessonView/${lesson}/${subjectId}/${streams.connections[0].id_stream}/${stepId}`}
                        // onClick={() => videoStart && videoStart(video_link || '')}
                        className="cursor-pointer max-w-[800px] text-[16px] text-wrap break-all hover:underline"
                    >
                        {title}
                    </Link>

                    {/* {link && link?.length > 0 ? (
                    <Link href={link} target="_blank" className="cursor-pointer max-w-[800px] text-[16px] text-wrap break-all hover:underline">
                        {title}
                    </Link>
                ) : (
                    <p>{title}</p>
                )} */}
                </div>
            </div>
            <div className="w-full flex justify-center sm:justify-end">{cheelseBtn('')}</div>
        </div>
    );

    const videoCard = (
        <div className="w-full flex items-center flex-col gap-2 py-1">
            <div className="w-full flex items-center gap-2">
                <div className="p-2 bg-[#f7634d] min-w-[38px] w-[38px] min-h-[38px] h-[38px] flex justify-center items-center rounded">
                    <i className={`${icon} text-white`}></i>
                </div>
                <div className="flex flex-col justify-center gap-1 max-w-[800px] text-wrap break-all">
                    <Link
                        href={`/teaching/lessonView/${lesson}/${subjectId}/${streams.connections[0].id_stream}/${stepId}`}
                        // onClick={() => videoStart && videoStart(video_link || '')}
                        className="cursor-pointer max-w-[800px] text-[16px] text-wrap break-all hover:underline"
                    >
                        {title}
                    </Link>
                </div>
            </div>
            <div className="w-full flex justify-center sm:justify-end">{cheelseBtn('')}</div>
        </div>
    );

    const testCard = (
        <div className="w-full flex items-center flex-col gap-2 py-1">
            <div className="w-full flex items-center gap-2">
                <div className="p-2 bg-[#c38598] min-w-[38px] w-[38px] min-h-[38px] h-[38px] flex justify-center items-center rounded">
                    <i className={`${icon} text-white`}></i>
                </div>
                <div className="flex flex-col justify-center gap-1 max-w-[800px] text-wrap break-all">
                    <Link href={`/teaching/lessonView/${lesson}/${subjectId}/${streams.connections[0].id_stream}/${stepId}`} className="cursor-pointer max-w-[800px] text-[16px] text-wrap break-all hover:underline">
                        Тест
                    </Link>
                </div>
            </div>
            <div className="w-full flex justify-center sm:justify-end">{cheelseBtn('test')}</div>
        </div>
    );

    const testInfo = (
        <div className="flex items-center gap-2 w-full">
            {/* {test?.answers && (
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
            )} */}
        </div>
    );

    const practicaCard = (
        <div className="w-full flex items-center flex-col gap-2 py-1">
            <div className="w-full flex items-center gap-2">
                <div className="p-2 bg-[var(--yellowColor)] min-w-[38px] w-[38px] min-h-[38px] h-[38px] flex justify-center items-center rounded">
                    <i className={`${icon} text-white`}></i>
                </div>
                <Link href={`/teaching/lessonView/${lesson}/${subjectId}/${streams.connections[0].id_stream}/${stepId}`} className="cursor-pointer max-w-[800px] text-[16px] text-wrap break-all hover:underline">
                    Практическое задание
                </Link>
            </div>
            <div className="w-full flex justify-center sm:justify-end">{cheelseBtn('practical')}</div>
        </div>
    );

    const practicaInfo = (
        <div className="flex flex-col justify-between gap-4 w-full">
            {/* <div className="flex flex-col gap-1 w-full">
                {documentUrl ? (
                    documentUrl.document_path && documentUrl.document_path?.length > 0 ? (
                        <Link className="flex gap-2" href={documentUrl.document_path} download target="_blank" rel="noopener noreferrer">
                            <span className="max-w-[800px] text-wrap break-all font-bold hover:underline">{title}</span>
                        </Link>
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
            </div> */}
        </div>
    );

    return (
        <div className="w-full">
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
