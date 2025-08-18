/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const { layoutConfig, user } = useContext(LayoutContext);

    const byStatus = user?.is_working ? [
        { label: 'Курстар', icon: 'pi pi-fw pi-calendar-clock', to: '/course' },
    ] : user?.is_student ? [
        { label: 'Окуу планы', icon: 'pi pi-fw pi-calendar-clock', to: '/teaching' },
    ] : []

    const model: AppMenuItem[] = [
        {
            label: 'Баракчалар',
            items: [{ label: 'Башкы баракча', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: '',
            items: byStatus
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
