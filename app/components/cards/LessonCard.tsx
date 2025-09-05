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
    videoVisible
}: {
    status: string;
    onSelected?: (id: number, type: string) => void;
    onDelete?: (id: number) => void;
    cardValue: { title: string; id: number; desctiption?: string; type?: string; photo?: string; url?: string; document?: string };
    cardBg: string;
    type: { typeValue: string; icon: string };
    typeColor: string;
    lessonDate: string;
    urlForPDF: () => void;
    urlForDownload: string;
    videoVisible?: (id: string | null) => void;
}) {
    const shortTitle = useShortText(cardValue.title, 90);
    const shortDoc = useShortText(cardValue?.document || '', 70);
    const shortDescription = useShortText(cardValue.desctiption ? cardValue.desctiption : '', 90);
    const shortUrl = useShortText(cardValue?.url ? cardValue?.url : '', 17);
    const [progressSpinner, setProgressSpinner] = useState(false);

    // useEffect(()=> {
    //     console.log(cardValue.photo);
    // },[cardValue]);
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

    const btnLabel = type.typeValue === 'doc' && status === 'working' ? 'Көчүрүү' : type.typeValue === 'doc' && status === 'student' ? 'Ачуу' : type.typeValue === 'link' ? 'Өтүү' : '';

    return (
        <div className="w-full flex flex-col items-start gap-2">
            <div
                className={`${type.typeValue === 'link' && 'relative'} ${type.typeValue !== 'link' && 'overflow-hidden'} 
                ${type.typeValue === 'video' && status === 'working' ? 'min-h-[200px]' : type.typeValue !== 'video' && status === 'working' ? 'min-h-[160px]' : ''} 
                ${status === 'student' && type.typeValue !== 'video' ? 'min-h-[160px]' : status === 'student' && type.typeValue === 'video' ? 'min-h-[200px]' : ''}

                ${type.typeValue === 'video' ? 'w-full' : ''} flex flex-col justify-evenly lesson-card-border rounded p-2
                
                ${type.typeValue === 'doc' ? 'w-full min-h-[160px] bg-black' : ''}

                `}
                style={{ backgroundColor: cardBg }}
            >
                <div className={`flex flex-col items-center ${type.typeValue !== 'video' ? 'gap-3' : 'gap-1'}`}>
                    <div className="bg-[#d6bcbc12] flex flex-col gap-1 justify-between rounded-2xl p-2">
                        {/* <div className=''>{!cardValue.photo && <img className="cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSweN5K2yaBwZpz5W9CxY9S41DI-2LawmjzYw&s" alt="" />}</div> */}
                        <b className="flex items-center justify-center text-[16px] sm:text-[18px] mt-1">{shortTitle}</b>
                        <div className="flex items-center justify-center text-[15px] sm:text-[17px] mt-1">{shortDoc}</div>
                        {type.typeValue === 'link' && <span className="flex justify-center">{shortUrl}</span>}
                        <div className="flex items-center justify-center text-[13px]">{cardValue?.desctiption && cardValue?.desctiption !== 'null' && shortDescription}</div>
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
                    {(
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
                                <div className="flex  justify-center items-center gap-2 sm:gap-0 sm:flex-row">
                                    {btnLabel && <Button onClick={lessonCardEvents} label={btnLabel} />}
                                    {status === 'working' && (
                                        <div className="pl-2 flex items-center">
                                            <div className="flex gap-2 ">
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
                    )}
                </div>
            </div>
        </div>
    );
}
