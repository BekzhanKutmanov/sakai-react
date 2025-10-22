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
import { getNotifications } from '@/services/notifications';
import { mainNotification } from '@/types/mainNotification';
import { TieredMenu } from 'primereact/tieredmenu';
import type { TieredMenu as TieredMenuRef } from 'primereact/tieredmenu';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    type OptionsType = Intl.DateTimeFormatOptions;

    const { layoutState, onMenuToggle, user, setUser, setGlobalLoading, setContextNotificationId } = useContext(LayoutContext);

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
    const menu = useRef<TieredMenuRef>(null);

    const [skeleton, setSkeleton] = useState(true);
    const [notification, setNotification] = useState<mainNotification[]>([]);

    const handleNotifications = async () => {
        const data = await getNotifications();
        if (data && Array.isArray(data)) {
            setNotification(data);
        }
    };

    const dateTime = (createdAt: string | null) => {
        const invalidDate = <div>---</div>;
        if (notification && createdAt) {
            const dateObject = new Date(createdAt);
            if (dateObject) {
                const options: OptionsType = {
                    month: 'short', // 'long', 'short', 'numeric'
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false // 24-часовой формат
                };
                const formattedString = dateObject.toLocaleString('ru-RU', options);
                const result = formattedString?.replace(/,/g, '');
                if (formattedString) {
                    return <div>{result}</div>;
                } else {
                    return invalidDate;
                }
            } else {
                return invalidDate;
            }
        } else {
            return invalidDate;
        }
    };

    const working_notification = [
        // {
        //     label: '',
        //     template: (
        //         <Link href={'/videoInstruct'} className="flex items-center flex-col gap-1 text-sm">
        //             Видеоинструкция
        //         </Link>
        //     )
        // },
        {
            label: '',
            template: (
                <div className="flex flex-col justify-center p-2 gap-1">
                    {notification?.length > 0 ? (
                        notification?.map((item) => {
                            return (
                                <div key={item?.id} className="w-full flex flex-col justify-center shadow p-2 gap-2">
                                    <div className="w-full flex justify-between">
                                        <Link
                                            onClick={() => setContextNotificationId(item?.id)}
                                            className='cursor-pointer hover:underline'
                                            href={`/students/${item?.meta?.course_id}/${item?.meta?.connect_id}/${item?.meta?.stream_id}/${item?.meta?.student_id}/${item?.meta?.lesson_id}/${item?.meta?.step_id}`}
                                        >
                                            <b className="text-[var(--mainColor)]">{item?.type?.title}</b>
                                        </Link>
                                        <span className="text-sm w-[13px] h-[13px] rounded-full bg-[var(--amberColor)]"></span>
                                    </div>
                                    <p className="m-0 text-[13px]">
                                        {item?.from_user?.father_name} {item?.from_user?.name}
                                    </p>
                                    <div className="w-full relative flex">
                                        <p className="absolute right-0 -top-3 text-[12px] m-0">{dateTime(item?.created_at)}</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center">Сообщений нет</p>
                    )}
                </div>
            )
        }
    ];

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
            label: 'Уведомление',
            icon: (
                <div className="p-overlay-badge">
                    <i className="pi pi-bell p-menuitem-icon" style={{ fontSize: '1.5rem' }}></i>
                    {/* Условное отображение красного кружка (бэйджа) */}
                    {notification?.length > 0 && (
                        // <div className='w-full relative'>
                        <span className="absolute w-[10px] h-[10px] right-[10px] top-[5px] bg-[var(--amberColor)] rounded-full "></span>
                        // </div>
                    )}
                </div>
            ),
            items: [
                {
                    label: '',
                    template: (
                        // <div className='max-h-[100px] overflow-y-auto'>
                            <div className="flex flex-col items-center max-h-[200px] overflow-y-auto p-2 gap-1"> 
                                {notification?.length > 0 ? (
                                    notification?.map((item) => {
                                        return (
                                            <div key={item?.id} className="w-full cursor-pointer flex flex-col justify-center shadow p-1 gap-1">
                                                <div className="w-full flex justify-between">
                                                    <Link
                                                        onClick={() => setContextNotificationId(item?.id)}
                                                        href={`/students/${item?.meta?.course_id}/${item?.meta?.connect_id}/${item?.meta?.stream_id}/${item?.meta?.student_id}/${item?.meta?.lesson_id}/${item?.meta?.step_id}`}
                                                    >
                                                        <b className="text-[var(--mainColor)] text-[12px]">{item?.type?.title}</b>
                                                    </Link>
                                                    <span className="text-sm w-[12px] h-[12px] text-[13px] rounded-full bg-[var(--amberColor)]"></span>
                                                </div>
                                                <p className="m-0 text-[11px]">
                                                    {item?.from_user?.last_name} {item?.from_user?.name}
                                                </p>
                                                <div className="w-full relative flex">
                                                    <p className="absolute right-0 -top-3 text-[10px] m-0">{dateTime(item?.created_at)}</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-center text-[12px]">Сообщений нет</p>
                                )}
                            </div>
                        // </div>
                    )
                }
            ]
        },
        {
            label: 'Старый Mooc',
            icon: '',
            items: [],
            url: 'https://oldmooc.oshsu.kg/'
        },
        {
            label: 'Сайт ОшГУ',
            icon: '',
            items: [],
            url: 'https://oshsu.kg'
        }
        // {
        //     label: 'Видеоинструкция',
        //     icon: '',
        //     items: [],
        //     url: '/videoInstruct'
        // },
    ];

    const mobileStudentMenu = [
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
            label: 'Старый Mooc',
            icon: '',
            items: [],
            url: 'https://oldmooc.oshsu.kg/'
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

    //

    const student_notification = [
        {
            // label: ''
        }
    ];

    const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        menu.current?.toggle(e);
        // setMobile(prev => !prev);
    };

    useEffect(() => {
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
    }, []);

    useEffect(() => {
        if (user?.is_working) {
            handleNotifications();
        }
    }, [user]);

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                {/* <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" /> */}
                <img src={`/layout/images/logo-remove.png`} className="w-[90px] sm:w-[100px]" alt="logo" />
                <h3 className="hidden sm:block text-[18px] md:text-[30px]">Цифровой кампус ОшГУ</h3>
            </Link>

            {pathName !== '/' ? (
                // departament.name.length > 0 ? (
                !pathName.startsWith('/pdf') && !pathName.startsWith('/students/') && !pathName.startsWith('/videoInstruct') ? (
                    <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                        <i className="pi pi-bars text-[var(--mainColor)]" />
                    </button>
                ) : (
                    ''
                )
            ) : (
                // )
                // : pathName !== '/course' ? (
                //     <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                //         <i className="pi pi-bars text-[var(--mainColor)]" />
                //     </button>
                // )
                // : (
                //     ''
                // )
                ''
            )}

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <div className="flex items-center gap-4">
                    {media ? (
                        <div className="relative">
                            <div className="absolute w-[10px] h-[10px] right-[10px] top-[5px] bg-[var(--amberColor)] rounded-full"></div>
                            <div className='max-h-[100px] overflow-hidden'><Tiered title={{ name: '', font: 'pi pi-ellipsis-v' }} insideColor={'--bodyColor'} items={user?.is_student ? mobileStudentMenu : user?.is_working ? mobileMenu : []} /></div>
                        </div>
                    ) : (
                        <div className={`flex items-center gap-3 ${!media ? 'order-2' : 'order-3'} `}>
                            <Link className="text-[var(--titleColor)] text-sm hover:text-[var(--mainColor)]" href={'https://oldmooc.oshsu.kg/'} target="_blank">
                                Старый Mooc
                            </Link>
                            <Link className="text-[var(--titleColor)] text-sm hover:text-[var(--mainColor)]" href={'https://www.oshsu.kg/ru'} target="_blank">
                                Сайт ОшГУ
                            </Link>
                        </div>
                    )}

                    {skeleton ? (
                        <div className="w-[150px]">
                            <GroupSkeleton count={1} size={{ width: '100%', height: '3rem' }} />
                        </div>
                    ) : user ? (
                        <div className={`hidden lg:flex items-center gap-3 ${media ? 'order-1' : 'order-2'} `}>
                            {user?.is_working && (
                                // <Tiered title={{ name: '', font: 'pi pi-bell' }} items={user?.is_working ? working_notification : user?.is_student ? student_notification : []} insideColor={'--titleColor'} />
                                <div>
                                    <div className="relative">
                                        {notification?.length > 0 ? <div className={`absolute -right-1 -top-1 px-1 bg-[var(--amberColor)] rounded text-white text-[11px]`}>{notification.length}</div> : ''}
                                        <button
                                            // icon={title.font}
                                            onClick={(e) => toggleMenu(e)}
                                            style={{ color: 'black', fontSize: media ? '16px' : '20px' }}
                                            className={`cursor-pointer flex gap-2 items-center px-0 bg-white text-blue-300 p-2 pi pi-bell font-bold`}
                                        />
                                    </div>
                                    <TieredMenu
                                        model={working_notification}
                                        popup
                                        ref={menu}
                                        breakpoint="1000px"
                                        // style={{ maxWidth: media ? '300px' : '500px', left: '10px' }}
                                        style={{ maxWidth: '600px', left: '8px' }}
                                        className={`min-w-[380px] max-h-[370px] mt-4 overflow-y-scroll`}
                                        pt={{
                                            root: { className: `bg-white border w-[500px] border-gray-300 rounded-md shadow-md` },
                                            menu: { className: 'transition-all' },
                                            menuitem: { className: 'text-[var(--titleColor)] text-[14px] py-1 hover:shadow-xl border-gray-200' },
                                            action: { className: `flex justify-center items-center gap-2` }, // для иконки + текста не работает :)
                                            icon: { className: 'text-[var(--titleColor)] mx-1' }
                                            // submenuIcon: { className: 'text-gray-400 ml-auto' }
                                        }}
                                    />
                                </div>
                            )}
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
