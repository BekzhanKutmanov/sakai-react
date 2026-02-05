'use client';
import React, { useState, createContext, useContext, useEffect } from 'react';

// IMPORTANT: The Kyrgyz translations are machine-translated and should be reviewed by a native speaker.
const localizationData = {
    ru: {
        oshSU: 'ОшГУ',

        // General
        search: 'Поиск',
        profile: 'Профиль',
        settings: 'Настройки',
        logout: 'Выйти',
        welcome: 'Добро пожаловать',
        all: 'Все',
        save: 'Сохранить',
        add: 'Добавить',
        edit: 'Редактировать',
        delete: 'Удалить',
        cancel: 'Отмена',
        back: 'Назад',
        next: 'Далее',
        send: 'Отправить',
        close: 'Закрыть',
        open: 'Открыть',
        copy: 'Копировать',
        copied: 'Скопировано',
        error: 'Ошибка',
        success: 'Успех',
        loading: 'Загрузка',
        noData: 'Нет данных',
        yes: 'Да',
        no: 'Нет',
        confirmation: 'Подтверждение',

        // Home
        convenientOnlineLearningSpace: 'Удобное онлайн-пространство для обучения',
        welcomeToDistanceLearningPortal: 'Добро пожаловать на портал дистанционного обучения!',
        weUniteUniversityProjects: 'Мы объединяем проекты университета в сфере онлайн-образования:',
        openOnlineHome: 'Открытые онлайн-курсы',
        higherEducationPrograms: 'Программы высшего образования',

        // AppTopbar
        oldMooc: 'Старый Mooc',
        digitalCampusOshSU: 'Цифровой кампус ОшГУ',
        login: 'Вход',
        exit: 'Выход',
        notification: 'Уведомление',

        // AppMenu
        mainPage: 'Главная страница',
        controlPanel: 'Панель управления',
        courses: 'Курсы',
        videoInstruction: 'Видеоинструкция',
        unverifiedTasks: 'Непроверенные задания',
        openOnlineCourses: 'Открытые онлайн курсы',
        myActiveCourses: 'Мои активные курсы',
        notifications: 'Уведомления',
        searchStudents: 'Поиск студентов',
        archiveCourses: 'Архив курсов',
        approveCourses: 'Утвердить курсы',
        admin: 'Админ',
        teacherCheck: 'Проверка преподавателей',
        department: 'Департамент',
        themes: 'Темы',

        // Calendar
        firstDayOfWeek: 'Понедельник',
        dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        dayNamesMin: ['В', 'П', 'В', 'С', 'Ч', 'П', 'С'],
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        today: 'Сегодня',
        clear: 'Очистить',

        // Course page
        addCourse: 'Добавить курс',
        courseName: 'Название курса',
        courseDescription: 'Описание курса',
        courseStatus: 'Статус курса',
        courseType: 'Тип курса',
        closed: 'Закрытый',
        openCourse: 'Открытый',
        paid: 'Платный',
        published: 'Опубликован',
        notPublished: 'Не опубликован',
        onReview: 'На рассмотрении',
        notOnReview: 'Не на рассмотрении',
        streams: 'Потоки',
        connects: 'Связан',
        archiveCourse: 'Архивировать курс',
        archiveCourseConfirmation: 'Курс будет сохранён в текущем состоянии и навсегда перемещён в архив без возможности восстановления.',
        archiveCourseNote: 'Курс будет доступен только в архиве',
        leaveCopy: 'Оставить копию курса',
        filters: 'Фильтры',
        courseAudienceType: 'Статус курса',
        isPublished: 'Публикация',
        reset: 'Сбросить',
        noCourses: 'Курсы отсутствуют',
        addStream: 'Добавить поток',

        // Roles page
        active: 'Активные',
        create: 'Создать',
        change: 'Изменить',
        view: 'Смотреть',

        // Messages
        successAdd: 'Успешно добавлен!',
        errorTitle: 'Ошибка!',
        addCourseError: 'Не удалось добавить курс',
        tryAgainLater: 'Повторите позже',
        addError: 'Ошибка при добавлении!',
        deleteSuccess: 'Успешно удалено!',
        deleteError: 'Ошибка при удалении!',
        updateSuccess: 'Успешно изменено!',
        updateError: 'Ошибка при изменении!',
        errorTryAgainLater: 'Ошибка, повторите позже',
        archiveSuccess: 'Архивирование прошло успешно',

        // table
        numberSign: '#',
        publication: 'Публикация',
        score: 'Балл',

        // buttons
        archive: 'Архивировать',
        addPhoto: 'Добавить фото',
        photo: 'Фото',
        teacherBtn: 'Преподаватель',
        studentBtn: 'Студент',

        // others
        status: 'Статус',
        connected: 'Связан',

        // lesson page
        lessonAvailability: 'Этот урок будет доступен до определённой даты. После окончания срока доступ к материалам будет закрыт',
        availableFrom: 'Доступен с:',
        courseScore: 'Балл за курс',
        scoreUnit: 'балл',
        noThemes: 'Темы отсутствуют',
        selectStepType: 'Выберите тип шага',
        position: 'Позиция',
        wordTestGeneration: 'Выберите свой документ в формате Word — из его содержания будет автоматически создан тест.',
        aiTestGeneration: 'Тест генерируется искусственным интеллектом',
        testVariantsHint: 'Варианты тестов будут более продуманными если передать ваш документ',
        optional: '(необязательно)',
        noSteps: 'Шаги отсутствует',
        positionUnit: 'позиция',
        deleteStep: 'Удалить шаг',
        trainingPlan: 'План обучения',
        cancellationOfWorks: 'Аннулирование работ',
        addAdditionally: 'Дополнительно',
        lessonsAvailableUntilDate: 'Уроки будут доступны только до указанного срока',
        start: 'Начало',
        end: 'Конец',
        title: 'Название',
        totalPointsForCourse: 'Всего баллов за курс',
        weekHeader: 'Нд',

        // counterbanner
        coursesAndVideoLessons: 'Курсы и видеоуроки',
        registeredStudents: 'Зарегистрированные студенты',
        teachers: 'Преподаватели',
        satisfactionLevel: 'Уровень удовлетворённости',

        // openCourses
        newCourses: 'Новые курсы',
        popularCourses: 'Популярные курсы',
        recommendedByDepartment: 'Рекомендованные департаментом',
        allOpenCourses: 'Все открытые курсы',
        dataNotAvailable: 'Данные недоступны',
        videoTourMainBuilding: 'Видеоэкскурсия по главному зданию',
    },
    ky: {
        oshSU: 'ОшМУ',

        // General
        search: 'Издөө',
        profile: 'Профиль',
        settings: 'Орнотуулар',
        logout: 'Чыгуу',
        welcome: 'Кош келиңиз',
        all: 'Баары',
        save: 'Сактоо',
        add: 'Кошуу',
        edit: 'Оңдоо',
        delete: 'Өчүрүү',
        cancel: 'Жокко чыгаруу',
        back: 'Артка',
        next: 'Андан ары',
        send: 'Жөнөтүү',
        close: 'Жабуу',
        open: 'Ачуу',
        copy: 'Көчүрүү',
        copied: 'Көчүрүлдү',
        error: 'Ката',
        success: 'Ийгилик',
        loading: 'Жүктөлүүдө',
        noData: 'Маалымат жок',
        yes: 'Ооба',
        no: 'Жок',
        confirmation: 'Ырастоо',

        // Home
        convenientOnlineLearningSpace: 'Окуу үчүн ыңгайлуу онлайн мейкиндик',
        welcomeToDistanceLearningPortal: 'Аралыктан окутуу порталына кош келиңиз!',
        weUniteUniversityProjects: 'Биз университеттин онлайн-билим берүү багытындагы долбоорлорун бириктиребиз:',
        openOnlineHome: 'Ачык онлайн курстар',
        higherEducationPrograms: 'Жогорку билим программалары',

        // AppTopbar
        oldMooc: 'Эски Mooc',
        digitalCampusOshSU: 'ОшМУнун санариптик кампусу',
        login: 'Кирүү',
        exit: 'Чыгуу',
        notification: 'Билдирүү',

        // AppMenu
        mainPage: 'Башкы бет',
        controlPanel: 'Башкаруу панели',
        courses: 'Курстар',
        videoInstruction: 'Видео нускама',
        unverifiedTasks: 'Текшериле элек тапшырмалар',
        openOnlineCourses: 'Ачык онлайн курстар',
        myActiveCourses: 'Менин активдүү курстарым',
        notifications: 'Билдирүүлөр',
        searchStudents: 'Студенттерди издөө',
        archiveCourses: 'Курстардын архиви',
        approveCourses: 'Курстарды бекитүү',
        admin: 'Админ',
        teacherCheck: 'Окутуучуларды текшерүү',
        department: 'Департамент',
        themes: 'Темалар',

        // Calendar
        firstDayOfWeek: 'Дүйшөмбү',
        dayNames: ['Жекшемби', 'Дүйшөмбү', 'Шейшемби', 'Шаршемби', 'Бейшемби', 'Жума', 'Ишемби'],
        dayNamesShort: ['Жш', 'Дш', 'Шш', 'Шр', 'Бш', 'Жм', 'Иш'],
        dayNamesMin: ['Ж', 'Д', 'Ш', 'Ш', 'Б', 'Ж', 'И'],
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        today: 'Бүгүн',
        clear: 'Тазалоо',

        // Course page
        addCourse: 'Курс кошуу',
        courseName: 'Курстун аталышы',
        courseDescription: 'Курстун сүрөттөлүшү',
        courseStatus: 'Курстун статусу',
        courseType: 'Курстун түрү',
        closed: 'Жабык',
        openCourse: 'Ачык',
        paid: 'Акылуу',
        published: 'Жарыяланды',
        notPublished: 'Жарыяланган жок',
        onReview: 'Кароодо',
        notOnReview: 'Кароодо эмес',
        streams: 'Агымдар',
        connects: 'Байланышкан',
        archiveCourse: 'Курсту архивдөө',
        archiveCourseConfirmation: 'Курс учурдагы абалында сакталат жана калыбына келтирүү мүмкүнчүлүгү жок биротоло архивге жылдырылат.',
        archiveCourseNote: 'Курс архивде гана жеткиликтүү болот',
        leaveCopy: 'Курстун көчүрмөсүн калтыруу',
        filters: 'Чыпкалар',
        courseAudienceType: 'Курстун статусу',
        isPublished: 'Жарыялоо',
        reset: 'Тазалоо',
        noCourses: 'Курстар жок',
        addStream: 'Агым кошуу',

        // Roles page
        active: 'Активдүүлөр',
        create: 'Түзүү',
        change: 'Өзгөртүү',
        view: 'Көрүү',

        // Messages
        successAdd: 'Успешно добавлен!',
        errorTitle: 'Ошибка!',
        addCourseError: 'Не удалось добавить курс',
        tryAgainLater: 'Повторите позже',
        addError: 'Ошибка при добавлении!',
        deleteSuccess: 'Успешно удалено!',
        deleteError: 'Ошибка при удалении!',
        updateSuccess: 'Успешно изменено!',
        updateError: 'Ошибка при изменении!',
        errorTryAgainLater: 'Ошибка, повторите позже',
        archiveSuccess: 'Архивирование прошло успешно',

        // table
        numberSign: '#',
        publication: 'Публикация',
        score: 'Балл',

        // buttons
        archive: 'Архивдөө',
        addPhoto: 'Сүрөт кошуу',
        photo: 'Фото',
        teacherBtn: 'Окутуучу',
        studentBtn: 'Студент',

        // others
        status: 'Статус',
        connected: 'Связан',

        // lesson page
        lessonAvailability: 'Этот урок будет доступен до определённой даты. После окончания срока доступ к материалам будет закрыт',
        availableFrom: 'Доступен с:',
        courseScore: 'Балл за курс',
        scoreUnit: 'балл',
        noThemes: 'Темы отсутствуют',
        selectStepType: 'Выберите тип шага',
        position: 'Позиция',
        wordTestGeneration: 'Выберите свой документ в формате Word — из его содержания будет автоматически создан тест.',
        aiTestGeneration: 'Тест генерируется искусственным интеллектом',
        testVariantsHint: 'Варианты тестов будут более продуманными если передать ваш документ',
        optional: '(необязательно)',
        noSteps: 'Шаги отсутствует',
        positionUnit: 'позиция',
        deleteStep: 'Өчүрүү',
        trainingPlan: 'Окуу планы',
        cancellationOfWorks: 'Жумуштарды жокко чыгаруу',
        addAdditionally: 'Кошумча',
        lessonsAvailableUntilDate: 'Сабактар белгиленген күнгө чейин гана жеткиликтүү болот',
        start: 'Башталышы',
        end: 'Аягы',
        title: 'Аталышы',
        totalPointsForCourse: 'Курс үчүн жалпы баллдар',
        weekHeader: 'Ап',

        // counterbanner
        coursesAndVideoLessons: 'Курстар жана видео сабактар',
        registeredStudents: 'Катталган студенттер',
        teachers: 'Окутуучулар',
        satisfactionLevel: 'Канааттануу деңгээли',
  
        // open courses
        newCourses: 'Жаңы курстар',
        popularCourses: 'Популярдуу курстар',
        recommendedByDepartment: 'Департамент тарабынан сунушталган',
        allOpenCourses: 'Бардык ачык курстар',
        dataNotAvailable: 'Маалымат жеткиликтүү эмес',
        videoTourMainBuilding: 'Башкы корпус боюнча видеоэкскурсия',
    },
};

type Language = 'ru' | 'ky';

interface LocalizationContextType {
    language: Language;
    translations: typeof localizationData.ru;
    setLanguage: (language: Language) => void;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<Language>('ru');

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language') as Language;
        if (storedLanguage && (storedLanguage === 'ru' || storedLanguage === 'ky')) {
            setLanguage(storedLanguage);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const translations = localizationData[language];

    return <LocalizationContext.Provider value={{ language, translations, setLanguage: handleSetLanguage }}>{children}</LocalizationContext.Provider>;
};

export const useLocalization = () => {
    const context = useContext(LocalizationContext);
    if (context === undefined) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
    }
    return context;
};
