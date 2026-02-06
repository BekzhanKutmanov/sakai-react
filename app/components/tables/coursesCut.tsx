'use client';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { cutStudentConnect, fetchStudentCut } from '@/services/student/studentSearch';
import { studentType } from '@/types/studentType';
import { confirmDialog } from 'primereact/confirmdialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useContext, useEffect, useState } from 'react';

interface ConnectType {
    subject_name: string;
    subject_details: { name_ru: string; name_kg: string; name_en: string; requirement: string };
    max_score: { course_id: number; course_title: string; total_score: number };
}

interface CurricullaType {
    connects: ConnectType[];
    id_curricula: number;
    is_exceeded: boolean;
    total_score: number;
}

export default function CoursesCut({ id_student }: { id_student: number | null }) {
    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const [student, setStudent] = useState<CurricullaType[] | null>(null);
    const [skeleton, setSkeleton] = useState(true);

    const handleFetchStudentDetail = async () => {
        const data = await fetchStudentCut(Number(id_student));
        console.log(data);
        if (data?.success) {
            setStudent(data?.data);
        }
        setSkeleton(false);
    };

    const handleCut = async () => {
        setSkeleton(true);
        const data = await cutStudentConnect(Number(id_student));
        console.log(data);
        if (data?.success) {
            handleFetchStudentDetail();
            setMessage({
                state: true,
                value: { severity: 'success', summary: data?.message, detail: '' }
            });
        } else {
            setSkeleton(false);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const confirm1 = (item: ConnectType) => {
        confirmDialog({
            message: (
                <div className="flex flex-col gap-2">
                    <b>Вы точно хотите удалить?</b> <span>Все данные потока и курса будут без возможности восстановления разорваны</span>
                </div>
            ),
            header: 'Подтверждение',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            acceptLabel: 'Удалить',
            rejectLabel: 'Назад',
            rejectClassName: 'p-button-secondary reject-button',
            accept: () => handleCut()
        });
    };

    const renderStatusBadge = (isOk: boolean) => {
        const baseClasses = 'inline-flex items-center px-2 py-1 rounded text-[13px] font-medium';
        if (!isOk) {
            return <span className={`pi pi-check-circle text-[green] ${baseClasses}`}></span>;
        }
        return <span className={`pi pi-times-circle text-[red] ${baseClasses}`}></span>;
    };

    const renderConnects = (connects: ConnectType[]) => {
        if (!connects || connects?.length < 1) {
            return <span className="text-[13px] text-[#7a7a7a]">Нет связанных потоков</span>;
        }

        return (
            <div className="flex flex-col gap-2">
                {connects?.map((item, idx) => (
                    <div key={`${item?.subject_name}-${idx}`} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 rounded border-2 sm:border border-[#efefef]">
                        <div className="flex flex-col gap-1 p-2 ">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[13px] text-[#7a7a7a]">Предмет:</span>
                                <span className="font-semibold text-[14px]">{item?.subject_name}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 ">
                                <span className="text-[13px] text-[#7a7a7a]">Курс:</span>
                                <span className="text-[14px] max-w-[340px] text-ellipsis text-nowrap overflow-hidden">{item?.max_score?.course_title}</span>
                                <span className="text-[13px] text-[#7a7a7a]">Балл:</span>
                                <span className="text-[14px] font-semibold">{item?.max_score?.total_score}</span>
                            </div>
                        </div>
                        <div className="pr-2 flex justify-end sm:justify-start">
                            <button
                                type="button"
                                className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-[#f5bcbc] bg-[#fff7f7] px-2 py-[4px] sm:py-[6px] text-[12px] font-semibold text-[#b00020] transition-colors duration-200 hover:bg-[#ffe9e9]"
                                title="Удалить поток"
                                aria-label="Удалить поток"
                                onClick={() => confirm1(item)}
                            >
                                <span className="pi pi-trash text-[12px]"></span>
                                Удалить
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderMobileCards = () => {
        if (skeleton) {
            return (
                <div className="py-6 text-center text-[14px] text-[#7a7a7a]">
                    <ProgressSpinner style={{ width: '45px', height: '45px' }} />
                </div>
            );
        }

        if (!student || student.length < 1) {
            return <div className="py-6 text-center text-[14px] text-[#7a7a7a]">Данные отсутствуют</div>;
        }

        return (
            <div className="flex flex-col gap-3">
                {student.map((item, index) => {
                    const cardAlert = item?.is_exceeded === true ? 'border-[#f5bcbc] bg-[#fff7f7]' : 'border-[#ededed]';
                    return (
                        <div key={`${item?.id_curricula}-${index}`} className={`rounded border p-3 ${cardAlert}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[14px] font-semibold text-[#4B4563]">#{index + 1}</span>
                                {renderStatusBadge(Boolean(item?.is_exceeded))}
                            </div>
                            <div className="flex flex-col gap-1 mb-3">
                                <span className="text-[13px] text-[#7a7a7a]">Макс. балл</span>
                                <span className="text-[15px] font-semibold">{item?.total_score}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[13px] text-[#7a7a7a]">Связанные потоки</span>
                                {renderConnects(item?.connects || [])}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderTableBody = () => {
        if (skeleton) {
            return (
                <tr>
                    <td colSpan={4} className="py-6 text-center text-[14px] text-[#7a7a7a]">
                        <ProgressSpinner style={{ width: '45px', height: '45px' }} />
                    </td>
                </tr>
            );
        }

        if (!student || student.length < 1) {
            return (
                <tr>
                    <td colSpan={4} className="py-6 text-center text-[14px] text-[#7a7a7a]">
                        Данные отсутствуют
                    </td>
                </tr>
            );
        }

        return student.map((item, index) => {
            const rowAlert = item?.is_exceeded === true ? 'bg-[#fff7f7]' : '';
            return (
                <tr key={`${item?.id_curricula}-${index}`} className={`border-b border-[#f0f0f0] ${rowAlert} hover:bg-green-50 transition-colors duration-200`}>
                    <td className="p-3 align-top text-[14px] text-[#4B4563] font-semibold">{index + 1}</td>
                    <td className="p-3 align-top text-[14px]">
                        <div className="flex flex-col gap-1">
                            <span className="text-[13px] text-[#7a7a7a]">Макс. балл</span>
                            <span className="font-semibold text-[15px]">{item?.total_score}</span>
                        </div>
                    </td>
                    <td className="p-3 align-top">{renderStatusBadge(Boolean(item?.is_exceeded))}</td>
                    <td className="p-3 align-top">{renderConnects(item?.connects || [])}</td>
                </tr>
            );
        });
    };

    useEffect(() => {
        handleFetchStudentDetail();
    }, []);

    return (
        <div>
            <div></div>
            <div className="w-full mt-4">
                <div className="block sm:hidden">{renderMobileCards()}</div>
                <div className="w-full overflow-x-auto bg-white rounded-2xl shadow-lg hidden sm:block">
                    <table className=" w-full min-w-[760px] border-collapse text-[14px] divide-y divide-gray-200">
                        <thead className="text-[#4B4563]">
                            <tr>
                                <th className="text-left font-semibold p-3 w-[60px]">#</th>
                                <th className="text-left font-semibold p-3 w-[140px]">Макс. балл</th>
                                <th className="text-left font-semibold p-3 w-[180px]">Статус</th>
                                <th className="text-left font-semibold p-3">Связанные потоки</th>
                            </tr>
                        </thead>
                        <tbody>{renderTableBody()}</tbody>
                    </table>
                </div>
                <div className="hidden sm:flex items-center gap-2 mt-2 text-[13px] text-[#7a7a7a]">
                    <span className="w-[10px] h-[10px] rounded-sm bg-[#fff7f7] border border-[#f5bcbc]"></span>
                    <span>Строки с отметкой выделены, если есть проблемы по статусу</span>
                </div>
            </div>
        </div>
    );
}
