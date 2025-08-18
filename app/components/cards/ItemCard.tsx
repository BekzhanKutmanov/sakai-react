'use client';

import { Button } from 'primereact/button';
import React from 'react';

export default function ItemCard() {
    return (
        // <div className="w-[350px] sm:w-[300px] shadow rounded p-3 ">
        <div className="w-[100%] md:w-[300px] shadow rounded p-3 ">
            <div className="w-full shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                <h3 className="text-[16px] ">Lorem ipsum dolor, sit amet consectetur adipisicing.</h3>
            </div>
            <div className='flex flex-col gap-1'>
                <div className="flex flex-col gap-1 p-1 rounded  bg-[var(--mainBgColor)]">
                    <div className="flex gap-1 items-center">
                        <span className="text-[var(--mainColor)]">Окутуучу:</span>
                        <span>{'Асилбек Жапаркулов'}</span>
                    </div>
                    <div className='flex sm:items-center gap-1 justify-between '>
                        <div className="flex gap-1 items-center">
                            <span className="text-[var(--mainColor)]">Тип:</span>
                            <span>{'Лекция'}</span>
                        </div>
                        {
                            // <div className="relative">
                            <Button label="Курс" icon="pi pi-arrow-right text-sm" iconPos="right"/>
                            // <span className='text-[var(--mainColor)] underline'>Курска өтүү -></span>
                        }
                    </div>
                </div>
                <div className="flex flex-col gap-1 p-1 rounded bg-[var(--mainBgColor)]">
                    <div className="flex gap-1 items-center">
                        <span className="text-[var(--mainColor)]">Окутуучу:</span>
                        <span>{'Асилбек ажапаркулов'}</span>
                    </div>
                    <div className='flex sm:items-center gap-1 justify-between '>
                        <div className="flex gap-1 items-center">
                            <span className="text-[var(--mainColor)]">Тип:</span>
                            <span>{'Лекция'}</span>
                        </div>
                        {
                            // <div className="relative">
                            <Button label="Курс" icon="pi pi-arrow-right text-sm" iconPos="right"/>
                            // <span className='text-[var(--mainColor)] underline'>Курска өтүү -></span>
                        }
                    </div>
                </div>
                
            </div>

            
        </div>
    );
}
