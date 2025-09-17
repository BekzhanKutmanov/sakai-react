'use client';

import LessonDocument from '@/app/components/lessons/LessonDocument';
import LessonLink from '@/app/components/lessons/LessonLink';
import LessonPractica from '@/app/components/lessons/LessonPractica';
import LessonTest from '@/app/components/lessons/LessonTest';
import LessonVideo from '@/app/components/lessons/LessonVideo';
import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { deleteLesson, fetchLessonShow } from '@/services/courses';
import { addLesson, deleteStep, fetchElement, fetchSteps, fetchTypes } from '@/services/steps';
import { lessonStateType } from '@/types/lessonStateType';
import { mainStepsType } from '@/types/mainStepType';
import { getConfirmOptions } from '@/utils/getConfirmOptions';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { useContext, useEffect, useRef, useState } from 'react';

export default function LessonStep() {
    const param = useParams();
    const course_id = param.course_Id;
    const scrollRef = useRef<HTMLDivElement>(null);

    const [lessonInfoState, setLessonInfoState] = useState<{ title: string; documents_count: string; usefullinks_count: string; videos_count: string } | null>(null);
    const media = useMediaQuery('(max-width: 640px)');
    const { setMessage, contextFetchThemes, contextThemes, setContextThemes, setDeleteQuery, deleteQuery, updateQuery, setUpdateeQuery } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const [formVisible, setFormVisible] = useState(false);
    const [types, setTypes] = useState<{ id: number; title: string; name: string; logo: string }[]>([]);
    const [steps, setSteps] = useState<mainStepsType[]>([]);
    const [element, setElement] = useState<{ content: any | null; step: mainStepsType } | null>(null);
    const [selectedId, setSelectId] = useState<number | null>(null);
    const [hasSteps, setHasSteps] = useState(false);
    const [themeNull, setThemeNull] = useState(false);
    // const [lesson_id, setLesson_id] = useState<number | null>(null);
    const [lesson_id, setLesson_id] = useState<number | null>(null);
    const [sequence_number, setSequence_number] = useState<number | null>(null);
    const [skeleton, setSkeleton] = useState(false);
    const [testovy, setTestovy] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const changeUrl = (lessonId: number | null) => {
        router.replace(`/course/${course_id}/${lessonId ? lessonId : null}`);
    };

    const handleShow = async (LessonId: number | null) => {
        const data = await fetchLessonShow(LessonId);

        if (data?.lesson) {
            setLessonInfoState({ title: data.lesson.title, videos_count: data.lesson.videos_count, usefullinks_count: data.lesson.usefullinks_count, documents_count: data.lesson.documents_count });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Катаа!', detail: 'Кийинчерээк кайталаныз' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
            // skeleton = false
        }
    };

    const handleFetchTypes = async () => {
        setFormVisible(true);
        setSkeleton(true);
        const data = await fetchTypes();
        if (data && Array.isArray(data)) {
            setTypes(data);
            setSkeleton(false);
        } else {
            setSkeleton(false);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Катаа!', detail: 'Кийинчерээк кайталаныз' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleFetchSteps = async (lesson_id: number | null) => {
        setSkeleton(true);
        const data = await fetchSteps(Number(lesson_id));
        console.log('steps', data);

        if (data.success) {
            setSkeleton(false);
            if (data.steps.length < 1) {
                setHasSteps(true);
            } else {
                setHasSteps(false);
                setSteps(data.steps);
            }
        } else {
            setSkeleton(false);
            setHasSteps(false);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Катаа!', detail: 'Кийинчерээк кайталаныз' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleAddLesson = async (lessonId: number, typeId: number) => {
        setFormVisible(false);
        const data = await addLesson({ lesson_id: lessonId, type_id: typeId }, sequence_number);
        console.log(data);

        if (data.success) {
            handleFetchSteps(lessonId);
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү кошулду!', detail: '' }
            });
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

    const handleFetchElement = async (stepId: number) => {
        if (lesson_id) {
            const data = await fetchElement(Number(lesson_id), stepId);
            if (data.success) {
                setElement({ content: data.content, step: data.step });
            } else {
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Катаа!', detail: 'Кийинчерээк кайталаныз' }
                });
                if (data?.response?.status) {
                    showError(data.response.status);
                }
            }
        }
    };

    const handleDeleteStep = async () => {
        const data = await deleteStep(Number(lesson_id), Number(selectedId));
        if (data.success) {
            handleFetchSteps(Number(lesson_id));
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

    useEffect(() => {
        if (Array.isArray(steps) && steps.length > 0) {
            const firstStep = steps[0]?.id;
            // const firstStep = steps[steps.length - 1]?.id;
            setSelectId(firstStep);
            handleFetchElement(firstStep);
        }
    }, [steps]);

    useEffect(() => {
        if (lesson_id) {
            console.warn('LESSONID ', lesson_id);
            handleShow(lesson_id);
            changeUrl(lesson_id);
        }
    }, [lesson_id]);

    useEffect(() => {
        setTestovy(true);
        console.log('course-id', course_id);

        contextFetchThemes(Number(course_id), null);
    }, [course_id]);

    // useEffect(() => {
    //     console.log('Тема ', contextThemes, lesson_id);
    //     if (testovy || updateQuery || deleteQuery) {
    //         setTestovy(false);
    //         setUpdateeQuery(false);
    //         if (contextThemes?.lessons?.data?.length > 0) {
    //             setThemeNull(false);
    //             if (param.lesson_id == 'null' || deleteQuery) {
    //                 console.log(contextThemes.lessons.data[0].id);

    //                 handleShow(contextThemes.lessons.data[0].id);
    //                 console.log('variant 4', contextThemes.lessons.data[0].id);
    //                 handleFetchSteps(contextThemes.lessons.data[0].id);
    //                 setLesson_id(contextThemes.lessons.data[0].id);
    //                 setDeleteQuery(false);
    //             } else {
    //                 console.log('variant 5');
    //                 handleShow(Number(param.lesson_id));
    //                 setLesson_id((param.lesson_id && Number(param.lesson_id)) || null);
    //                 handleFetchSteps(Number(param.lesson_id));
    //             }
    //         } else {
    //             setThemeNull(true);
    //             console.log('variant 3');
    //         }
    //     }
    // }, [contextThemes]);

    // useEffect(() => {
    //     if (!contextThemes?.lessons?.data) return;

    //     const lessons = contextThemes.lessons.data;

    //     if (lessons.length > 0) {
    //         setThemeNull(false);
    //         console.warn(lessons, deleteQuery);
    //         let chosenId: number | null = null;

    //         if (param.lesson_id === 'null' || deleteQuery) {
    //             console.log('var 1');
    //             // alert(1);

    //             chosenId = lessons[0].id;
    //             setDeleteQuery(false);
    //         } else {
    //             console.log('var 2');
    //             // alert(2);
    //             chosenId = param.lesson_id ? Number(param.lesson_id) : lessons[0].id;
    //         }
    //         // alert(chosenId);
    //         setLesson_id(chosenId);
    //     } else {
    //         setThemeNull(true);
    //     }

    //     setTestovy(false);
    //     setUpdateeQuery(false);
    // }, [contextThemes, deleteQuery, param.lesson_id]);

    // useEffect(() => {
    //     console.warn('LESSONID ', lesson_id);
    //     if (!lesson_id) return;

    //     handleShow(lesson_id);
    //     handleFetchSteps(lesson_id);
    //     changeUrl(lesson_id);
    // }, [lesson_id]);

    useEffect(() => {
        console.warn(contextThemes, contextThemes.length);
        
        if (contextThemes?.length < 1 || !contextThemes?.lessons?.data) {
            setThemeNull(true);
            return;
        } else {
            setThemeNull(false);
        }

        const lessons = contextThemes.lessons.data;
        if (lessons.length < 1) {
            setThemeNull(true);
        } else {
            setThemeNull(false);
        }
        
        let chosenId: number | null = null;
        if(lessons.length > 0) { 
            setThemeNull(false);
            if (param.lesson_id && param.lesson_id !== 'null') {
                const urlId = Number(param.lesson_id);
                const exists = lessons.some((l:{id: number}) => l.id === urlId);
                chosenId = exists ? urlId : lessons[0].id;
            } else {
                chosenId = lessons[0].id;
            }
    
            if (lesson_id !== chosenId) {
                setLesson_id(chosenId);
            }
        } else {
            setThemeNull(true);
        }
    }, [contextThemes, deleteQuery, param.lesson_id]);
    
    useEffect(() => {
        if (lesson_id && param.lesson_id !== String(lesson_id)) {
            changeUrl(lesson_id);
        }
        if (lesson_id) {
            handleFetchSteps(lesson_id);
            handleShow(lesson_id);
        }
    }, [lesson_id]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const onWheel = (e: WheelEvent) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                el.scrollLeft += e.deltaY; // прокрутка по горизонтали
            }
        };

        el.addEventListener('wheel', onWheel, { passive: false });
        return () => {
            el.removeEventListener('wheel', onWheel);
            setLesson_id(null);
            setContextThemes([]);
        };
    }, []);

    const lessonInfo = (
        <div>
            <div className="bg-[var(--titleColor)] relative flex flex-col justify-center items-center w-full text-white p-4 md:p-3 pb-4">
                <h1 style={{ color: 'white', fontSize: media ? '24px' : '28px', textAlign: 'center' }}>{lessonInfoState?.title}</h1>
            </div>
        </div>
    );

    const step = (icon: string, step: number, idx: number) => {
        return (
            <div
                className="cursor-pointer flex flex-col items-center"
                onClick={() => {
                    setSelectId(step);
                    handleFetchElement(step);
                }}
            >
                <span>{idx + 1}</span>
                <div className={`w-[40px] h-[40px] sm:w-[57px] sm:h-[57px] rounded ${step === selectedId ? 'activeStep' : 'step'} flex justify-center items-center`}>
                    <i className={`${icon} text-xl sm:text-2xl text-white`}></i>
                </div>
            </div>
        );
    };

    if (themeNull) {
        return (
            <div>
                <NotFound titleMessage="Тема жок. Курска тема кошуңуз" />
            </div>
        );
    }

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
                }}
            >
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col items-center">
                        <span>Позиция:</span>
                        <InputText
                            type="number"
                            // value={}
                            className="w-[90%]"
                            onChange={(e) => {
                                setSequence_number(Number(e.target.value));
                            }}
                        />
                    </div>
                    {skeleton ? (
                        <GroupSkeleton count={1} size={{ width: '100%', height: '5rem' }} />
                    ) : (
                        <div className="w-full step-type-grid mt-1">
                            {types.map((item) => {
                                return (
                                    <React.Fragment key={item.id}>
                                        <div className="flex-1 p-1 shadow flex gap-1 items-center">
                                            <i className={`${item.logo}`}></i>
                                            <b className="cursor-pointer" onClick={() => handleAddLesson(Number(lesson_id), item.id)}>
                                                {item.title}
                                            </b>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    )}
                </div>
            </Dialog>

            {/* info section */}
            {lessonInfo}

            {/* steps section */}
            <div className="flex gap-2 mt-4 items-end">
                {hasSteps ? (
                    <div className="flex items-center gap-4">
                        <div onClick={handleFetchTypes} className="cursor-pointer w-[40px] h-[40px] sm:w-[57px] sm:h-[57px] rounded animate-step"></div>
                    </div>
                ) : (
                    <div ref={scrollRef} className="flex gap-2 max-w-[550px] sm:max-w-[800px] overflow-x-auto scrollbar-thin right-shadow">
                        {skeleton ? (
                            <div className="w-[700px]">
                                <GroupSkeleton count={1} size={{ width: '100%', height: '3rem' }} />
                            </div>
                        ) : (
                            steps.map((item, idx) => {
                                return (
                                    <div key={item.id} className="flex flex-col items-center">
                                        {step(item.type.logo, item.id, idx)}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleFetchTypes}
                        className="cursor-pointer min-w-[40px] min-h-[40px] w-[40px] h-[40px] sm:w-[57px] sm:h-[57px] border rounded flex justify-center items-center text-4xl text-white bg-[var(--mainColor)] hover:bg-[var(--mainBorder)] transition"
                    >
                        +
                    </button>
                </div>
            </div>

            {hasSteps && (
                <div>
                    <NotFound titleMessage="Азырынча кадамдар жок" />
                </div>
            )}
            <div className="max-w-[500px] m-auto shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)] mt-3 pb-1 flex items-center justify-between flex-col sm:flex-row gap-1">
                {!hasSteps && <b className="sm:text-[18px]">{element?.step.type.title}</b>}
                {!hasSteps && (
                    <Button
                        icon={'pi pi-trash'}
                        label="Кадамды өчүрүү"
                        className=" hover:bg-[var(--mainBorder)] transition"
                        onClick={() => {
                            const options = getConfirmOptions(Number(), () => handleDeleteStep());
                            confirmDialog(options);
                        }}
                    />
                )}
            </div>
            {element?.step.type.name === 'document' && <LessonDocument element={element?.step} content={element?.content} fetchPropElement={handleFetchElement} clearProp={hasSteps} />}
            {element?.step.type.name === 'video' && <LessonVideo element={element?.step} content={element?.content} fetchPropElement={handleFetchElement} clearProp={hasSteps} />}
            {element?.step.type.name === 'test' && <LessonTest element={element?.step} content={element?.content} fetchPropElement={handleFetchElement} clearProp={hasSteps} />}
            {element?.step.type.name === 'practical' && <LessonPractica element={element?.step} content={element?.content} fetchPropElement={handleFetchElement} clearProp={hasSteps} />}
            {element?.step.type.name === 'link' && <LessonLink element={element?.step} content={element?.content} fetchPropElement={handleFetchElement} clearProp={hasSteps} />}
        </div>
    );
}
