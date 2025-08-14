'use client';

import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { connectStreams, fetchStreams } from '@/services/streams';
import { getToken } from '@/utils/auth';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { useContext, useEffect, useState } from 'react';
import { NotFound } from '../NotFound';
import GroupSkeleton from '../skeleton/GroupSkeleton';
import Link from 'next/link';

export default function StreamList({ callIndex, courseValue, isMobile }: { callIndex: number; courseValue: { id: number; title: string } | null; isMobile: boolean }) {
    const streamList = [
        {
            created_at: '',
            name_kg: '',
            id: 1,
            image: '',
            status: true,
            title: 'lorem-1 lorem-1 lorem-1lorem-1lorem-1lorem-1lorem-1',
            user_id: 1
        },
        {
            created_at: '',
            name_kg: '',
            id: 2,
            image: '',
            status: true,
            title: 'lorem-2',
            user_id: 2
        },
        {
            created_at: '',
            name_kg: '',
            id: 3,
            image: '',
            status: true,
            title: 'lorem-3',
            user_id: 3
        },
        {
            created_at: '',
            name_kg: '',
            id: 4,
            image: '',
            status: true,
            title: 'lorem-4',
            user_id: 4
        },
        {
            created_at: '',
            name_kg: '',
            id: 5,
            image: '',
            status: true,
            title: 'lorem-5',
            user_id: 5
        }
    ];

    // type
    interface StreamsType {};

    const [streams, setStreams] = useState<StreamsType[]>([]);
    const [streamValues, setStreamValues] = useState<{stream: {course_id: number, stream_id: number, info: string | null}[]}>({ stream: [] });
    const [displayStreams, setDisplayStreams] = useState<{course_id: number, stream_id: number, info: string | null, stream_title: string}[]>([]);
    const [hasStreams, setHasStreams] = useState(false);

    const [skeleton, setSkeleton] = useState(false);

    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const toggleSkeleton = () => {
        setSkeleton(true);
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
    };

    const handleFetchStreams = async (page = 1) => {
        const data = await fetchStreams(courseValue ? courseValue.id : null);
        console.log(data);

        if (data) {
            setHasStreams(false);
            setStreams(data);
            // setPagination({
            //     currentPage: data.courses.current_page,
            //     total: data.courses.total,
            //     perPage: data.courses.per_page
            // });
        } else {
            setHasStreams(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Проблема с соединением. Повторите заново' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleConnect = async () => {
        const data = await connectStreams(streamValues);
        console.log(data);

        if (data?.success) {
            toggleSkeleton();
            handleFetchStreams();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү кошулду!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при связке' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const clearValues = () => {
        // ?
    };

    const handleEdit = (e, id: number, title: string) => {
        console.log(e.checked);

        const forSentStreams = {
            course_id: courseValue!.id,
            stream_id: id,
            info: ''
        };

        if (e.checked) {
            setStreamValues((prev)=> ({
                ...prev,
                stream: [...prev.stream, forSentStreams]
            }));    

        } else {
            setStreamValues(
                (prev) =>
                    prev && {
                        ...prev,
                        stream: [...prev.stream.filter((item) => item?.stream_id !== id)]
                    }
            );
        }
    };

    useEffect(() => {
        console.log('отправляемый поток ', streamValues);
        const forDisplay = streamValues.stream.map((item, idx) => {
            if (idx <= 2) {
                return item;
            } else {
                return null;
            }
        });

        setDisplayStreams(forDisplay);
    }, [streamValues]);

    useEffect(() => {
        console.log('Потоки ', streams);

        if (streams.length < 1) {
            // setHasStreams(true);
        } else {
            if (streams.length > 0) {
                // setForStreamId({ id: courses[0].id, title: courses[0].title });
            }
            // setHasStreams(false);
        }
    }, [streams]);

    useEffect(() => {
        console.log('Id ', courseValue);
        setStreamValues({ stream: [] });
        toggleSkeleton();
        if (courseValue?.id) {
            handleFetchStreams();
        }
    }, [courseValue]);

    const itemTemplate = (item, index: number) => {
        const bgClass = item.connect_id ? 'bg-[var(--greenBgColor)] border-b border-[gray]' 
            : index % 2 == 1 ? 'bg-[#f5f5f5]' 
            : '';
        
        return (
            <div className={`w-full ${bgClass}`} key={item?.stream_id}>
                <div className={`flex flex-column p-2 gap-2`}>
                    <div className="flex justify-between gap-1 items-center">
                        <h3 className="m-0">{item?.subject_name.name_kg}</h3>
                        <label className="custom-radio">
                                <input type="checkbox" className={`customCheckbox`} 
                                    checked={Boolean(item.connect_id)}
                                    onChange={(e)=> {
                                        handleEdit(e.target, item.stream_id, item?.subject_name.name_kg);
                                        setStreams(prev => 
                                            prev.map(el => el.stream_id === item.stream_id
                                                ? { ...el, connect_id: el.connect_id ? null : 1 }
                                                : el
                                        ))
                                    }}
                                    />
                                <span className="checkbox-mark"></span>
                        </label>
                    </div>
                    <div className="flex flex-column xl:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-col order-2 xl:order-1 gap-1 items-start text-[12px] sm:text-[14px]">
                            <div className="flex gap-1 items-center">
                                <span className="text-[var(--mainColor)]">{item?.subject_type_name?.short_name_kg}:</span>
                                <span>{item?.teacher?.name}</span>
                            </div>
                            <div className="flex gap-1 items-center">
                                <span className="text-[var(--mainColor)]">Үйрөтүлүү тили: </span>
                                <span>{item?.language?.name}</span>
                            </div>
                            <div className="flex gap-1 items-center">
                                <span className="text-[var(--mainColor)]">Окуу жылы: </span>
                                <span className="font-semibold">{item?.id_edu_year}</span>
                            </div>
                            <div className="flex gap-1 items-center">
                                <span className="text-[var(--mainColor)]">Период: </span>
                                <span className="font-semibold">{item?.id_period}</span>
                            </div>
                        </div>
                        <div className="flex flex-col order-1 xl:order-2 align-items-center gap-2">
                            <span className="font-semibold">{item?.semester?.name_kg}</span>
                            <span className="bg-[var(--greenColor)] text-[12px] text-white p-1 rounded">{item?.edu_form?.name_kg}</span>
                            <Link href={`/students/${item.connect_id}/${item.stream_id}`} className='underline'>Студенттер</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((product, index: number) => {
            return itemTemplate(product, index);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };

    return (
        <>
            {callIndex === 1 && (
                <div className="p-1 sm:py-4 px-2">
                    {/* info section */}
                    {!isMobile && (
                        <div className="flex justify-between items-center mb-4 py-2 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                            <h3 className="text-[32px] m-0">Агымдар</h3>
                            <Button
                                label="Байлоо"
                                icon="pi pi-link"
                                onClick={() => {
                                    handleConnect();
                                    // setEditMode(false);
                                    // clearValues();
                                    // setFormVisible(true);
                                }}
                            />
                        </div>
                    )}

                    {hasStreams ? (
                        <NotFound titleMessage={'Агымдар азырынча жок'} />
                    ) : (
                        <div className="flex flex-col gap-2 sm:gap-4">
                            {isMobile && (
                                <div className="flex">
                                    <Button
                                        label="Байлоо"
                                        icon="pi pi-link"
                                        onClick={() => {
                                            // setEditMode(false);
                                            // clearValues();
                                            // setFormVisible(true);
                                        }}
                                    />
                                </div>
                            )}

                            <div className="max-h-[450px] overflow-y-scroll shadow-[0_2px_2px_0px_rgba(0,0,0,0.2)]">
                                {skeleton ? (
                                    <GroupSkeleton count={10} size={{ width: '100%', height: '4rem' }} />
                                ) : (
                                    <>
                                        <DataView value={streams} listTemplate={listTemplate} />
                                    </>
                                )}
                            </div>

                            {courseValue?.title && (
                                <div className="flex flex-col items-start justify-center gap-2 text-[14px]">
                                    <div className="flex items-center gap-1">
                                        <span className="w-[14px] sm:w-[18px] h-[14px] sm:h-[18px] block border bg-[var(--greenColor)] rounded-4xl"></span>
                                        <span className="text-[16px] font-bold">Курстун аталышы: {courseValue?.title}</span>
                                    </div>
                                    <div className="w-full flex items-center gap-2">
                                        <div className="w-[14px] sm:w-[18px] h-[14px] sm:h-[18px] border bg-[yellow]"></div>
                                        <div className="flex flex-col gap-1">
                                            {streamValues.stream?.length < 1 && <span className="text-[13px]">Курска байлоо үчүн агымдарды тандаңыз</span>}
                                            {displayStreams.map((item) => {
                                                return <div key={item?.stream_id}>{item?.stream_title}</div>;
                                            })}
                                            <div>{displayStreams.length >= 3 && '...'}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
