'use client';

import LessonInfoCard from '@/app/components/lessons/LessonInfoCard';
import StudentInfoCard from '@/app/components/lessons/StudentInfoCard';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchItemsLessons, fetchMainLesson, fetchSubjects } from '@/services/studentMain';
import { lessonType } from '@/types/lessonType';
import { useParams } from 'next/navigation';
import { Accordion, AccordionTab, AccordionTabChangeEvent } from 'primereact/accordion';
import { ProgressSpinner } from 'primereact/progressspinner';
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
    const [activeAccordion, setActiveAccordion] = useState<number>(0);
    const [activeIndex, setActiveIndex] = useState<number | number[]>(0);

    const [activeIndexes, setActiveIndexes] = useState<Record<number, number | null>>({});
    const [isLoadingSteps, setLoadingSteps] = useState<boolean>(false);

    // types
    type Lesson = { id: number; title: string /* ... */ };
    type Connection = { subject_type: string; id: number; user_id: number | null; id_stream: number };
    type Course = {
        id: number;
        title: string;
        lessons: Lesson[];
        connections: Connection[];
        // ...
    };

    // type Props = {
    //     course: Course;
    //     handleMainLesson: (lessonId: number, streamId: number) => void;
    // };

    // old mainlesson
    // const handleMainLesson = async (lesson_id: number, stream_id: number) => {
    //     const data = await fetchMainLesson(lesson_id, stream_id);

    //     if (data) {
    //         if (data.length > 0) {
    //             setHasSteps(false);
    //             setMainSteps(data);
    //         } else {
    //             setHasSteps(true);
    //         }
    //     } else {
    //         setHasSteps(true);
    //     }
    // };

    const handleMainLesson = async (lesson_id: number, stream_id: number) => {
        const data = await fetchMainLesson(lesson_id, stream_id);

        // Возвращаем данные или null/пустой массив
        if (data && data.length > 0) {
            return data;
        }
        return []; // Возвращаем пустой массив, если данных нет
    };

    // old tabchange
    // const handleTabChange = (courseId: number, e: any) => {
    //     setActiveIndexes((prev) => ({
    //         ...prev,
    //         [courseId]: e.index
    //     }));

    //     const course = courses.find((c) => c.id === courseId);
    //     console.log(course, e.index);

    //     if (course) {
    //         const lesson = course.lessons[e.index];
    //         const stream = course.connections[0];
    //         console.log(lesson, stream);
    //         if (lesson && stream) {
    //             handleMainLesson(lesson.id, stream.id_stream);
    //         }
    //     } else {
    //         console.warn(course);
    //     }
    // };

    // Вам понадобится эта функция для получения ID урока
    const getLessonIdByCourseAndIndex = (course: any, index: number) => {
        // Убедитесь, что lessonType включает поле steps: any[]
        return course.lessons[index]?.id;
    };

    const handleTabChange = async (courseId: number, e: any) => {
        // 1. Обновление активного индекса (ОК)
        setActiveIndexes((prev) => ({
            ...prev,
            [courseId]: e.index // e.index - это индекс темы (AccordionTab)
        }));

        const course = courses.find((c) => c.id === courseId);

        // Если вкладка закрывается (e.index == null или -1),
        // нет необходимости в загрузке данных
        if (course && e.index !== null && e.index >= 0) {
            const lessonId = getLessonIdByCourseAndIndex(course, e.index);
            const stream = course.connections[0];

            // 2. Вызываем новую handleMainLesson и получаем данные
            if (lessonId && stream) {   
                // Ожидаем массив данных или пустой массив

                // 1. Устанавливаем статус загрузки для конкретного урока
                setCourses((prevCourses) =>
                    prevCourses.map((c) => {
                        if (c.id === courseId) {
                            return {
                                ...c,
                                lessons: c.lessons.map(
                                    (l) => (l.id === lessonId ? { ...l, isLoadingSteps: true } : l) // 💡 ВКЛЮЧАЕМ
                                )
                            };
                        }
                        return c;
                    })
                );

                const newSteps = await handleMainLesson(lessonId, stream.id_stream);
                if (newSteps) {
                    // 3. Обновляем состояние courses: добавляем steps к нужному уроку
                    setCourses((prevCourses) =>
                        prevCourses.map((c) => {
                            // Находим нужный курс
                            if (c.id === courseId) {
                                return {
                                    ...c,
                                    lessons: c.lessons.map((l) =>
                                        // Находим нужный урок и обновляем его шаги
                                        l.id === lessonId ? { ...l, steps: newSteps, isLoadingSteps: false } : l
                                    )
                                };
                            }
                            return c;
                        })
                    );
                }
            }
        }
    };

    const toggleSortSelect = (e: sortOptType) => {
        setSelectedSort(e);
    };

    // fetch lessons
    const handleFetchLessons = async () => {
        const data = await fetchItemsLessons();

        setSkeleton(true);
        if (data) {
            // валидность проверить
            // console.log(data);
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
        if (main_id && main_id != null) {
            const forSubject: subjectType = { id_curricula: main_id?.id_curricula, course_ids: main_id?.course_ids, streams: main_id?.streams.map((i: { id: number }) => i.id) };
            handleFetchSubject(forSubject);
        }
    }, [main_id]);

    // useEffect(() => {
    //     courses.forEach((course) => {
    //         const idx = activeIndexes[course.id]; // выбранный индекс у конкретного курса
    //         console.log(idx);
    //         console.log(courses, course);

    //         if (typeof idx === 'number') {
    //             const lesson = course.lessons[idx];
    //             const stream = course.connections[idx];

    //             if (lesson && stream) {
    //                 console.log('lesson_id:', lesson.id, 'stream_id:', stream.id_stream);
    //                 handleMainLesson(lesson.id, stream.id_stream);
    //             }
    //         }
    //     });

    //     // if (courses.length > 0) {
    //     //     const index = typeof activeIndex === 'number' ? Number(activeIndex) : 0;
    //     //     if (courses[index]?.connections?.length > 0 && courses[index]?.lessons?.length > 0) {
    //     //         const lesson_id = courses[index].lessons[index]?.id;
    //     //         const stream_id = courses[index].connections[index]?.id_stream;
    //     //         console.log(lesson_id, stream_id);

    //     //         handleMainLesson(lesson_id, stream_id);
    //     //     }
    //     //     else {
    //     //         // ?
    //     //     }
    //     // } else {
    //     //     // ?
    //     // }
    // }, [courses, activeIndexes]);

    useEffect(() => {
        console.log(courses);
    }, [courses]);

    const courseInfoClass = true;

    return (
        <div className="main-bg">
            <h1 className="text-xl shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">Список курсов</h1>
            {courses.map((course, idx) => {
                return (
                    <div key={course.id} className="flex flex-col gap-4 lesson-card-border shadow rounded my-4 py-2 px-1">
                        <div className="flex flex-col gap-2">
                            <h3 className="m-0">
                                <span className="text-[var(--mainColor)]">Название курса:</span> {course?.title}
                            </h3>
                            <h3 className="m-0">
                                <span className="text-[var(--mainColor)]">Преподаватель:</span> {course?.user.last_name} {course?.user.name}
                            </h3>
                        </div>
                        <div>
                            <Accordion key={`${course.id}`} activeIndex={activeIndexes[course.id]} onTabChange={(e) => handleTabChange(course.id, e)} multiple={false}>
                                {course.lessons.map((lesson) => {                                    
                                    const steps = lesson.steps && lesson.steps?.length > 0;
                                    return (
                                        <AccordionTab header={'Тема: ' + lesson.title} key={lesson.id} className="w-full p-accordion" style={{ width: '100%' }}>
                                            <div className="flex flex-col gap-2">
                                                {/* Используем lesson.steps, который был обновлен в handleTabChange */}
                                                {lesson?.isLoadingSteps ? (
                                                    <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                                                ) : steps ? (
                                                    lesson.steps.map((item: { id: number; type: { name: string; logo: string }; content: { title: string; description: string; url: string; document: string; document_path: string } }, idx) => {
                                                        if (item.content == null) {
                                                            return null;
                                                        }

                                                        return (
                                                            <div key={item.id} className={`${idx > 0 ? 'my-border-top' : ''}`}>
                                                                <StudentInfoCard
                                                                    type={item.type.name}
                                                                    icon={item.type.logo}
                                                                    title={item.content?.title}
                                                                    description={item.content?.description || ''}
                                                                    documentUrl={{ document: item.content?.document, document_path: item.content?.document_path }}
                                                                    link={item.content?.url}
                                                                    stepId={item.id}
                                                                    streams={course}
                                                                    lesson={lesson.id}
                                                                    subjectId={subject_id}
                                                                />
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <p className="text-center text-sm">Данных нет</p>
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
