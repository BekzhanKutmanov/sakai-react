/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from './context/layoutcontext';
import axiosInstance from '@/utils/axiosInstance';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [univer, setUniver] = useState<{ address_kg: string; contact_kg: string, info_ru: string, info_en: string }>({ address_kg: '', contact_kg: '', info_ru: '', info_en:'' });
    // dark mode
    // <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Logo" height="20" className="mr-2" />

    const fetchInfo = async () => {
        try {
            const res = await axiosInstance.get('https://api.myedu.oshsu.kg/public/api/open/universities');
            const data = res.data;
            return data;
        } catch (err) {
            console.log('Ошибка при получении данных', err);
        }
    };

    useEffect(() => {
        const handleInfo = async ()=> {
            const data = await fetchInfo();
            console.log(data);

            if(data){
                setUniver({
                    address_kg: data[0]?.address_kg,
                    contact_kg: data[0]?.contact_kg,
                    info_ru: data[0]?.info_ru,
                    info_en: data[0]?.info_en,
                    // contact_kg: data[0]?.contact_kg  
                });
            }
        }
        handleInfo();
    }, []);

    useEffect(() => {
        console.log(univer);
    }, [univer]);

    return (
        <footer className="text-white">
            <div className="w-full absolute left-0 bg-[#A00e07]">
                <div className="flex flex-col md:flex-row gap-2 md:gap-8 border-b-1 border-white p-[30px] md:px-14 md:py-10">
                    <div>
                        <img src={'/layout/images/logo-remove-white.png'} width={70} height={80} alt="Логотип" />
                        <div className="flex flex-col text-[14px] sm:text-[16px]">
                            <span>{univer.address_kg}</span>
                            <span>{univer.contact_kg}</span>
                        </div>
                    </div>
                    {/* <div className="flex flex-col items-start gap-4 w-[200px]">
                        <div className="flex items-center gap-2">
                            <MyFontAwesome icon={faChalkboard} className="text-white text-[18px] sm:text-2xl" />
                            <h4 style={{ color: 'white' }} className="text-[18px] sm:text-[22px]">
                                Курстар
                            </h4>
                        </div>
                        <div className="flex flex-col justify-center items-center gap-2 text-[14px] sm:text-[16px]">
                            <Link href={'#'}>lorem ipsum</Link>
                            <Link href={'#'}>lorem ipsum</Link>
                            <Link href={'#'}>lorem ipsum</Link>
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-4 w-[200px]">
                        <div className="flex items-center gap-2">
                            <MyFontAwesome icon={faPhone} className="text-white text-[18px] sm:text-2xl" />
                            <h4 style={{ color: 'white' }} className="text-[18px] sm:text-[22px]">
                                Байланыш
                            </h4>
                        </div>
                        <div className="flex flex-col justify-center items-center gap-2 text-[14px] sm:text-[16px]">
                            <Link href={'#'}>lorem ipsum</Link>
                            <Link href={'#'}>lorem ipsum</Link>
                            <Link href={'#'}>lorem ipsum</Link>
                        </div>
                    </div> */}
                </div>
                <p style={{ color: 'white' }} className="flex flex-col p-1 sm:p-5 text-[12px] sm:text=[14px] sm:w-[400px] m-auto text-center ">
                    <span>©{univer.info_ru} | {univer.info_en} IT Academy</span>
                    <span>Ошский Государственный Университет oshsu.kg</span>
                </p>
            </div>
        </footer>
    );
};

export default AppFooter;
