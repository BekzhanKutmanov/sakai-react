'use client';
import React, { useEffect, useState } from 'react';

export default function ItemCard({
    lessonName,
    streams,
    connection,
    subject
}: {
    lessonName: string;
    streams: { id: number; teacher?: { name: string; last_name?: string }; subject_type_name?: { name_kg: string; short_name_kg: string } }[];
    connection: { id: number; course_id: number; id_myedu_stream: number }[];
    subject: {connect: boolean};
}) {
    const [activeStreamIds, setActiveStreamIds] = useState<number[]>([]);
    const matchedIdx = streams.findIndex((stream) => connection.some((item) => item.id_myedu_stream === stream.id));

    useEffect(() => {
        const matchedIds = streams.filter((stream) => connection.some((item) => item.id_myedu_stream === stream.id)).map((stream) => stream.id);
        setActiveStreamIds(matchedIds);
    }, [streams, connection]);

    useEffect(() => {
        console.log(subject);
    }, [subject]);

    return (
        <div className={`w-full shadow-md rounded p-3 ${subject.connect && 'bg-[var(--greenBgColor)] '}`}>
            <div className={`w-full`}>
                <h3 className={`text-[16px] ${subject.connect && 'text-white font-bold underline'}`}>{lessonName}</h3>
            </div>

            <div className="flex flex-col gap-1">
                {streams.map((stream, idx) => {
                    const isActive = activeStreamIds.includes(stream.id);
                    return (
                        // <div key={idx} className={`${isActive ? 'bg-[var(--greenBgColor)]' : ''} flex flex-col gap-2 p-1 rounded ${streams.length !== idx + 1 ? 'border-b border-[gray]' : ''}`}>
                        //     {/* <div className="flex flex-wrap gap-1 items-center text-[14px] sm:text-[16px]">
                        //         <span className="text-[var(--mainColor)]">Окутуучу:</span>
                        //         <div className="flex gap-1 items-center">
                        //             <span>{stream.teacher?.name}</span>
                        //             <span>{stream.teacher?.last_name}</span>
                        //         </div>
                        //     </div> */}
                        //     <div className="flex sm:items-center gap-1 justify-between">
                        //         {/* <div className="flex gap-1 items-center text-[14px] sm:text-[16px]">
                        //             <span className="text-[var(--mainColor)]">Тип:</span>
                        //             <span>{stream.subject_type_name?.short_name_kg}</span>
                        //         </div> */}
                        //         {/* {connection.map((item) => {
                        //             if (item.id_myedu_stream === stream.id) {
                        //                 // console.log('Здесь кнопка должна появиться:', item.id_myedu_stream + '=' + stream.id);
                        //                 return (
                        //                     <Link key={item.id} href={`teaching/${item.course_id}/${stream.id}`}>
                        //                         <Button className="px-2 py-1" style={{ fontSize: '14px' }} label="Курс" icon="pi pi-arrow-right text-sm" iconPos="right" />
                        //                     </Link>
                        //                 );
                        //             }
                        //             return null;
                        //         })} */}
                        //     </div>
                        // </div>
                        ''
                    );
                })}
            </div>
        </div>
    );
}
