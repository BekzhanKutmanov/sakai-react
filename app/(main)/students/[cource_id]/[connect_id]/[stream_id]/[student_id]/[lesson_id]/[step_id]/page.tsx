'use client';

import ActivityPage from '@/app/components/Contribution';
import LessonInfoCard from '@/app/components/lessons/LessonInfoCard';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { statusView } from '@/services/notifications';
import { fetchElement } from '@/services/steps';
import { fetchStudentCalendar, fetchStudentDetail, pacticaScoreAdd } from '@/services/streams';
import { ContributionDay } from '@/types/ContributionDay';
import { lessonType } from '@/types/lessonType';
import { mainStepsType } from '@/types/mainStepType';
import { studentType } from '@/types/studentType';
import { useParams } from 'next/navigation';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useContext, useEffect, useState } from 'react';

export default function StudentCheck() {
    // type
    interface mainStep {}

    const { connect_id, stream_id, student_id, lesson_id, step_id } = useParams();
    const params = useParams();
    console.log(params);

    const { setMessage, contextNotificationId, setContextNotificationId } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const [mainSkeleton, mainSetSkeleton] = useState(false);
    const [lessons, setLessons] = useState<lessonType[] | null>(null);
    const [student, setStudent] = useState<studentType | null>(null);
    const [hasSteps, setHasSteps] = useState(false);
    const [element, setElement] = useState<{ content: any | null; step: mainStepsType } | null>(null);
    const [contribution, setContribution] = useState<ContributionDay[] | null>(null);
    const [skeleton, setSkeleton] = useState(false);

    const [activeIndex, setActiveIndex] = useState<number | number[]>(0);

    const handleFetchStreams = async () => {
        mainSetSkeleton(true);
        const data = await fetchStudentDetail(lesson_id ? Number(lesson_id) : null, connect_id ? Number(connect_id) : null, stream_id ? Number(stream_id) : null, student_id ? Number(student_id) : null, step_id ? Number(step_id) : null);
        console.log(data);

        if (data?.success) {
            // handleStatusView();
            setHasSteps(false);
            mainSetSkeleton(false);
            setStudent(data?.student);
            setLessons(data?.lessons);
        } else {
            mainSetSkeleton(false);
            setHasSteps(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleStatusView = async (notification_id: number | null) => {
        if (notification_id) {
            const data = await statusView(Number(notification_id));
            console.log(data);
            
            setContextNotificationId(null);
        }
    };

    const handleFetchElement = async (lesson_id: number, stepId: number) => {
        if (lesson_id) {
            setSkeleton(true);
            const data = await fetchElement(Number(lesson_id), stepId);
            if (data.success) {
                setSkeleton(false);
                setElement({ content: data.content, step: data.step });
            } else {
                setSkeleton(false);
                setMessage({
                    state: true,
                    value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
                });
                if (data?.response?.status) {
                    showError(data.response.status);
                }
            }
        }
    };

    const handleFetchCalendar = async () => {
        mainSetSkeleton(true);
        const data = await fetchStudentCalendar(connect_id ? Number(connect_id) : null, stream_id ? Number(stream_id) : null, student_id ? Number(student_id) : null);

        if (data && Array.isArray(data)) {
            setContribution(data);
            // setHasInfo(false);
            // mainSetSkeleton(false);
            // setStudent(data?.student);
            // setLessons(data?.lessons);
        } else {
            // mainSetSkeleton(false);
            // setHasInfo(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handlePracticaScoreAdd = async (stepId: number, score: number) => {
        const data = await pacticaScoreAdd(connect_id ? Number(connect_id) : null, stream_id ? Number(stream_id) : null, student_id ? Number(student_id) : null, stepId, score);

        if (data?.success) {
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно добавлен!', detail: '' }
            });
            handleFetchStreams();
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при добавлении!', detail: '' }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
    };

    useEffect(() => {
        handleFetchCalendar();
        handleFetchStreams();

        if (contextNotificationId && contextNotificationId != null) {
            handleStatusView(contextNotificationId);
        }
    }, []);

    useEffect(()=> {
        if(lessons && lessons?.length) {
            lessons.forEach((item, idx)=> {
                if(item?.is_opened){
                    setActiveIndex(idx);
                    console.warn('опен есть ',idx )
                    return null;
                } else {
                    console.warn('опен нет');
                }
            });
        }
    },[lessons]);

    return (
        <div className="main-bg">
            {mainSkeleton ? (
                <div className="w-full">
                    <GroupSkeleton count={1} size={{ width: '100%', height: '5rem' }} /> <GroupSkeleton count={1} size={{ width: '100%', height: '10rem' }} />
                </div>
            ) : (
                <div>
                    <ActivityPage value={contribution} />
                    <h3 className="text-lg pb-1 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">{/* <span className="text-[var(--mainColor)]">Название курса:</span> {courseInfo.title} */}</h3>
                    <Accordion activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                        {lessons?.map((item) => {
                            const content = item?.steps?.filter((j) => {
                                return j?.id_parent != null;
                            });

                            return (
                                <AccordionTab header={'Тема: ' + item.title} key={item.id} className="w-full p-accordion" style={{ width: '100%' }}>
                                    <div className="flex flex-col gap-2">
                                        {content?.length < 1 || hasSteps ? (
                                            <p className="text-center text-sm">Данных нет</p>
                                        ) : (
                                            content?.map((i, idx) => {
                                                if (i.id_parent) {
                                                    return (
                                                        <div className={`${idx !== 0 && idx !== content?.length ? 'border-t-1 border-[gray]' : ''}`} key={i.id}>
                                                            {
                                                                <LessonInfoCard
                                                                    contentType={'check'}
                                                                    totalScore={i?.score}
                                                                    type={i.type.name}
                                                                    icon={i.type.logo}
                                                                    title={element?.content?.title}
                                                                    checkTitle={i?.type?.title}
                                                                    description={element?.content?.description || ''}
                                                                    documentUrl={{ document: element?.content?.document, document_path: element?.content?.document_path }}
                                                                    video_link={element?.content?.link}
                                                                    link={element?.content?.url}
                                                                    test={{ content: element?.content.content, answers: element?.content.answers, score: element?.content.score }}
                                                                    answerList={i?.ListAnswer}
                                                                    videoStart={() => {}}
                                                                    skeleton={skeleton}
                                                                    getValues={() => handleFetchElement(i?.lesson_id, i?.id)}
                                                                    addPracticaScore={(score) => handlePracticaScoreAdd(i?.id, score)}
                                                                    isOpened={i?.is_opened || false}
                                                                    item={i}
                                                                />
                                                            }
                                                        </div>
                                                    );
                                                }
                                            })
                                        )}
                                    </div>
                                </AccordionTab>
                            );
                        })}
                    </Accordion>
                </div>
            )}
        </div>
    );
}
