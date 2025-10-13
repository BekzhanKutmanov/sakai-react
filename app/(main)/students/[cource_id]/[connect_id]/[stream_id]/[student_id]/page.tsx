'use client';

import LessonInfoCard from '@/app/components/lessons/LessonInfoCard';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchElement } from '@/services/steps';
import { fetchStudentDetail } from '@/services/streams';
import { lessonType } from '@/types/lessonType';
import { mainStepsType } from '@/types/mainStepType';
import { studentType } from '@/types/studentType';
import { useParams } from 'next/navigation';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useContext, useEffect, useState } from 'react';

export default function StudentCheck() {
    // type
    interface mainStep {}

    const { connect_id, stream_id, student_id } = useParams();
    console.log(connect_id, stream_id, student_id);

    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const [hasInfo, setHasInfo] = useState(false);
    const [mainSkeleton, mainSetSkeleton] = useState(false);
    const [lessons, setLessons] = useState<lessonType[] | null>(null);
    const [student, setStudent] = useState<studentType | null>(null);
    const [stepsList, setStepList] = useState(false);
    const [hasSteps, setHasSteps] = useState(false);
    const [element, setElement] = useState<{ content: any | null; step: mainStepsType } | null>(null);

    const [activeIndex, setActiveIndex] = useState<number | number[]>(0);

    const handleFetchStreams = async () => {
        mainSetSkeleton(true);
        const data = await fetchStudentDetail(connect_id ? Number(connect_id) : null, stream_id ? Number(stream_id) : null, student_id ? Number(student_id) : null);

        console.log(data);

        if (data?.success) {
            setHasInfo(false);
            mainSetSkeleton(false);
            setStudent(data?.student);
            setLessons(data?.lessons);
        } else {
            mainSetSkeleton(false);
            setHasInfo(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleFetchElement = async (lesson_id: number, stepId: number) => {
        if (lesson_id) {
            // setSkeleton(true);
            const data = await fetchElement(Number(lesson_id), stepId);
            console.log(data);
            
            if (data.success) {
                // setSkeleton(false);
                setElement({ content: data.content, step: data.step });
            } else {
                // setSkeleton(false);
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

    useEffect(() => {
        handleFetchStreams();
    }, []);

    return (
        <div className="main-bg">
            {mainSkeleton ? (
                <div className="w-full">
                    <GroupSkeleton count={1} size={{ width: '100%', height: '5rem' }} /> <GroupSkeleton count={1} size={{ width: '100%', height: '10rem' }} />
                </div>
            ) : (
                <div>
                    <h3 className="text-lg pb-1 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">{/* <span className="text-[var(--mainColor)]">Название курса:</span> {courseInfo.title} */}</h3>
                    <Accordion activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                        {lessons?.map((item) => {
                            const content = item?.steps?.filter((j) => {
                                return j?.id_parent != null;
                            });

                            console.log(content);

                            return (
                                <AccordionTab header={'Тема: ' + item.title} key={item.id} className="w-full p-accordion" style={{ width: '100%' }}>
                                    <div className="flex flex-col gap-2">
                                        {hasSteps ? (
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
                                                                    title={
                                                                        i.type.name === 'document' || i.type.name === 'video' || i.type.name === 'link' ? 
                                                                          i?.type?.title  
                                                                        : element?.content?.title
                                                                    } 
                                                                    description={element?.content?.description || ''}
                                                                    documentUrl={{ document: element?.content?.document, document_path: element?.content?.document_path }}
                                                                    video_link={i.content?.link}
                                                                    link={element?.content?.url}
                                                                    test={{ content: element?.content.content, answers: element?.content.answers, score: element?.content.score }}
                                                                    answerList={i?.ListAnswer}
                                                                    // videoStart={handleVideoCall}
                                                                    getValues={() => handleFetchElement(i?.lesson_id, i?.id)}
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
