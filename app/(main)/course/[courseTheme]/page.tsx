'use client';

import ConfirmModal from '@/app/components/popUp/ConfirmModal';
import FormModal from '@/app/components/popUp/FormModal';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { LayoutContext } from '@/layout/context/layoutcontext';
import React, { useContext, useEffect, useState } from 'react';
import { getToken } from '@/utils/auth';
import { useParams } from 'next/navigation';
import { addThemes, deleteTheme, fetchCourseInfo, fetchThemes, updateTheme } from '@/services/courses';
import useErrorMessage from '@/hooks/useErrorMessage';
import { CourseCreateType } from '@/types/courseCreateType';
import { NotFound } from '@/app/components/NotFound';

export default function CourseTheme() {
    const [hasThemes, setHasThemes] = useState(false);
    const [themes, setThemes] = useState([]);
    const [themeValue, setThemeValue] = useState({ title: '', description: '', video_url: '' });
    const [themeInfo, setThemeInfo] = useState<CourseCreateType>();
    const [courseTitle, setCourseTitle] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<{ id: number | null }>({ id: null });
    const [formVisible, setFormVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [forStart, setForStart] = useState(false);
    const [skeleton, setSkeleton] = useState(false);
    const { setMessage } = useContext(LayoutContext);

    const { courseTheme } = useParams() as { courseTheme: string };
    const showError = useErrorMessage();

    const handleFetchThemes = async () => {
        const token = getToken('access_token');
        const data = await fetchThemes(token, Number(courseTheme));
        console.log(data);

        if (data?.lessons) {
            setHasThemes(false);
            setThemes(data.lessons.data);
        } else {
            setHasThemes(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Проблема с соединением. Повторите заново' }
            }); // messege - Ошибка загрузки курсов
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleFetchInfo = async () => {
        const token = getToken('access_token');
        const data = await fetchCourseInfo(token, Number(courseTheme));

        if (data.success) {
            setThemeInfo(data.course);
        }
    };

    const handleAddTheme = async () => {
        if (themeValue.title.length < 1) {
            alert('hi');
            return null;
        }

        const token = getToken('access_token');
        const data = await addThemes(token, Number(courseTheme), themeValue.title);
        console.log(data);

        if (data.success) {
            toggleSkeleton();
            handleFetchThemes();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү кошулду!', detail: '' }
            }); // messege - Успех!
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при добавлении' }
            }); // messege - Ошибка при добавлении
            if (data.response.status) {
                showError(data.response.status);
            }
        }
    };

    const handleDeleteCourse = async (id: number) => {
        const token = getToken('access_token');

        const data = await deleteTheme(token, id);
        if (data.success) {
            toggleSkeleton();
            handleFetchThemes();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өчүрүлдү!', detail: '' }
            }); // messege - Успех!
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при удалении' }
            }); // messege - Ошибка при добавлении
            if (data.response.status) {
                showError(data.response.status);
            }
        }
    };

    const handleUpdateTheme = async () => {
        const token = getToken('access_token');

        const data = await updateTheme(token, Number(courseTheme), selectedCourse.id, themeValue);
        if (data.success) {
            toggleSkeleton();
            handleFetchThemes();
            clearValues();
            setEditMode(false);
            setSelectedCourse({ id: null });
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өзгөртүлдү!', detail: '' }
            }); // messege - Успех!
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при при изменении темы', detail: 'Заполняйте поля правильно' }
            }); // messege - Ошибка при изменении курса
            if (data.response.status) {
                showError(data.response.status);
            }
        }
    };

    const clearValues = () => {
        setThemeValue({ title: '', description: '', video_url: '' });
        setCourseTitle('');
        setEditMode(false);
        setSelectedCourse({ id: null });
    };

    const getConfirmOptions = (id: number) => ({
        message: 'Сиз чын эле өчүрүүнү каалайсызбы??',
        header: 'Өчүрүү',
        icon: 'pi pi-info-circle',
        defaultFocus: 'reject',
        acceptClassName: 'p-button-danger',
        acceptLabel: 'Кийинки кадам', // кастомная надпись для "Yes"
        rejectLabel: 'Артка',
        accept: () => handleDeleteCourse(id),
        reject: () => console.log('Удаление отменено')
    });

    const toggleSkeleton = () => {
        setSkeleton(true);
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
    };

    useEffect(() => {
        handleFetchInfo();
        handleFetchThemes();
    }, []);

    useEffect(() => {
        const title = courseTitle.trim();
        title.length > 0 ? setForStart(false) : setForStart(true);
    }, [courseTitle]);

    useEffect(() => {
        themes.length < 1 ? setHasThemes(true) : setHasThemes(false);
    }, [themes]);

    const titleInfoClass = `${!themeInfo?.image ? 'items-center' : 'w-full'} ${themeInfo?.image ? 'w-1/2' : 'w-full'}`;
    const titleImageClass = `${themeInfo?.image ? 'md:w-1/3' : ''}`;

    return (
        <div className="main-bg">
            {/* title section */}
            <div className={`bg-[var(--titleColor)] flex flex-col gap-3 md:flex-row items-center p-10 mt-2 mb-10 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]`}>
                <div className={`${titleInfoClass} flex flex-col justify-center gap-2 text-white`}>
                    <h3 className="text-[36px] font-bold m-0" style={{ color: 'white' }}>
                        {themeInfo?.title}
                    </h3>
                    <p style={{ color: 'white' }}>{themeInfo?.description}</p>
                    <div className="flex items-center gap-2">
                        <i className={'pi pi-clock text-blue-500'}></i>
                        <span>{themeInfo?.created_at}</span>
                        <span>Home/theme</span>
                    </div>
                </div>

                <div className={`${titleImageClass}`}>
                    <img src={String(themeInfo?.image)} />
                </div>
            </div>

            {/* add button*/}
            <Button
                label="Кошуу"
                icon="pi pi-plus"
                onClick={() => {
                    setEditMode(false);
                    clearValues();
                    setFormVisible(true);
                }}
            />

            {/* modal sectoin */}
            <FormModal title={editMode ? 'Теманы жаңылоо' : 'Кошуу'} fetchValue={editMode ? handleUpdateTheme : handleAddTheme} clearValues={clearValues} visible={formVisible} setVisible={setFormVisible} start={forStart}>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col lg:flex-row gap-1 justify-around items-center">
                        <div className="flex flex-col gap-1 items-center justify-center">
                            <label className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">Аталышы</label>
                            <InputText
                                value={courseTitle}
                                onChange={(e) => {
                                    setCourseTitle(e.target.value);
                                    setThemeValue((prev) => ({
                                        ...prev,
                                        title: e.target.value
                                    }));
                                }}
                            />
                        </div>
                    </div>
                </div>
            </FormModal>

            {/* table section */}
            {hasThemes ? (
                <NotFound titleMessage={'Тема кошуу үчүн кошуу баскычты басыныз'} />
            ) : (
                <div className="py-4">
                    {skeleton ? (
                        <GroupSkeleton count={themes.length} size={{ width: '100%', height: '4rem' }} />
                    ) : (
                        <DataTable value={themes} breakpoint="960px" className="my-custom-table">
                            <Column body={(_, { rowIndex }) => rowIndex + 1} header="Номер" style={{ width: '20px' }}></Column>
                            <Column field="title" header="Темалар" className="w-2/3" sortable body={(rowData) => <Link href={`/course/lessons/${rowData.id}`}>{rowData.title}</Link>}></Column>

                            <Column
                                header=""
                                className="flex justify-center"
                                body={(rowData) => (
                                    <div className="flex gap-2">
                                        <Button
                                            icon="pi pi-pencil"
                                            className="p-button-rounded bg-blue-400"
                                            onClick={() => {
                                                setEditMode(true);
                                                setSelectedCourse(rowData.id);
                                                // setThemeValue({ title: rowData.title || '' });
                                                setCourseTitle(rowData.title);
                                                setFormVisible(true);
                                            }}
                                        />
                                        {/* <ConfirmModal confirmVisible={getConfirmOptions(rowData.id)} /> */}
                                        <Button className=" bg-blue-400" icon="pi pi-arrow-right">
                                            <Link href={`/course/${rowData.id}`}></Link>
                                        </Button>
                                    </div>
                                )}
                            />
                        </DataTable>
                    )}
                </div>
            )}
        </div>
    );
}
