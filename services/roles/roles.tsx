import axiosInstance from "@/utils/axiosInstance";
let url = '';

export const fetchRolesList = async () => {
    url = process.env.NEXT_PUBLIC_BASE_URL + '/roles/list';
    
    try {
        const res = await axiosInstance.get(url);

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при получении пользователя', err);
        return err;
    }   
};

export const fetchRolesUsers = async (page:number, search: string | null, myedu_id: string | null, role_id: number | null, active: boolean | null) => {
    try { 
        const res = await axiosInstance.get(`/roles/users?search=${search}&myedu_id=${myedu_id ? Number(myedu_id) : 0}&${role_id ? `role_id=${role_id}` : 'role_id='}${role_id ? `${active ? `&active=${active ? 1 : 0}` : '&active='}` : '&active='}&page=${page}&limit=`);

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при получении пользователя', err);
        return err;
    }
};

export const controlRolesUsers = async (worker_id: number | null, role_id: number | null, active: boolean | null) => {
    const payload = {
        worker_id,
        role_id,
        active
    }
    
    try { 
        const res = await axiosInstance.post(`/roles/control`, payload);

        const data = res.data;
        return data;
    } catch (err) {
        console.log('Ошибка при изменении роля', err);
        return err;
    }
};