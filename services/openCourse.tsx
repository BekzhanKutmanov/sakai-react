import axiosInstance from "@/utils/axiosInstance";

export const fetchOpenCourses = async (page: number, audence_type_id: number | string, search: string) => {
    try {
        const res = await axiosInstance.get(`/open/courses?course_audience_type_id=${audence_type_id}&${search?.length > 0 ? `search=${search}` : 'search='}&page=${page}&limit=1`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};

export const openCourseShow = async (course_id: number) => {
    try {
        const res = await axiosInstance.get(`/open/course/show?course_id=${course_id}`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};