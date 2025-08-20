'use client';

import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { itemsCourseInfo } from '@/services/studentMain';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

export default function StudentThemes() {
    const [themes, setThemes] = useState({});
    const [hasCourses, setHasCourses] = useState(false);
    const [skeleton, setSkeleton] = useState(false);

    const params = useParams();
    // console.log(params);
    const courseId = params.studentThemeCourse;
    const streamId = params.studentThemeId;

    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const media = useMediaQuery('(max-width: 640px)');

    const titleInfoClass = `${themes?.image ? 'items-center justify-between' : 'justify-center'}`;
    const titleImageClass = `${true ? 'md:w-1/3' : ''}`;

    const toggleSkeleton = () => {
        setSkeleton(true);
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
    };

    const handleCourseInfo = async () => {
        const data = await itemsCourseInfo(courseId ? Number(courseId) : null, streamId ? Number(streamId) : null);
        console.log(data.course);

        if (data && data.course) {
            setHasCourses(false);
            setThemes(data.course);
        } else {
            setHasCourses(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Проблема с соединением. Повторите заново' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    useEffect(() => {
        handleCourseInfo();
    }, []);

    return (
        <div>
            <div className="py-4 w-full">
                {/* info section */}
                {skeleton ? (
                    <GroupSkeleton count={1} size={{ width: '100%', height: '5rem' }} />
                ) : (
                    <div>
                        <div className="w-full bg-[var(--titleColor)] relative flex justify-center items-center text-white p-[30px] md:p-[40px]">
                            <span className="absolute left-4 top-4 text-2xl sm:text-4xl pi pi-bookmark-fill "></span>
                            <div className={`w-full flex flex-col sm:flex-row gap-3 ${titleInfoClass}`}>
                                <div className="">
                                    <h1 style={{ color: 'white', fontSize: media ? '24px' : '36px', textAlign: 'center' }}>{themes?.title}</h1>
                                    <p style={{ color: 'white' }} className="sm:w-[300px] text-[12px] sm:text-[14px] text-center">
                                        {themes?.description}
                                    </p>
                                    <div className="text-center">Home/theme</div>
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-5"></div>
                                </div>
                                <div className='sm:w-1/2'>
                                    <img src={themes?.image} alt="Фото" />
                                </div>
                            </div>
                        </div>

                        {/* <div className="w-[100%] md:w-[300px] shadow rounded p-3">
                            <div className="w-full shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                                <h3 className="text-[16px] ">{'lessonName'}</h3>
                            </div>
                            <div className="flex flex-col gap-2 p-1 rounded bg-[var(--mainBgColor)]">
                                <div className="flex gap-1 items-center">
                                    <span className="text-[var(--mainColor)]">Окутуучу:</span>
                                    <span>{'you'}</span>
                                    <span>{'you'}</span>
                                </div>
                            </div>
                        </div> */}

                        <div />
                        <div />
                    </div>
                )}

                {/* table section */}
                {hasCourses ? <NotFound titleMessage={'Темалар жеткиликтүү эмес'} /> : <div>{skeleton ? <GroupSkeleton count={10} size={{ width: '100%', height: '4rem' }} /> : <></>}</div>}
            </div>
        </div>
    );
}
