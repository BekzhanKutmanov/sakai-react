/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
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

const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    // const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const {register, handleSubmit, formState: { errors }, control} = useForm({
        resolver:yupResolver(schema), mode: 'onChange',
    });

    const onSubmit = async (data) => {
        console.log(data);
        
        // console.log("Данные формы:", data);
        try {
            const res = await fetch('https://mooc.oshsu.kg/api/v2/login', {
                method:"POST",
                headers: {
                    'Content-Type': 'application/json',
                    // 'mode':'no-cors',
                },
                credentials: "include",
                body: JSON.stringify({
                    email : "kalilov054720@oshsu.kg",
                    password : "054720"
                }),
                // body: JSON.stringify(data),
            })
        } catch(err){
            console.log("Ошибка ",err);
        }
    };

    return (
        <div className={'flex flex-col gap-4'}>
            <InfoBanner title='Кирүү'/>
            <div className="flex gap-4 flex-column lg:flex-row items-center justify-evenly px-4 mb-8">
                    <div className='user-img'>
                        <img src="/layout/images/man.png" className='w-[500px]' alt="" />
                    </div>
                    
                    <div className="w-[90%] sm:w-[500px] shadow-2xl py-6 px-3 md:py-8 sm:px-4 md:px-8 rounded">
                        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 md:gap-6'>
                            <div className='flex flex-col'>
                                <label htmlFor="email1" className="block text-900 text-[16px] md:text-xl font-medium mb-1 md:mb-2">
                                    MyEdu email
                                </label>
                                <InputText {...register("email")} id="email1" type="text" placeholder="email@oshsu.kg" className="w-[90%] p-2 sm:p-3" />
                                {errors.email && <b className="text-red-500 text-[12px] ml-2">{errors.email.message}</b>}
                            </div>  
                            
                            <div className='flex flex-col'>
                                <label htmlFor="password1" className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">
                                    Сыр сөз
                                </label>
                                <Controller
                                    name="password"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Password
                                        {...field}
                                        toggleMask
                                        className="w-[100%]"
                                        inputClassName="w-[90%] p-2 sm:p-3"
                                        inputStyle={{marginRight:'30px'}}
                                        feedback={false}
                                        />
                                    )}
                                    />
                                    {errors.password && (
                                    <b className="text-red-500 text-[12px] ml-2">
                                        {errors.password.message}
                                    </b>
                                    )}
                                </div>
                            <Button label="Кирүү" type='submit' className="w-full p-2 md:p-3 text-[14px] md:text-xl"></Button>
                        </form>
                    </div>
                </div>
        </div>
    );
};

export default LoginPage;
