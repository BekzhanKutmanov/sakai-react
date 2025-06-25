'use client';

import { useEffect, useRef, useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import CKEditorWrapper from '@/app/components/CKEditorWrapper.tsx';
import { Button } from 'primereact/button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '@/schemas/schema';
import { InputText } from 'primereact/inputtext';
import FancyLinkBtn from '@/app/components/buttons/FancyLinkBtn';
import { LoginType } from '@/types/login';
import useTypingEffect from '@/hooks/useTypingEffect';
import Test from '@/app/components/Test';
import { FileUpload } from 'primereact/fileupload';

export default function Lesson() {
    const stepperRef = useRef(null);

    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [contentShow, setContentShow] = useState<boolean>(true);
    const [videoLink, setVideoLink] = useState<string>('');

    // for typing effects
    const [videoTyping, setVideoTyping] = useState(true);
    const [linkTyping, setLinkTyping] = useState(true);

    const handleTabChange = (e) => {
        // console.log('Переход на шаг:', e);
        //     // fetchDataForStep(e.index);
        setActiveIndex(e.index);
    };

    const {
        register,
        handleSubmit,
        setValue,
        trigger,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange'
    });

    const handleVideoChange = (value: string) => {
        console.log(value);

        setVideoLink(value);
        setValue('videoReq', value, { shouldValidate: true }); // ✅ обновляем форму и запускаем валидацию
    };

    const addVideo = async () => {
        console.log('hi');
    };

    const videoTyped = useTypingEffect('lreomlroemlfjslj sdlfkjlksdjk ksjdf l', videoTyping);
    const linkTyped = useTypingEffect('lreomlroemlfjslj sdlfkjlksdjk ksjdf lldfd', linkTyping);

    useEffect(() => {
        switch (activeIndex) {
            case 3:
                setVideoTyping(true); // включить эффект
                break;
            case 2:
                setLinkTyping(true);
                break;
            default:
                setLinkTyping(false);
                setVideoTyping(false); // выключить при уходе
        }
    }, [activeIndex]);

    return (
        <div>
            <TabView
                onTabChange={(e) => handleTabChange(e)}
                activeIndex={activeIndex}
                className=""
                pt={{
                    nav: { className: 'flex flex-wrap justify-around' },
                    panelContainer: { className: 'flex-1 pl-4' }
                }}
            >
                {/* CKEDITOR */}
                <TabPanel
                    pt={{
                        headerAction: { className: 'font-italic tab-custom-text' }
                    }}
                    header="Тексттер"
                    leftIcon={'pi pi-pen-to-square mr-1'}
                    className=" p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                >
                    {contentShow && (
                        <div className="py-4 flex flex-col gap-16 items-center m-0 className='min-h-1/2'">
                            <CKEditorWrapper />
                            <Button label="Сактоо" />
                        </div>
                    )}
                </TabPanel>

                {/* DOC */}
                <TabPanel
                    pt={{
                        headerAction: { className: 'font-italic tab-custom-text-2' }
                    }}
                    header="Документтер"
                    leftIcon={'pi pi-folder mr-1'}
                    className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                >
                    {contentShow &&
                        <div className='py-4'>
                            <div className='bg-white shadow'>
                                <FileUpload className='bg-white text-black poka' style={{backgroundColor:'white'}} mode="basic" name="demo[]" url="/api/upload" accept="document/*" />
                                <InputText placeholder="Мазмун" className="w-full" />
                            </div>
                            <div className="flex flex-col w-full">
                                <InputText
                                    {...register('usefulLink')}
                                    type="text"
                                    value={linkTyping ? linkTyped : videoLink}
                                    onClick={() => setLinkTyping(false)}
                                    onChange={(e) => {
                                        setVideoLink(e.target.value);
                                        setValue('usefulLink', e.target.value, { shouldValidate: true });
                                    }}
                                    placeholder="https://..."
                                    className="w-full p-2 sm:p-3"
                                />
                                {errors.usefulLink && <b className="text-[red] text-[12px] ml-2">{errors.usefulLink.message}</b>}
                            </div>
                            <Button type="submit" onClick={addVideo} label="Сактоо" className="" disabled={!!errors.videoReq} />
                        </div>
                    }
                </TabPanel>

                {/* USEFUL LINKS */}
                <TabPanel
                    pt={{
                        headerAction: { className: 'font-italic tab-custom-text-3' }
                    }}
                    header="Пайдалуу шилтемелер"
                    leftIcon={'pi pi-link mr-1'}
                    className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                >
                    {contentShow && (
                        <div className="w-full py-4 flex flex-col items-center gap-2">
                            <div className="flex flex-col w-full">
                                <InputText
                                    {...register('usefulLink')}
                                    type="text"
                                    value={linkTyping ? linkTyped : videoLink}
                                    onClick={() => setLinkTyping(false)}
                                    onChange={(e) => {
                                        setVideoLink(e.target.value);
                                        setValue('usefulLink', e.target.value, { shouldValidate: true });
                                    }}
                                    placeholder="https://..."
                                    className="w-full p-2 sm:p-3"
                                />
                                {errors.usefulLink && <b className="text-[red] text-[12px] ml-2">{errors.usefulLink.message}</b>}
                            </div>
                            <InputText placeholder="Мазмун" className="w-full" />
                            <Button type="submit" onClick={addVideo} label="Сактоо" className="" disabled={!!errors.videoReq} />
                        </div>
                    )}
                </TabPanel>

                {/* VIDEO */}
                <TabPanel
                    pt={{
                        headerAction: { className: 'font-italic tab-custom-text-4' }
                    }}
                    header="Видео"
                    leftIcon={'pi pi-video mr-1'}
                    className="p-tabview p-tabview-nav p-tabview-selected p-tabview-panels p-tabview-panel"
                >
                    {contentShow && (
                        <div className="w-full py-4 flex flex-col items-center gap-2">
                            <div className="flex flex-col w-full">
                                <InputText
                                    {...register('videoReq')}
                                    type="text"
                                    value={videoTyping ? videoTyped : videoLink}
                                    onClick={() => setVideoTyping(false)}
                                    onChange={(e) => {
                                        setVideoLink(e.target.value);
                                        setValue('videoReq', e.target.value, { shouldValidate: true });
                                    }}
                                    placeholder="https://..."
                                    className="w-full p-2 sm:p-3"
                                />
                                {errors.videoReq && <b className="text-[red] text-[12px] ml-2">{errors.videoReq.message}</b>}
                            </div>
                            <InputText placeholder="Мазмун" className="w-full" />
                            <Button type="submit" onClick={addVideo} label="Сактоо" className="" disabled={!!errors.videoReq} />
                        </div>
                    )}
                </TabPanel>
            </TabView>
        </div>
    );
}
