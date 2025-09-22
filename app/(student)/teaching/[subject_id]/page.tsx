'use client';

import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchItemsLessons, fetchSubjects } from '@/services/studentMain';
import { useParams } from 'next/navigation';
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

    const [skeleton, setSkeleton] = useState(false);
    const [hasLessons, setHasLessons] = useState(false);
    const [lessons, setLessons] = useState<Record<number, { semester: { name_kg: string } } | predmetType>>({
        1: { semester: { name_kg: '' } }
    });
    const [courses, setCourses] = useState<{ connections: { subject_type: string; id: number; user_id: number | null }[]; title: string }[]>([]);
    const [selectedSort, setSelectedSort] = useState({ name: 'Все', code: 0 });
    const [sortOpt, setSortOpt] = useState<sortOptType[]>();

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

    // Запрос курса, темы
    const handleFetchSubject = async (subject: subjectType) => {
        params.append('id_curricula', String(subject.id_curricula));
        subject.streams.forEach((i) => params.append('streams[]', String(i)));
        subject.course_ids.forEach((i) => params.append('course_ids[]', String(i)));

        const data = await fetchSubjects(params);
        console.log(data);

        setSkeleton(true);
        if (data) {
            setCourses(data);
            // валидность проверить
            // setLessons(data);
            // setHasLessons(false);
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
        let forDropdown: sortOptType[] = [{ name: 'Все', code: 0 }];
        courses[0]?.connections.forEach((element) => {
            forDropdown.push({
                name: element.subject_type,
                code: element.id,
                user_id: element.user_id
            });
        });

        setSortOpt(forDropdown);
    }, [courses]);

    return (
        <div className="main-bg">
            <div className="flex justify-between gap-1 items-center">
                <h3 className="text-lg pb-1 m-0">
                    <span className="text-[var(--mainColor)]">Название курса:</span> {courses[0]?.title}
                </h3>
                <Dropdown
                    value={selectedSort}
                    onChange={(e) => {
                        toggleSortSelect(e.value);
                    }}
                    options={sortOpt}
                    optionLabel="name"
                    placeholder=""
                    className="w-[213px] md:w-14rem"
                />
            </div>
            <div>
                {/* Данные придут с типами урока (лк, лб...) от туда и все отображу. С их юсер ид достану мой юсер ид тоже отображу */}
                {/* Найду связь наверное с connectionc id и по порядку отображу с начало название из моего sortOpt и внутри новый рендер с новых данных */}
                {sortOpt?.map((item) => {
                    return item.name;
                })}
            </div>
        </div>
    );
}
