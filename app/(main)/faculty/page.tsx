'use client';

import { NotFound } from '@/app/components/NotFound';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchFaculty, fetchKafedra } from '@/services/faculty';
import Link from 'next/link';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { useContext, useEffect, useState } from 'react';

export default function Faculty() {
    interface City {
        id: number | null;
        name_ru: string;
        id_faculty?: number | null;
    }

    const showError = useErrorMessage();
    const { setMessage, setGlobalLoading } = useContext(LayoutContext);

    const [selected, setSelected] = useState<City | null>(null);
    const [faculty, setFaculty] = useState<City[]>([{ name_ru: '', id: null }]);
    const [kafedra, setKafedra] = useState<City[]>([{ name_ru: '', id: null }]);
    const [selectShow, setSelectShow] = useState<boolean>(false);
    const [facultyShow, setFacultyShow] = useState<boolean>(false);

    const handleFetchFaculty = async () => {
        const data = await fetchFaculty();
        if (data && Array.isArray(data)) {
            const newFaculty = data.map((item) => {
                return { name_ru: item.name_ru, id: item.id };
            });
            setFaculty(newFaculty);

            if (newFaculty.length > 0) {
                setSelected(newFaculty[0]);
                setSelectShow(false);
            } else {
                setSelectShow(true);
            }
        } else {
            setSelectShow(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleFetchKafedra = async () => {
        if (selected) {
            const data = await fetchKafedra(selected && selected.id);
            console.log(data);

            if (data && Array.isArray(data)) {
                setKafedra(data);
                setFacultyShow(false);
            } else {
                setFacultyShow(true);
            }
        }
    };

    useEffect(() => {
        handleFetchFaculty();
        setGlobalLoading(true);
        setTimeout(() => {
            setGlobalLoading(false);
        }, 900);
    }, []);

    useEffect(() => {
        handleFetchKafedra();
    }, [selected]);

    useEffect(() => {
        console.log(kafedra);
    }, [kafedra]);

    return (
        <div className="flex flex-col gap-4">
            <div>
                {selectShow ? (
                    <p className="text-[16px] text-center font-bold my-2">Факультеты временно не доступны</p>
                ) : (
                    <div className='w-full overflow-x-auto'>
                        <Dropdown value={selected} onChange={(e: DropdownChangeEvent) => setSelected(e.value)} options={faculty} optionLabel="name_ru" className="w-[90%] overflow-x-auto" panelClassName="w-[50%] overflow-x-scroll" />
                    </div>
                )}
            </div>
            {/* data table */}
            <div>
                <h3 className="text-[18px] pb-1 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">Кафедры</h3>
                {facultyShow ? (
                    <NotFound titleMessage="Кафедры не доступны" />
                ) : (
                    <DataTable value={kafedra} dataKey="id" key={JSON.stringify('name_ru')} responsiveLayout="stack" breakpoint="960px" rows={5} className="my-custom-table">
                        <Column body={(_, { rowIndex }) => rowIndex + 1} header="#" style={{ width: '20px' }}></Column>
                        <Column
                            field="name_ru"
                            header="Название"
                            style={{ width: '80%' }}
                            body={(rowData) => (
                                <Link href={`/faculty/${rowData.id}`} key={rowData.id}>
                                    {rowData.name_ru}
                                </Link>
                            )}
                        ></Column>
                    </DataTable>
                )}
            </div>
        </div>
    );
}
