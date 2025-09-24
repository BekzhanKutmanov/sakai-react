import axiosInstance from '@/utils/axiosInstance';

export const fetchItemsLessons = async () => {
    try {
        const res = await axiosInstance.get(`v1/student/streams`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const fetchSubjects = async (params: URLSearchParams) => {
// export const fetchSubjects = async ( id_curricula:number, course_ids: number[], streams: number[]) => {
    
    try {
        const res = await axiosInstance.get(`/v1/student/course/lessons?${params.toString()}`);
        // const res = await axiosInstance.get(`/v1/student/course/lessons?id_curricula=${id_curricula}&course_ids=${course_ids}&streams=${streams}`);
        const data = await res.data;
        
        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const fetchItemsConnect = async () => {
    try {
        const res = await axiosInstance.get(`v1/student/stream/connect`);
        const data = await res.data;
        
        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const itemsCourseInfo = async (course_id: number | null, stream_id: number | null ) => {
    try {
        const res = await axiosInstance.get(`v1/student/course?course_id=${course_id}&stream_id=${stream_id}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
}

// student theme fetch
export const fetchStudentThemes = async (course_id: number) => {    
    try {
        const res = await axiosInstance.get(`v1/student/course/lessons?course_id=${course_id}`);
        const data = await res.data;
        
        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

// fetch student lesson main info
export const fetchMainLesson = async (lesson_id: number | null, stream_id: number) => {    
    console.log(lesson_id);
    
    try {
        const res = await axiosInstance.get(`v1/student/course/lesson/show?lesson_id=${lesson_id}&stream_id=${stream_id}`);
        // const res = await axiosInstance.get(`v1/student/course/lesson/show?lesson_id=${lesson_id}`);
        const data = await res.data;
        
        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

// fetch student steps, lessons
export const fetchStudentSteps = async (step_id: number | null, stream_id: number) => {    
    
    try {
        const res = await axiosInstance.get(`/v1/student/course/lesson/step?step_id=${step_id}&stream_id=${stream_id}`);
        const data = await res.data;
        
        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};
