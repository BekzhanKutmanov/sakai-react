import axiosInstance from '@/utils/axiosInstance';

export const getNotifications = async () => {
    try {
        const res = await axiosInstance.get(`/v1/notifications`);
        const data = await res.data;

        return data;
    } catch (err) {
        console.log('Ошибка загрузки:', err);
        return err;
    }
};