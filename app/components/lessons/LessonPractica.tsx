'use client';

import { lessonSchema } from '@/schemas/lessonSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NotFound } from '../NotFound';
import LessonCard from '../cards/LessonCard';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { addDocument, addPractica, deleteDocument, deletePractica, fetchElement, updateDocument, updatePractica } from '@/services/steps';
import { mainStepsType } from '@/types/mainStepType';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import FormModal from '../popUp/FormModal';
import { InputTextarea } from 'primereact/inputtextarea';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('../PDFBook'), {
    ssr: false
});

export default function LessonPractica({ element, content, fetchPropElement, clearProp }: { element: mainStepsType; content: any; fetchPropElement: (id: number) => void; clearProp: boolean }) {
    interface docValueType {
        title: string;
        description: string;
        document: File | null;
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

    const router = useRouter();
    const media = useMediaQuery('(max-width: 640px)');
    const fileUploadRef = useRef<FileUpload>(null);
    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);

    const [editingLesson, setEditingLesson] = useState<docValueType>({ title: '', description: '', document: null, url: '' });
    const [visible, setVisisble] = useState(false);
    const [imageState, setImageState] = useState<string | null>(null);
    const [contentShow, setContentShow] = useState(false);
    // doc
    const [document, setDocuments] = useState<contentType>();
    const [docValue, setDocValue] = useState<docValueType>({
        title: '',
        description: '',
        document: null,
        url: ''
    });
    const [docShow, setDocShow] = useState<boolean>(false);
    const [urlPDF, setUrlPDF] = useState('');
    const [PDFVisible, setPDFVisible] = useState<boolean>(false);

    const [progressSpinner, setProgressSpinner] = useState(false);
    const [additional, setAdditional] = useState<{ doc: boolean; link: boolean; video: boolean }>({ doc: false, link: false, video: false });
    const [selectType, setSelectType] = useState('');
    const [selectId, setSelectId] = useState<number | null>(null);

    const clearFile = () => {
        fileUploadRef.current?.clear();
        setAdditional((prev) => ({ ...prev, video: false }));
        setImageState(null);
        if (visible) {
            setEditingLesson(
                (prev) =>
                    prev && {
                        ...prev,
                        document: null
                    }
            );
        } else {
            setDocValue((prev) => ({
                ...prev,
                document: null
            }));
        }
    };

    const documentView = (
        <>
            <div className=" flex flex-col gap-1">
                <i className="pi pi-times text-2xl" onClick={() => setPDFVisible(false)}></i>
                <div className="w-full flex flex-col gap-1 items-center justify-center">
                    <PDFViewer url={urlPDF || ''} />
                </div>
            </div>
        </>
    );

    const clearValues = () => {
        clearFile();
        setDocValue({ title: '', description: '', document: null, url: '' });
        setEditingLesson({ title: '', description: '', document: null, url: '' });
        setSelectId(null);
        setSelectType('');
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
        setSelectType(type);
        setSelectId(id);
        setVisisble(true);
        editing();
    };

    const sentToPDF = (url: string) => {
        setUrlPDF(url);
        if (media) {
            router.push(`/pdf/${url}`);
        } else {
            setPDFVisible(true);
        }
    };

    const editing = async () => {
        const data = await fetchElement(element.lesson_id, element.id);
        if (data.success) {
            setEditingLesson({ title: data.content.title, document: null, description: data.content.description, url: '' });
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

    const handleAddPracica = async () => {
        toggleSpinner();
        const data = await addPractica(docValue, element.lesson_id, element.type_id, element.id);
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
    const handleDeleteDoc = async (id: number) => {
        const data = await deletePractica(Number(document?.lesson_id), id, element.type.id, element.id);
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
    const handleUpdateDoc = async () => {
        const data = await updatePractica(editingLesson, document?.lesson_id ? Number(document?.lesson_id) : null, Number(selectId), element.type.id, element.id);
        if (data?.success) {
            fetchPropElement(element.id);
            clearValues();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өзгөртүлдү!', detail: '' }
            });
        } else {
            setDocValue({ title: '', description: '', document: null, url: '' });
            setEditingLesson({ title: '', description: '', document: null, url: '' });
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Катаа!', detail: 'Өзгөртүүдө ката кетти' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const practicaSection = () => {
        return (
            <div className="py-1 sm:py-3 flex flex-col items-center gap-4">
                {PDFVisible ? (
                    documentView
                ) : contentShow ? (
                    <div className="w-full flex flex-col items-center gap-4 py-2">
                        <div className="w-full flex flex-wrap gap-4">
                            {docShow ? (
                                <NotFound titleMessage={'Сабак кошуу үчүн талааларды толтурунуз'} />
                            ) : (
                                document && (
                                    <LessonCard
                                        status="working"
                                        onSelected={(id: number, type: string) => selectedForEditing(id, type)}
                                        onDelete={(id: number) => handleDeleteDoc(id)}
                                        cardValue={{ title: document?.title, id: document.id, desctiption: document?.description || '', type: 'practica', url: document.url, document: document.document }}
                                        cardBg={'#ddc4f51a'}
                                        type={{ typeValue: 'practica', icon: 'pi pi-list' }}
                                        typeColor={'var(--mainColor)'}
                                        lessonDate={new Date(document.created_at).toISOString().slice(0, 10)}
                                        urlForPDF={() => sentToPDF('')}
                                        urlForDownload={document.document ? document.document_path : ''}
                                    />
                                )
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col justify-center gap-2">
                        <div className="flex gap-1 items-center">
                            <InputTextarea value={docValue.title} id="title" placeholder='Суроо...' style={{resize: 'none', width: '100%'}} onChange={(e) => {
                                setDocValue((prev) => ({ ...prev, title: e.target.value }));
                                setValue('title', e.target.value, { shouldValidate: true });
                            }} />
                        </div>
                        <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                        {additional.doc && (
                            // <div className="flex gap-1 items-center">
                            //     <FileUpload
                            //         className="text-[12px]"
                            //         ref={fileUploadRef}
                            //         chooseLabel="Документ жүктөө"
                            //         mode="basic"
                            //         name="demo[]"
                            //         customUpload
                            //         uploadHandler={() => {}}
                            //         accept="application/pdf"
                            //         onSelect={(e) =>
                            //             setDocValue((prev) => ({
                            //                 ...prev,
                            //                 document: e.files[0]
                            //             }))
                            //         }
                            //     />
                            //     <Button icon={'pi pi-trash'} onClick={clearFile} />
                            // </div>
                            <input
                            type="file"
                            accept="application/pdf"
                            className='border rounded p-1'
                            onChange={(e) => {
                                console.log(e.target.files);
                                const file = e.target.files?.[0]; 
                                if(file){
                                    setDocValue((prev) => ({
                                        ...prev,
                                        document: file
                                    }))
                                }
                            }}
                        />
                        )}
                        {additional.doc && (
                            <div className="w-full flex flex-col items-center">
                                <InputText
                                    id="usefulLinkNotReq"
                                    type="url"
                                    placeholder={'Шилтеме жүктөө'}
                                    value={docValue.url}
                                    className="w-full"
                                    onChange={(e) => {
                                        setDocValue((prev) => ({ ...prev, url: e.target.value }));
                                        setValue('usefulLinkNotReq', e.target.value, { shouldValidate: true });
                                    }}
                                />
                                <b style={{ color: 'red', fontSize: '12px' }}>{errors.usefulLinkNotReq?.message}</b>
                            </div>
                        )}
                        <InputText placeholder="Мазмун" id="title" value={docValue.description} onChange={(e) => {
                            setDocValue((prev) => ({ ...prev, description: e.target.value }))
                            setValue('title', e.target.value, { shouldValidate: true });
                        }} className="w-full" />
                        <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>

                        <div className="flex relative">
                            {/* <Button disabled={!!errors.title || !docValue.file} label="Сактоо" onClick={handleAddDoc} /> */}
                            <div className="absolute">
                                <span className="cursor-pointer ml-1 text-sm text-[var(--mainColor)]" onClick={() => setAdditional((prev) => ({ ...prev, doc: !prev.doc }))}>
                                    Кошумча {additional.doc ? '-' : '+'}
                                </span>
                            </div>
                            <div className="w-full flex gap-1 justify-center items-center">
                                <Button
                                    label="Сактоо"
                                    disabled={progressSpinner || !docValue.title.length || !!errors.title || !docValue.description.length}
                                    onClick={() => {
                                        handleAddPracica();
                                    }}
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
            setDocuments(content);
        } else {
            setContentShow(false);
        }
    }, [content]);

    useEffect(() => {
        console.log('edititing', element);
        setDocValue({ title: '', description: '', document: null, url: '' });
    }, [element]);

    useEffect(() => {
        console.log('value ', editingLesson);
    }, [editingLesson]);

    return (
        <div>
            <FormModal
                title={'Сабакты жаңылоо'}
                fetchValue={() => {
                    handleUpdateDoc();
                }}
                clearValues={clearValues}
                visible={visible}
                setVisible={setVisisble}
                start={false}
            >
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col gap-1 items-center justify-center">
                        <div className="w-full flex gap-1 items-center">
                            <InputTextarea id="title" style={{resize: 'none', width: '100%'}} value={editingLesson?.title && editingLesson.title} onChange={(e) => {
                                setEditingLesson((prev) => prev && { ...prev, title: e.target.value })
                                setValue('title', e.target.value, { shouldValidate: true });
                            }} />
                        </div>
                        <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                        {additional.doc && (
                            <div className="flex gap-1 flex-col items-center">
                                <div className='flex  gap-1'>
                                    <FileUpload
                                        className="text-[12px]"
                                        ref={fileUploadRef}
                                        chooseLabel="Документ жүктөө"
                                        mode="basic"
                                        name="demo[]"
                                        customUpload
                                        uploadHandler={() => {}}
                                        accept="application/pdf"
                                        onSelect={(e) =>
                                            setEditingLesson(
                                                (prev) =>
                                                    prev && {
                                                        ...prev,
                                                        document: e.files[0]
                                                    }
                                            )
                                        }
                                    />
                                    <Button icon={'pi pi-trash'} onClick={clearFile} />
                                </div>
                                <span>{typeof editingLesson?.document === 'string' && String(editingLesson?.document)}</span>
                            </div>
                        )}
                        {additional.doc && (
                            <div className="w-full flex flex-col items-center">
                                <InputText
                                    id="usefulLink"
                                    type="url"
                                    placeholder={'Шилтеме жүктөө'}
                                    value={editingLesson?.url}
                                    className="w-full"
                                    onChange={(e) => {
                                        setEditingLesson((prev) => prev && { ...prev, url: e.target.value });
                                        setValue('usefulLink', e.target.value, { shouldValidate: true });
                                    }}
                                />
                            </div>
                        )}
                        <InputText placeholder="Мазмун" id="title" value={editingLesson?.description} onChange={(e) => {
                            setEditingLesson((prev) => ({ ...prev, description: e.target.value }))
                            setValue('title', e.target.value, { shouldValidate: true });
                        }} className="w-full" />
                        <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>

                        <div className="flex relative">
                            <div className="">
                                <span className="cursor-pointer ml-1 text-sm text-[var(--mainColor)]" onClick={() => setAdditional((prev) => ({ ...prev, doc: !prev.doc }))}>
                                    Кошумча {additional.doc ? '-' : '+'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </FormModal>
            {!clearProp && practicaSection()}
        </div>
    );
}
