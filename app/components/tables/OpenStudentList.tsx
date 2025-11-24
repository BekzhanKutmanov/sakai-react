'use client';

import Link from 'next/link';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import MyDateTime from '../MyDateTime';
import { DataTable } from 'primereact/datatable';
import GroupSkeleton from '../skeleton/GroupSkeleton';
import { NotFound } from '../NotFound';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useContext, useState } from 'react';
import { mainStreamsType } from '@/types/mainStreamsType';
import { LayoutContext } from '@/layout/context/layoutcontext';
import useErrorMessage from '@/hooks/useErrorMessage';
import { OptionsType } from '@/types/OptionsType';

export default function OpenStudentList() {
    const media = useMediaQuery('(max-width: 640px)');

    const [studentList, setStudentList] = useState([]);
    const [hasList, setHasList] = useState(false);
    const [skeleton, setSkeleton] = useState(false);
    const [streams, setStreams] = useState<mainStreamsType[]>([]);
    const [stream, setStream] = useState<mainStreamsType | null>(null);

    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const options: OptionsType = {
        year: '2-digit',
        month: '2-digit', // 'long', 'short', 'numeric'
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // 24-часовой формат
    };

    if(hasList) {
        <NotFound titleMessage={'Данные временно не доступны'} />
    }

    return (
        <div className="main-bg">
            {skeleton ? (
                <GroupSkeleton count={studentList.length} size={{ width: '100%', height: '5rem' }} />
            ) : (
                <>
                    {/* info section */}
                    <div className="bg-[var(--titleColor)] relative flex flex-col justify-center items-center w-full text-white p-[30px] md:p-[40px] pb-4">
                        
                            <h1 className="text-wrap break-words text-xl sm:text-2xl" style={{ color: 'white', textAlign: 'center' }}>
                                {stream?.subject_name.name_ru}
                                {true ? 'Ваш открытый курс: древние закопки в пирамидах египта'
                                : <div>Ваш открытый курс не опубликован</div>}
                            </h1>

                        {true ? (
                            <div className="w-full flex flex-wrap flex-col sm:flex-row gap-3 justify-center text-[12px] sm:text-[14px]">
                                <span className="text-sm font-semibold">{stream?.semester?.name_ru}</span>

                                <div className="flex gap-1 items-center">
                                    <span className="font-semibold">{stream?.subject_type_name?.name_ru}</span>
                                </div>
                                <div className="flex gap-1 items-center">
                                    <span>Количество записанных студентов: </span>
                                    <span className="font-semibold">{20}</span>
                                </div>
                                <div className="flex gap-1 items-center">
                                    <span>Время обучения: </span>
                                    <span className="font-semibold">----</span>
                                </div>
                                <div>
                                    <span className="bg-[var(--greenColor)] text-[12px] text-center text-white p-1 rounded">{'Бесплатный'}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">Курс пока не опубликован. После публикации все пользователи MOOC смогут находить этот курс, записываться и проходить его материалы.</div>
                        )}
                    </div>
                </>
            )}

            {/* table section */}
            {false ? (
                <b className='flex justify-center m-4'>Здесь будет отображаться список ваших студентов </b>
            ) : (
                <div>
                    {skeleton ? (
                        <GroupSkeleton count={studentList.length} size={{ width: '100%', height: '4rem' }} />
                    ) : (
                        <>
                            <DataTable value={studentList} dataKey="id" emptyMessage="Нет данных" breakpoint="960px" rows={5} className="mini-table">
                                <Column body={(_, { rowIndex }) => rowIndex + 1} header="#" style={{ width: '20px' }}></Column>
                                <Column
                                    field="title"
                                    header="ФИО"
                                    style={{ width: '50%' }}
                                    body={(rowData) => (
                                        <div className="flex gap-1" key={rowData?.id}>
                                            <span>{rowData?.last_name}</span>
                                            <span>{rowData?.name}</span>
                                            <span>{rowData?.father_name}</span>
                                        </div>
                                    )}
                                ></Column>

                                <Column
                                    header="Балл"
                                    className="flex items-center border-b-0"
                                    body={(rowData) => (
                                        <div className="flex items-center gap-2" key={rowData?.id}>
                                            {rowData?.score && rowData.score > 0 ? (
                                                <div className="flex justify-between items-center gap-2 ">
                                                    <b className={`${rowData.score > 30 ? 'text-[var(--greenColor)] p-1 w-[25px] text-center' : 'text-amber-400 p-1 w-[25px] text-center '}`}>{rowData.score}</b>
                                                    <i className="cursor-pointer pi pi-upload bg-[var(--mainColor)] text-white p-2 px-3 rounded" title="Сохранить в myedu"></i>
                                                    {/* <Button icon={'pi pi-arrow-right'} size='small' style={{ fontSize: '13px', padding: '4px 4px'}} label="myedu" /> */}
                                                </div>
                                            ) : (
                                                <b className={'text-[var(--redColor)] p-1 w-[25px]text-center'}>{rowData?.score}</b>
                                            )}
                                        </div>
                                    )}
                                />

                                <Column
                                    header="Последнее посещение"
                                    // style={{ width: '20%' }}
                                    body={(rowData) => (
                                        <div className="flex items-center gap-2" key={rowData?.id}>
                                            {/* {rowData?.last_movement ? new Date(rowData.last_movement).toISOString().slice(0, 19).replace('T', ' ') : <i className="pi pi-minus"></i>} */}
                                            {rowData?.last_movement ? <MyDateTime createdAt={rowData?.last_movement} options={options} /> : <i className="pi pi-minus"></i>}
                                        </div>
                                    )}
                                />

                                <Column
                                    header="Выполненные действия"
                                    body={(rowData) => (
                                        <div className="flex items-center gap-2" key={rowData?.id}>
                                            {rowData?.last_movement && (
                                                <Link
                                                    href={{
                                                        pathname: ''
                                                        // pathname: `/students/${cource_id}/${connect_id}/${stream_id}/${rowData?.id}/optional/optional`
                                                    }}
                                                >
                                                    <Button label="Данные" />
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                />
                            </DataTable>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
