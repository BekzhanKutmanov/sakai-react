import axiosInstance from "@/utils/axiosInstance";

export const fetchTeacherDashboard = async () => {

    try {
        const res = await axiosInstance.get('/v1/teacher/dashboard');

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при получении', err);
        return [];
    }
};

export const fetchDashboardPerformance = async () => {

    try {
        const res = await axiosInstance.get('/v1/teacher/dashboard/performance');

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при получении', err);
        return [];
    }
};

export const fetchTelegramQr = async () => {
    try {
        const response = await axiosInstance.get('/v1/telegram/showQr');
        return response.data;
    } catch (error: any) {
        return error;
    }
};
