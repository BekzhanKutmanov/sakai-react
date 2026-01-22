'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { fetchSpeciality, fetchStudentsForTeacher } from '@/services/student/studentSearch';
import { Dialog } from 'primereact/dialog';

type Student = {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'inactive' | 'suspended';
    registrationDate: string;
};

const StudentSearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const [students, setStudents] = useState<Student[]>([]);
    const [mainSpinner, setMainSpinner] = useState(false);
    const [progressSpinner, setProgressSpinner] = useState(false);
    const [visible, setVisible] = useState(false);
    const [studentVisible, setStudentVisible] = useState<any | null>(null);

    const clearValues = () => {
        setStudentVisible(null);
    };

    const handleStudentSpeciality = async (id_faculty: number) => {
        const data = await fetchSpeciality(id_faculty);
        console.log(data);

        if (data && data?.success) {
            // setStudents(data?.data);
        }
    };

    const handleStudentSearch = async (term: string) => {
        setProgressSpinner(true);
        setMainSpinner(true);

        const data = await fetchStudentsForTeacher(term);
        // console.log(data);

        if (data && data?.success) {
            setStudents(data?.data);
        }

        setProgressSpinner(false);
        setMainSpinner(false);
    };

    // Debounce effect for search input
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 1000);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    useEffect(() => {
        if (debouncedTerm) {
            performSearch(debouncedTerm);
        }
    }, [debouncedTerm]);

    // useEffect(() => {
    //     // handleStudentSpeciality(42);
    // }, []);

    const performSearch = (term: string) => {
        handleStudentSearch(term);
        // setTimeout(() => {
        //     const filteredStudents = mockStudents.filter((student) => student.name.toLowerCase().includes(term.toLowerCase()) || student.email.toLowerCase().includes(term.toLowerCase()));
        //     setStudents(filteredStudents);
        //     setLoading(false);
        // }, 300); // Simulate network delay
    };

    const searchSection = (
        <div className="main-bg flex flex-col gap-1">
            <h5 className="text-xl sm:text-2xl">Студенты</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                {/* <InputText type="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Поиск по имени или email..." className="p-inputtext-sm w-full md:w-auto" /> */}
                <div className="flex items-center relative">
                    <InputText placeholder="Поиск..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-inputtext-sm p-inputtext-rounded" />
                    <div className="absolute right-1">{progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}</div>
                </div>
            </span>
        </div>
    );

    return (
        <div className="flex flex-col gap-2">
            {searchSection}

            {students?.length < 1 ? (
                <div className="main-bg p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <i className="pi pi-users text-3xl text-gray-400"></i>
                    </div>
                    {/* <h3 className="text-xl font-semibold text-gray-700 mb-2">Курсы не найдены</h3> */}
                    {/* <p className="text-gray-500 max-w-md">У вас пока нет назначенных курсов. Если вы считаете, что это ошибка, обратитесь в администрацию.</p> */}
                </div>
            ) : mainSpinner ? (
                <div className="main-bg flex justify-center items-center m-4">
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} animationDuration=".5s" />
                </div>
            ) : (
                <div className="card" style={{ padding: '2rem' }}>
                    <DataTable value={students || []} rows={10} size="small" loading={mainSpinner} dataKey="id" emptyMessage="Студенты не найдены." className="p-datatable-customers text-sm">
                        <Column body={(_, { rowIndex }) => rowIndex + 1} header="#" style={{ width: '20px' }} />
                        <Column
                            field="name"
                            header={() => <span className="text-sm">ФИО</span>}
                            sortable
                            body={(rowData) => {
                                return (
                                    <div
                                        className="flex flex-col text-[var(--mainColor)] underline"
                                        onClick={() => {
                                            setVisible(true);
                                            setStudentVisible(rowData);
                                            console.log(rowData);
                                        }}
                                    >
                                        <span>{rowData?.last_name}</span>
                                        <span>{rowData?.name}</span>
                                        <span>{rowData?.father_name}</span>
                                    </div>
                                );
                            }}
                            style={{ minWidth: '14rem' }}
                        />
                        <Column field="email" header={() => <span className="text-sm">Email</span>} sortable style={{ minWidth: '14rem' }} />
                        <Column field="myedu_id" header={() => <span className="text-sm">Л/н</span>} sortable sortField="status" style={{ minWidth: '8rem' }} />
                    </DataTable>
                </div>
            )}

            <Dialog
                header={'Студент'}
                visible={visible}
                className="my-custom-dialog"
                onHide={() => {
                    if (!visible) return;
                    setVisible(false);
                    clearValues();
                }}
            >
                <div className="z-10 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                    <div className="relative group">
                        {/* Контейнер-рамка */}
                        <div className="w-35 h-34 rounded-2xl overflow-hidden border-2 border-white shadow-md ring-2 ring-gray-100 flex items-center justify-center bg-gray-50">
                            <img src={'/layout/images/no-image.png'} alt="Фото студента" className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110" />
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-gray-600 m-0 text-center">
                                {studentVisible?.last_name} {studentVisible?.name} {studentVisible?.father_name}
                            </p>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>Email: </span>
                            <span className='text-[var(--mainColor)]'>{studentVisible?.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>Личный номер (ID): </span>
                            <span className='text-[var(--mainColor)]'>{studentVisible?.myedu_id}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className='text-[var(--mainColor)]'>{studentVisible?.birth_date}</span>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default StudentSearchPage;
