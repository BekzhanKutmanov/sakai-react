import Redacting from '../popUp/Redacting';
import { getRedactor } from '@/utils/getRedactor';
import { getConfirmOptions } from '@/utils/getConfirmOptions';
import { Button } from 'primereact/button';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import MyFontAwesome from '../MyFontAwesome';
import useShortText from '@/hooks/useShortText';
import { useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function LessonCard({
    status,
    onSelected,
    onDelete,
    cardValue,
    cardBg,
    typeColor,
    type,
    lessonDate,
    urlForPDF,
    urlForDownload
}: {
    status: string;
    onSelected?: (id: number, type: string) => void;
    onDelete?: (id: number) => void;
    cardValue: { title: string; id: number; desctiption?: string; type?: string; photo?: string; url?: string };
    cardBg: string;
    type: { typeValue: string; icon: string };
    typeColor: string;
    lessonDate: string;
    urlForPDF: () => void;
    urlForDownload: string;
}) {
    const shortTitle = useShortText(cardValue.title, 10);
    const [progressSpinner, setProgressSpinner] = useState(false);

    const toggleSpinner = () => {
        setProgressSpinner(true);
        setInterval(() => {
            setProgressSpinner(false);
        }, 2000);
    };

    const toSentPDF = () => {
        toggleSpinner();
        urlForPDF();
    };

    const lessonCardEvents = () => {
        if (type.typeValue === 'doc') {
            toSentPDF();
        } else if (type.typeValue === 'link') {
            // window.location.href = cardValue?.url || '#';
            window.open(cardValue?.url || '#', '_blank');
        }
    };

    const cardHeader =
        type.typeValue === 'video' && status === 'working' ? (
            <div className={`flex gap-2 justify-around items-center font-bold text-[12px]`} style={{ color: typeColor }}>
                <div className={`${type.icon} text-2xl text-[${typeColor}]`}></div>
                <div className={`flex gap-1 items-center`}>
                    <i className={`pi pi-calendar text-[var(--mainColor)]`}></i>
                    <span className="text-[14px]">{lessonDate}</span>
                </div>
            </div>
        ) : (
            <div className="w-full flex justify-center">
                <i className={`${type.icon} text-4xl sm:text-5xl text-[${typeColor}]`}></i>
            </div>
        );

    const videoPreviw =
        type.typeValue === 'video' && status === 'working' ? (
            <div className="w-[140px] h-[100px] overflow-hidden rounded-2xl">
                <img src="/layout/images/no-image.png" className="w-full h-[100px] object-cover" alt="Видео" />
            </div>
        ) : type.typeValue === 'video' && status === 'student' ? (
            <div className="relative bg-white shadow w-[140px] h-[100px] overflow-hidden rounded-2xl">
                <div className="w-[140px] h-[100%] absolute flex justify-center items-center bg-[rgba(8,9,0,30%)]">
                    <div className="relative flex items-center justify-center">
                        {/* Волна */}
                        {/* <span className="absolute w-full h-full rounded-full border-4 border-blue-500 animate-ping"></span> */}

                        {/* Иконка-кнопка */}
                        <div className="relative z-10 w-[40px] h-[40px] rounded-full bg-white text-[var(--mainColor)] flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer shadow-lg">
                            <MyFontAwesome icon={faPlay} />
                        </div>
                    </div>
                </div>
                <img src="/layout/images/no-image.png" className="w-full h-[100px] object-cover" alt="Видео" />
            </div>
        ) : (
            ''
        );

    const btnLabel = type.typeValue === 'doc' && status === 'working' ? 'Көчүрүү' : type.typeValue === 'doc' && status === 'student' ? 'Ачуу' : type.typeValue === 'link' ? 'Өтүү' : '';

    return (
        <div
            className={`${type.typeValue === 'link' && 'relative'} ${type.typeValue !== 'link' && 'overflow-hidden'} 
            ${type.typeValue === 'video' && status === 'working' ? 'min-h-[200px]' : type.typeValue !== 'video' && status === 'working' ? 'min-h-[160px]' : ''} 
            ${status === 'student' && type.typeValue !== 'video' ? 'min-h-[160px]' : status === 'student' && type.typeValue === 'video' ? 'min-h-[200px]' : ''}
            w-[100%] sm:w-[100%] md:w-[160px] flex flex-col justify-evenly shadow rounded sm:rounded-2xl p-2`}
            style={{ backgroundColor: cardBg }}
        >
            {status === 'working' && (
                <div>
                    <div className="flex items-center justify-end">{status === 'working' && <Redacting redactor={getRedactor(status, cardValue, { onEdit: onSelected, getConfirmOptions, onDelete: onDelete })} textSize={'12px'} />}</div>
                    {/* {cardHeader} */}
                </div>
            )}
            <div className={`flex flex-col items-center ${type.typeValue !== 'video' ? 'gap-3' : 'gap-1'}`}>
                <div className="bg-[#d6bcbc12] flex flex-col justify-between rounded-2xl p-1">
                    {/* <div className=''>{!cardValue.photo && <img className="cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSweN5K2yaBwZpz5W9CxY9S41DI-2LawmjzYw&s" alt="" />}</div> */}
                    <div className="flex items-center justify-center text-[16px] sm:text-xl mt-1">{shortTitle}</div>
                    {type.typeValue === 'link' && <span className="flex justify-center">{cardValue?.url}</span>}
                    <div className="flex items-center justify-center text-[13px]">{cardValue?.desctiption && cardValue.desctiption}</div>
                    {status === 'working' && type.typeValue !== 'video' && (
                        <div className={`flex gap-1 items-center justify-center mt-1`}>
                            <i className={`pi pi-calendar text-[var(--mainColor)]`}></i>
                            <span className="text-[12px]">{lessonDate}</span>
                        </div>
                    )}
                </div>

                {/* video preview */}
                {videoPreviw}

                {/* button */}
                {btnLabel && (
                    <>
                        {status === 'student' && type.typeValue === 'doc' ? (
                            <div className="flex gap-1 items-center">
                                <div className="flex gap-1 items-center">
                                    <Button onClick={lessonCardEvents} className="w-full" label={btnLabel} disabled={progressSpinner === true ? true : false} />
                                    {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                                </div>
                                <a href={urlForDownload} download target="_blank" rel="noopener noreferrer">
                                    {' '}
                                    <Button icon="pi pi-file-arrow-up" />
                                </a>
                            </div>
                        ) : (
                            <Button onClick={lessonCardEvents} label={btnLabel} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
