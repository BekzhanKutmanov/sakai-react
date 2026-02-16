import axiosInstance from '@/utils/axiosInstance';
import { Nullable } from 'primereact/ts-helpers';

export const fetchModuleShedule = async (id_specialities: number[], period: number | null, semester: number | null) => {
    try {
        const res = await axiosInstance.get(`/v1/schedule/module`, {
            params: {
                id_specialities: id_specialities,
                id_period: period ? period : null,
                id_semester: semester
            }
        });
        return res.data;
    } catch (err) {
        console.log('Ошибка при получении', err);
        return err;
    }
};

export const fetchSemestr = async () => {
    try {
        const res = await axiosInstance.get('https://api.myedu.oshsu.kg/public/api/open/semester');
        return res.data;
    } catch (err) {
        console.log('Ошибка при получении', err);
        return err;
    }
};

export const sheduleSave = async (from: Nullable<Date>, to: Nullable<Date>, id_period: number | null, id_semester: number | null, id_specialities: number[] | null, id_streams: number[] | null) => {
    const uniq = new Set(id_streams);
    const id_streamsUniq = Array.from(uniq);
    const payload = {
        from: from,
        id_period: id_period,
        id_semester: id_semester,
        id_specialities: id_specialities,
        id_streams: id_streamsUniq,
        to: to
    };
    try {
        const res = await axiosInstance.post('/v1/schedule/module/adjusting', payload);
        return res.data;
    } catch (err) {
        console.log('Ошибка при получении', err);
        return err;
    }
};
