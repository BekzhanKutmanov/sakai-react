'use client';

import { useEffect, useState } from 'react';

type ModuleChartCardProps = {
    title?: string;
    shedule: {active: boolean};
    handleEdit: (id: number, checked: { checked: boolean }) => void;
    allIds: number[] | null;
    date?: string;
    connectId: number;
};

export default function ModuleChartCard({ title = 'Название карточки', shedule, connectId, handleEdit, allIds, date }: ModuleChartCardProps) {
    
    useEffect(()=> {
        console.log(allIds, connectId);
    },[allIds, connectId]);

    return (
        // <div className="w-full bg-[var(white)] shadow-[0_6px_18px_rgba(15,23,42,0.08)] rounded-md px-3 sm:px-4 py-2 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-[var(--whiteHoverColor)] cursor-pointer transition-colors">
        //     <div className="flex items-center gap-2">
        //         <label className="custom-radio text-xl">
        //             <input
        //                 type="checkbox"
        //                 className={`customCheckbox p-2`}
        //                 checked={allIds ? allIds.some((s) => s === connectId) : false}
        //                 onChange={(e) => {
        //                     handleEdit(connectId, e.target);
        //                 }}
        //             />
        //             <span className="checkbox-mark"></span>
        //         </label>
        //     </div>

        //     <div className="flex-1 text-sm text-[var(--bodyColor)] ">{title}</div>

        //     <div className="flex justify-end">
        //         <input
        //             type="date"
        //             className="border border-[#e5e7eb] rounded px-2 py-1 text-sm text-[var(--bodyColor)] bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--mainColor)]"
        //             value={date}
        //             onChange={(e) => onDateChange(e.target.value)}
        //         />
        //     </div>
        // </div>

        <div className="group w-full bg-white border border-slate-100 shadow-sm hover:shadow-md rounded px-4 py-2 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-slate-50/50 transition-all duration-200 cursor-pointer">
            {/* Секция с чекбоксом (Label не тронут) */}
            <div className="flex items-center shrink-0">
                <label className="custom-radio text-xl leading-none">
                    <input
                        type="checkbox"
                        className={`customCheckbox p-2`}
                        checked={allIds ? allIds.some((s) => s === connectId) : false} 
                        onChange={(e) => {
                            handleEdit(connectId, e.target);
                        }}
                    />
                    <span className="checkbox-mark"></span>
                </label>
            </div>
    
            {/* Заголовок */}
            <div className="flex-1 min-w-0 ml-2 sm:m-0">
                <span className="text-[15px] font-medium text-slate-700 truncate tracking-tight">{title}</span>
            </div>

            {/* Секция с датой */}  
            <div className="flex items-center justify-end sm:ml-auto">
                <div className="relative">
                    <span className=''>{date ? date : '---'}</span>
                </div>
            </div>
        </div>
    );
}
