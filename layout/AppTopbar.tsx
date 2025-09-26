/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Tiered from '@/app/components/popUp/Tiered';
import FancyLinkBtn from '@/app/components/buttons/FancyLinkBtn';
import { classNames } from 'primereact/utils';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/utils/logout';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar, user, setUser, setGlobalLoading, departament } = useContext(LayoutContext);

    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const pathName = usePathname();
    const media = useMediaQuery('(max-width: 1000px)');

    const [skeleton, setSkeleton] = useState(true);

    const router = useRouter();

    const mobileMenu = [
        user
            ? {
                  label: 'Профиль',
                  icon: 'pi pi-user',
                  items: [
                      {
                          label: '',
                          template: (
                              <div className="flex items-center flex-col gap-1 text-sm">
                                  <div className="flex gap-1">
                                      <span className="text-[var(--titleColor)]">{user?.last_name}</span>
                                      <span className="text-[var(--titleColor)]">{user?.name}</span>
                                  </div>
                                  <span className="text-gray-500 text-[12px]">{user?.email}</span>
                              </div>
                          )
                      },
                      {
                          label: 'Выход',
                          icon: 'pi pi-sign-out',
                          className: 'text-[12px]',
                          items: [],
                          command: () => {
                              window.location.href = '/auth/login';
                              logout({ setUser, setGlobalLoading });
                          }
                      }
                  ]
              }
            : {
                  label: 'Вход',
                  icon: 'pi pi-sign-in',
                  items: [],
                  //   url: '/auth/login'
                  command: () => {
                      // router.push('/auth/login');
                      window.location.href = '/auth/login';
                  }
              },
        {
            label: 'Сайт ОшГУ',
            icon: '',
            items: [],
            url: 'https://oshsu.kg'
        }
    ];

    // profile
    const profileItems = [
        {
            label: '',
            template: (
                <div className="flex items-center flex-col gap-1 text-sm">
                    <div className="flex gap-1">
                        <span className="text-[var(--titleColor)]">{user?.last_name}</span>
                        <span className="text-[var(--titleColor)]">{user?.name}</span>
                    </div>
                    <span className="text-gray-500 text-[12px]">{user?.email}</span>
                </div>
            )
        },
        {
            label: 'Выход',
            icon: 'pi pi-sign-out',
            items: [],
            command: () => {
                window.location.href = '/auth/login';
                logout({ setUser, setGlobalLoading });
            }
        }
    ];

    useEffect(()=> {
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
    },[]);

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                {/* <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" /> */}
                <img src={`/layout/images/logo-remove.png`} className="w-[90px] sm:w-[100px]" alt="logo" />
                <h3 className="hidden sm:block text-[18px] md:text-[30px]">Цифровой кампус ОшГУ</h3>
            </Link>

            {pathName !== '/' ? (
                departament.name.length > 0 ? (
                    <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                        <i className="pi pi-bars text-[var(--mainColor)]" />
                    </button>
                ) : pathName !== '/course' ? (
                    <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                        <i className="pi pi-bars text-[var(--mainColor)]" />
                    </button>
                ) : (
                    ''
                )
            ) : (
                ''
            )}

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <div className="flex items-center gap-4">
                    {media ? (
                        <Tiered title={{ name: '', font: 'pi pi-ellipsis-v' }} insideColor={'--bodyColor'} items={mobileMenu} />
                    ) : (
                        <div className={`flex items-center gap-3 ${!media ? 'order-2' : 'order-3'} `}>
                            <Link className="text-[var(--titleColor)] text-sm hover:text-[var(--mainColor)]" href={'https://oldmooc.oshsu.kg/'} target='_blank'>Старый Mooc</Link>
                            <Link className="text-[var(--titleColor)] text-sm hover:text-[var(--mainColor)]" href={'https://www.oshsu.kg/ru'} target='_blank'>Сайт ОшГУ</Link>
                        </div>
                    )}

                    {skeleton ? <div className="w-[150px]"><GroupSkeleton count={1} size={{ width: '100%', height: '3rem' }} /></div>
                    : user ? (
                        <div className={`hidden lg:block ${media ? 'order-1' : 'order-2'}`}>
                            <Tiered title={{ name: '', font: 'pi pi-user' }} items={profileItems} insideColor={'--titleColor'} />
                        </div>
                    ) : (
                        <div className={`hidden lg:block ${media ? 'order-1' : 'order-2'}`}>
                            <Link href={'/auth/login'}>
                                <FancyLinkBtn btnWidth={'100px'} backround={'--redColor'} effectBg={'--mainColor'} title={'Вход'} />
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* {media && mobileMenu} */}
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
