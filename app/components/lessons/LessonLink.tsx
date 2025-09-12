'use client';

import { lessonSchema } from '@/schemas/lessonSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NotFound } from '../NotFound';
import LessonCard from '../cards/LessonCard';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { addDocument, addLink, addPractica, deleteDocument, deleteLink, deletePractica, fetchElement, updateDocument, updateLink, updatePractica } from '@/services/steps';
import { mainStepsType } from '@/types/mainStepType';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import FormModal from '../popUp/FormModal';

export default function LessonLink({ element, content, fetchPropElement, clearProp }: { element: mainStepsType; content: any; fetchPropElement: (id: number) => void; clearProp: boolean }) {
    interface linkValueType {
        title: string;
        description: string;
        url: string;
    }

    interface contentType {
        course_id: number | null;
        created_at: string;
        description: string | null;
        document: string;
        id: number;
        lesson_id: number;
        status: true;
        title: string;
        updated_at: string;
        user_id: number;
        document_path: string;
        url: string;
    }

    const { course_id } = useParams();

    const media = useMediaQuery('(max-width: 640px)');
    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);

    const [editingLesson, setEditingLesson] = useState<linkValueType>({ title: '', description: '', url: '' });
    const [visible, setVisisble] = useState(false);
    const [contentShow, setContentShow] = useState(false);
    // doc
    const [link, setLink] = useState<contentType>();
    const [linkValue, setLinkValue] = useState<linkValueType>({
        title: '',
        description: '',
        url: ''
    });
    const [docShow, setDocShow] = useState<boolean>(false);

    const [progressSpinner, setProgressSpinner] = useState(false);
    const [additional, setAdditional] = useState<{ doc: boolean; link: boolean; video: boolean }>({ doc: false, link: false, video: false });
    const [selectId, setSelectId] = useState<number | null>(null);

    const clearFile = () => {
        setAdditional((prev) => ({ ...prev, link: false }));
    };

    const clearValues = () => {
        clearFile();
        setLinkValue({ title: '', description: '', url: '' });
        setEditingLesson({ title: '', description: '', url: '' });
        setSelectId(null);
    };

    const toggleSpinner = () => {
        setProgressSpinner(true);
        setInterval(() => {
            setProgressSpinner(false);
        }, 1000);
    };

    // validate
    const {
        setValue,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(lessonSchema),
        mode: 'onChange'
    });

    const selectedForEditing = (id: number, type: string) => {
        setSelectId(id);
        setVisisble(true);
        editing();
    };

    const editing = async () => {
        const data = await fetchElement(element.lesson_id, element.id);
        console.log(data);
        
        if (data.success) {
            setEditingLesson({ title: data.content.title, description: data.content.description, url: data.content.url });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Катаа!', detail: 'Кийинчерээк кайталаныз' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleAddLink = async () => {
        toggleSpinner();
        const data = await addLink(linkValue, element.lesson_id, element.type_id, element.id);        
        if (data.success) {
            fetchPropElement(element.id);
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү Кошулдуу!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Катаа!', detail: 'Кошуу учурунда катаа кетти' }
            });
            if (data.response.status) {
                showError(data.response.status);
            }
        }
    };

    // delete document
    const handleDeleteLink = async (id: number) => {
        const data = await deleteLink(Number(link?.lesson_id), id, element.type.id, element.id);
        if (data.success) {
            fetchPropElement(element.id);
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өчүрүлдү!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Катаа!', detail: 'Өчүрүүдө ката кетти' }
            });
            if (data.response.status) {
                showError(data.response.status);
            }
        }
    };

    // update document
    const handleUpdateLink = async () => {
        const data = await updateLink(editingLesson, link?.lesson_id ? Number(link?.lesson_id) : null, Number(selectId), element.type.id, element.id);
        if (data?.success) {
            fetchPropElement(element.id);
            clearValues();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өзгөртүлдү!', detail: '' }
            });
        } else {
            setLinkValue({ title: '', description: '', url: '' });
            setEditingLesson({ title: '', description: '', url: '' });
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Катаа!', detail: 'Өзгөртүүдө ката кетти' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const linkSection = () => {
        return (
            <div className="py-1 sm:py-3 flex flex-col items-center gap-4">
                {contentShow ? (
                    <div className="w-full flex flex-col items-center gap-4 py-2">
                        <div className="w-full flex flex-wrap gap-4">
                            {docShow ? (
                                <NotFound titleMessage={'Сабак кошуу үчүн талааларды толтурунуз'} />
                            ) : (
                                link && (
                                    <LessonCard
                                        status="working"
                                        onSelected={(id: number, type: string) => selectedForEditing(id, type)}
                                        onDelete={(id: number) => handleDeleteLink(id)}
                                        cardValue={{ title: link?.title, id: link.id, desctiption: link?.description || '', type: 'link', url: link.url, document: link.document }}
                                        cardBg={'#ddc4f51a'}
                                        type={{ typeValue: 'link', icon: 'pi pi-link' }}
                                        typeColor={'var(--mainColor)'}
                                        lessonDate={new Date(link.created_at).toISOString().slice(0, 10)}
                                        urlForPDF={() => {}}
                                        urlForDownload={''}
                                    />
                                )
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col justify-center gap-2">
                        <div className="w-full flex flex-col items-center">
                            <InputText
                                id="usefulLink"
                                type="url"
                                placeholder={'Шилтеме жүктөө'}
                                value={linkValue.url}
                                className="w-full"
                                onChange={(e) => {
                                    setLinkValue((prev) => ({ ...prev, url: e.target.value }));
                                    setValue('usefulLink', e.target.value, { shouldValidate: true });
                                }}
                            />
                            <b style={{ color: 'red', fontSize: '12px' }}>{errors.usefulLink?.message}</b>
                        </div>
                        <InputText
                            id="title"
                            type="text"
                            placeholder={'Аталышы'}
                            value={linkValue.title}
                            onChange={(e) => {
                                setLinkValue((prev) => ({ ...prev, title: e.target.value }));
                                setValue('title', e.target.value, { shouldValidate: true });
                            }}
                        />
                        <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                        {additional.link && <InputText placeholder="Мазмун" value={linkValue.description} onChange={(e) => setLinkValue((prev) => ({ ...prev, description: e.target.value }))} className="w-full" />}

                        <div className="flex relative">
                            {/* <Button disabled={!!errors.title || !docValue.file} label="Сактоо" onClick={handleAddDoc} /> */}
                            <div className="absolute">
                                <span className="cursor-pointer ml-1 text-sm text-[var(--mainColor)]" onClick={() => setAdditional((prev) => ({ ...prev, link: !prev.link }))}>
                                    Кошумча {additional.link ? '-' : '+'}
                                </span>
                            </div>
                            <div className="w-full flex gap-1 justify-center items-center">
                                <Button
                                    label="Сактоо"
                                    disabled={progressSpinner || !linkValue.title.length || !!errors.title || !linkValue.url.length}
                                    onClick={() => handleAddLink()}
                                />
                                {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    useEffect(() => {
        console.log('content', content);
        if (content) {
            setContentShow(true);
            setLink(content);
        } else {
            setContentShow(false);
        }
    }, [content]);

    useEffect(() => {
        console.log('edititing', element);
        setLinkValue({ title: '', description: '', url: '' });
    }, [element]);

    useEffect(() => {
        console.log('value ', linkValue);
    }, [linkValue]);

    return (
        <div>
            <FormModal
                title={'Сабакты жаңылоо'}
                fetchValue={() => handleUpdateLink()}
                clearValues={clearValues}
                visible={visible}
                setVisible={setVisisble}
                start={false}
            >
                <div className="flex flex-col gap-1">
                    <div className="w-full flex flex-col items-center">
                            <InputText
                                id="usefulLink"
                                type="url"
                                placeholder={'Шилтеме жүктөө'}
                                value={editingLesson.url}
                                className="w-full"
                                onChange={(e) => {
                                    setEditingLesson((prev) => ({ ...prev, url: e.target.value }));
                                    setValue('usefulLink', e.target.value, { shouldValidate: true });
                                }}
                            />
                            <b style={{ color: 'red', fontSize: '12px' }}>{errors.usefulLink?.message}</b>
                        </div>
                        <InputText
                            id="title"
                            type="text"
                            placeholder={'Аталышы'}
                            value={editingLesson.title}
                            onChange={(e) => {
                                setEditingLesson((prev) => ({ ...prev, title: e.target.value }));
                                setValue('title', e.target.value, { shouldValidate: true });
                            }}
                        />
                        <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                        {additional.link && <InputText placeholder="Мазмун" value={editingLesson.description} onChange={(e) => setEditingLesson((prev) => ({ ...prev, description: e.target.value }))} className="w-full" />}

                        <div className="flex relative">
                            {/* <Button disabled={!!errors.title || !editingLesson.file} label="Сактоо" onClick={handleAddDoc} /> */}
                            <div className="absolute">
                                <span className="cursor-pointer ml-1 text-sm text-[var(--mainColor)]" onClick={() => setAdditional((prev) => ({ ...prev, link: !prev.link }))}>
                                    Кошумча {additional.link ? '-' : '+'}
                                </span>
                            </div>
                        </div>
                </div>
            </FormModal>
            {!clearProp && linkSection()}
        </div>
    );
}
