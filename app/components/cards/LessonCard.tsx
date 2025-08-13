import Redacting from '../popUp/Redacting';
import { getRedactor } from '@/utils/getRedactor';
import { getConfirmOptions } from '@/utils/getConfirmOptions';

export default function LessonCard({
    status,
    onSelected,
    onDelete,
    cardValue,
    cardBg,
    typeColor,
    type,
    lessonDate
}: {
    status: string;
    onSelected?: (id: number, type: string) => void;
    onDelete?: (id: number) => void;
    cardValue: { title: string; id: number; desctiption?: string; type?: string; photo?: string };
    cardBg: string;
    type: { typeValue: string; icon: string };
    typeColor: string;
    lessonDate: string;
}) {
    return (
        <div className={`w-[180px] sm:w-[70%] md:w-[200px] h-[130px] overflow-hidden flex flex-col shadow-xl rounded-sm p-2`} style={{ backgroundColor: cardBg }}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`flex gap-1 items-center font-bold text-[12px]`} style={{ color: typeColor }}>
                        <i className={`${type.icon}`}></i>
                        <span className="">{type.typeValue && type.typeValue}</span>
                    </div>
                    <span>/</span>
                    <div className={`flex gap-1 items-center`}>
                        <i className={`pi pi-calendar text-[var(--mainColor)]`}></i>
                        <span>{lessonDate}</span>
                    </div>
                </div>
                {status === 'working' && <Redacting redactor={getRedactor(status, cardValue, { onEdit: onSelected, getConfirmOptions, onDelete: onDelete })} textSize={'12px'} />}
            </div>

            <div className="bg-[#d6bcbc12] p-1 mt-2 flex flex-col gap-2 justify-between rounded-2xl">
                <div className=''>{!cardValue.photo && <img className="cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSweN5K2yaBwZpz5W9CxY9S41DI-2LawmjzYw&s" alt="" />}</div>
                <div className="flex items-center justify-center mt-1">{cardValue.title}</div>
                <div className="flex items-center justify-center mt-1">{cardValue?.desctiption}</div>
            </div>
        </div>
    );
}
