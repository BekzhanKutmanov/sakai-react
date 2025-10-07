'use client';
import React, { useState, createContext, useEffect } from 'react';
import { LayoutState, ChildContainerProps, LayoutConfig, LayoutContextProps } from '@/types';
import SessionManager from '@/app/components/SessionManager';
import GlobalLoading from '@/app/components/loading/GlobalLoading';
import Message from '@/app/components/messages/Message';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { User } from '@/types/user';
import { MessageType } from '@/types/messageType';
import { fetchCourses, fetchThemes } from '@/services/courses';
import { fetchStudentThemes } from '@/services/studentMain';
import { myMainCourseType } from '@/types/myMainCourseType';
import { usePathname } from 'next/navigation';

export const LayoutContext = createContext({} as LayoutContextProps);

export const LayoutProvider = ({ children }: ChildContainerProps) => {
    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'static',
        colorScheme: 'light',
        theme: 'lara-light-indigo',
        scale: 14
    });

    const [layoutState, setLayoutState] = useState<LayoutState>({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        profileSidebarVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false
    });

    const pathname = usePathname();

    // Добавляем пользователя
    const [user, setUser] = useState<User | null>(null);

    // Глобальная загрузка
    const [globalLoading, setGlobalLoading] = useState<boolean>(false);

    // Сообщение об ошибке/успехе
    const [message, setMessage] = useState<MessageType>({ state: false, value: {} });

    const onMenuToggle = () => {
        if (isOverlay()) {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, overlayMenuActive: !prevLayoutState.overlayMenuActive }));
        }

        if (isDesktop()) {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive }));
        } else {
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive }));
        }
    };

    const showProfileSidebar = () => {
        setLayoutState((prevLayoutState) => ({ ...prevLayoutState, profileSidebarVisible: !prevLayoutState.profileSidebarVisible }));
    };

    const isOverlay = () => {
        return layoutConfig.menuMode === 'overlay';
    };

    const isDesktop = () => {
        return window.innerWidth > 991;
    };

    // breadCrumb urls
    const isTopicsChildPage = /^\/teaching\/[^/]+\/[^/]+$/.test(pathname);
    const [crumbUrls, setCrumbUrls] = useState<{ type: string; crumbUrl: string }>({ type: '', crumbUrl: '' });
    const contextAddCrumb = (url: { type: string; crumbUrl: string }) => {
        const urlName = url.type === 'studentStream' ? 'studentStream' : '';
        setCrumbUrls((prev) => ({ ...prev, [urlName]: url.crumbUrl }));
    };

    // fetch course
    const [mainCourseId, setMainCourseId] = useState<number | null>(null);
    const [course, setCourses] = useState<{ current_page: number; total: number; per_page: number; data: myMainCourseType[] }>({ current_page: 1, total: 0, per_page: 10, data: [] });

    const contextFetchCourse = async (page: number) => {
        const data = await fetchCourses(page, 0);

        if (data?.courses) {
            // setCourses(data.courses.data);
            setCourses(data.courses);
        }
    };

    // fetch themes
    const [deleteQuery, setDeleteQuery] = useState(false);
    const [updateQuery, setUpdateeQuery] = useState(false);
    const [contextThemes, setContextThemes] = useState([]);
    const contextFetchThemes = async (id: number | null, id_kafedra: number | null) => {
        const data = await fetchThemes(Number(id) || null, id_kafedra);
        if (data) {
            console.log(data);
            setContextThemes(data);
        }
    };

    // fetch themes for student
    const [contextStudentThemes, setContextStudentThemes] = useState([]);
    const contextFetchStudentThemes = async (id: number) => {
        const data = await fetchStudentThemes(id);

        setContextStudentThemes(data);
    };

    // fetch themes for student
    const [contextNewStudentThemes, setContextNewStudentThemes] = useState([]);

    // departament
    const [departament, setDepartament] = useState<{ last_name: string; name: string; father_name: string; info: string }>({ last_name: '', name: '', father_name: '', info: '' });

    useEffect(() => {
        // if (pathname === '/course' && !departament.name) {
        if (pathname.startsWith('/pdf')  || pathname.startsWith('/videoInstruct') ) {
            setLayoutState((prev) => ({
                ...prev,
                staticMenuDesktopInactive: true,
                staticMenuMobileActive: false,
                overlayMenuActive: false,
                profileSidebarVisible: false
            }));
        } else {
            setLayoutState((prev) => ({
                ...prev,
                staticMenuDesktopInactive: false
            }));
        }
    }, [pathname, departament]);

    useEffect(() => {
        if (isTopicsChildPage && crumbUrls) {
            localStorage.setItem('currentBreadCrumb', JSON.stringify(crumbUrls));
        }
    }, [crumbUrls]);

    const value: LayoutContextProps = {
        layoutConfig,
        setLayoutConfig,
        layoutState,
        setLayoutState,
        onMenuToggle,
        showProfileSidebar,
        user,
        setUser,
        globalLoading,
        setGlobalLoading,
        message,
        setMessage,

        contextFetchCourse,
        course,
        setCourses,

        contextFetchThemes,
        contextThemes,
        setContextThemes,
        deleteQuery,
        setDeleteQuery,
        updateQuery,
        setUpdateeQuery,

        contextFetchStudentThemes,
        contextStudentThemes,
        setContextStudentThemes,

        crumbUrls,
        contextAddCrumb,
        mainCourseId,
        setMainCourseId,

        departament,
        setDepartament,
        contextNewStudentThemes,
        setContextNewStudentThemes,

    };

    return (
        <LayoutContext.Provider value={value}>
            <SessionManager />
            <GlobalLoading />
            <ConfirmDialog />
            {message.state && <Message />}
            {children}
        </LayoutContext.Provider>
    );
};
