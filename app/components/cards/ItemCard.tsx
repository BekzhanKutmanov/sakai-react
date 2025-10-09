'use client';
import React, { useEffect, useState } from 'react';

export default function ItemCard({
    lessonName,
    subject
}: {
    lessonName: string;
    streams: { id: number; teacher?: { name: string; last_name?: string }; subject_type_name?: { name_kg: string; short_name_kg: string } }[];
    connection: { id: number; course_id: number; id_myedu_stream: number }[];
    subject: {connect: boolean};
}) {
    return (
        <div className={`w-full shadow-md rounded p-3 ${subject.connect && 'bg-[var(--greenBgColor)] '}`}>
            <div className={`w-full`}>
                <h3 className={`text-[16px] ${subject.connect && 'font-bold underline'}`}>{lessonName}</h3>
            </div>
        </div>
    );
}
