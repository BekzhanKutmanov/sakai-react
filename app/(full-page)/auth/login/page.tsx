/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { use, useContext, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import InfoBanner from '@/app/components/InfoBanner';

import { useForm } from 'react-hook-form';
import { schema } from '@/schemas/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller } from 'react-hook-form';
import { json } from 'stream/consumers';
import { getUser, login } from '@/services/auth';
import FancyLinkBtn from '@/app/components/buttons/FancyLinkBtn';
import { getToken } from '@/utils/auth';
import { logout } from '@/utils/logout';
import { LoginType } from '@/types/login';

const LoginPage = () => {
    const { layoutConfig, setUser, setMessage, setGlobalLoading } = useContext(LayoutContext);

    const router = useRouter();
    // const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const {
        register,
        handleSubmit,
        formState: { errors },
        control
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange'
    });

    const onSubmit = async (value: LoginType) => {
        console.log('Данные пользователя: ', value);

        const user = await login(value);
        console.log(user);
        if (user && user.success) {
            document.cookie = `access_token=${user.token.access_token}; path=/; Secure; SameSite=Strict; expires=${user.token.expires_at}`;

            const token = user.token.access_token;
            if (token) {
                const res = await getUser(token);
                try {
                    if (res?.success) {
                        console.log(res);
                        if (res?.user.is_working) {
                            window.location.href = '/course';
                        }
                    } else {
                        logout({ setUser, setGlobalLoading });
                        setMessage({
                            state: true,
                            value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при авторизации' }
                        }); // messege - Ошибка при авторизации
                        console.log('Ошибка при получении пользователя');
                    }
                } catch (error) {
                    logout({ setUser, setGlobalLoading });
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка при авторизации' }
                    }); // messege - Ошибка при авторизации
                    console.log('Ошибка при получении пользователя');
                }
            }
        } else {
            console.log('Ошибка при авторизации');
        }
    };

    const x = () => {
        console.log('hi');
    };

    return (
        <div className={'flex flex-col gap-4'}>
            <InfoBanner title="Кирүү" />
            <div className="flex gap-4 flex-column lg:flex-row items-center justify-evenly px-4 mb-8">
                <div className="user-img">
                    <img src="/layout/images/man.png" className="w-[500px]" alt="" />
                </div>

                <div className="w-[90%] sm:w-[500px] shadow-2xl py-6 px-3 md:py-8 sm:px-4 md:px-8 rounded">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(onSubmit);
                        }}
                        className="flex flex-col gap-4 md:gap-6"
                    >
                        <div className="flex flex-col">
                            <label htmlFor="email1" className="block text-900 text-[16px] md:text-xl font-medium mb-1 md:mb-2">
                                MyEdu email
                            </label>
                            <InputText {...register('email')} id="email1" type="text" placeholder="email@oshsu.kg" className="w-[90%] p-2 sm:p-3" />
                            {errors.email && <b className="text-red-500 text-[12px] ml-2">{errors.email.message}</b>}
                        </div>
                        <button type="submit" className="w-[90%] p-2 md:p-3 text-[14px] md:text-xl">
                            lorem
                        </button>

                    </form>
                    {/* <div className="flex flex-col">
                                <label htmlFor="password1" className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">
                                    Сыр сөз
                                </label>
                                <Controller
                                    name="password"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => <Password {...field} toggleMask className="w-[100%]" inputClassName="w-[90%] p-2 sm:p-3" inputStyle={{ marginRight: '30px' }} feedback={false} />}
                                />
                                {errors.password && <b className="text-red-500 text-[12px] ml-2">{errors.password.message}</b>}
                            </div> */}
                    {/* <FancyLinkBtn btnWidth={'90%'} backround={'--mainColor'} effectBg={'--titleColor'} title={'Кирүү'} /> */}
                    {/* <Button label="Кирүү" type='submit' className="w-full p-2 md:p-3 text-[14px] md:text-xl"></Button> */}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
