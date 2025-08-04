'use client';

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';

export default function StreamList({ callIndex, courseValue }: { callIndex: number; courseValue: { id: number | null; title: string } | null }) {
    const streamList = [
        {
            created_at: '',
            id: 1,
            image: '',
            status: true,
            title: 'lorem-1',
            user_id: 1
        },
        {
            created_at: '',
            id: 2,
            image: '',
            status: true,
            title: 'lorem-2',
            user_id: 2
        },
        {
            created_at: '',
            id: 3,
            image: '',
            status: true,
            title: 'lorem-3',
            user_id: 3
        },
        {
            created_at: '',
            id: 4,
            image: '',
            status: true,
            title: 'lorem-4',
            user_id: 4
        },
        {
            created_at: '',
            id: 5,
            image: '',
            status: true,
            title: 'lorem-5',
            user_id: 5
        }
    ];

    const [streamValues, setStreamValues] = useState({ id: courseValue, streams: [] });

    const handleEdit = (e, id: number, title: string) => {
        console.log(e.checked);

        const forSentStreams = {
            stream_id: id,
            stream_title: title
        };
        if (e.checked) {
            setStreamValues((prev) => ({
                ...prev,
                streams: [...prev.streams, forSentStreams]
            }));
        }
    };

    useEffect(() => {
        console.log('отправляемый поток ', streamValues);
    }, [streamValues]);

    useEffect(() => {
        console.log('Id ', courseValue);
    }, [courseValue]);

    return (
        <>
            {callIndex === 1 && (
                <div className=" shadow-[0_1px_0px_0px_rgba(0,0,0,0.1)] px-2 h-[100%]">
                    {/* info section */}
                    <div className="flex justify-between items-center mb-4 py-2 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                        <h3 className="text-[32px] m-0">Потоктор</h3>
                        {courseValue?.title}
                        {streamValues.streams.map((item) => {
                            return <div key={item?.stream_id}>{item?.stream_title}</div>;
                        })}
                    </div>

                    {/* {hasCourses ? (
                                    <NotFound titleMessage={'Курс кошуу үчүн кошуу баскычты басыныз'} />
                                ) : ( */}
                    <div className="py-4 max-h-[500px] overflow-x-scroll">
                        {/* {skeleton ? (
                                            <GroupSkeleton count={courses.length} size={{ width: '100%', height: '4rem' }} />
                                        ) : ( */}
                        <>
                            {/* <StreamList courseValue={forStreamId} courseInsideTitle=''/> */}
                            <DataTable value={streamList} breakpoint="960px" dataKey={'id'} rows={5} className="my-custom-table">
                                <Column body={(_, { rowIndex }) => rowIndex + 1} header="Номер" style={{ width: '20px' }}></Column>
                                <Column
                                    field="title"
                                    header="Аталышы"
                                    style={{ width: '80%' }}
                                    sortable
                                    body={
                                        (rowData) => (
                                            // <Link href={`/course/${rowData.id}`} key={rowData.id}>
                                            // {
                                            <div className="p-[10px]">{rowData.title}</div>
                                        )
                                        // }
                                        // </Link>
                                    }
                                ></Column>

                                <Column
                                    header=""
                                    style={{ width: '40%' }}
                                    body={(rowData) => (
                                        <label className="custom-radio">
                                            <input type="checkbox" className="customCheckbox" onChange={(e) => handleEdit(e.target, rowData.id, rowData.title)} />
                                            <span className="checkbox-mark"></span>
                                            Option 1
                                        </label>
                                    )}
                                ></Column>
                            </DataTable>
                        </>
                        {/* )} */}
                    </div>
                    {/* )} */}
                </div>
            )}
        </>
        // </div>
    );
}
