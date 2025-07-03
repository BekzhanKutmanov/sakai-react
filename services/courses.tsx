import { AuthBaseType } from '@/types/authBaseType';
import { CourseCreateType } from '@/types/courseCreateType';
import axiosInstance from '@/utils/axiosInstance';

let url = '';

type OnlyTitle = Pick<CourseCreateType, 'title'>;

export const fetchCourses = async (token, page, limit) => {
    try {
        console.log('Номер запрашиваемой страницы ', page);

        const res = await axiosInstance.get(`/v1/teacher/courses?page=${Number(page)}&limit=${limit}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const data = await res.data;

        return data;
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
};

export const addCourse = async (token: string | null, value: CourseCreateType) => {
    const formData = new FormData();
    formData.append('title', value.title);
    formData.append('description', value.description);
    formData.append('image', value.image);
    formData.append('video_url', value.video_url);

    try {
        const res = await axiosInstance.post(`/v1/teacher/courses/store`, formData, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('Урок: ', res.data);

        return res.data;
    } catch (err) {
        console.log('Ошибка при добавлении курса', err);
        return err;
    }
};

export const deleteCourse = async (token: string | null, id: number) => {
    url = process.env.NEXT_PUBLIC_BASE_URL + `/v1/teacher/courses/delete?course_id=${id}`;

    try {
        const res = await axiosInstance.delete(`/v1/teacher/courses/delete?course_id=${id}`, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log(res.data);
        return res.data;
    } catch (err) {
        console.log('Ошибка при удалении курса', err);
        return err;
    }
};

export const updateCourse = async (token: string | null, id: number | null, value) => {
    console.log(value);

    url = process.env.NEXT_PUBLIC_BASE_URL + `/v1/teacher/courses/update?course_id=${id}`;

    const formData = new FormData();
    formData.append('title', value.title);
    formData.append('description', value.description);
    if (value.image instanceof File) {
        formData.append('image', value.image);
    }
    formData.append('video_url', value.video_url);

    try {
        const res = await axiosInstance.post(`/v1/teacher/courses/update?course_id=${id}`, formData, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'multipart/form-data'
            }
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при обновлении курса', err);
        return err;
    }
};

// Themes

export const fetchCourseInfo = async (token: AuthBaseType, id: AuthBaseType) => {
    try {
        const res = await axiosInstance.get(`/v1/teacher/courses/show?course_id=${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при получении темы', err);
        return err;
    }
};

export const addThemes = async (token: string | null, id: number, value: OnlyTitle) => {
    const formData = new FormData();
    formData.append('title', value);

    try {
        const res = await axiosInstance.post(`/v1/teacher/lessons/store?course_id=${id}&title=${value}`,
        formData, 
        {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'multipart/form-data'
            }
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при добавлении темы', err);
        return err;
    }
};

export const fetchThemes = async (token: string | null, id: number) => {
    try {
        const res = await axiosInstance(`/v1/teacher/lessons?course_id=${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при получении темы', err);
        return err;
    }
};

export const updateTheme = async (token: string | null, course_id: number | null, theme_id: number, value: CourseCreateType) => {
    const formData = new FormData();
    formData.append('title', value.title);

    try {
        const res = await axiosInstance.post(`/v1/teacher/lessons/update?course_id=${course_id}&title=${value}&lesson_id=${theme_id}`,
        formData,
        {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'Content-Type': 'multipart/form-data'
            }
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при обновлении темы', err);
        return err;
    }
};

export const deleteTheme = async (token: string | null, id: number) => {

    try {
        const res = await axiosInstance.delete(`/v1/teacher/lessons/delete?lesson_id=${id}`, {
            headers : token ? { Authorization: `Bearer ${token}` } : {}
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при удалении темы', err);
        return err;
    }
};

// Lessons

export const addLesson = async (type: string, token: string | null, courseId: number | null, lessonId: number | null, value: string) => {
    // const formData = new FormData();
    // formData.append('title', value);
    console.log(type);
    
    if(type === 'text'){
        url = `/v1/teacher/textcontent/store?course_id=${courseId}&lesson_id=${lessonId}&content=${value}`
    }

    try {
        const res = await axiosInstance.post(url,
        value, 
        {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при добавлении урока', err);
        return err;
    }
};

export const fetchLesson = async (type: string, token: string | null, courseId: number | null, lessonId: number | null) => {
    let url = '';

    // if(type === 'text'){
        url = `/v1/teacher/textcontent?course_id=${courseId}&lesson_id=${lessonId}`
    // }

    try {
        const res = await axiosInstance.get(url, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        // const data = await res();
        console.log('Урок: ', res.data);

        return res.data;
    } catch (err) {
        console.log('Ошибка при получении урока', err);
        return err;
    }
};

export const updateLesson = async (type: string, token: string | null, course_id: number | null, lesson_id: number | null, contentId: number, value: CourseCreateType) => {
    console.log(contentId ,value);
    
    // if(type === 'text'){
        url = `/v1/teacher/textcontent/update?course_id=${course_id}&lesson_id=${lesson_id}&content_id=${contentId}&content=${value}`
    // }

    try {
        const res = await axiosInstance.post(url,
        value,
        {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при обновлении урока', err);
        return err;
    }
};

export const deleteLesson = async (token: string | null, courseId: number | null, lesson_id: number | null, content_id : number | null) => {

    try {
        const res = await axiosInstance.delete(`/v1/teacher/textcontent/delete?course_id=${courseId}&lesson_id=${lesson_id}&content_id=${content_id}`, {
            headers : token ? { Authorization: `Bearer ${token}` } : {}
        });

        const data = await res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при удалении урока', err);
        return err;
    }
};