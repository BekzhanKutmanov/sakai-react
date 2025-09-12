import Redacting from '../popUp/Redacting';
import { getRedactor } from '@/utils/getRedactor';
import { getConfirmOptions } from '@/utils/getConfirmOptions';
import { Button } from 'primereact/button';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import MyFontAwesome from '../MyFontAwesome';
import useShortText from '@/hooks/useShortText';
import { useEffect, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { confirmDialog } from 'primereact/confirmdialog';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import Link from 'next/link';

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
    urlForDownload,
    videoVisible,
    answers
}: {
    status: string;
    onSelected?: (id: number, type: string) => void;
    onDelete?: (id: number) => void;
    cardValue: { title: string; id: number; desctiption?: string; type?: string; photo?: string; url?: string; document?: string; score?: number };
    cardBg: string;
    type: { typeValue: string; icon: string };
    typeColor: string;
    lessonDate: string;
    urlForPDF: () => void;
    urlForDownload: string;
    videoVisible?: (id: string | null) => void;
    answers?: { id?: number | null; text: string; is_correct: boolean }[];
}) {
    const forShortTitle = useShortText(cardValue.title, 200);
    const shortTitle = type.typeValue !== 'practica' ? forShortTitle : cardValue.title;
    const shortDoc = useShortText(cardValue?.document || '', 20);
    const shortDescription = useShortText(cardValue.desctiption ? cardValue.desctiption : '', 90);
    const shortUrl = useShortText(cardValue?.url ? cardValue?.url : '', 100);
    const [progressSpinner, setProgressSpinner] = useState(false);

    // useEffect(()=> {
    //     console.log(urlForDownload);
    // },[urlForDownload]);
    const media = useMediaQuery('(max-width: 640px)');

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
        if (type.typeValue === 'doc' || type.typeValue === 'practica') {
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

    const videoPreviw = type.typeValue === 'video' && (
        <div className="relative bg-white shadow w-[90%] max-h-[190px]/ overflow-hidden rounded-2xl">
            <div className="w-full h-[100%] absolute flex justify-center items-center bg-[rgba(8,9,0,50%)]">
                <div className="relative flex items-center justify-center" onClick={() => videoVisible?.(type.typeValue)}>
                    {/* Волна */}
                    {/* <span className="absolute w-full h-full rounded-full border-4 border-blue-500 animate-ping"></span> */}

                    {/* Иконка-кнопка */}
                    <div className="relative z-10 w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] rounded-full bg-white text-[var(--mainColor)] flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer shadow-lg">
                        <MyFontAwesome icon={faPlay} />
                    </div>
                </div>
            </div>
            <img src={(cardValue.photo && cardValue.photo) || '/layout/images/no-image.png'} className="w-full sm:w-[200px] max-h-[200px] object-cover" alt="Видео" />
        </div>
    );

    const btnLabel = type.typeValue === 'doc' || type.typeValue === 'practica' ? 'Ачуу' : type.typeValue === 'link' ? 'Өтүү' : '';

    return (
        <div className="w-full flex flex-col items-start gap-2">
            <div
                className={`${type.typeValue === 'link' && 'relative'} ${type.typeValue !== 'link' && 'overflow-hidden'} 
                ${type.typeValue === 'video' && status === 'working' ? 'min-h-[200px]' : type.typeValue !== 'video' && status === 'working' ? 'min-h-[160px]' : ''} 
                ${status === 'student' && type.typeValue !== 'video' ? 'min-h-[160px]' : status === 'student' && type.typeValue === 'video' ? 'min-h-[200px]' : ''}

                ${type.typeValue === 'video' ? 'w-full' : 'w-full'} flex flex-col justify-evenly lesson-card-border rounded p-2

                `}
                style={{ backgroundColor: cardBg }}
            >
                <div className={`flex flex-col items-center ${type.typeValue !== 'video' ? 'gap-3' : 'gap-1'}`}>
                    <div className="flex flex-col gap-1 justify-between rounded-2xl p-2">
                        {/* <div className=''>{!cardValue.photo && <img className="cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSweN5K2yaBwZpz5W9CxY9S41DI-2LawmjzYw&s" alt="" />}</div> */}
                        <div className={`flex gap-1 ${cardValue.score ? 'items-center gap-2 flex-col sm:flex-row' : 'justify-center'}`}>
                            <b className={`flex items-center justify-center text-[16px] sm:text-[18px] mt-1 text-wrap break-all ${type.typeValue === 'practica' && ' shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]'}`}>{shortTitle}</b>
                            {cardValue.score ? (
                                <div className="flex items-center justify-center">
                                    <span className="text-[var(--mainColor)] ">{!media && '/'} Балл: </span>
                                    <b className="text-[16px] sm:text-[18px]">{`${cardValue.score}`}</b>
                                </div>
                            ) : (
                                ''
                            )}
                        </div>

                        {type.typeValue !== 'practica' && <div className="flex items-center justify-center text-[15px] sm:text-[17px] m-auto">{shortDoc}</div>}

                        {type.typeValue === 'practica' && cardValue.url ? (
                            <div className="flex sm:items-center gap-2 flex-col sm:flex-row">
                                <Link href={cardValue?.url} target="_blank" className="underline">
                                    Шилтеме:
                                </Link>
                                <span className="flex justify-center max-w-[500px] text-wrap break-all">{cardValue?.url}</span>
                            </div>
                        ) : (
                            type.typeValue === 'link' && (
                                <>
                                    <span className="flex justify-center text-wrap break-all">{shortUrl}</span>
                                </>
                            )
                        )}
                        {answers && (
                            <div className="flex flex-wrap">
                                {answers.map((item) => {
                                    return (
                                        <div key={item.id}>
                                            <label className="custom-radio opacity-[60%]">
                                                <input disabled type="radio" name="radio" checked={item.is_correct} />
                                                <span className="radio-mark min-w-[18px]"></span>
                                                <span>{item.text}</span>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <div className={`flex items-center justify-center text-[13px]`}>
                            {cardValue?.desctiption && cardValue?.desctiption !== 'null' ? shortDescription : cardValue?.desctiption && cardValue?.desctiption !== 'null' && type.typeValue === 'practica' ? <div>{shortDescription}</div> : ''}
                        </div>

                        {status === 'working' && (
                            <div className={`flex gap-1 items-center justify-center mt-1`}>
                                <i className={`pi pi-calendar text-[var(--mainColor)]`}></i>
                                <span className="text-[12px]">{lessonDate}</span>
                            </div>
                        )}
                    </div>
                    {/* video preview */}
                    {videoPreviw}

                    {/* button */}
                    {
                        <>
                            {status === 'student' && type.typeValue === 'doc' ? (
                                <div className="flex gap-1 items-center">
                                    <div className="flex gap-1 items-center">{progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}</div>
                                    <a href={urlForDownload} download target="_blank" rel="noopener noreferrer">
                                        {' '}
                                        <Button icon="pi pi-file-arrow-up" />
                                    </a>
                                </div>
                            ) : (
                                <div className="flex justify-center items-center gap-2 sm:gap-2 sm:flex-row">
                                    {type.typeValue === 'doc' && (
                                        <div className="flex gap-1 items-center">
                                            <div className="flex gap-1 items-center">
                                                <Button onClick={lessonCardEvents} className={`w-full ${btnLabel === 'Ачуу' ? 'flex justify-center pi pi-eye h-[31px] sm:h-[38px]' : ''}`} label={btnLabel !== 'Ачуу' ? btnLabel : ' '} disabled={progressSpinner === true ? true : false} />
                                                {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                                            </div>
                                            <a href={urlForDownload} download target="_blank" rel="noopener noreferrer">
                                                {' '}
                                                <Button icon="pi pi-file-arrow-up" />
                                            </a>
                                        </div>
                                    )}
                                    {type.typeValue === 'practica' && urlForDownload.length > 1 && (
                                        <div className="flex gap-1 items-center">
                                            <a href={urlForDownload} download target="_blank" rel="noopener noreferrer">
                                                {' '}
                                                <Button icon="pi pi-file-arrow-up" />
                                            </a>
                                        </div>
                                    )}
                                    {type.typeValue === 'link' && (
                                        <div className="flex gap-1 items-center">
                                            <Button onClick={lessonCardEvents} className={`w-full ${btnLabel === 'Ачуу' ? 'flex justify-center pi pi-eye h-[31px] sm:h-[38px]' : btnLabel === 'Өтүү' ? 'flex justify-center pi pi-link h-[31px] sm:h-[38px]' : ' '}`} label={btnLabel !== 'Ачуу' && btnLabel !== 'Өтүү' ? btnLabel : ' '} disabled={progressSpinner === true ? true : false} />
                                            {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                                        </div>
                                    )}
                                    {status === 'working' && (
                                        <div className="flex items-center">
                                            <div className="flex gap-2">
                                                <Button
                                                    className=""
                                                    icon={'pi pi-pencil'}
                                                    label={!media ? 'Редактирлөө' : ''}
                                                    onClick={() => {
                                                        onSelected && onSelected(cardValue.id, cardValue?.type || '');
                                                    }}
                                                />
                                                <Button
                                                    className=""
                                                    icon={'pi pi-trash'}
                                                    label={!media ? 'Өчүрүү' : ''}
                                                    onClick={() => {
                                                        const options = getConfirmOptions(Number(cardValue.id), () => onDelete && onDelete(cardValue.id));
                                                        confirmDialog(options);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    }
                </div>
            </div>
        </div>
    );
}
