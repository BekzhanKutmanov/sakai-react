'use client';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { useContext, useEffect, useState } from 'react';
import CounterBanner from './CounterBanner';
import Link from 'next/link';
import VideoPlay from './VideoPlay';
import FancyLinkBtn from './buttons/FancyLinkBtn';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MainPageStatistics } from '@/types/main/MainPageStatistic';
import { mainPageStatistics } from '@/services/main/main';
import useErrorMessage from '@/hooks/useErrorMessage';
import { fetchOpenCourses, openCourseShow, openCourseSignup, signupList } from '@/services/openCourse';
import { myMainCourseType } from '@/types/myMainCourseType';
import MyDateTime from './MyDateTime';
import { OptionsType } from '@/types/OptionsType';
import { Paginator } from 'primereact/paginator';
import GroupSkeleton from './skeleton/GroupSkeleton';
import { Sidebar } from 'primereact/sidebar';
import OpenCourseShowCard from './cards/OpenCourseShowCard';

export default function HomeClient() {
    const params = new URLSearchParams();
    const { user, setGlobalLoading, setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const [statistics, setStatistics] = useState<MainPageStatistics | null>(null);
    const [skeleton, setSkeleton] = useState(false);
    const [mainProgressSpinner, setMainProgressSpinner] = useState(false);
    const [showVisisble, setShowVisible] = useState(false);
    const [hasCourses, setHasCourses] = useState(false);
    const [coursesValue, setValueCourses] = useState<myMainCourseType[]>([]);
    const [pagination, setPagination] = useState<{ currentPage: number; total: number; perPage: number }>({
        currentPage: 1,
        total: 0,
        perPage: 0
    });
    const [pageState, setPageState] = useState<number>(1);
    const [courseDetail, setCourseDetail] = useState<myMainCourseType | null>(null);
    const [signUpList, setSignupList] = useState<number[]>([]);
    const [sendSignupList, setSendSignupList] = useState(false);

    const options: OptionsType = {
        year: '2-digit',
        month: 'short', // 'long', 'short', 'numeric'
        day: '2-digit',
        // hour: '2-digit',
        // minute: '2-digit',
        hour12: false // 24-часовой формат
    };
    const media = useMediaQuery('(max-width: 640px)');

    const handleMainPageStatistics = async () => {
        const data = await mainPageStatistics();
        if ((data && data?.students) || data?.workers || data?.course) setStatistics(data);
    };

    const handleFetchOpenCourse = async (page: number, audence_type_id: number | string, search: string) => {
        setSkeleton(true);
        setMainProgressSpinner(true);
        const data = await fetchOpenCourses(page, audence_type_id, search);
        
        if (data && Array.isArray(data.data)) {
            setHasCourses(false);
            setValueCourses(data.data);
            setPagination({
                currentPage: data.current_page,
                total: data?.total,
                perPage: data?.per_page
            });
        } else {
            setHasCourses(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
        setSkeleton(false);
        setMainProgressSpinner(false);
    };
    const gradients = [
        'linear-gradient(135deg, #FF512F, #DD2476)', // красно-розовый
        'linear-gradient(135deg, #FF8008, #FFC837)', // оранжево-жёлтый
        'linear-gradient(135deg, #00C6FF, #0072FF)', // синий
        'linear-gradient(135deg, #6A11CB, #2575FC)', // фиолетово-синий
        'linear-gradient(135deg, #11998E, #38EF7D)', // зелёный
        'linear-gradient(135deg, #F7971E, #FFD200)', // золотой
        'linear-gradient(135deg, #FC466B, #3F5EFB)', // розово-синий
        'linear-gradient(135deg, #36D1DC, #5B86E5)', // голубой
        'linear-gradient(135deg, #F953C6, #B91D73)', // насыщенный розовый
        'linear-gradient(135deg, #43E97B, #38F9D7)' // мятный
    ];

    const imageBodyTemplate = (product: any, idx: number) => {
        const image = product.image;

        if (typeof image === 'string') {
            return (
                <div className="flex justify-center w-[70%] sm:w-[80%] sm:max-h-[200px] rounded" key={product.id}>
                    <img src={image} alt="Course image" className="w-full object-cover shadow-2 border-round" />
                </div>
            );
        }

        return (
            // <div className="flex justify-center min-w-[100px] w-[100px] min-h-[100px] h-[100px] sm:w-[120px] sm:min-w-[120px] sm:h-[120px] sm:min-h-[120px] mx-4" key={product.id}>
            <div className="flex justify-center w-[70%] sm:w-[80%] sm:max-h-[200px] rounded" key={product.id}>
                <img src={'/layout/images/no-image.png'} alt="Course image" className="w-full object-cover shadow-2 border-round" />
                {/* <div ></div> */}
            </div>
        );
    };

    // Ручное управление пагинацией
    const handlePageChange = (page: number) => {
        handleFetchOpenCourse(page, '', '');
        setPageState(page);
    };

    const OpenCourse = ({ course, index }: { course: myMainCourseType; index: number }) => {
        return (
            <div key={course?.id} className="max-h-[430px] min-h-[350px] sm:max-h-[330px] sm:min-h-[330px] w-full sm:min-w-[300px] sm:max-w-[300px] shadow rounded p-2 flex flex-col gap-2 justify-between">
                <div className="relative">
                    <div className="flex justify-center items-center">{imageBodyTemplate(course, index)}</div>
                    <div
                        className={`absolute top-0 right-0 sm:flex gap-1 items-center text-sm text-white rounded p-1 mb-1 ${
                            course?.audience_type?.name === 'open' ? 'bg-[var(--greenColor)]' : course?.audience_type?.name === 'wallet' ? 'bg-[var(--amberColor)]' : ''
                        }`}
                    >
                        <i className={course?.audience_type?.icon} style={{ fontSize: '13px' }}></i>
                        <i className="text-[12px]">{course?.audience_type?.name === 'open' ? 'Бесплатный' : course?.audience_type?.name === 'wallet' ? 'Платный' : ''}</i>
                    </div>
                </div>

                <div className="flex justify-center flex-col items-center">
                    {course.status ? (
                        <b
                            onClick={() => handleCourseShow(course?.id)}
                            className="cursor-pointer w-full sm:max-w-[350px] break-words text-[var(--mainColor)] underline"
                            // onClick={() => courseShowProp(course?.id)}
                        >
                            {course?.title}
                        </b>
                    ) : (
                        <b
                            className="cursor-pointer w-full sm:max-w-[350px] break-words text-[var(--mainColor)] underline"
                            // onClick={() => courseShowProp(course?.id)}
                        >
                            {course?.title}
                        </b>
                    )}

                    <div className="max-h-[20px] overflow-hidden">
                        <small className="max-w-[300px] text-nowrap overflow-hidden text-ellipsis ">{course?.description}</small>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-center text-[15px] text-[var(--titleColor)] author_font">
                        {/* <span className="">Автор: </span> */}
                        <div className="flex gap-1 items-center">
                            {!media ? (
                                <>
                                    <span>{course?.user?.last_name}</span>
                                    <span>{course?.user?.name}</span>
                                    <span>{course?.user?.father_name}</span>
                                </>
                            ) : (
                                <>
                                    <span>{course?.user?.last_name}</span>
                                    <span>{course?.user?.name[0]}.</span>
                                    <span>{course?.user?.father_name && course?.user?.father_name[0] + '.'}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* data */}
                    <div className="w-full flex justify-end text-[11px] order-1 sm:order-2">
                        <MyDateTime createdAt={course?.created_at} options={options} />
                    </div>
                </div>
            </div>
        );
    };

    const handleCourseShow = async (course_id: number) => {
        setShowVisible(true);
        setSkeleton(true);
        const data = await openCourseShow(course_id);

        if (data && Object.values(data)?.length) {
            setCourseDetail(data);
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
        setSkeleton(false);
    };

    // signUp
    const сourseSignup = async (course_id: number) => {
        const data = await openCourseSignup(course_id);
        if (data?.success) {
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешное добавление!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                if (data?.response?.status == '400') {
                    setMessage({
                        state: true,
                        value: { severity: 'error', summary: 'Ошибка!', detail: data?.response?.data?.message }
                    });
                } else {
                    showError(data.response.status);
                }
            }
        }
    };

    // signup courses list
    const handleSignupList = async (course: any) => {
        course?.forEach((i: { id: number }) => params.append('course_Ids[]', String(i?.id)));
        const data = await signupList(params);
        if (data && data?.signed_courses) {
            return data?.signed_courses;
        } else {
            return null;
        }
    };

    useEffect(() => {
        const handleSendSingup = async () => {
            const list: any | null = await handleSignupList(coursesValue);
            if (list) {
                setSignupList(list);
            }
        };
        if (sendSignupList) {
            handleSendSingup();
        }
    }, [sendSignupList]);

    useEffect(() => {
        if (coursesValue?.length) {
            setSendSignupList(true);
        } else {
            setSendSignupList(false);
        }
    }, [coursesValue]);

    useEffect(() => {
        handleFetchOpenCourse(pageState, '', '');
        setGlobalLoading(true);
        handleMainPageStatistics();
        setTimeout(() => {
            setGlobalLoading(false);
        }, 800);
        AOS.init();
    }, []);

    return (
        <>
            {/* <div className='relative  h-[100px] overflow-hidden'><div className='home-bg'></div></div> */}
            <div className="absolute left-0 right-0 top-[96px] w-full home-bg min-h-[500px] max-h-[500px]"></div>
            <div className="relative mt-[98px] px-2 py-[50px] z-[1]">
                {/* <Link href={`/pdf/1757146212.pdf`}>{"Уроки"}</Link> */}
                <div className="w-full">
                    <div className="flex flex-column md:flex-row items-center justify-center overflow-hidden">
                        <div className="w-full">
                            <div className="w-full m-auto overflow-hidden text-[16px] text-[var(--mainColor)] block mb-[15px]">
                                <div className="relative flex">
                                    <img
                                        src={'/layout/images/shape1.png'}
                                        data-aos="fade-up"
                                        data-aos-delay="900"
                                        data-aos-duration="1000"
                                        data-aos-once="true"
                                        alt="Фото"
                                        className="hidden lg:block absolute top-[-100px] left-[-10px] animateContent"
                                    />
                                    <span className="w-full text-center" data-aos="fade-up" data-aos-delay="900" data-aos-duration="1000" data-aos-once="true">
                                        УДОБНОЕ ОНЛАЙН-ПРОСТРАНСТВО ДЛЯ ОБУЧЕНИЯ
                                    </span>
                                </div>
                                <h2 data-aos="fade-down" data-aos-delay="900" data-aos-duration="1000" data-aos-once="true" className="text-center text-[30px] sm:text-[50px]">
                                    Добро пожаловать на портал дистанционного обучения!
                                </h2>
                                <div data-aos="fade-up" data-aos-delay="900" data-aos-duration="1000" data-aos-once="true" className="text-center text-[var(--titleColor)]">
                                    {' '}
                                    Мы объединяем проекты университета в сфере онлайн-образования:
                                    <ul className="list-disc m-auto my-4 max-w-[300px] flex flex-col items-start">
                                        <li>открытые онлайн-курсы</li>
                                        <li>программы высшего образования</li>
                                    </ul>
                                    {user ? (
                                        <Link href={user.is_working ? '/course' : user.is_student ? '/teaching' : ''}>
                                            <FancyLinkBtn btnWidth={'200px'} backround={'--mainColor'} effectBg={'--titleColor'} title={user.is_working ? 'Преподаватель' : user.is_student ? 'Студент' : ''} btnType={false} />
                                        </Link>
                                    ) : media ? (
                                        <Link href={'/auth/login'}>
                                            <FancyLinkBtn btnWidth={'200px'} backround={'--mainColor'} effectBg={'--titleColor'} title={'Вход'} btnType={false} />
                                        </Link>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Counter Statistics */}
                <CounterBanner statisticValue={statistics} />

                {/* open courses */}

                {coursesValue?.length > 0 ? (
                    skeleton ? (
                        <div className="flex flex-wrap gap-2 flex-col sm:flex-row justify-center">
                            <GroupSkeleton count={1} size={{ width: '300px', height: '300px' }} />
                            <GroupSkeleton count={1} size={{ width: '300px', height: '300px' }} />
                            <GroupSkeleton count={1} size={{ width: '300px', height: '300px' }} />
                            <GroupSkeleton count={1} size={{ width: '300px', height: '300px' }} />
                            <GroupSkeleton count={1} size={{ width: '300px', height: '300px' }} />
                        </div>
                    ) : (
                        <div className="main-bg">
                            <h3 className="text-xl sm:text-2xl text-center mb-4">Открытые онлайн курсы</h3>
                            <div className="w-full flex flex-wrap justify-center gap-4 mt-5 sm:m-0">
                                {coursesValue?.map((item, idx) => {
                                    return <OpenCourse key={item?.id} course={item} index={idx} />;
                                })}
                            </div>
                            <div className={`shadow-[0px_-11px_5px_-6px_rgba(0,_0,_0,_0.1)]`}>
                                <Paginator
                                    first={(pagination.currentPage - 1) * pagination.perPage}
                                    rows={pagination.perPage}
                                    totalRecords={pagination.total}
                                    onPageChange={(e) => handlePageChange(e.page + 1)}
                                    template={media ? 'FirstPageLink PrevPageLink NextPageLink LastPageLink' : 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'}
                                />
                            </div>
                        </div>
                    )
                ) : (
                    ''
                )}

                <Sidebar visible={showVisisble} position="bottom" style={{ height: '90vh' }} onHide={() => setShowVisible(false)}>
                    {skeleton ? (
                        <GroupSkeleton count={1} size={{ width: '100%', height: '12rem' }} />
                    ) : courseDetail ? (
                        <OpenCourseShowCard course={courseDetail} courseSignup={сourseSignup} signUpList={signUpList} />
                    ) : (
                        <b className="flex justify-center">Данные не доступны</b>
                    )}
                </Sidebar>

                {/* Oshgu Video */}
                <div>
                    <h2 className="text-[22px] p-4 text-center">
                        Видеоэкскурсия по главному зданию <span className="text-[var(--mainColor)]">ОшГУ</span>
                    </h2>
                </div>
                <VideoPlay />
            </div>
        </>
    );
}
