import { CourseCreateType } from '@/types/courseCreateType';
import { lessonStateType } from '@/types/lessonStateType';
import axiosInstance from '@/utils/axiosInstance';

let url = '';

export const fetchTypes = async () => {
    try {
        const res = await axiosInstance.get(`/v1/teacher/courses/content/types`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const fetchSteps = async (lesson_id: number) => {
    try {
        const res = await axiosInstance.get(`/v1/teacher/lessons/step?lesson_id=${lesson_id}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const addLesson = async (value: { lesson_id: number; type_id: number }) => {
    const formData = new FormData();
    formData.append('lesson_id', String(value.lesson_id));
    formData.append('type_id', String(value.type_id));

    try {
        const res = await axiosInstance.post(`/v1/teacher/lessons/step`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return res.data;
    } catch (err) {
        console.log('Ошибка при добавлении курса', err);
        return err;
    }
};

// fetch steps content

export const fetchElement = async (lesson_id: number, step_id: number) => {
    console.log(lesson_id, step_id);
    
    try {
        const res = await axiosInstance.get(`/v1/teacher/lessons/step/content?lesson_id=${lesson_id}&step_id=${step_id}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const addDocument = async (value: { file: File | null; title: string; description: string }, lesson_id: number, type_id: number, step_id: number) => {
    const formData = new FormData();
    formData.append('lesson_id', String(lesson_id));
    formData.append('type_id', String(type_id));
    formData.append('step_id', String(step_id));
    if (value.file) {
        formData.append('document', value.file && value.file);
    }
    formData.append('title', String(value.title));
    formData.append('description', String(value?.description));

    try {
        const res = await axiosInstance.post(`/v1/teacher/document/store`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return res.data;
    } catch (err) {
        console.log('Ошибка при добавлении курса', err);
        return err;
    }
};

export const deleteDocument = async (lesson_id: number, content_id: number) => {
    console.log(lesson_id, content_id);

    try {
        const res = await axiosInstance.delete(`/v1/teacher/document/delete?lesson_id=${lesson_id}&document_id=${content_id}`);

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при удалении темы', err);
        return err;
    }
};

export const updateDocument = async (token: string | null, lesson_id: number | null, contentId: number | null, type_id: number, step_id: number, value: any) => {
    console.log(contentId, value);
    let headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    let formData = new FormData();
    let url = `/v1/teacher/document/update?lesson_id=${lesson_id}&document_id=${contentId}&document=${value.file}`;

    formData.append('lesson_id', String(lesson_id));
    formData.append('type_id', String(type_id));
    formData.append('step_id', String(step_id));
    formData.append('lesson_id', String(lesson_id));
    formData.append('document', value.file);
    formData.append('document_id', String(contentId));
    formData.append('title', String(value.title));
    formData.append('description', String(value.description));

    try {
        const res = await axiosInstance.post(url, formData, {
            headers
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при обновлении урока', err);
        return err;
    }
};

// video

export const addVideo = async (value: { file: File | null; title: string; description: string; video_link: string; cover: string | null }, lesson_id: number, videoType: number, type_id: number, step_id: number) => {
    const formData = new FormData();
    url = `v1/teacher/video/store?lesson_id=${lesson_id}&title=${value.title}&description=${value.description}&video_link=${value.video_link}&video_type_id=${videoType}`;
    formData.append('type_id', String(type_id));
    formData.append('step_id', String(step_id));
    formData.append('lesson_id', String(lesson_id));
    formData.append('video_link', String(value?.video_link));
    formData.append('title', String(value?.title));
    formData.append('description', String(value?.description));
    if (value.cover) {
        formData.append('cover', value?.cover && value?.cover);
    }
    try {
        const res = await axiosInstance.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return res.data;
    } catch (err) {
        console.log('Ошибка при добавлении курса', err);
        return err;
    }
};

export const deleteVideo = async (lesson_id: number, content_id: number) => {
    console.log(lesson_id, content_id);

    try {
        const res = await axiosInstance.delete(`/v1/teacher/video/delete?lesson_id=${lesson_id}&video_id=${content_id}`);

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при удалении темы', err);
        return err;
    }
};

export const updateVideo = async (
    token: string | null,
    value: { file: File | null; title: string; description: string; video_link: string; cover: string | null, video_type_id: number },
    lesson_id: number,
    contentId: number,
    videoType: number,
    type_id: number,
    step_id: number
) => {
    let headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    let formData = new FormData();
    url = `/v1/teacher/video/update?lesson_id=${lesson_id}&title=${value.title}&description=${value.description}&video_link=${value.video_link}&video_type_id=${value.video_type_id}&video_id=${contentId}`;
    formData.append('type_id', String(type_id));
    formData.append('step_id', String(step_id));
    formData.append('lesson_id', String(lesson_id));
    formData.append('video_link', value.video_link);
    formData.append('video_type_id', String(value.video_type_id));
    formData.append('video_id', String(contentId));
    formData.append('title', String(value.title));
    formData.append('description', String(value.description));

    try {
        const res = await axiosInstance.post(url, formData, {
            headers
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при обновлении урока', err);
        return err;
    }
};

export const deleteStep = async (lesson_id: number, step_id: number) => {
    console.log(lesson_id, step_id);

    try {
        const res = await axiosInstance.delete(`/v1/teacher/lessons/step/delete?lesson_id=${lesson_id}&step_id=${step_id}`);

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при удалении темы', err);
        return err;
    }
};
