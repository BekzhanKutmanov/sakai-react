'use client';

import FormModal from '@/app/components/popUp/FormModal';
import { addCourse, deleteCourse, fetchCourseInfo, fetchCourses, updateCourse } from '@/services/courses';
import { getToken } from '@/utils/auth';
import { Button } from 'primereact/button';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { InputTextarea } from 'primereact/inputtextarea';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import Link from 'next/link';
import { CourseCreateType } from '@/types/courseCreateType';
import { CourseType } from '@/types/courseType';
import { Paginator } from 'primereact/paginator';
import { NotFound } from '@/app/components/NotFound';
import Redacting from '@/app/components/popUp/Redacting';
import { getRedactor } from '@/utils/getRedactor';
import { getConfirmOptions } from '@/utils/getConfirmOptions';
import useErrorMessage from '@/hooks/useErrorMessage';

export default function Course() {
    const [courses, setCourses] = useState([]);
    const [hasCourses, setHasCourses] = useState(false);
    const [courseValue, setCourseValue] = useState<CourseCreateType>({ title: '', description: '', video_url: '', image: '' });
    const [courseTitle, setCourseTitle] = useState('');
    const [video_url, setVideo_url] = useState('');
    const [description, setDesciption] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
    const [formVisible, setFormVisible] = useState(false);
    const [image, setImage] = useState<File | string>('');
    const [forStart, setForStart] = useState(false);
    const [skeleton, setSkeleton] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        total: 0,
        perPage: 0
    });

    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const handleFetchCourse = async (page = 1) => {
        const token = getToken('access_token');
        const data = await fetchCourses(token, page, 3);
        console.log(data);

        if (data?.courses) {
            setHasCourses(false);
            setCourses(data.courses.data);
            setPagination({
                currentPage: data.courses.current_page,
                total: data.courses.total,
                perPage: data.courses.per_page
            });
        } else {
            setHasCourses(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Проблема с соединением. Повторите заново' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleAddCourse = async () => {
        const token = getToken('access_token');
        const data = await addCourse(token, courseValue);
        if (data?.success) {
            toggleSkeleton();
            handleFetchCourse();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү кошулду!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при добавлении' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleDeleteCourse = async (id: number) => {
        const token = getToken('access_token');

        const data = await deleteCourse(token, id);
        if (data?.success) {
            toggleSkeleton();
            handleFetchCourse();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өчүрүлдү!', detail: '' }
            }); // messege - Успех!
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при удалении' }
            }); // messege - Ошибка при добавлении
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleUpdateCourse = async () => {
        const token = getToken('access_token');

        const data = await updateCourse(token, selectedCourse, courseValue);
        if (data?.success) {
            toggleSkeleton();
            handleFetchCourse();
            clearValues();
            setEditMode(false);
            setSelectedCourse(null);
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өзгөртүлдү!', detail: '' }
            }); // messege - Успех!
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при при изменении курса', detail: 'Заполняйте поля правильно' }
            }); // messege - Ошибка при изменении курса
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const clearValues = () => {
        setCourseValue({ title: '', description: '', video_url: '', image: '' });
        setCourseTitle('');
        setVideo_url('');
        setDesciption('');
        setImage('');
        setEditMode(false);
        setSelectedCourse(null);
    };

    const onSelect = (e: FileUploadSelectEvent) => {
        setImage(e.files[0]); // сохраняешь файл
        console.log(e.files[0]);
        
        setCourseValue((prev) => ({
            ...prev,
            image: e.files[0]
        }));
    };

    const imageBodyTemplate = (product: CourseType) => {
        const image = product.image;

        if (typeof image === 'string') {
            return (
                <div className="flex justify-center w-[50px] h-[50px]" key={product.id}>
                    <img src={image} alt="Course image" className="w-full object-cover shadow-2 border-round" />
                </div>
            );
        }

        return (
            <div className="flex justify-center w-[50px] h-[50px]" key={product.id}>
                <img src={'/layout/images/no-image.png'} alt="Course image" className="w-full object-cover shadow-2 border-round" />
            </div>
        );
    };

    const toggleSkeleton = () => {
        setSkeleton(true);
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
    };

        // Ручное управление пагинацией
    const handlePageChange = (page: number) => {
        handleFetchCourse(page);
    };

    const edit = (rowData: number | null) => {
        setEditMode(true);
        setSelectedCourse(rowData);
        setFormVisible(true);
    };

    useEffect(() => {
        handleFetchCourse();
    }, []);

    useEffect(() => {
        const title = courseTitle.trim();
        if (title.length > 0) {
            setForStart(false);
        } else {
            setForStart(true);
        }
    }, [courseTitle]);

    useEffect(() => {
        console.log('Курсы ', courses);
        courses.length < 1 ? setHasCourses(true) : setHasCourses(false);
    }, [courses]);

    useEffect(() => {
        const handleShow = async () => {
            const token = getToken('access_token');
            const data = await fetchCourseInfo(token, selectedCourse);
            console.log(data);
            setCourseTitle(data.course.title || '');
            setVideo_url(data.course.video_url || '');
            setDesciption(data.course.description || '');
            setImage(data.course.image);
        };

        if (editMode) {
            handleShow();
        }
    }, [editMode]);

    return (
        <div className="main-bg">
            {/* modal window */}
            <FormModal title={editMode ? 'Курсту жаңылоо' : 'Кошуу'} fetchValue={editMode ? handleUpdateCourse : handleAddCourse} clearValues={clearValues} visible={formVisible} setVisible={setFormVisible} start={forStart}>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col lg:flex-row gap-1 justify-around items-center">
                        <div className="flex flex-col gap-1 items-center justify-center">
                            <label className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">Аталышы</label>
                            <InputText
                                value={courseTitle}
                                placeholder="Аталышы талап кылынат"
                                onChange={(e) => {
                                    setCourseTitle(e.target.value);
                                    setCourseValue((prev) => ({
                                        ...prev,
                                        title: e.target.value
                                    }));
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-1 items-center justify-center">
                            <label className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">Видео шилтеме</label>
                            <InputText
                                value={video_url}
                                placeholder="https://..."
                                title="Шилтеме https:// менен башталышы шарт!"
                                onChange={(e) => {
                                    setVideo_url(e.target.value);
                                    setCourseValue((prev) => ({
                                        ...prev,
                                        video_url: e.target.value
                                    }));
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-1 justify-around items-center">
                        <div className="flex flex-col gap-1 items-center justify-center">
                            <label className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">Мазмуну</label>
                            <InputTextarea
                                autoResize
                                value={description}
                                rows={5}
                                cols={30}
                                onChange={(e) => {
                                    setDesciption(e.target.value);
                                    setCourseValue((prev) => ({
                                        ...prev,
                                        description: e.target.value
                                    }));
                                }}
                            />
                        </div>

                        <div className="flex flex-col pag-1 items-center justify-center">
                            <label className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">Сүрөт кошуу</label>
                            <FileUpload mode="basic" customUpload name="demo[]" accept="image/*" maxFileSize={1000000} onSelect={onSelect} />
                            {image ? (
                                <div className="mt-2 text-sm text-gray-700">
                                    {typeof image === 'string' && (
                                        <>
                                            Сүрөт: <b className="text-[12px]">{image}</b>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <b className="text-[12px] text-red-500">jpeg, png, jpg</b>
                            )}
                        </div>
                    </div>
                </div>
            </FormModal>

            {/* info section */}
            <div className="flex justify-between items-center mb-4 py-2 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                <h3 className="text-[36px] m-0">Курстар</h3>

                <Button
                    label="Кошуу"
                    icon="pi pi-plus"
                    onClick={() => {
                        setEditMode(false);
                        clearValues();
                        setFormVisible(true);
                    }}
                />
            </div>

            {/* table section */}
            {hasCourses ? (
                <NotFound titleMessage={'Курс кошуу үчүн кошуу баскычты басыныз'} />
            ) : (
                <div className="py-4">
                    {skeleton ? (
                        <GroupSkeleton count={courses.length} size={{ width: '100%', height: '4rem' }} />
                    ) : (
                        <>
                            <DataTable value={courses} breakpoint="960px" rows={5} className="my-custom-table">
                                <Column body={(_, { rowIndex }) => rowIndex + 1} header="Номер" style={{ width: '20px' }}></Column>
                                <Column
                                    field="title"
                                    header="Аталышы"
                                    style={{ width: '80%' }}
                                    sortable
                                    body={(rowData) => <Link href={`/course/${rowData.id}`} key={rowData.id}>{rowData.title}</Link> }
                                ></Column>
                                <Column header="" body={imageBodyTemplate}></Column>
                                <Column
                                    header=""
                                    className="flex items-center justify-center h-[60px] border-b-0"
                                    body={(rowData) => (
                                        <div className="flex items-center gap-2" key={rowData.id}>
                                            <Redacting redactor={getRedactor(rowData, { onEdit: edit, getConfirmOptions, onDelete: handleDeleteCourse })} textSize={'14px'} />
                                        </div>
                                    )}
                                />
                            </DataTable>
                            <Paginator
                                first={(pagination.currentPage - 1) * pagination.perPage}
                                rows={pagination.perPage}
                                totalRecords={pagination.total}
                                onPageChange={(e) => handlePageChange(e.page + 1)}
                                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
