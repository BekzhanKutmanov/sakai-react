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
import { lessonStateType } from '@/types/lessonStateType';
import { lessonSchema } from '@/schemas/lessonSchema';
import { lessonType } from '@/types/lessonType';

export default function LessonTyping({ mainType, courseId, lessonId }: { mainType: string; courseId: string | null; lessonId: string | null }) {
    // types
    interface EditableLesson {
        title: string;
        description?: string;
        document?: File | null;
        url?: string | null;
    }

    interface editingType {
        key: string;
        file: string;
        url: string;
    }

    // validate
    const { setValue, formState: { errors }} = useForm({
        resolver: yupResolver(lessonSchema),
        mode: 'onChange'
    });

    // doc
    const [documents, setDocuments] = useState([]);
    const [docValue, setDocValue] = useState<lessonStateType>({
        title: '',
        description: '',
        file: null,
        url: ''
    });
    const [docShow, setDocShow] = useState<boolean>(false);

    // links
    const [links, setLinks] = useState([]);
    const [linksValue, setLinksValue] = useState<lessonStateType>({
        title: '',
        description: '',
        file: null,
        url: ''
    });
    const [linksShow, setLinksShow] = useState<boolean>(false);

    // auxiliary
    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);
    const [selectId, setSelectId] = useState<number | null>(null);
    const [selectType, setSelectType] = useState('');
    const [visible, setVisisble] = useState(false);
    const [editingLesson, setEditingLesson] = useState<EditableLesson | null>(null);

    // functions
    const handleUpdate = () => {
        if (selectType === 'doc') {
            handleUpdateLesson();
        } else if (selectType === 'url') {
            handleUpdateLink();
        }
    };

    const selectedForModal = (id: number, type: string) => {
        console.log('Открытие окна... ', id, type);

        setSelectId(id);
        setSelectType(type);
        editing(type, id);
        setVisisble(true);
    };

    // Предоставляю данные из сервера для изменения
    const editing = async (type: string, selected: number) => {
        console.log(type, selected);

        const token = getToken('access_token');
        const data = await fetchLesson(type, token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null);

        console.log(data);

        const lesson: editingType = type === 'doc' ? { key: 'documents', file: 'document', url: '' } : type === 'url' ? { key: 'links', file: '', url: 'url' } : { key: '', file: '', url: '' };
        // console.log(lesson);
        // console.log(data[lesson.key]);

        if (data.success) {
            if (data[lesson.key]) {
                const arr = data[lesson.key].find((item: lessonType) => item.id === selected);
                // console.log(arr);

                setEditingLesson({
                    title: arr.title,
                    description: arr?.description,
                    document: arr[lesson.file],
                    url: arr[lesson.url]
                });
            }
        }
    };

    const cencalEdit = () => { // пока отдельная функция, если не будет расширения то сделаю без функции
        setEditingLesson(null);
    };

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
                            ? documents.map((item: lessonType) => (
                                  <div key={item?.id}>
                                      <LessonCard
                                          onSelected={(id: number, type: string) => selectedForModal(id, type)}
                                          onDelete={(id: number) => handleDeleteDoc(id)}
                                          cardValue={{ title: item?.title, id: item.id, type: 'doc' }}
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
                setDocValue({ title: '', description: '', file: null, url: '' });
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

        const data = await addLesson('doc', token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null, docValue);
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
        console.log(editingLesson);
        
        const data = await updateLesson('doc', token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null, Number(selectId), editingLesson);
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
            setDocValue({ title: '', description: '', file: null, url: '' });
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
    const handleDeleteDoc = async (id: number) => {
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
    };

                                            // LINKS SECTION

    const linkSection = () => {
        return (
            <div className="py-4 flex flex-col items-center gap-4">
                <div className="w-full flex flex-col justify-center gap-2">
                    <InputText
                        id="usefulLink"
                        type="url"
                        placeholder={'Шилтеме жүктөө'}
                        value={linksValue.url}
                        onChange={(e) => {
                            setLinksValue((prev) => ({ ...prev, url: e.target.value }));
                            setValue('usefulLink', e.target.value, { shouldValidate: true });
                        }}
                    />
                    <b style={{ color: 'red', fontSize: '12px' }}>{errors.usefulLink?.message}</b>

                    <InputText
                        id="title"
                        type="text"
                        placeholder={'Аталышы'}
                        value={linksValue.title}
                        onChange={(e) => {
                            setLinksValue((prev) => ({ ...prev, title: e.target.value }));
                            setValue('title', e.target.value, { shouldValidate: true });
                        }}
                    />
                    <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>

                    <InputText placeholder="Мазмун" value={linksValue.description} onChange={(e) => setLinksValue((prev) => ({ ...prev, description: e.target.value }))} className="w-full" />
                    <div className="flex justify-center">
                        <Button label="Сактоо" disabled={!linksValue.title.length || !linksValue.url?.length || !!errors.title || !!errors.usefulLink} onClick={handleAddLink} />
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4 py-4">
                    <div className="flex flex-wrap justify-center">
                        {linksShow
                            ? links.map((item: lessonType) => {
                                  return (
                                      <div key={item?.id}>
                                          <LessonCard
                                              onSelected={(id: number, type: string) => selectedForModal(id, type)}
                                              onDelete={(id: number) => handleDeleteLink(id)}
                                              cardValue={{ title: item.title, id: item.id, type: 'url' }}
                                              cardBg={'#7bb78112'}
                                              type={{ typeValue: 'Шилтемелер', icon: 'pi pi-link' }}
                                              typeColor={'var(--mainColor)'}
                                              lessonDate={'xx-xx-xx'}
                                          />
                                      </div>
                                  );
                              })
                            : 'Шаблон если данных нет'}
                    </div>
                </div>
            </div>
        );
    };

    // fetch document
    const handleFetchLink = async () => {
        // skeleton = false
        const token = getToken('access_token');
        const data = await fetchLesson('url', token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null);
        console.log(data);

        if (data.success) {
            if (data.links) {
                // Присваиваю себе. Для отображения
                setLinksValue({ title: '', description: '', file: null, url: '' });
                setLinks(data.links);
                setLinksShow(true);
            } else {
                setLinksShow(false);
            }
        } else {
            setDocShow(false);
            if (data.response.status) {
                showError(data.response.status);
            }
            // skeleton = false
        }
    };

    // add link
    const handleAddLink = async () => {
        const token = getToken('access_token');

        const data = await addLesson('url', token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null, linksValue);
        console.log(data);

        if (data.success) {
            handleFetchLink();
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

    // delete link
    const handleDeleteLink = async (id: number) => {
        const token = getToken('access_token');
        const data = await deleteLesson('url', token, Number(courseId), Number(lessonId), id);
        
        if (data.success) {
            handleFetchLink();
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
    };

    // update link
    const handleUpdateLink = async () => {
        const token = getToken('access_token');

        const data = await updateLesson('url', token, courseId ? Number(courseId) : null, lessonId ? Number(lessonId) : null, Number(selectId), editingLesson);
        console.log(data);

        if (data.success) {
            handleFetchLink();
            setSelectId(null);
            setEditingLesson(null);
            setSelectType('');
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Ийгиликтүү өзгөртүлдү!', detail: '' }
            });
        } else {
            setLinksValue({ title: '', description: '', file: null, url: '' });
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при при изменении урока' }
            });
            if (data.response.status) {
                showError(data.response.status);
            }
        }
    };

    // USEEFFECTS

    useEffect(() => {
        if (mainType === 'doc') handleFetchDoc();
        if (mainType === 'link') handleFetchLink();
    }, []);

    useEffect(() => {
        console.log('selected id ', selectId);
    }, [selectId]);
    
    useEffect(() => {
        console.log('eidting ', editingLesson);
    }, [editingLesson]);

    return (
        <div>
            <FormModal title={'Сабакты жанылоо'} fetchValue={handleUpdate} clearValues={cencalEdit} visible={visible} setVisible={setVisisble} start={false}>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-col gap-1 items-center justify-center">
                        {selectType === 'doc' ? (
                            <>
                                <FileUpload
                                    chooseLabel="Жаңылоо"
                                    mode="basic"
                                    name="demo[]"
                                    customUpload
                                    uploadHandler={() => {}}
                                    accept="application/pdf"
                                    onSelect={(e) =>
                                        setEditingLesson((prev)=> prev && { ...prev, file: e.files[0] })
                                    }
                                />
                                <span>{String(editingLesson?.document)}</span>
                                <InputText
                                    type="text"
                                    value={editingLesson?.title}
                                    onChange={(e) => {
                                        setEditingLesson((prev)=> prev && { ...prev, title: e.target.value});
                                        setValue('title', e.target.value, { shouldValidate: true });
                                    }}
                                />
                                <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                                <InputText placeholder="Мазмун" value={editingLesson?.description} onChange={(e) => setEditingLesson((prev) => prev && { ...prev, description: e.target.value })} className="w-full" />
                            </>
                        ) : selectType === 'url' ? (
                            <>
                                <InputText
                                    type="url"
                                    value={editingLesson?.url}
                                    onChange={(e) => {
                                        setEditingLesson((prev) => prev && { ...prev, url: e.target.value });
                                        setValue('usefulLink', e.target.value, { shouldValidate: true });
                                    }}
                                />
                                <InputText
                                    type="text"
                                    placeholder={editingLesson?.title ? editingLesson?.title : 'Аталышы'}
                                    value={editingLesson?.title}
                                    onChange={(e) => {
                                        setEditingLesson((prev) => prev && { ...prev, title: e.target.value });
                                        setValue('title', e.target.value, { shouldValidate: true });
                                    }}
                                />
                                <b style={{ color: 'red', fontSize: '12px' }}>{errors.title?.message}</b>
                                <InputText placeholder="Мазмун" value={editingLesson?.description} onChange={(e) => setEditingLesson((prev) => prev && { ...prev, description: e.target.value })} className="w-full" />
                            </>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </FormModal>

            {mainType === 'doc' && docSection()}
            {mainType === 'link' && linkSection()}
        </div>
    );
}
