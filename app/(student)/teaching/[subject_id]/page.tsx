'use client';

import LessonInfoCard from '@/app/components/lessons/LessonInfoCard';
import StudentInfoCard from '@/app/components/lessons/StudentInfoCard';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchItemsLessons, fetchMainLesson, fetchSubjects } from '@/services/studentMain';
import { lessonType } from '@/types/lessonType';
import { useParams } from 'next/navigation';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dropdown } from 'primereact/dropdown';
import { useContext, useEffect, useState } from 'react';

export default function StudentLesson() {
    // types
    interface subjectType {
        id_curricula: number;
        course_ids: number[];
        streams: number[];
    }

    interface sortOptType {
        name: string;
        code: number;
        user_id?: number | null;
    }

    const { subject_id } = useParams();
    const params = new URLSearchParams();

    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const [main_id, setMain_id] = useState<predmetType | null>(null);

    const [steps, setMainSteps] = useState([]);
    const [hasSteps, setHasSteps] = useState(false);

    const [skeleton, setSkeleton] = useState(false);
    const [hasLessons, setHasLessons] = useState(false);
    const [lessons, setLessons] = useState<Record<number, { semester: { name_kg: string } } | predmetType>>({
        1: { semester: { name_kg: '' } }
    });
    const [courses, setCourses] = useState<
        { id: number; connections: { subject_type: string; id: number; user_id: number | null; id_stream: number }[]; title: string; description: string; user: { last_name: string; name: string; father_name: string }; lessons: lessonType[] }[]
    >([]);
    const [selectedSort, setSelectedSort] = useState({ name: 'Все', code: 0 });
    const [sortOpt, setSortOpt] = useState<sortOptType[]>();
    const [hasThemes, setHasThemes] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | number[]>(0);

    const toggleSortSelect = (e: sortOptType) => {
        setSelectedSort(e);
    };

    // fetch lessons
    const handleFetchLessons = async () => {
        const data = await fetchItemsLessons();
        setSkeleton(true);
        if (data) {
            // валидность проверить
            console.log(data);
            setLessons(data);
            setHasLessons(false);
            setSkeleton(false);
        } else {
            setHasLessons(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
            setSkeleton(false);
        }
    };

    // Запрос курса, типа уроков (лк,лб)
    const handleFetchSubject = async (subject: subjectType) => {
        params.append('id_curricula', String(subject.id_curricula));
        subject.streams.forEach((i) => params.append('streams[]', String(i)));
        subject.course_ids.forEach((i) => params.append('course_ids[]', String(i)));

        const data = await fetchSubjects(params);
        console.log(data);

        setSkeleton(true);
        if (data) {
            setCourses(data);
            setHasThemes(false);
            setSkeleton(false);
        } else {
            setHasThemes(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
            setSkeleton(false);
        }
    };

    const handleMainLesson = async (lesson_id: number, stream_id: number) => {
        const data = await fetchMainLesson(lesson_id, stream_id);
        console.log(data);
        
        if (data) {
            if (data.length > 0) {
                setHasSteps(false);
                setMainSteps(data);
            } else {
                setHasSteps(true);
            }
        } else {
            setHasSteps(true);
        }
    };

    // НАХОДИМ ПО ИД КРУКЛА НУЖНЫЙ ЭЛЕМЕНТ МАССИВА И ПРИСВАИВАЕМ В main_id ОБЪЕКТ

    // Просим предметы для получения конкретного из них
    useEffect(() => {
        handleFetchLessons();
    }, []);

    // Из предметов получаю выбранный курс в main_id
    useEffect(() => {
        const lessonArray = Object.values(lessons);
        // console.log(lessonArray)
        let search_id: predmetType | null = null;
        if (lessonArray && Array.isArray(lessonArray)) {
            for (let i = 0; i < lessonArray.length; i++) {
                const lessonItemArray = Object.values(lessonArray[i]);
                // console.log(lessonItemArray);

                search_id = lessonItemArray.find((item: any) => item.id_curricula == subject_id);
                if (search_id && search_id != null) {
                    break;
                }
            }
            if (search_id) {
                setMain_id(search_id);
            }
        }
    }, [lessons]);

    // НАХОДИМ ПО ИД КРУКЛА НУЖНЫЙ ЭЛЕМЕНТ МАССИВА И ПРИСВАИВАЕМ В main_id ОБЪЕКТ

    useEffect(() => {
        console.log('Главный курс ', main_id);

        if (main_id && main_id != null) {
            const forSubject: subjectType = { id_curricula: main_id?.id_curricula, course_ids: main_id?.course_ids, streams: main_id?.streams.map((i: { id: number }) => i.id) };
            handleFetchSubject(forSubject);
        }
    }, [main_id]);

    useEffect(() => {
        console.log(courses);

        let forDropdown: sortOptType[] = [{ name: 'Все', code: 0 }];
        courses[0]?.connections.forEach((element) => {
            forDropdown.push({
                name: element.subject_type,
                code: element.id,
                user_id: element.user_id
            });
        });

        setSortOpt(forDropdown);
        if (courses.length > 0) {
            const index = typeof activeIndex === 'number' ? Number(activeIndex) : 0;
            if (courses[0].connections.length > 0 && courses[0].lessons.length > 0) {
                const lesson_id = courses[0].lessons[index].id;
                const stream_id = courses[0].connections[index].id_stream;
                console.log(lesson_id, stream_id);

                handleMainLesson(lesson_id, stream_id);
            } else {
                // ?
            }
        } else {
            // ?
        }
    }, [courses, activeIndex]);

    // useEffect(() => {
    //     console.log('Лоакльные темы ', themes);

    //     if (themes.length > 0 && [activeIndex as number]) {
    //         console.log('active index ', activeIndex);

    //         const lessonId = themes[activeIndex as number]?.id;
    //         if (lessonId) {
    //             handleFetchSteps(lessonId);
    //         }
    //     }
    // }, [themes, activeIndex]);

    const courseInfoClass = true;

    return (
        <div className="main-bg">
            {/* <Dropdown
                    value={selectedSort}
                    onChange={(e) => {
                        toggleSortSelect(e.value);
                    }}
                    options={sortOpt}
                    optionLabel="name"
                    placeholder=""
                    className="w-[213px] md:w-14rem"
                /> */}
            {courses.map((course) => {
                return (
                    <div key={course.id} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <h3 className="m-0 text-lg shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                                <span className="text-[var(--mainColor)]">Название курса:</span> {course?.title}
                            </h3>
                        </div>
                        <div>
                            <h3 className="">
                                {/* <span className="text-[var(--mainColor)]">Преподаватель:</span> */}
                                 {course?.user.last_name} {course?.user.name}
                            </h3>
                            <Accordion activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                                {course.lessons.map((lesson, idx) => {
                                    return (
                                        <AccordionTab header={'Тема: ' + lesson.title} key={lesson.id} className="w-full p-accordion" style={{ width: '100%' }}>
                                            <div className="flex flex-col gap-2">
                                                {hasThemes ? (
                                                    <p className="text-center text-sm">Данных нет</p>
                                                ) : (
                                                    <div key={lesson.id}>
                                                        {hasSteps ? <p className="text-center text-sm">Данных нет</p>
                                                            : steps.map((item: {id: number, type: {name:string; logo:string}, content: {title: string}}, idx) => {
                                                            return (
                                                                <div key={item.id} className={`${
                                                                    idx > 0 ? 
                                                                        'my-border-top'
                                                                        : ''
                                                                }`}>
                                                                    <StudentInfoCard
                                                                        type={item.type.name}
                                                                        icon={item.type.logo}
                                                                        title={item.content?.title}
                                                                        // description={item.content?.description || ''}
                                                                        // documentUrl={{ document: item.content?.document, document_path: item.content?.document_path }}
                                                                        // video_link={item.content?.link}
                                                                        // link={item.content?.url}
                                                                        // test={{ content: item.content.content, answers: item.content.answers, score: item.content.score }}

                                                                        stepId={item.id}
                                                                        streams={course}
                                                                        lesson={lesson.id}
                                                                    />
                                                                </div>
                                                            );
                                                        })}

                                                        {/* {
                                                        <LessonInfoCard
                                                            type={i.type.name}
                                                            icon={i.type.logo}
                                                            title={i.content?.title}
                                                            description={i.content?.description || ''}
                                                            documentUrl={{ document: i.content?.document, document_path: i.content?.document_path }}
                                                            video_link={i.content?.link}
                                                            link={i.content?.url}
                                                            test={{ content: i.content.content, answers: i.content.answers, score: i.content.score }}
                                                            videoStart={handleVideoCall}
                                                        />
                                                    } */}
                                                    </div>
                                                )}
                                            </div>
                                        </AccordionTab>
                                    );
                                })}
                            </Accordion>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
