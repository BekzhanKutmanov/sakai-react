'use client';

import LessonInfoCard from '@/app/components/lessons/LessonInfoCard';
import StudentInfoCard from '@/app/components/lessons/StudentInfoCard';
import { mainStepsType } from '@/types/mainStepType';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useState } from 'react';

export default function Test() {
    const [hasSteps, setHasSteps] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | number[]>(0);

    const [content, setContent] = useState<mainStepsType[]>([
        {
            id: 1,
            id_parent: null,
            type_id: 1,
            user_id: 1,
            lesson_id: 1,
            step: 1,
            type: { active: true, created_at: '', id: 1, logo: 'pi pi-folder', description: null, modelName: '', name: 'document', title: 'hhi', updated_at: '' },
            updated_at: '',
            content: {
                document: '',
                document_path: '',
                description: null,
                title: 'Надо сделать: Посетить занятие resource iconКейс к практическому занятию',
                link: '',
                url: '',
                content: 'jkkkk',
                answers: [{ text: '', is_correct: false, id: null }],
                score: 1
            },
            score: 1
        }
    ]);

    return (
        <div>
            {/* <StudentInfoCard
                                                    type={'link'}
                                                    icon={'pi pi-link'}
                                                    title={'he he he baby'}
                                                    description={'hyyyyyyyyyyyy ggg rrrrrrrr ffffff'}
                                                    // documentUrl={''}
                                                    // documentUrl={{ document: i.content?.document, document_path: i.content?.document_path }}
                                                    video_link={i.content?.link}
                                                    link={'jljkljkljj;ljkj'}
                                                    test={{ content: i.content.content, answers: i.content.answers, score: i.content.score }}
                                                    // videoStart={handleVideoCall}
                                                /> */}
            {/* <StudentInfoCard
                                                    type={'video'}
                                                    icon={'pi pi-video'}
                                                    title={'he he he baby'}
                                                    description={'hyyyyyyyyyyyy ggg rrrrrrrr ffffff'}
                                                    documentUrl={{ document: i.content?.document, document_path: i.content?.document_path }}
                                                    video_link={'https://www.youtube.com/watch?v=LYigiwbaX_U&list=RDLYigiwbaX_U&start_radio=1'}
                                                    link={''}
                                                    test={{ content: i.content.content, answers: i.content.answers, score: i.content.score }}
                                                    // videoStart={handleVideoCall}
                                                /> */}
            <h3 className="text-lg pb-1 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                <span className="text-[var(--mainColor)]">Название курса:</span> {'oooo'}
            </h3>
            <Accordion activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                <AccordionTab header={'Тема: '} className="w-full p-accordion" style={{ width: '100%' }}>
                    <div className="flex flex-col gap-2">
                        {hasSteps ? (
                            <p className="text-center text-sm">Данных нет</p>
                        ) : content.length > 0 ? (
                            content.map((i, idx) => {
                                console.log(i);
                                // return ''
                                if (i.content) {
                                    return (
                                        <div className={`${idx !== 0 && idx !== content.length ? 'border-t-1 border-[gray]' : ''}`} key={i.id}>
                                            <>
                                                <StudentInfoCard
                                                    type={i.type.name}
                                                    icon={i.type.logo}
                                                    title={i.content?.title}
                                                    description={i.content?.description || 'hyyyyyyyyyyyy ggg rrrrrrrr ffffff'}
                                                    // documentUrl={{ document: '', document_path: '' }}
                                                    documentUrl={{ document: i.content?.document, document_path: i.content?.document_path }}
                                                    video_link={i.content?.link}
                                                    link={i.content?.url}
                                                    test={{ content: i.content.content, answers: i.content.answers, score: i.content.score }}
                                                    // videoStart={handleVideoCall}
                                                />
                                            </>
                                        </div>
                                    );
                                }
                            })
                        ) : (
                            <p className="text-center text-sm">Данных нет</p>
                        )}
                    </div>
                </AccordionTab>
            </Accordion>
        </div>
    );
}
