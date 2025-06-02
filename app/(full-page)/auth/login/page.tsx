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

const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    // const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    return (
        <div className={'flex flex-col gap-4'}>
            <InfoBanner title='Кирүү'/>
            <div className="flex gap-4 flex-column lg:flex-row items-center justify-evenly px-4 mb-8">
                    <div className='user-img'>
                        <img src="/layout/images/man.png" className='w-[500px]' alt="" />
                    </div>
                    
                    <div className="lg:w-1/3 shadow-2xl py-6 px-3 md:py-8 md:px-4 sm:px-8 rounded">
                        <div>
                            <label htmlFor="email1" className="block text-900 text-[16px] md:text-xl font-medium mb-1 md:mb-2">
                                MyEdu email
                            </label>
                            <InputText id="email1" type="text" placeholder="email@oshsu.kg" className="w-[90%] mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="password1" className="block text-900 font-medium text-[16px] md:text-xl mb-1 md:mb-2">
                                Сыр сөз
                            </label>
                            <Password inputStyle={{  }} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="" toggleMask className="w-[100%] mb-5" inputClassName="w-[90%]" feedback={false}></Password>

                            {/* <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">Remember me</label>
                                </div>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Forgot password?
                                </a>
                            </div> */}
                            <Button label="Кирүү" className="w-full p-2 md:p-3 text-[14px] md:text-xl" onClick={() => router.push('/')}></Button>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default LoginPage;
