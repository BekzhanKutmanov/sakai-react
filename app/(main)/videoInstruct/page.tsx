'use client';

import { faPlay } from '@fortawesome/free-solid-svg-icons';

import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
// import 'primereact/resources/themes/lara-light-blue/theme.css'; // или другая тема
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import MyFontAwesome from '../../components/MyFontAwesome';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useRouter } from 'next/navigation';

export default function VideoInstruct() {
    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);

    const [videoCall, setVideoCall] = useState(false);
    const [videoLink, setVideoLink] = useState('');

    const router = useRouter();

    const handleVideoCall = (value: string | null) => {
        console.log(value);

        if (!value) {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при обработке видео', detail: '' }
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
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при обработке видео', detail: '' }
            });
            return null; // не удалось получить ID
        }
        // return `https://www.youtube.com/embed/${videoId}`;
        setVideoLink(`https://www.youtube.com/embed/${videoId}`);
        setVideoCall(true);
        // setVisisble(true);
    };

    useEffect(() => {
        handleVideoCall('https://youtu.be/9j9vUpNrgDM?si=nqk6tX5JPCyr7znv');
    }, []);

    return (
        <div>
            <div className='flex items-start flex-col sm:flex-row gap-1'>
                <button onClick={() => router.back()} className="text-[var(--mainColor)] underline px-2 flex items-center gap-1">
                    <i className="pi pi-arrow-left text-[13px] cursor-pointer hover:shadow-2xl" style={{ fontSize: '13px' }}></i>
                    <span className="text-[13px] cursor-pointer">Назад</span>
                </button>
                <h2 className="text-center text-lg sm:text-xl w-full m-0 mb-4 flex justify-center">Видеоуроки по использованию платформы Mooc</h2>
            </div>
            <div className="p-2 shadow">
                <div className="w-full flex flex-col justify-center items-center">
                    <iframe
                        className="w-[70%] h-[200px] md:h-[400px]"
                        // src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                        src={videoLink}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                <p className="text-center mt-4">Видеоинструкция по использованию образовательного портала Mooc</p>
            </div>
        </div>
    );
}
