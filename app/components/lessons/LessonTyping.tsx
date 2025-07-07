import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import React, { useContext, useEffect, useState } from 'react';
import LessonCard from '../cards/LessonCard';
import { getToken } from '@/utils/auth';
import { addLesson, deleteLesson, fetchLesson, updateLesson } from '@/services/courses';
import useErrorMessage from '@/hooks/useErrorMessage';
import FormModal from '../popUp/FormModal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { baseSchema } from '@/schemas/baseSchema';

export default function LessonTyping({ mainType, courseId, lessonId }: { mainType: string; courseId: string | null; lessonId: string | null }) {
    // type
    interface lessonType {
        title: string;
        description: string;
        file?: File | null;
    }

    interface EditableLesson {
        title: string;
        description?: string;

        document?: File | null;
    }

    // validate
    const {
        register,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(baseSchema),
        mode: 'onChange'
    });

    // doc
    const [documents, setDocuments] = useState([]);
    const [docValue, setDocValue] = useState<lessonType>({
        title: '',
        description: ''
    });
    const [docShow, setDocShow] = useState<boolean>(false);

    // auxiliary
    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);
    const [selectId, setSelectId] = useState<number | null>(null);
    const [selectType, setSelectType] = useState('');
    const [visible, setVisisble] = useState(false);
    const [editingLesson, setEditingLesson] = useState<EditableLesson | null>(null);

    const selectedForModal = (id: number, type: string) => {
        console.log('selected use');

        setSelectId(id);
        setSelectType(type);
        //
        editing('doc', id);
        setVisisble(true);
    };

    const editing = async (type: string, id: number) => {
        const token = getToken('access_token');
        const data = await fetchLesson(type, token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null);
        const lesson = type === 'doc' ? { key: 'documents', file: 'document' } : '';
        console.log(lesson.key);

        if (data.success) {
            if (data[lesson.key]) {
                const arr = data[lesson.key].find((el) => el.id == id);
                setEditingLesson({
                    title: arr.title,
                    description: arr?.description,
                    document: arr[lesson.file]
                });
            }
        }
    };

    const cencalEdit = () => {
        setDocValue({ title: '', description: '' });
    };

    useEffect(() => {
        console.log('selected id ', selectId);
    }, [selectId]);

    // DOC SECTION

    const docSection = () => {
        return (
            <div className="py-4 flex flex-col items-center gap-4">
                <div className="w-full flex flex-col justify-center gap-2">
                    <FileUpload
                        chooseLabel="Документ жүктөө"
                        mode="basic"
                        name="demo[]"
                        customUpload
                        uploadHandler={() => {}}
                        accept="application/pdf"
                        onSelect={(e) =>
                            setDocValue((prev) => ({
                                ...prev,
                                file: e.files[0]
                            }))
                        }
                    />

                    <InputText
                        id="title"
                        type="text"
                        placeholder={'Аталышы'}
                        value={docValue.title}
                        onChange={(e) => {
                            setDocValue((prev) => ({ ...prev, title: e.target.value }));
                            setValue('title', e.target.value, { shouldValidate: true });
                        }}
                    />
                    <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>

                    <InputText placeholder="Мазмун" value={docValue.description} onChange={(e) => setDocValue((prev) => ({ ...prev, description: e.target.value }))} className="w-full" />
                    <div className="flex justify-center">
                        {/* <Button disabled={!!errors.title || !docValue.file} label="Сактоо" onClick={handleAddDoc} /> */}
                        <Button label="Сактоо" disabled={!docValue.title.length || !!errors.title || !docValue.file} onClick={handleAddDoc} />
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4 py-4">
                    <div className="flex flex-wrap justify-center">
                        {docShow
                            ? documents.map((item) => (
                                  <div key={item?.id}>
                                      <LessonCard
                                          onSelected={(id: number, type: string) => selectedForModal(id, type)}
                                          onDelete={(id: number) => handleDeleteDoc(id)}
                                          cardValue={{ title: item?.title, id: item?.id, type: 'doc' }}
                                          cardBg={'#ddc4f51a'}
                                          type={{ typeValue: 'Документтер', icon: 'pi pi-folder' }}
                                          typeColor={'var(--mainColor)'}
                                          lessonDate={'xx-xx-xx'}
                                      />
                                  </div>
                              ))
                            : 'Шаблон если данных нет'}
                    </div>
                </div>
            </div>
        );
    };

    // fetch document
    const handleFetchDoc = async () => {
        // skeleton = false
        const token = getToken('access_token');
        const data = await fetchLesson('doc', token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null);
        console.log(data);

        if (data.success) {
            if (data.documents) {
                // Присваиваю себе. Для отображения
                setDocValue({ title: '', description: '' });
                setDocuments(data.documents);
                setDocShow(true);
            } else {
                setDocShow(false);
                alert('content null!!');
            }
        } else {
            setDocShow(false);
            if (data.response.status) {
                showError(data.response.status);
            }
            // skeleton = false
        }
    };

    // add document
    const handleAddDoc = async () => {
        const token = getToken('access_token');
        const data = await addLesson('doc', token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null, docValue.file && docValue?.file, docValue.title);
        console.log(data);

        if (data.success) {
            handleFetchDoc();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү Кошулдуу!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при добавлении' }
            });
            if (data.response.status) {
                showError(data.response.status);
            }
        }
    };

    // update document
    const handleUpdateLesson = async () => {
        const token = getToken('access_token');

        const data = await updateLesson('doc', token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null, Number(selectId), docValue);
        console.log(data);

        if (data.success) {
            handleFetchDoc();
            setSelectId(null);
            setSelectType('');
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өзгөртүлдү!', detail: '' }
            });
        } else {
            setDocValue({ title: '', description: '' });
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при изменении урока' }
            });
            if (data.response.status) {
                showError(data.response.status);
            }
        }
    };

    // delete document
    const handleDeleteDoc = async (id) => {
        console.log(id);

        const token = getToken('access_token');

        const data = await deleteLesson('doc', token, Number(courseId), Number(lessonId), id);
        if (data.success) {
            handleFetchDoc();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өчүрүлдү!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при удалении' }
            });
            if (data.response.status) {
                showError(data.response.status);
            }
        }
        console.log(data);
    };

    // USEEFFECTS

    useEffect(() => {
        if (mainType === 'doc') handleFetchDoc();
    }, []);

    return (
        <div>
            <FormModal title={'Сабакты жанылоо'} fetchValue={handleUpdateLesson} clearValues={cencalEdit} visible={visible} setVisible={setVisisble} start={''}>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col gap-1 items-center justify-center">
                        {selectType === 'doc' && (
                            <>
                                <FileUpload
                                    chooseLabel="Жаңылоо"
                                    mode="basic"
                                    name="demo[]"
                                    customUpload
                                    uploadHandler={() => {}}
                                    accept="application/pdf"
                                    onSelect={(e) =>
                                        setDocValue((prev) => ({
                                            ...prev,
                                            file: e.files[0]
                                        }))
                                    }
                                />
                                <span>{editingLesson?.document}</span>
                                <InputText
                                    type="text"
                                    placeholder={editingLesson?.title ? editingLesson?.title : 'Аталышы'}
                                    value={docValue.title}
                                    onChange={(e) => {
                                        setDocValue((prev) => ({ ...prev, title: e.target.value }));
                                        setValue('title', e.target.value, { shouldValidate: true });
                                        // setEditingLesson((prev)=> ({...prev, title: e.target.value}));
                                    }}
                                />
                                <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>

                                <InputText placeholder="Мазмун" value={docValue.description} onChange={(e) => setDocValue((prev) => ({ ...prev, description: e.target.value }))} className="w-full" />
                            </>
                        )}
                    </div>
                </div>
            </FormModal>

            {mainType === 'doc' && docSection()}
        </div>
    );
}
