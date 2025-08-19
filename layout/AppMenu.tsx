/* eslint-disable @next/next/no-img-element */

import React, { useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const { layoutConfig, user, course, setCourses, contextFetchCourse, contextFetchThemes, contextThemes, setContextThemes } = useContext(LayoutContext);

    const [courseList, setCourseList] = useState([]);
    const [clickedCourseId, setClickedCourseId] = useState<number | null>(null);

    const byStatus = user?.is_working
        ? [
              {
                  label: 'Курстар',
                  icon: 'pi pi-fw pi-calendar-clock',
                  items: courseList?.length > 0 ? courseList : []
              }
          ]
        : user?.is_student
        ? [{ label: 'Окуу планы', icon: 'pi pi-fw pi-calendar-clock', to: '/teaching' }]
        : [];

    const model: AppMenuItem[] = [
        {
            label: 'Баракчалар',
            items: [{ label: 'Башкы баракча', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: '',
            items: byStatus
        }
    ];

    useEffect(() => {
        contextFetchCourse();
    }, []);

    useEffect(() => {
        // if (course) {
        //     const forCourse = [];
        //     console.log(course);

        //     course?.data?.map((item) => {
        //         forCourse.push({
        //             label: item.title,
        //             id: item.id,
        //             items: [],
        //             command: () => {
        //                 contextFetchThemes(item.id);
        //             }
        //         });
        //     });
        //     console.log(forCourse);

        //     setCourseList(forCourse);
        // }

        if (course) {
            const forCourse = [{ label: 'Курс', id: 0, to: '/course' }];
            course.data?.map((item: any) =>
                forCourse.push({
                    label: item.title,
                    id: item.id,
                    items: [], // пока пусто
                    command: () => {
                        contextFetchThemes(item.id);
                        setClickedCourseId(item.id);
                    }
                })
            );
            setCourseList(forCourse);
        }
    }, [course]);

    useEffect(() => {
        if (contextThemes && contextThemes.lessons) {
            const newThemes = contextThemes.lessons.data.map((item: any) => ({
                label: item.title,
                id: item.id,
                to: `/course/${clickedCourseId}/${item.id}`,
                command: () => {
                    console.log('clicked theme', item.id);
                }
            }));
            console.log(newThemes);

            setCourseList((prev) =>
                prev.map((course) =>
                    course.id === clickedCourseId
                        ? { ...course, items: newThemes } // добавляем темы
                        : course
                )
            );
        }
    }, [contextThemes]);

    useEffect(() => {
        console.log(courseList);
    }, [courseList]);

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
