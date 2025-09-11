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
import { getToken } from '@/utils/auth';
import { addDocument, deleteDocument, fetchElement, updateDocument } from '@/services/steps';
import { mainStepsType } from '@/types/mainStepType';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import FormModal from '../popUp/FormModal';
// import PDFViewer from '../PDFBook';
import dynamic from "next/dynamic";

const PDFViewer = dynamic(()=> import('../PDFBook'), {
    ssr: false,
})

export default function LessonDocument({ element, content, fetchPropElement, clearProp }: { element: mainStepsType; content: any; fetchPropElement: (id: number) => void; clearProp: boolean}) {
    interface docValueType {
        title: string;
        description: string;
        file: File | null;
        document?: string;
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
        document_path:string;
    }

    const { course_id } = useParams();

    const router = useRouter();
    const media = useMediaQuery('(max-width: 640px)');
    const fileUploadRef = useRef<FileUpload>(null);
    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);

    const [editingLesson, setEditingLesson] = useState<docValueType | null>({ title: 'string', description: '', file: null });
    const [visible, setVisisble] = useState(false);
    const [imageState, setImageState] = useState<string | null>(null);
    const [contentShow, setContentShow] = useState(false);
    // doc
    const [document, setDocuments] = useState<contentType>();
    const [docValue, setDocValue] = useState<docValueType>({
        title: '',
        description: '',
        file: null
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
                        file: null
                    }
            );
        } else {
            setDocValue((prev) => ({
                ...prev,
                file: null
            }));
        }
    };

    const clearValues = () => {
        clearFile();
        setDocValue({ title: '', description: '', file: null });
        setEditingLesson(null);
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

    const documentView = (
        <>
            <div className=" flex flex-col gap-1">
                <i className="pi pi-times text-2xl" onClick={() => setPDFVisible(false)}></i>
                <div className="w-full flex flex-col gap-1 items-center justify-center"><PDFViewer url={urlPDF || ''} /></div>
            </div>
        </>
    );
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
            setEditingLesson({title: data.content.title, file:null, document: data.content.document, description: data.content.description})
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

    const handleAddDoc = async () => {
        toggleSpinner();
        const data = await addDocument(docValue, element.lesson_id, element.type_id, element.id);
        console.log(data);

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
        console.log(id);

        // const token = getToken('access_token');
        const data = await deleteDocument(Number(document?.lesson_id), id);
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
        const token = getToken('access_token');
        const data = await updateDocument(token, document?.lesson_id ? Number(document?.lesson_id) : null, Number(selectId), element.type.id, element.type.id, editingLesson);
        console.log(data);

        if (data?.success) {
            fetchPropElement(element.id);
            clearValues();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өзгөртүлдү!', detail: '' }
            });
        } else {
            setDocValue({ title: '', description: '', file: null });
            setEditingLesson(null);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Катаа!', detail: 'Өзгөртүүдө ката кетти' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const documentSection = () => {
        return (
            <div className="py-1 sm:py-4 flex flex-col items-center gap-4">
                {PDFVisible ? (
                    documentView
                ) : contentShow ? (
                    <div className="w-full flex flex-col items-center gap-4 py-2 sm:py-4">
                        <div className="w-full flex flex-wrap gap-4">
                            {docShow ? (
                                <NotFound titleMessage={'Сабак кошуу үчүн талааларды толтурунуз'} />
                            ) : (
                                document && (
                                    <LessonCard
                                        status="working"
                                        onSelected={(id: number, type: string) => selectedForEditing(id, type)}
                                        onDelete={(id: number) => handleDeleteDoc(id)}
                                        cardValue={{ title: document?.title, id: document.id, desctiption: document?.description || '', type: 'doc', document: document.document }}
                                        cardBg={'#ddc4f51a'}
                                        type={{ typeValue: 'doc', icon: 'pi pi-doc' }}
                                        typeColor={'var(--mainColor)'}
                                        lessonDate={new Date(document.created_at).toISOString().slice(0, 10)}
                                        urlForPDF={() => sentToPDF(document.document || '')}
                                        urlForDownload={document.document_path || ''}
                                    />
                                )
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col justify-center gap-2">
                        <div className="flex gap-1 items-center">
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
                                    setDocValue((prev) => ({
                                        ...prev,
                                        file: e.files[0]
                                    }))
                                }
                            />
                            <Button icon={'pi pi-trash'} onClick={clearFile} />
                        </div>

                        <InputText
                            id="title"
                            type="text"
                            placeholder={'Аталышы'}
                            value={docValue.title}
                            onChange={(e) => {
                                setDocValue((prev) => ({ ...prev, title: e.target.value }));
                                setValue('title', e.target.value, { shouldValidate: true });
                            }}
                        />
                        <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                        {additional.doc && <InputText placeholder="Мазмун" value={docValue.description} onChange={(e) => setDocValue((prev) => ({ ...prev, description: e.target.value }))} className="w-full" />}

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
                                    disabled={progressSpinner || !docValue.title.length || !!errors.title || !docValue.file}
                                    onClick={() => {
                                        handleAddDoc();
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
        setDocValue({ title: '', description: '', file: null });
    }, [element]);

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
                        {selectType === 'doc' ? (
                            <>
                                <div className="flex gap-1 items-center">
                                    <FileUpload
                                        ref={fileUploadRef}
                                        chooseLabel="Жаңылоо"
                                        mode="basic"
                                        name="demo[]"
                                        customUpload
                                        uploadHandler={() => {}}
                                        accept="application/pdf"
                                        onSelect={(e) => {
                                            if (e.files[0]) setEditingLesson((prev) => prev && { ...prev, file: e.files[0] });
                                        }}
                                    />
                                    <Button icon={'pi pi-trash'} onClick={clearFile} />
                                </div>
                                {/* <span>{String(editingLesson?.file[0].objectURL)}</span> */}
                                <InputText
                                    type="text"
                                    placeholder="Аталышы"
                                    className="w-full"
                                    value={editingLesson?.title && editingLesson?.title}
                                    onChange={(e) => {
                                        console.log(editingLesson);
                                        setEditingLesson((prev) => prev && { ...prev, title: e.target.value });
                                        setValue('title', e.target.value, { shouldValidate: true });
                                    }}
                                />
                                <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                                <InputText
                                    placeholder="Мазмун"
                                    value={editingLesson?.description !== 'null' ? editingLesson?.description : ''}
                                    onChange={(e) => setEditingLesson((prev) => prev && { ...prev, description: e.target.value })}
                                    className="w-full"
                                />
                            </>
                        ) : selectType === 'video' ? (
                            <>
                            </>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </FormModal>
            {!clearProp && documentSection()}
        </div>
    );
}
