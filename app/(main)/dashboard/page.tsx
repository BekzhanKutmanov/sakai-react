'use client';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { ContributionDay } from '@/types/ContributionDay';
import ActivityPage from '@/app/components/Contribution';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { fetchTeacherDashboard } from '@/services/dashboard/workingDashboard';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function Dashboard() {
    interface CourseStatisticApi {
        courses: number;
        lock: number;
        myActiveDays: string[];
        open: number;
        published: number;
        wallet: number;
    }

    const { user, departament, setMessage } = useContext(LayoutContext);

    const media = useMediaQuery('(max-width: 640px)');

    const [courses, setCourses] = useState<CourseStatisticApi | null>(null);
    const [hasCourses, setHasCourses] = useState(false);
    const [videoLink, setVideoLink] = useState('');
    const [contribution, setContribution] = useState<ContributionDay[] | null>(null);
    const [skeleton, setSkeleton] = useState(false);

    const hanldeTeacherDashboard = async () => {
        const data = await fetchTeacherDashboard();
        console.log(data);

        if (data && data?.courses) {
            if (data?.myActiveDays) {
                setContribution(data.myActiveDays);
            }
            setHasCourses(false);
            setCourses(data);
        } else {
            setHasCourses(true);
        }
    };

    const handleVideoCall = (value: string | null) => {
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
        // setVideoCall(true);
        // setVisisble(true);
    };

    useEffect(() => {
        hanldeTeacherDashboard();
        handleVideoCall('https://youtu.be/9j9vUpNrgDM?si=nqk6tX5JPCyr7znv');
    }, []);

    return (
        <div className="flex flex-col gap-2">
            {/* user info */}
            <div className="main-bg">
                <h1 className="text-lg sm:text-xl m-0">
                    {user ? (
                        <div className="flex flex-col gap-1">
                            {user?.last_name} {user?.name && user.name[0] + '.'} {user?.father_name && user.father_name[0] + '.'}
                            <small className="text-sm">Преподаватель {user?.is_working && departament?.name && '• Зав. кафедрой'}</small>
                        </div>
                    ) : (
                        '---'
                    )}
                </h1>
            </div>

            {/* statistic */}
            {skeleton ? (
                <div className="w-full flex items-center justify-center gap-1 flex-col sm:flex-row sm:flex-wrap">
                    <GroupSkeleton count={1} size={{ width: '260px', height: '6rem' }} />
                    <GroupSkeleton count={1} size={{ width: '260px', height: '6rem' }} />
                    <GroupSkeleton count={1} size={{ width: '260px', height: '6rem' }} />
                    <GroupSkeleton count={1} size={{ width: '260px', height: '6rem' }} />
                </div>
            ) : (
                !hasCourses && (
                    <div className="flex items-start gap-2 justify-around lg:justify-between flex-wrap mb-2">
                        <Link href={'/course'} className="main-bg flex flex-col gap-1 w-full md:!w-[250px] px-4 min-h-[132px] hover:underline">
                            <div className="flex justify-between gap-1 items-start">
                                <b className="underline text-[var(--bodyColor)]">Все курсы</b>
                                <i className="pi pi-fw pi-book text-xl p-1 px-3 flex justify-center rounded bg-[var(--productQuantityBg)] text-[var(--productQuantityText)]"></i>
                            </div>
                            <div className="text-lg mb-1 text-[black]">{courses?.courses}</div>
                            <small>
                                <b className="text-[var(--greenColor)]">4</b> созданы за последние 30 дней
                            </small>
                        </Link>
                        <Link href={'/course'} className="main-bg flex flex-col gap-2 w-full md:!w-[250px] px-4 min-h-[132px] hover:underline">
                            <div className="flex justify-between gap-1 items-start">
                                <b className="underline text-[var(--bodyColor)]">Кол-о закрытых курсов</b>
                                <i className="pi pi-fw pi-lock text-xl p-1 px-3 flex justify-center rounded bg-[var(--productQuantityBg)] text-[var(--productQuantityText)]"></i>
                            </div>
                            <div className="text-lg mb-1 text-[black]">{courses?.lock}</div>
                            <small>{/* <b className="text-[var(--greenColor)]">4</b> созданы за последние 30 дней */}</small>
                        </Link>
                        <Link href={'/course'} className="main-bg flex flex-col gap-2 w-full md:!w-[250px] px-4 min-h-[132px] hover:underline">
                            <div className="flex justify-between gap-1 items-start">
                                <b className="underline text-[var(--bodyColor)]">Кол-о открытых курсов</b>
                                <i className="pi pi-fw pi-lock-open text-xl p-1 px-3 flex justify-center rounded bg-[var(--productQuantityBg)] text-[var(--productQuantityText)]"></i>
                            </div>
                            <div className="text-lg mb-1 text-[black]">{courses?.open}</div>
                            <small>{/* <b className="text-[var(--greenColor)]">4</b> созданы за последние 30 дней */}</small>
                        </Link>
                        <Link href={'/course'} className="main-bg flex flex-col gap-2 w-full md:!w-[250px] px-4 min-h-[132px] hover:underline">
                            <div className="flex justify-between gap-1 items-start">
                                <b className="underline text-[var(--bodyColor)]">Кол-о платных курсов</b>
                                <i className="pi pi-fw pi-wallet text-xl p-1 px-3 flex justify-center rounded bg-[var(--productQuantityBg)] text-[var(--productQuantityText)]"></i>
                            </div>
                            <div className="text-lg mb-1 text-[black]">{courses?.wallet}</div>
                            <small>{/* <b className="text-[var(--greenColor)]">4</b> созданы за последние 30 дней */}</small>
                        </Link>
                    </div>
                )
            )}

            <div className="flex flex-col gap-4 items-center">
                {/* video instruct */}
                <div className="w-full flex flex-col justify-center items-center main-bg p-2 bg-white shadow">
                    <iframe
                        className="w-full h-[200px] md:h-[400px]"
                        // src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                        src={videoLink}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>

                {/* activity */}
                <div className="w-full main-bg p-2">
                    <ActivityPage value={contribution} recipient="Активность преподавателя" userInfo={null} />
                </div>
            </div>
        </div>
    );
}
