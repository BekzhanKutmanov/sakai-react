'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function LessonTest() {
    const media = useMediaQuery('(max-width: 640px)');

    const courseInfoClass = true;

    const practicaSection = (
        <div className='py-4'>
            {/* <div className="flex items-center justify-end gap-1 my-4">
                <span className="text-[var(--mainColor)] sm:text-lg">Балл за задание: </span>
                <b className="text-[16px] sm:text-[18px]">{`${10}`}</b>
            </div> */}

            <div className='flex flex-col gap-2'>
                <b className='text-[16px] sm:text-[18px] text-wrap break-all'>Сделай фон прогресс-бара светлым (серый/белый), а саму заливку — яркой (зелёный, синий, красный). Тогда даже тонкая.</b>
                <div className="bg-[#ddc4f51a] p-2 relative m-auto sm:w-[500px] md:w-[70%]">
                    <p className="mt-1"><span className='w-[20px] h-[20px] bg-green-600 relative inline-block'><span className="pi pi-bookmark text-xl absolute top-[-2px]"></span></span> У прогресс-бара есть такая особенность: если ширина маленькая (0–10%), то «полоска» почти не видна. Чтобы это исправить, есть несколько приёмов:</p>
                </div>
            </div>

                        <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-1">
                    <span className="text-[var(--mainColor)]">Документ: </span> 
                    {
                        true ? <a className={`flex gap-2 pi pi-file-arrow-up text-xl text-white bg-[var(--mainColor)] p-1 rounded`} href={true && 'documentUrl.document_path'} download target="_blank" rel="noopener noreferrer"></a>
                        : <span className={`flex gap-2 pi pi-file-arrow-up text-xl text-white bg-[gray] p-1 rounded`} rel="noopener noreferrer"></span>
                    } 
                </div>

                <div className="flex gap-2 items-center">
                    <span className="text-[var(--mainColor)]">Ссылка: </span>
                    {true ? <a href={true ? String(true) : ''} className="max-w-[800px] text-wrap break-all" target="_blank">
                            {true}
                        </a>
                        : <span className={``} rel="noopener noreferrer">?</span>
                    }
                </div>
            </div>            
        </div>
    );

    return (
        <div className="main-bg">
            <div className={`w-full bg-[var(--titleColor)] relative  text-white p-4 md:p-3 pb-4`}>
                <div className="flex flex-col gap-2 items-center">
                    <div className={`w-full flex items-center gap-1 ${courseInfoClass ? 'justify-around flex-col sm:flex-row' : 'justify-center'}  items-center`}>
                        <h1 style={{ color: 'white', fontSize: media ? '24px' : '28px', textAlign: 'center', margin: '0' }}>{'course'}</h1>
                        {courseInfoClass && <span className="text-white">babt</span>}
                    </div>
                    <span>description description description description description descriptiondescription </span>
                    <div className="flex items-center justify-end gap-1">
                        <b className="text-white sm:text-lg">Тема: </b>
                        <b className="text-[16px] sm:text-[18px]">{'theme title'}</b>
                    </div>
                </div>
            </div>
            {/* practica */}
            {practicaSection}
        </div>
    );
}
