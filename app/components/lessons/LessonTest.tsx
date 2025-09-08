'use client';

import { lessonSchema } from '@/schemas/lessonSchema';
import { EditableLesson } from '@/types/editableLesson';
import { lessonStateType } from '@/types/lessonStateType';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NotFound } from '../NotFound';
import { lessonType } from '@/types/lessonType';
import LessonCard from '../cards/LessonCard';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { log } from 'node:console';
import { getToken } from '@/utils/auth';
import { addDocument, addTest, deleteDocument, deleteTest, fetchElement, updateDocument, updateTest } from '@/services/steps';
import { mainStepsType } from '@/types/mainStepType';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import FormModal from '../popUp/FormModal';
import PDFViewer from '../PDFBook';
import { InputTextarea } from 'primereact/inputtextarea';

export default function LessonTest({ element, content, fetchPropElement, clearProp }: { element: mainStepsType; content: any; fetchPropElement: (id: number) => void; clearProp: boolean }) {
    interface contentType {
        course_id: number | null;
        created_at: string;
        description: string | null;
        document: string;
        id: number | null;
        lesson_id: number;
        status: true;
        title: string;
        updated_at: string;
        user_id: number;
        answers: { id: number | null; text: string; is_correct: boolean }[];
        content: string;
        score: number;
        image: null | string;
    }

    const { course_id } = useParams();

    const router = useRouter();
    const media = useMediaQuery('(max-width: 640px)');
    const fileUploadRef = useRef<FileUpload>(null);
    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);

    const [editingLesson, setEditingLesson] = useState<{ title: string; score: number } | null>({ title: '', score: 0 });
    const [visible, setVisisble] = useState(false);
    const [imageState, setImageState] = useState<string | null>(null);
    const [contentShow, setContentShow] = useState(false);
    // doc
    const [answer, setAnswer] = useState<{ id: number | null; text: string; is_correct: boolean }[]>([
        { text: '', is_correct: false, id: null },
        { text: '', is_correct: false, id: null }
    ]);
    const [test, setTests] = useState<contentType>({ answers: { id: null, text: '', is_correct: false }, content: '', score: 0, image: null, title: '' });
    const [testValue, setTestValue] = useState<{ title: string; score: number }>({ title: '', score: 0 });
    const [testShow, setTestShow] = useState<boolean>(false);
    const [urlPDF, setUrlPDF] = useState('');

    const [progressSpinner, setProgressSpinner] = useState(false);
    const [selectType, setSelectType] = useState('');
    const [selectId, setSelectId] = useState<number | null>(null);

    const clearValues = () => {
        setTestValue({ title: '', score: 0 });
        setAnswer([]);
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

    const selectedForEditing = (id: number) => {
        setSelectId(id);
        setVisisble(true);
        editing();
    };

    const editing = async () => {
        const data = await fetchElement(element.lesson_id, element.id);
        console.log(data);

        if (data.success) {
            setEditingLesson({ title: data.content.content, score: data.content.score});
            if(data.content.answers && Array.isArray(data.content.answers)){
                console.log('DA! ', );
                
                setAnswer(data.content.answers);
            }
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Катаа!', detail: 'Кийинирээк кайталаныз' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    // update document
    const handleAddTest = async () => {
        console.log(answer);

        const data = await addTest(answer, testValue.title, element?.lesson_id && Number(element?.lesson_id), element.type.id, element.id, testValue.score);
        console.log(data);

        if (data?.success) {
            fetchPropElement(element.id);
            clearValues();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү кошулду!', detail: '' }
            });
        } else {
            setTestValue({ title: '', score: 0 });
            setEditingLesson(null);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при изменении урока' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const addOption = () => {
        setAnswer((prev) => [...prev, { text: '', is_correct: false, id: null }]);
    };

    const deleteOption = (index: number) => {
        setAnswer((prev) => prev.filter((_, i) => i !== index));
    };

    // update test
    const handleUpdateTest = async () => {
        const data = await updateTest(answer, editingLesson?.title || '', element.lesson_id, Number(selectId), element.type.id, element.id, 1);
        console.log(data);

        // if (data?.success) {
        //     fetchPropElement(element.id);
        //     clearValues();
        //     setMessage({
        //         state: true,
        //         value: { severity: 'success', summary: 'Ийгиликтүү өзгөртүлдү!', detail: '' }
        //     });
        // } else {
        //     // setDocValue({ title: '', description: '', file: null });
        //     setEditingLesson(null);
        //     setMessage({
        //         state: true,
        //         value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при изменении урока' }
        //     });
        //     if (data?.response?.status) {
        //         showError(data.response.status);
        //     }
        // }
    };

    // delete document
    const handleDeleteTest = async (id: number) => {
        console.log(element.lesson_id, id, element.type.id, element.id);

        const data = await deleteTest(element.lesson_id, id, element.type.id, element.id);
        console.log(data);

        if (data.success) {
            console.log(element.id);
            clearValues();
            fetchPropElement(element.id);
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өчүрүлдү!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при удалении' }
            });
            if (data.response.status) {
                showError(data.response.status);
            }
        }
    };

    const optionAddBtn = answer.length > 2 && answer[answer.length - 1].text.length < 1;
    const testSection = () => {
        return (
            <div className="py-1 sm:py-4 flex flex-col items-center gap-4">
                {contentShow ? (
                    <div className="w-full flex flex-col items-center gap-4 py-2 sm:py-4">
                        <div className="w-full flex flex-wrap gap-4">
                            {testShow ? (
                                <NotFound titleMessage={'Тест кошуу үчүн талааларды толтурунуз'} />
                            ) : (
                                test && (
                                    <LessonCard
                                        status="working"
                                        onSelected={(id: number, type: string) => selectedForEditing(id)}
                                        onDelete={(id: number) => handleDeleteTest(id)}
                                        cardValue={{ title: test?.content || '', id: Number(test!.id), desctiption: test?.description || '', type: 'test', score: test.score }}
                                        cardBg={'#ddc4f51a'}
                                        type={{ typeValue: 'test', icon: 'pi pi-doc' }}
                                        typeColor={'var(--mainColor)'}
                                        lessonDate={test.created_at && new Date(test.created_at).toISOString().slice(0, 10)}
                                        urlForPDF={() => {}}
                                        urlForDownload={''}
                                        answers={test.answers}
                                    />
                                )
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col justify-center gap-2 my-2">
                        <div className="w-[280px] sm:w-[320px] md:w-[600px] m-auto lesson-card-border flex flex-col gap-2 sm:items-center shadow rounded p-1 sm:p-2">
                            <div className="w-full flex items-center gap-1">
                                <div className="w-full">
                                    <InputTextarea
                                        id="title"
                                        placeholder={'Суроо...'}
                                        value={testValue.title}
                                        style={{ resize: 'none', width: '100%' }}
                                        onChange={(e) => {
                                            setTestValue((prev) => ({ ...prev, title: e.target.value }));
                                            setValue('title', e.target.value, { shouldValidate: true });
                                        }}
                                    />
                                    <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                                </div>
                                <div className="flex flex-col justify-center items-center">
                                    <span>Балл</span>
                                    <InputText
                                        type="number"
                                        className="w-[70px]"
                                        onChange={(e) => {
                                            setTestValue((prev) => ({ ...prev, score: Number(e.target.value) }));
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col justify-start items-start gap-2">
                                {answer.map((item, index) => {
                                    return (
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="radio"
                                                name="testRadio"
                                                onChange={() => {
                                                    setAnswer((prev) => prev.map((ans, i) => (i === index ? { ...ans, is_correct: true } : { ...ans, is_correct: false })));
                                                }}
                                            />
                                            <InputText
                                                type="text"
                                                value={item.text}
                                                className="w-[200px] sm:w-full"
                                                onChange={(e) => {
                                                    setAnswer((prev) => prev.map((ans, i) => (i === index ? { ...ans, text: e.target.value } : ans)));
                                                }}
                                            />
                                            <Button icon="pi pi-trash" onClick={() => deleteOption(index)} className="p-[0px] w-2 " style={{ fontSize: '14px' }} />
                                        </div>
                                    );
                                })}

                                <Button label="Вариант кошуу" onClick={addOption} disabled={optionAddBtn} icon="pi pi-plus" className="p-1 ml-4" style={{ fontSize: '14px' }} />
                            </div>
                        </div>
                        <div className="flex relative">
                            <div className="w-full flex gap-1 justify-center items-center">
                                <Button
                                    label="Сактоо"
                                    disabled={progressSpinner || !testValue.title.length || !!errors.title}
                                    onClick={() => {
                                        handleAddTest();
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
        console.log('ANSWER ', answer);
    }, [answer]);

    useEffect(() => {
        console.log('content', content);
        if (content) {
            setContentShow(true);
            setTests(content);
        } else {
            setContentShow(false);
        }
    }, [content]);

    useEffect(() => {
        console.log('element', element);
        setTestValue({ title: '', score: 0 });
    }, [element]);

    return (
        <div>
            <FormModal
                title={'Сабакты жаңылоо'}
                fetchValue={() => {
                    handleUpdateTest();
                }}
                clearValues={clearValues}
                visible={visible}
                setVisible={setVisisble}
                start={false}
            >
                <div className="flex flex-col gap-1">
                    <div className="w-[90%] m-auto lesson-card-border flex flex-col gap-2 sm:items-center shadow rounded p-1 sm:p-2">
                        <div className="w-full flex items-center gap-1">
                            <div className="w-full">
                                <InputTextarea
                                    id="title"
                                    placeholder={'Суроо...'}
                                    value={editingLesson?.title && editingLesson.title}
                                    style={{ resize: 'none', width: '100%' }}
                                    onChange={(e) => {
                                        setEditingLesson((prev) => prev && ({ ...prev, title: e.target.value }));
                                        setValue('title', e.target.value, { shouldValidate: true });
                                    }}
                                />
                                <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <span>Балл</span>
                                <InputText
                                    type="number"
                                    className="w-[70px]"
                                    value={String(editingLesson?.score)}
                                    onChange={(e) => {
                                        setEditingLesson((prev) => prev && ({ ...prev, score: Number(e.target.value) }));
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col justify-start items-start gap-2">
                            {answer.map((item, index) => {
                                console.log(item);
                                
                                return (
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="radio"
                                            name="testRadio"
                                            checked={item.is_correct}
                                            onChange={() => {
                                                setAnswer((prev) => prev.map((ans, i) => (i === index ? { ...ans, is_correct: true } : { ...ans, is_correct: false })));
                                            }}
                                        />
                                        <InputText
                                            type="text"
                                            value={item.text}
                                            className="w-[200px] sm:w-full"
                                            onChange={(e) => {
                                                setAnswer((prev) => prev.map((ans, i) => (i === index ? { ...ans, text: e.target.value } : ans)));
                                            }}
                                        />
                                        <Button icon="pi pi-trash" onClick={() => deleteOption(index)} className="p-[0px] w-2 " style={{ fontSize: '14px' }} />
                                    </div>
                                );
                            })}

                            <Button label="Вариант кошуу" onClick={addOption} disabled={optionAddBtn} icon="pi pi-plus" className="p-1 ml-4" style={{ fontSize: '14px' }} />
                        </div>
                    </div>
                </div>
            </FormModal>
            {!clearProp && testSection()}
        </div>
    );
}
