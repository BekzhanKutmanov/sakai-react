'use client';

import { getToken } from '@/utils/auth';
import { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { getUser } from '@/services/auth';

const SessionManager = () => {
    const [checkUser, setCheckUser] = useState(getToken('access_token'));
    const { user, setUser } = useContext(LayoutContext);
    const { globalLoading, setGlobalLoading } = useContext(LayoutContext);

    useEffect(() => {
        console.log('Пользователь ', user);
    }, [user]);

    useEffect(() => {
        console.log('Роутинг!');

        const init = async () => {
            const token = getToken('access_token');
            if (token) {
                const res = await getUser(token);
                setGlobalLoading(true);
                if (res?.success) {
                    console.log('Данные успешно пришли ', res);
                    setGlobalLoading(false);
                    const userVisit = localStorage.getItem('userVisit');
                    if(!userVisit){
                        // messege - Успех!
                        localStorage.setItem('userVisit', JSON.stringify(true));
                    }
                    setUser(res.user);
                } else {
                    setGlobalLoading(false)
                    // messege - Ошибка при авторизации
                    localStorage.removeItem('userVisit');
                    console.log('Ошибка при получении пользователя');
                }
            } else {
                setGlobalLoading(false);
            }
        };
        init();
    }, []);

    useEffect(() => {
        const checkToken = () => {
            const token = getToken('access_token');

            if (!token) {
                console.log('Токен отсутствует - завершаем сессию');
               // messege - Время сесси завершилось
               
                setGlobalLoading(false)
                setUser(null);
                localStorage.removeItem('userVisit');
                document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
                return false; // сигнал для остановки интервала
            }
            return true;
        };

        // немедленная проверка
        if (!checkToken()) return;

        const interval = setInterval(() => {
            if (!checkToken()) {
                clearInterval(interval);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return null;
};

export default SessionManager;