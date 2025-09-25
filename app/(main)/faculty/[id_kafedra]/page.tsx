'use client';

import { NotFound } from '@/app/components/NotFound';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { publishCourse } from '@/services/courses';
import { fetchDepartament } from '@/services/faculty';
import { CourseType } from '@/types/courseType';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useState } from 'react';

export default function Kafedra() {
    interface kafedraInfoType {
        birth_date: string | null;
        courses: [];
        created_at: string;
        email: string;
        email_verified_at: string | null;
        father_name: string;
        id: number;
        is_student: boolean;
        is_working: boolean;
        last_name: string;
        myedu_id: number;
        name: string;
        phone: string;
        pin: number;
        updated_at: string;
    }

    const { id_kafedra } = useParams();
    console.log(id_kafedra);
    
    const [courses, setCourses] = useState<kafedraInfoType[]>([]);
    const [notCourse, setNoteCourse] = useState<kafedraInfoType[]>([]);
    const [contentShow, setContentShow] = useState<boolean>(false);
    const [progressSpinner, setProgressSpinner] = useState(false);
    const [forDisabled, setForDisabled] = useState(false);

    const { setMessage, setGlobalLoading } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const handleFetchKafedra = async () => {
        const data = await fetchDepartament(Number(id_kafedra));
        console.log(data);

        if (data && Array.isArray(data)) {
            if (data.length > 0) {
                setCourses(data);
                setContentShow(false);
            } else {
                setContentShow(true);
            }
        } else {
            setContentShow(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const publish = async (id_kafedra: number, id_teacher: number, course_id: number, status: boolean) => {
        setForDisabled(true);
        const data = await publishCourse(id_kafedra, id_teacher, course_id, status);
        if (data) {
            setForDisabled(false);
            handleFetchKafedra();
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно добавлен!', detail: '' }
            });
        } else {
            setForDisabled(false);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            }); // messege - Ошибка при добавлении
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const imageBodyTemplate = (product: CourseType) => {
        const image = product.image;

        if (typeof image === 'string') {
            return (
                <div className="flex justify-center w-[50px] h-[50px] mx-4" key={product.id}>
                    <img src={image} alt="Course image" className="w-full object-cover shadow-2 border-round" />
                </div>
            );
        }

        return (
            <div className="flex justify-center w-[50px] h-[50px] mx-4" key={product.id}>
                <img src={'/layout/images/no-image.png'} alt="Course image" className="w-full object-cover shadow-2 border-round" />
            </div>
        );
    };

    useEffect(() => {
        setGlobalLoading(true);
        setTimeout(() => {
            setGlobalLoading(false);
        }, 900);
        handleFetchKafedra();
    }, []);

    useEffect(() => {
        // const forNotCourse = courses.filter((item) => item.courses.length < 1);
        // setNoteCourse(forNotCourse);
    }, [courses]);

    return (
        <div className="flex flex-col gap-2 main-bg">
            {contentShow ? (
                <NotFound titleMessage="Данные не доступны" />
            ) : (
                <>
                    <div className="">
                        <DataTable value={courses} dataKey="id_kafedra" key={JSON.stringify('forStreamId')} responsiveLayout="stack" breakpoint="960px" rows={5} className="my-custom-table">
                                <Column body={(_, { rowIndex }) => rowIndex + 1} header="#"></Column>
                                <Column
                                    field="title"
                                    header="Преподаватели"
                                    body={(rowData) => (
                                        <Link href={`/faculty/${id_kafedra}/${rowData.id}`} key={rowData.id} className="text-[16px] my-3 hover:underline">
                                            {rowData.last_name} {rowData.name} {rowData.father_name}
                                        </Link>
                                    )}
                                ></Column>
                                {/* <Column
                                    field="title"
                                    header="Количество курсов"
                                    // style={{width: '250px'}}
                                    body={(rowData) => (
                                        <div className="w-full flex justify-center">
                                            <div className='w-[300px] flex jusctify-center items-center'>
                                                <b className="w-full flex justify-end">4 всего </b>
                                                <span className="w-full">(2 утверждённых)</span>
                                            </div>
                                        </div>
                                    )}
                                ></Column> */}
                            </DataTable>
                        {/* {courses.map((item) => { */}
                            {/* // return ( */}
                            {/* //     <div className="w-full flex flex-col justify-center gap-2" key={item.id}> */}
                                    {/* {courses.length > 0 && (
                                        <div className="w-full m-auto">
                                             */}
                                            {/* <DataTable value={courses} dataKey="id" key={JSON.stringify(forDisabled)} responsiveLayout="stack" breakpoint="960px" rows={5} className="my-custom-table">
                                                <Column body={(_, { rowIndex }) => rowIndex + 1} header="#" style={{ width: '20px' }}></Column>
                                                <Column body={imageBodyTemplate}></Column>
                                                <Column
                                                    field="title"
                                                    header="Название"
                                                    style={{ width: '80%' }}
                                                    body={(rowData) => (
                                                        <Link href={`/faculty/${id_kafedra}/${rowData.id}`} key={rowData.id}>
                                                            {rowData.last_name} {rowData.name} {rowData.father_name}
                                                        </Link>
                                                    )}
                                                ></Column>
                                                <Column
                                                    header="Публикация"
                                                    body={(rowData) => (
                                                        <div key={rowData.id}>
                                                            {!rowData.is_published ? (
                                                                <button className={`theme-toggle ${forDisabled && 'opacity-5'}`} disabled={forDisabled} onClick={() => publish(Number(id_kafedra), item.id, rowData.id, true)} aria-pressed="false">
                                                                    <span className="right">
                                                                        <span className="option option-left" aria-hidden></span>
                                                                        <span className="option option-right" aria-hidden></span>
                                                                        <span className="knob" aria-hidden></span>
                                                                    </span>
                                                                </button>
                                                            ) : (
                                                                <button className={`theme-toggle ${forDisabled && 'opacity-5'}`} disabled={forDisabled} onClick={() => publish(Number(id_kafedra), item.id, rowData.id, false)} aria-pressed="false">
                                                                    <span className="track">
                                                                        <span className="option option-left" aria-hidden></span>

                                                                        <span className="option option-right" aria-hidden>
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="24"
                                                                                height="24"
                                                                                fill="none"
                                                                                stroke="green"
                                                                                stroke-width="2"
                                                                                stroke-linecap="round"
                                                                                stroke-linejoin="round"
                                                                                viewBox="0 0 24 24"
                                                                                aria-label="Опубликовано"
                                                                            >
                                                                                <circle cx="12" cy="12" r="10"></circle>
                                                                                <path d="M9 12l2 2 4-4"></path>
                                                                            </svg>
                                                                        </span>

                                                                        <span className="knob" aria-hidden></span>
                                                                    </span>
                                                                </button>
                                                            )}
                                                            {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                                                        </div>
                                                    )}
                                                ></Column>
                                            </DataTable> */}
                                        {/* </div>
                                    )} */}
                                {/* </div>
                            ); */}
                        {/* })} */}
                    </div>
                    {notCourse.length > 0 && (
                        <div className="mt-2">
                            <h3 className="text-lg sm:text-xl pb-1 font-bold shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">Преподаватели</h3>
                            {/* <DataTable value={notCourse} dataKey="id" key={JSON.stringify('forStreamId')} responsiveLayout="stack" breakpoint="960px" rows={5} className="my-custom-table">
                                <Column body={(_, { rowIndex }) => rowIndex + 1} header="#"></Column>
                                <Column
                                    field="title"
                                    header=""
                                    body={(rowData) => (
                                        <Link href={'#'} className="text-[16px] my-3 hover:underline">
                                            {rowData.last_name} {rowData.name} {rowData.father_name}
                                        </Link>
                                    )}
                                ></Column>
                                <Column
                                    field="title"
                                    header="Количество курсов"
                                    // style={{width: '250px'}}
                                    body={(rowData) => (
                                        <div className="w-full flex justify-center">
                                            <div className='w-[300px] flex jusctify-center items-center'>
                                                <b className="w-full flex justify-end">4 всего </b>
                                                <span className="w-full">(2 утверждённых)</span>
                                            </div>
                                        </div>
                                    )}
                                ></Column>
                            </DataTable> */}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
