'use client';

import useErrorMessage from '@/hooks/useErrorMessage';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchMainLesson, fetchStudentSteps } from '@/services/studentMain';
import { lessonType } from '@/types/lessonType';
import { mainStepsType } from '@/types/mainStepType';
import { testType } from '@/types/testType';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('@/app/components/PDFBook'), {
    ssr: false
});

export default function LessonTest() {
    const { stream_id, id } = useParams();
    console.log(stream_id, id);

    const { pdfUrl } = useParams();
    const media = useMediaQuery('(max-width: 640px)');
    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);

    const [steps, setMainSteps] = useState<mainStepsType | null>(null);
    const [bigSteps, setBigSteps] = useState<
        { id: number; connections: { subject_type: string; id: number; user_id: number | null; id_stream: number }[]; title: string; description: string; user: { last_name: string; name: string; father_name: string }; lessons: lessonType[] }[]
    >([]);
    const [hasSteps, setHasSteps] = useState(false);
    const [progressSpinner, setProgressSpinner] = useState(false);
    const [type, setType] = useState('');
    const [practica, setPractica] = useState<{
        content?: { document: string; document_path: string; description: string | null; title: string; link: string; url: string; content: string; answers: [{ text: string; is_correct: boolean; id: number | null }]; score: number };
    } | null>(null);
    const [test, setTests] = useState<mainStepsType | null>(null);
    const [answer, setAnswer] = useState<{ id: number | null; text: string; is_correct: boolean }[]>([
        { text: '', is_correct: false, id: null },
        { text: '', is_correct: false, id: null }
    ]);

    // document
    const [document, setDocument] = useState<mainStepsType | null>(null);

    // link
    const [link, setLink] = useState<mainStepsType | null>(null);

    // video
    const [video, setVideo] = useState<mainStepsType | null>(null);
    const [preview, setPreview] = useState(false);
    const [videoLink, setVideoLink] = useState('');

    const handleStep = async () => {
        const data = await fetchStudentSteps(Number(id), Number(stream_id));
        console.log(data);

        if (data.success) {
            setHasSteps(false);
            setMainSteps(data.step);
        } else {
            setHasSteps(true);
        }
    };

    const handleVideoCall = (value: string | null) => {
        console.log(value);
        setPreview(true);

        if (!value) {
            setPreview(false);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при воспроизведении видео', detail: '' }
            });
        }

        const url = new URL(typeof value === 'string' ? value : '');
        let videoId = null;

        if (url.hostname === 'youtu.be') {
            // короткая ссылка, видео ID — в пути
            videoId = url.pathname.slice(1); // убираем первый слеш
        } else if (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') {
            // стандартная ссылка, видео ID в параметре v
            videoId = url.searchParams.get('v');
        }

        if (!videoId) {
            setPreview(false);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при воспроизведении видео', detail: '' }
            });
            return null; // не удалось получить ID
        }
        // return `https://www.youtube.com/embed/${videoId}`;
        setVideoLink(`https://www.youtube.com/embed/${videoId}`);
        setPreview(false);
        // setVisisble(true);
    };

    useEffect(() => {
        handleStep();
    }, []);

    useEffect(() => {
        console.log('Step ', steps);

        // const lesson = steps.find((item) => item.id === Number(id));
        // console.log(lesson, lesson?.type);
        if (steps?.type.name === 'document') {
            setType(steps?.type.name);
            setDocument(steps);
        } else if (steps?.type.name === 'link') {
            setType(steps?.type.name);
            setLink(steps);
        } else if (steps?.type.name === 'practical') {
            setType(steps?.type.name);
            setPractica(steps);
        } else if (steps?.type.name === 'test') {
            setType(steps?.type.name);
            setTests(steps);
        } else if (steps?.type.name === 'video') {
            setType(steps?.type.name);
            setVideo(steps);
        }
    }, [steps]);

    useEffect(() => {
        console.log('practica ', video);
        if (video?.content?.link) {
            handleVideoCall(video.content.link);
        }
    }, [video]);

    const courseInfoClass = true;

    const hasPdf = /pdf/i.test(document?.content?.document || ''); // true

    const docSection = (
        <div className="lesson-card-border shadow rounded p-2 sm:p-4 mt-2 w-full flex flex-col gap-2 items-center">
            <div className="w-full">
                <b className="text-[16px] sm:text-[18px] text-wrap break-all">{document?.content?.title}</b>
                {document?.content?.description && (
                    <div className="bg-[#ddc4f51a] p-2 relative sm:w-full md:w-[70%]">
                        <p className="mt-1">
                            <span className="w-[20px] h-[20px] bg-green-600 relative inline-block">
                                <span className="pi pi-bookmark text-xl absolute top-[-2px]"></span>
                            </span>{' '}
                            {document?.content?.description}
                        </p>
                    </div>
                )}
            </div>
            <div className="w-full flex gap-2 justify-center sm:justify-end">
                <Link href={`/pdf/${document?.content?.document}`}>
                    <Button icon="pi pi-eye" label="Открыть документ" className="px-2 mini-button" />
                </Link>
                {document?.content?.document_path && (
                    <a href={document?.content?.document_path} download target="_blank" rel="noopener noreferrer">
                        {' '}
                        <Button icon="pi pi-file-arrow-up" className="mini-button" />
                    </a>
                )}
                {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
            </div>
            {/* <div className='w-full'>
                <div className='w-[90%] m-auto xl:w-[800px] h-[400px] lesson-card-border shadow rounded p-2 '>
                    <i className='pi pi-folder text-5xl' ></i>
                </div>
            </div> */}
        </div>
    );

    const linkSection = (
        <div className="lesson-card-border shadow rounded p-2 sm:p-4 mt-2 w-full flex flex-col gap-2 items-center">
            <div className="flex flex-col w-full gap-2">
                <b className="text-[16px] sm:text-[18px] text-wrap break-all">{link?.content?.title}</b>

                {link?.content?.description && (
                    <div className="bg-[#ddc4f51a] p-2 relative sm:w-full md:w-[70%]">
                        <p className="mt-1">
                            <span className="w-[20px] h-[20px] bg-green-600 relative inline-block">
                                <span className="pi pi-bookmark text-xl absolute top-[-2px]"></span>
                            </span>{' '}
                            {link?.content?.description}
                        </p>
                    </div>
                )}
                <div className="flex gap-1 items-center">
                    <span className="text-[var(--mainColor)]">Ссылка: </span>
                    <a href={link ? String(link?.content?.url) : '#'} className="max-w-[800px] text-[16px] text-wrap break-all hover:underline" target="_blank">
                        {link?.content?.url}
                    </a>
                </div>
            </div>
        </div>
    );

    const practicaSection = (
        <div className="lesson-card-border shadow rounded p-2 mt-2">
            <div className="flex flex-col gap-2">
                <b className="text-[16px] sm:text-[18px] text-wrap break-all">{practica?.content?.title}</b>
                {practica?.content?.description && (
                    <div className="bg-[#ddc4f51a] p-2 relative sm:w-full md:w-[70%]">
                        <p className="mt-1">
                            <span className="w-[20px] h-[20px] bg-green-600 mx-2 relative inline-block">
                                <span className="pi pi-bookmark text-2xl absolute top-[-3px]"></span>
                            </span>{' '}
                            {practica?.content?.description}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-1">
                    {practica?.content?.document_path && practica?.content.document_path.toLowerCase().includes('pdf') && (
                        <>
                            <span className="text-[var(--mainColor)]">Документ: </span>
                            <a className={`flex gap-2 pi pi-file-arrow-up text-xl text-white bg-[var(--mainColor)] p-1 rounded`} href={practica?.content.document_path} download target="_blank" rel="noopener noreferrer"></a>
                        </>
                    )}
                </div>

                <div className="flex gap-2 items-center">
                    {practica?.content?.url && (
                        <>
                            <span className="text-[var(--mainColor)]">Ссылка: </span>
                            {practica?.content.url && (
                                <a href={practica?.content.url} className="max-w-[800px] text-wrap break-all" target="_blank">
                                    {practica?.content.url}
                                </a>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    const testSection = (
        <div className="w-full flex flex-col justify-center gap-2 my-2">
            <div className="lesson-card-border shadow rounded p-2">
                <div className="flex items-center  gap-1 my-2">
                    <span className="text-[var(--mainColor)] sm:text-lg">Балл за задание: </span>
                    <b className="text-[16px] sm:text-[18px]">{`${test?.content?.score}`}</b>
                </div>
                <div className="w-[99%] sm:w-[90%]  m-auto  flex flex-col gap-2 sm:items-center  p-1 sm:p-2">
                    <div className="w-full flex flex-col justify-start items-start gap-2">
                        {test?.content?.answers.map((item, index) => {
                            return (
                                <div className="flex items-center gap-1" key={index}>
                                    <label className="custom-radio">
                                        <input
                                            type="radio"
                                            name="testRadio"
                                            onChange={() => {
                                                setAnswer((prev) => prev.map((ans, i) => (i === index ? { ...ans, is_correct: true } : { ...ans, is_correct: false })));
                                            }}
                                        />
                                        {/* <input type="radio" name="radio" /> */}
                                        <span className="radio-mark min-w-[18px]"></span>
                                    </label>
                                    <div>{item.text}</div>
                                    {/* <InputText
                                        type="text"
                                        value={item.text}
                                        className="w-[90%] sm:w-full"
                                        onChange={(e) => {
                                            setAnswer((prev) => prev.map((ans, i) => (i === index ? { ...ans, text: e.target.value } : ans)));
                                        }}
                                    /> */}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="flex relative">
                <div className="w-full flex gap-1 justify-center items-center">
                    <Button
                        label="Отправить"
                        // disabled={progressSpinner || !testValue.title.length || !!errors.title}
                        onClick={() => {
                            // handleAddTest();
                        }}
                    />
                    {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                </div>
            </div>
        </div>
    );

    const videoSection = (
        <div className="lesson-card-border shadow rounded p-2 mt-2">
            <div className='flex flex-col gap-2'>
                <div className="flex flex-col gap-2">
                    <b className="text-[16px] sm:text-[18px] text-wrap break-all">{video?.content?.title}</b>
                    {video?.content?.description && (
                        <div className="bg-[#ddc4f51a] p-2 relative sm:w-full md:w-[70%]">
                            <p className="mt-1">
                                <span className="w-[20px] h-[20px] bg-green-600 relative inline-block">
                                    <span className="pi pi-bookmark text-xl absolute top-[-2px]"></span>
                                </span>{' '}
                                {video?.content?.description}
                            </p>
                        </div>
                    )}
                </div>
                <div className="w-full flex flex-col justify-center items-center">
                    {preview ? (
                        <div className="relative bg-white shadow w-[90%] max-h-[400px] overflow-hidden rounded-2xl">
                            <div className="w-full h-[100%] absolute flex justify-center items-center bg-[rgba(8,9,0,70%)]">
                                <ProgressSpinner className="max-w-[70px] sm:max-w-[100px]" />
                            </div>
                            {/* <img src={(video?.content?.cover_url && video?.content?.cover_url) || '/layout/images/no-image.png'} className="w-full sm:w-[200px] max-h-[400px] object-cover" alt="Видео" /> */}
                        </div>
                    ) : (
                        <iframe
                            className="w-[95%] h-[200px] md:h-[400px]"
                            // src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                            src={videoLink}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="main-bg">
            <div className={`w-full bg-[var(--titleColor)] relative text-white p-4 md:p-3 pb-4`}>
                <div className="flex flex-col gap-2 items-center">
                    <div className={`w-full flex items-center gap-1 ${courseInfoClass ? 'justify-around flex-col sm:flex-row' : 'justify-center'}  items-center`}>
                        <h1 style={{ color: 'white', fontSize: media ? '24px' : '28px', textAlign: 'center', margin: '0' }}>{"Название курса"}</h1>
                        {/* {courseInfoClass && <span className="text-white">babt</span>} */}
                    </div>
                    <span>Описание курса ... </span>
                    <div className="flex items-center justify-end gap-1">
                        <b className="text-white sm:text-lg">Тема: </b>
                        <b className="text-[16px] sm:text-[18px]">{'Физика...'}</b>
                    </div>
                </div>
            </div>
            
            {type === 'document' && docSection}
            {type === 'link' && linkSection}
            {type === 'practical' && practicaSection}
            {type === 'test' && testSection}
            {type === 'video' && videoSection}
        </div>
    );
}
