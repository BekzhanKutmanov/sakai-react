'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useMediaQuery from '@/hooks/useMediaQuery';

export const BottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        { label: 'Главная', icon: 'pi-home', href: '/' },
        { label: 'Панель', icon: 'pi-th-large', href: '/studentHome' },
        { label: 'Обучение', icon: 'pi-graduation-cap', href: '/teaching' },
        { label: 'Уведомления', icon: 'pi-bell', href: '/notifications' }
    ];

    return (
        <div className="w-full sticky bottom-1 right-0 bg-[white] my-border-top rounded-t-[-5.5rem] rounded z-50 flex justify-center">
            <nav className="flex items-center justify-between w-full px-2 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-2xl">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link key={item.href} href={item.href} className="relative flex flex-col items-center justify-center flex-1 group">
                            {/* Активный фон-пилюля */}
                            <div className={`absolute inset-0 mx-2 transition-all duration-300 ease-in-out rounded-2xl ${isActive ? 'text-[red] scale-100 opacity-100' : 'scale-75 opacity-0 group-active:opacity-50'}`} />

                            {/* Иконка и текст */}
                            <div className="relative z-10 flex flex-col items-center py-1">
                                <i className={`pi ${item.icon} transition-all duration-300 ${isActive ? 'text-[var(--mainColor)] scale-110 -translate-y-0.5' : 'text-[var(--bodyColor)] dark:text-white'}`} style={{ fontSize: '1rem' }} />

                                <span className={`text-[10px] mt-1 font-semibold transition-colors duration-300 ${isActive ? 'text-[var(--mainColor)] scale-110 -translate-y-0.5' : 'text-[var(--bodyColor)] dark:text-white'}`}>{item.label}</span>
                            </div>

                            {/* Маленькая точка под активным пунктом */}
                            {isActive && <div className="absolute -bottom-1 w-1 h-1 bg-[var(--mainColor)] rounded-full shadow-[0_0_8px_rgba(79,70,229,0.6)]" />}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};
