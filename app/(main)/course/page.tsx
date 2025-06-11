'use client';

import FormModal from '@/app/components/popUp/FormModal';
import { addCourse, deleteCourse, fetchCourses, updateCourse } from '@/services/courses';
import { getToken } from '@/utils/auth';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { useContext, useEffect, useRef, useState } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function Course() {
    const [courses, setCourses] = useState([]);
    const [courseValue, setCourseValue] = useState({ title: '', description: '', video_url: '', image: '' });
    const [courseTitle, setCourseTitle] = useState('');
    const [video_url, setVideo_url] = useState('');
    const [description, setDesciption] = useState('');
    // const fileUploadRef = useRef(null);
    const [editMode, setEditMode] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [image, setImage] = useState(null);
    const [forStart, setForStart] = useState(false);

    const { setMessage } = useContext(LayoutContext);

    const handleFetchCourses = async () => {
        const token = getToken('access_token');
        const data = await fetchCourses(token);
        console.log(data);

        setCourses(data.courses);
    };

    const handleAddCourse = async () => {
        console.log(courseValue);
        if (courseValue.title.length < 1) {
            alert('hi');
            return null;
        }
        const token = getToken('access_token');
        const data = await addCourse(token, courseValue);
        console.log(data);
        if (data.success) {
            handleFetchCourses();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү кошулду!', detail: '' }
            }); // messege - Успех!
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при добавлении' }
            }); // messege - Ошибка при добавлении
        }
    };

    const handleDeleteCourse = async (id) => {
        const token = getToken('access_token');

        const data = await deleteCourse(token, id);
        console.log(data);

        if (data.success) {
            handleFetchCourses();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өчүрүлдү!', detail: '' }
            }); // messege - Успех!
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при удалении' }
            }); // messege - Ошибка при добавлении
        }
    };

    const handleUpdateCourse = async () => {
        console.log(courseValue);

        const token = getToken('access_token');

        const data = await updateCourse(token, selectedCourse.id, courseValue);
        console.log(data);
        if (data.success) {
            handleFetchCourses();
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
        }
    };

    const clearValues = () => {
        setCourseValue({ title: '', description: '', video_url: '', image: '' });
        setCourseTitle('');
        setVideo_url('');
        setDesciption('');
        // fileUploadRef.current = null;
        setEditMode(false);
        setSelectedCourse(null);
    };

    const onSelect = (e) => {
        setImage(e.files[0]); // сохраняешь файл
        setCourseValue((prev) => ({
            ...prev,
            image: e.files[0]
        }));
    };

    useEffect(() => {
        handleFetchCourses();
    }, []);

    useEffect(() => {
        courseTitle.length > 0 ? setForStart(false) : setForStart(true);
    }, [courseTitle]);

    return (
        <div>
            <div>
                <FormModal title={editMode ? 'Курсту жаңылоо' : 'Кошуу'} fetchValue={editMode ? handleUpdateCourse : handleAddCourse} clearValues={clearValues} visible={formVisible} setVisible={setFormVisible} start={forStart}>
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-col lg:flex-row gap-1 justify-around items-center">
                            <div className="flex flex-col gap-1 items-center justify-center">
                                <label className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">Аталышы</label>
                                <InputText
                                    value={courseTitle}
                                    // classname?
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
                                {courseValue.image ? (
                                    <div className="mt-2 text-sm text-gray-700">
                                        Сүрөт: <b className="text-[12px]">{courseValue.image.name || courseValue.image}</b>
                                    </div>
                                ) : (
                                    <b className="text-[12px] text-red-500">jpeg, png, jpg</b>
                                )}
                            </div>
                        </div>
                    </div>
                </FormModal>

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

            <div className="flex flex-col gap-2">
                {courses.map((item) => (
                    <div key={item?.id} className="flex justify-between items-center gap-1 border-2">
                        <div className="flex justify-between items-center gap-1 border-2">
                            <span>{item.id}</span>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                        <button onClick={() => handleDeleteCourse(item.id)}>delete</button>
                        <Button
                            label="Редактировать"
                            icon="pi pi-pencil"
                            onClick={() => {
                                setEditMode(true);
                                setSelectedCourse(item);
                                setCourseValue({
                                    title: item.title || '',
                                    description: item.description || '',
                                    video_url: item.video_url || '',
                                    image: item.image || ''
                                });
                                setCourseTitle(item.title);
                                setVideo_url(item.video_url);
                                setDesciption(item.description);
                                setFormVisible(true); // этот флаг надо добавить
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
