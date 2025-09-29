'use client';

import { NotFound } from '@/app/components/NotFound';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchDepartament } from '@/services/faculty';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
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

    const [courses, setCourses] = useState<kafedraInfoType[]>([]);
    const [contentShow, setContentShow] = useState<boolean>(false);

    const { setMessage, setGlobalLoading } = useContext(LayoutContext);
    const showError = useErrorMessage();

    const handleFetchKafedra = async () => {
        const data = await fetchDepartament(Number(id_kafedra));        
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

    useEffect(() => {
        setGlobalLoading(true);
        setTimeout(() => {
            setGlobalLoading(false);
        }, 900);
        handleFetchKafedra();
    }, []);

    return (
        <div className="flex flex-col gap-2 main-bg">
            {contentShow ? (
                <NotFound titleMessage="Данные не доступны" />
            ) : (
                <div>
                    <DataTable value={courses} emptyMessage="Нет данных" dataKey="id_kafedra" key={JSON.stringify('forStreamId')} responsiveLayout="stack" breakpoint="960px" rows={5} className="my-custom-table">
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
                        <Column
                            field="title"
                            header="Всего курсов"
                            body={(rowData) => (
                                <div className="w-full flex justify-center">
                                    <div className="w-[300px] flex gap-1 jusctify-center items-center">
                                        <b className="w-full flex justify-end">4 </b>
                                        <span className="w-full">(2 утверждённых)</span>
                                    </div>
                                </div>
                            )}
                        ></Column>
                    </DataTable>
                </div>
            )}
        </div>
    );
}
