'use client';

import LessonDocument from '@/app/components/lessons/LessonDocument';
import LessonVideo from '@/app/components/lessons/LessonVideo';
import PDFViewer from '@/app/components/PDFBook';
import FormModal from '@/app/components/popUp/FormModal';
import useBreadCrumbs from '@/hooks/useBreadCrumbs';
import useErrorMessage from '@/hooks/useErrorMessage';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { lessonSchema } from '@/schemas/lessonSchema';
import { fetchLessonShow } from '@/services/courses';
import { addLesson, deleteStep, fetchElement, fetchSteps, fetchTypes } from '@/services/steps';
import { lessonStateType } from '@/types/lessonStateType';
import { mainStepsType } from '@/types/mainStepType';
import { getConfirmOptions } from '@/utils/getConfirmOptions';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function LessonStep() {
    // types
    interface editingType {
        key: string;
        file: string;
        url: string;
        link: string;
        video_type_id?: number | null;
    }

    interface videoType {
        name: string;
        status: boolean;
        id: number;
    }

    interface videoInsideType {
        id: number;
        is_link: boolean;
        short_title: string;
        title: string;
    }

    const { course_id, lesson_id } = useParams();

    const [lessonInfoState, setLessonInfoState] = useState<{ title: string; documents_count: string; usefullinks_count: string; videos_count: string } | null>(null);
    const media = useMediaQuery('(max-width: 640px)');
    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const [formVisible, setFormVisible] = useState(false);
    const [types, setTypes] = useState<{ id: number; title: string; name: string; logo: string }[]>([]);
    const [steps, setSteps] = useState<mainStepsType[]>([]);
    const [element, setElement] = useState<{ content: any | null; step: mainStepsType } | null>(null);
    const [selectedId, setSelectId] = useState<number | null>(null);
    const [hasSteps, setHasSteps] = useState(false);

    const teachingBreadCrumb = [
        {
            id: 1,
            url: '/',
            title: '',
            icon: true,
            parent_id: null
        },
        {
            id: 2,
            url: '/course',
            title: 'Курстар',
            parent_id: 1
        },
        // {
        //     id: 3,
        //     url: `/course/${''}`,
        //     title: 'Темалар',
        //     parent_id: 2
        // },
        // {
        //     id: 4,
        //     url: '/course/:course_id/:lesson_id',
        //     title: 'Сабактар',
        //     parent_id: 3
        // }
    ];

    const pathname = usePathname();
    const breadcrumb = useBreadCrumbs(teachingBreadCrumb, pathname);
    
    const clearValues = () => {};

    const handleShow = async () => {
        const data = await fetchLessonShow(lesson_id ? Number(lesson_id) : null);
        if (data?.lesson) {
            setLessonInfoState({ title: data.lesson.title, videos_count: data.lesson.videos_count, usefullinks_count: data.lesson.usefullinks_count, documents_count: data.lesson.documents_count });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Проблема с соединением. Повторите заново' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
            // skeleton = false
        }
    };

    const handleFetchTypes = async () => {
        const data = await fetchTypes();
        
        if (data && Array.isArray(data)) {
            setTypes(data);
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Катаа!', detail: 'Кийинирээк кайталаныз' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
        setFormVisible(true);
    };

    const handleFetchSteps = async () => {        
        const data = await fetchSteps(Number(lesson_id));
        
        if (data.success) {
            console.log(data.steps);

            if (data.steps.length < 1) {
                setHasSteps(true);
            } else {
                setHasSteps(false);
                setSteps(data.steps);
            }
        } else {
            setHasSteps(false);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Катаа!', detail: 'Кийинирээк кайталаныз' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleAddLesson = async (lessonId: number, typeId: number) => {
        const data = await addLesson({ lesson_id: lessonId, type_id: typeId });
        if (data.success) {
            handleFetchSteps();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү кошулду!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Катаа!', detail: 'Кийинирээк кайталаныз' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
        setFormVisible(false);
    };

    const handleFetchElement = async (stepId: number) => {
        const data = await fetchElement(Number(lesson_id), stepId);
        if (data.success) {
            setElement({ content: data.content, step: data.step });
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

    const handleDeleteStep = async () => {
        const data = await deleteStep(Number(lesson_id), Number(selectedId));
        console.log(data);

        if (data.success) {
            handleFetchSteps();
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

    const lessonInfo = (
        <div>
            <div className="bg-[var(--titleColor)] relative flex flex-col justify-center items-center w-full text-white p-4 md:p-3 pb-4">
                <div>
                    <h1 style={{ color: 'white', fontSize: media ? '24px' : '28px', textAlign: 'center' }}>{lessonInfoState?.title}</h1>
                    <div className="w-full">{breadcrumb}</div>
                </div>
            </div>
        </div>
    );

    const step = (icon: string, step: number) => (
        <div
            className="cursor-pointer"
            onClick={() => {
                setSelectId(step);
                handleFetchElement(step);
            }}
        >
            <div className={`w-[40px] h-[40px] sm:w-[57px] sm:h-[57px] rounded ${step === selectedId ? 'activeStep' : 'step'} flex justify-center items-center`}>
                <i className={`${icon} text-xl sm:text-2xl text-white`}></i>
            </div>
        </div>
    );

    useEffect(() => {
        if (Array.isArray(steps) && steps.length > 0) {
            const firstStep = steps[0]?.id;
            setSelectId(steps[0]?.id);
            handleFetchElement(firstStep);
        }
    }, [steps]);

    useEffect(() => {
        handleShow();
        handleFetchSteps();
        // handleAddLesson(lesson_id, );
    }, []);

    useEffect(() => {
        console.log('element', element);
    }, [element]);

    return (
        <div className="main-bg">
            {/* modal sectoin */}
            <Dialog
                header={'Кадамдын тибин тандаңыз'}
                visible={formVisible}
                className="my-custom-dialog"
                onHide={() => {
                    if (!formVisible) return;
                    setFormVisible(false);
                    clearValues();
                }}
                // footer={footerContent}
            >
                <div className="w-full step-type-grid">
                    {types.map((item) => {
                        console.log(item);
                        const iconClass = item.name === 'link' ? 'pi pi-link' : item.name === 'video' ? 'pi pi-video' : item.name === 'document' ? 'pi pi-folder' : '';

                        return (
                            <div>
                                <div className="flex-1 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)] flex gap-1 items-center">
                                    <i className={`${iconClass}`}></i>
                                    <b className="cursor-pointer" onClick={() => handleAddLesson(Number(lesson_id), item.id)}>
                                        {item.title}
                                    </b>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Dialog>

            {/* info section */}
            {lessonInfo}

            {/* steps section */}
            <div className="flex gap-2 mt-4">
                {hasSteps ? (
                    <div className='flex items-center gap-4'>
                        <h3>Азырынча кадамдар жок</h3>
                        <div onClick={handleFetchTypes} className="cursor-pointer w-[40px] h-[40px] sm:w-[57px] sm:h-[57px] rounded animate-step"></div>
                    </div>
                ) : (
                    <div className="flex gap-2 max-w-[550px] sm:max-w-[800px] overflow-x-scroll">
                        {steps.map((item, idx) => {
                            return (
                                <div key={item.id} className="flex flex-col items-center">
                                    {step(item.type.logo, item.id)}
                                </div>
                            );
                        })}
                    </div>
                )}
                <button
                    onClick={handleFetchTypes}
                    className="cursor-pointer min-w-[40px] min-h-[40px] w-[40px] h-[40px] sm:w-[57px] sm:h-[57px] border rounded flex justify-center items-center text-4xl text-white bg-[var(--mainColor)] hover:bg-[var(--mainBorder)] transition"
                >
                    +
                </button>
                <Button
                    icon={'pi pi-trash'}
                    className="min-w-[40px] min-h-[40px] w-[40px] h-[40px] sm:w-[57px] sm:h-[57px] hover:bg-[var(--mainBorder)] transition"
                    onClick={() => {
                        const options = getConfirmOptions(Number(), () => handleDeleteStep());
                        confirmDialog(options);
                    }}
                />
            </div>

            {/* {lessonDisplay} */}
            {element?.step.type.name === 'document' && <LessonDocument element={element?.step} content={element?.content} fetchPropElement={handleFetchElement} deleteElement={() => {}} />}
            {element?.step.type.name === 'video' && <LessonVideo element={element?.step} content={element?.content} fetchPropElement={handleFetchElement} deleteElement={() => {}} />}
        </div>
    );
}
