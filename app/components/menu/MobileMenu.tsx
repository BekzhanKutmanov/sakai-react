'use client';

import React, { useContext, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useMediaQuery from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import Notification from '@/app/components/notification/Notification';
import { TieredMenu } from 'primereact/tieredmenu';
import type { TieredMenu as TieredMenuRef } from 'primereact/tieredmenu';

export const BottomNav = () => {
    const pathname = usePathname();
    const { contextNotifications } = useContext(LayoutContext);
    const menu = useRef<TieredMenuRef>(null);
    const student_notification = [
        {
            label: '',
            template: <Notification notification={contextNotifications} />
        }
    ];

    const toggleMenu = (e: any) => {
        menu.current?.toggle(e);
        // setMobile(prev => !prev);
    };

    const stop = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
    };

    const navItems = [
        { label: 'Главная', icon: 'pi-home', href: '/' },
        { label: 'Панель', icon: 'pi-th-large', href: '/studentHome' },
        { label: 'Обучение', icon: 'pi-graduation-cap', href: '/teaching' },
        { label: 'Уведомления', icon: 'pi-bell', href: '/notifications' }
    ];

    return (
        <div className="w-full sticky bottom-1 right-0 bg-[white] my-border-top rounded-t-[-5.5rem] rounded-xl z-50 flex justify-center">
            <nav className="flex items-center justify-between w-full px-2 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-2xl">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const isNotificate = item?.icon === 'pi-bell';

                    return (
                        <Link onClick={(e) => {
                            if(isNotificate) {
                                toggleMenu(e);
                                stop(e);
                            }

                        }} key={item.href} href={item.href} className="relative flex flex-col items-center justify-center flex-1 group">
                            {/* Активный фон-пилюля */}
                            <div className={`absolute inset-0 mx-2 transition-all duration-300 ease-in-out rounded-2xl ${isActive ? 'text-[red] scale-100 opacity-100' : 'scale-75 opacity-0 group-active:opacity-50'}`} />

                            {/* Иконка и текст */}
                            <div className="relative z-10 flex flex-col items-center py-1">
                                {item?.icon === 'pi-bell' && contextNotifications?.length > 0 ? <div className={`absolute -right-1 -top-1 px-1 bg-[var(--amberColor)] rounded text-white text-[11px]`}>{contextNotifications.length}</div> : ''}
                                <i className={`pi ${item.icon} transition-all duration-300 ${isActive ? 'text-[var(--mainColor)] scale-110 -translate-y-0.5' : 'text-[var(--bodyColor)] dark:text-white'}`} style={{ fontSize: '1rem' }} />

                                <span className={`text-[10px] mt-1 font-semibold transition-colors duration-300 ${isActive ? 'text-[var(--mainColor)] scale-110 -translate-y-0.5' : 'text-[var(--bodyColor)] dark:text-white'}`}>{item.label}</span>
                            </div>
                            <TieredMenu
                                model={student_notification}
                                popup
                                ref={menu}
                                breakpoint="1000px"
                                // style={{ maxWidth: media ? '300px' : '500px', left: '10px' }}
                                style={{ maxWidth: '500px', left: '8px' }}
                                className={`${contextNotifications?.length < 1 ? 'min-w-[250px]' : 'min-w-[310px]'}  max-h-[370px] mt-4 overflow-y-scroll`}
                                pt={{
                                    root: { className: 'bg-white border border-gray-300 rounded-md shadow-md translate-y-[-100%]' },
                                    menu: { className: 'transition-all' },
                                    menuitem: { className: 'text-[var(--titleColor)] text-[14px] py-1 hover:shadow-xl border-gray-200' },
                                    action: { className: `flex justify-center items-center gap-2` }, // для иконки + текста не работает :)
                                    icon: { className: 'text-[var(--titleColor)] mx-1' }
                                    // submenuIcon: { className: 'text-gray-400 ml-auto' }
                                }}
                            />
                            {/* Маленькая точка под активным пунктом */}
                            {isActive && <div className="absolute -bottom-1 w-1 h-1 bg-[var(--mainColor)] rounded-full shadow-[0_0_8px_rgba(79,70,229,0.6)]" />}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};
