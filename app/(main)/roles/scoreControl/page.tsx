'use client';

import React, { useState, useEffect } from 'react';
import { fetchCourseOpenStatus } from '@/services/courses';
import { AudenceType } from '@/types/courseTypes/AudenceTypes';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { classNames } from 'primereact/utils';
import { useLocalization } from '@/layout/context/localizationcontext';
import { Dialog } from 'primereact/dialog';

/**
 * Компонент управления диапазоном баллов для конкретной строки
 */
const ScoreRangeInputs = ({ min, max, onChange }: { min: number; max: number; onChange: (type: 'min' | 'max', val: number) => void }) => {
    return (
        <div className="flex align-items-center gap-1 sm:gap-2 bg-secondary-faded p-1 border-round shadow-1 surface-50">
            <div className="flex flex-column align-items-center">
                <span className="text-xs font-medium text-500 mb-1">Мин</span>
                <InputNumber
                    value={min}
                    onChange={(e) => onChange('min', Number(e.value) || 0)}
                    min={0}
                    max={max}
                    inputClassName="w-3rem sm:w-4rem text-center p-1 text-sm border-none bg-transparent"
                    showButtons
                    buttonLayout="vertical"
                    incrementButtonClassName="hidden"
                    decrementButtonClassName="hidden"
                />
            </div>
            <div className="text-400 font-bold self-end mb-1">-</div>
            <div className="flex flex-column align-items-center">
                <span className="text-xs font-medium text-500 mb-1">Макс</span>
                <InputNumber
                    value={max}
                    // onValueChange={(e) => onChange('max', Number(e.value) || 0)}
                    onChange={(e) => onChange('max', Number(e.value) || 0)}
                    min={min}
                    // max={100}
                    inputClassName="w-3rem sm:w-4rem text-center p-1 text-sm border-none bg-transparent"
                    showButtons
                    buttonLayout="vertical"
                    incrementButtonClassName="hidden"
                    decrementButtonClassName="hidden"
                />
            </div>
        </div>
    );
};

/**
 * Компонент строки таблицы (или карточки на мобилке)
 */
const ScoreRow = ({ item, typesFetchProp }: { item: AudenceType; typesFetchProp: ()=> void }) => {
    const [scores, setScores] = useState({ min: item.min_score, max: item.max_score });
    const [loading, setLoading] = useState(false);

    const isMinChanged = Number(scores.min) !== Number(item.min_score);
    const isMaxChanged = Number(scores.max) !== Number(item.max_score);

    // Если ХОТЯ БЫ одно изменилось — true
    const isChanged = isMinChanged || isMaxChanged;

    const handleSave = async () => {
        setLoading(true);
        typesFetchProp();
        // Имитация асинхронного запроса
        await new Promise((resolve) => setTimeout(resolve, 1200));
        console.log(`Saved for ${item.id}:`, scores);
        setLoading(false);
    };

    const handleChange = (type: 'min' | 'max', val: number) => {
        if (typeof val === 'number') {
            setScores((prev) => ({ ...prev, [type]: val }));
        } else {
            alert('Ошибка типов ');
        }
    };

    return (
        <tr className="border-bottom-1 surface-border transition-colors hover:surface-100">
            <td className="py-4 px-3">
                <div className="flex flex-column gap-1">
                    <div className="flex align-items-center gap-2">
                        <div className="p-2 border-round-circle surface-200 flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                            <i className={classNames('pi', item.icon || 'pi-tag', 'text-primary')}></i>
                        </div>
                        <div>
                            <span
                                className={`block font-bold text-900 line-height-1 p-1 rounded ${
                                    item.name === 'open'
                                        ? 'bg-[var(--greenColor)] text-white'
                                        : item.name === 'wallet'
                                        ? 'bg-[var(--amberColor)] text-white'
                                        : item.name === 'extra'
                                        ? 'bg-[var(--noAuditColor)] text-white'
                                        : item.name === 'lock'
                                        ? 'bg-[var(--redColor)] text-white'
                                        : ''
                                }`}
                            >
                                {item.title}
                            </span>
                        </div>
                    </div>
                    {/* Описание под названием (на мобилках может быть скрыто или сокращено) */}
                    <p className="m-0 mt-2 text-600 text-sm line-height-2 max-w-30rem">{item.description}</p>
                </div>
            </td>
            <td className="py-4 px-3 text-right">
                <div className="flex align-items-center justify-content-end gap-2">
                    <ScoreRangeInputs min={scores.min} max={scores.max} onChange={handleChange} />

                    <Button
                        icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
                        onClick={handleSave}
                        disabled={!isChanged || loading}
                        tooltip={isChanged ? 'Сохранить изменения' : ''}
                        tooltipOptions={{ position: 'top' }}
                        className={`p-button-rounded p-button-sm shadow-2 transition-all transition-duration-300 p-button-success ${!isChanged ? 'opacity-30' : ''}`}
                        style={{ width: '35px', height: '35px', background: 'var(--greenColor)' }}
                    />
                </div>
            </td>
        </tr>
    );
};

/**
 * Заглушка загрузки
 */
const TableSkeleton = () => (
    <>
        {[1, 2, 3, 4].map((i) => (
            <tr key={i} className="border-bottom-1 surface-border">
                <td className="py-4 px-3">
                    <Skeleton width="40%" height="1.2rem" className="mb-2" />
                    <Skeleton width="90%" height="3rem" />
                </td>
                <td className="py-4 px-3">
                    <div className="flex justify-content-end gap-2">
                        <Skeleton width="100px" height="40px" borderRadius="8px" />
                        <Skeleton shape="circle" size="35px" />
                    </div>
                </td>
            </tr>
        ))}
    </>
);

/**
 * Основной компонент страницы
 */
export default function ScoreControl() {
    const { translations } = useLocalization();
    const [data, setData] = useState<AudenceType[]>([]);
    const [loading, setLoading] = useState(true);
    const [scoreControlInfo, setScoreControlInfo] = useState(false);

    const handleFetchTypes = async () => {
        try {
            const res = await fetchCourseOpenStatus();
            setData(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFetchTypes();
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card border-none shadow-4 p-0 overflow-hidden">
                    <div className={'mt-3 mx-2 pb-2 flex justify-between items-center gap-2 shadow-[var(--bottom-shadow)]'}>
                        <h3 className={`text-xl sm:text-2xl m-0 font-bold`}>{translations.scoreControle}</h3>
                        <i onClick={() => setScoreControlInfo(true)} className={'cursor-pointer pi pi-info-circle text-lg text-[var(--titleColor)]'}></i>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="surface-50 border-bottom-1 surface-border">
                                <tr>
                                    <th className="text-left py-3 px-3 text-600 font-medium uppercase text-xs tracking-wider">{translations.courseAudienceType}</th>
                                    <th className="text-right py-3 px-3 text-600 font-medium uppercase text-xs tracking-wider">{translations.scoreDiapazon}</th>
                                </tr>
                            </thead>
                            <tbody>{loading ? <TableSkeleton /> : data.map((item) => <ScoreRow key={item.id} item={item} typesFetchProp={handleFetchTypes} />)}</tbody>
                        </table>
                    </div>

                    {!loading && data.length === 0 && (
                        <div className="p-5 text-center text-500">
                            <i className="pi pi-info-circle text-2xl mb-2"></i>
                            <p>Данные не найдены</p>
                        </div>
                    )}
                </div>
            </div>

            <Dialog
                header={'Управление баллами по типам курсов'}
                visible={scoreControlInfo}
                className={'max-w-xl'}
                onHide={() => {
                    if (!scoreControlInfo) return;
                    setScoreControlInfo(false);
                }}
            >
                <div>Здесь вы можете гибко настроить диапазон баллов (минимум и максимум) для каждого типа курса</div>
            </Dialog>

            <style jsx global>{`
                @media screen and (max-width: 640px) {
                    .p-inputnumber-input {
                        width: 2.5rem !important;
                        font-size: 0.8rem !important;
                    }
                    td {
                        padding: 1rem 0.5rem !important;
                    }
                }
                .bg-secondary-faded {
                    background-color: rgba(0, 0, 0, 0.03);
                }
                .transition-all {
                    transition: all 0.2s ease-in-out;
                }
            `}</style>
        </div>
    );
}
