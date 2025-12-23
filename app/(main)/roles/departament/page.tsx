'use client';

import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { addOpenTypes, fetchCourseOpenStatus } from '@/services/courses';
import { controlDepartamentUsers, controlRolesUsers, fetchRolesDepartment, fetchRolesList, fetchRolesUsers } from '@/services/roles/roles';
import { AudenceType } from '@/types/courseTypes/AudenceTypes';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useState } from 'react';

export default function RolesDepartment() {
    // types
    interface Role {
        id: number;
        title: string;
        created_at: string;
        updated_at: string;
    }

    interface Role_idType {
        name: string;
        role_id: number | null;
    }

    const showError = useErrorMessage();
    const { setMessage } = useContext(LayoutContext);

    const [roles, setRoles] = useState<Role[] | null>(null);
    const [skeleton, setSkeleton] = useState(true);
    const [contentNull, setContentNull] = useState<boolean>(false);
    const [mainProgressSpinner, setMainProgressSpinner] = useState(false);
    const [miniProgressSpinner, setMiniProgressSpinner] = useState(false);
    const [myeduProgressSpinner, setMyeduProgressSpinner] = useState(false);
    const [search, setSearch] = useState<string>('');
    const [searchController, setSearchController] = useState(false);
    const [myeduController, setMyeduController] = useState(false);
    const [active, setActive] = useState(false);
    const [myedu_id, setMyedu_id] = useState<string | null>(null);
    const [pagination, setPagination] = useState<{ current_page: number; total: number; per_page: number }>({
        current_page: 1,
        total: 0,
        per_page: 0
    });
    const [pageState, setPageState] = useState<number>(1);
    const [selectedTypeId, setSelectedTypeId] = useState<Role_idType | null>({ name: 'Все', role_id: null });
    const [cities, setCities] = useState<Role_idType[]>([{ name: 'Все', role_id: null }]);
    const [forDisabled, setForDisabled] = useState(false);
    const [openTypes, setOpenTypes] = useState<AudenceType[]>([]);

    const handleFetchCourseOpenStatus = async () => {
        const data = await fetchCourseOpenStatus();
        if (data && Array.isArray(data)) {
            setOpenTypes(data);
            setCities([{ name: 'Все', role_id: null }]);
            const forSelectedRole_id: any = data?.map((item) => {
                return { name: item?.title, role_id: item?.id };
            });
            setCities((prev) => [...prev, ...forSelectedRole_id]);
            setContentNull(false);
        } else {
            setContentNull(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка повторите позже', detail: '' }
            }); // messege - Ошибка при изменении курса
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

    const handleFetchDepartment = async (page: number, search: string, myedu_id: string | null, selectedTypeId: Role_idType | null, active: boolean | null) => {
        setMainProgressSpinner(true);
        const res = await fetchRolesDepartment(page, search, myedu_id, selectedTypeId?.role_id || null, active);
        if (res?.success) {
            setRoles(res?.data?.data);
            setPagination(res?.data);
            setContentNull(false);
        } else {
            setContentNull(true);
            setMessage({ state: true, value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' } });
            if (res?.response?.status) {
                showError(res.response.status);
            }
        }
        setMainProgressSpinner(false);
        setSkeleton(false);
    };

    const handleControlDepartament = async (worker_id: number, course_audience_type_id: number | null, activeParam: boolean | null) => {
        // setForDisabled(true);
        setMainProgressSpinner(true);
        const res = await controlDepartamentUsers(worker_id, course_audience_type_id || null, activeParam);
        console.log(res);
        if (res?.success) {
            setTimeout(() => {
                handleFetchDepartment(pageState, search, myedu_id, selectedTypeId, active);
            }, 1000);
            setMessage({ state: true, value: { severity: 'success', summary: 'Успешно изменено!', detail: '' } });
        } else {
            setMainProgressSpinner(false);
            if (res?.response?.status === 400) {
                setMessage({ state: true, value: { severity: 'error', summary: res.response.data?.message, detail: '' } });
            } else {
                setMessage({ state: true, value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' } });
                if (res?.response?.status) {
                    showError(res.response.status);
                }
            }
        }
        // setForDisabled(false);
    };

    // Ручное управление пагинацией
    const handlePageChange = (page: number) => {
        handleFetchDepartment(page, search, myedu_id, selectedTypeId, active);
        setPageState(page);
    };

    useEffect(() => {
        setMiniProgressSpinner(true);
        if (search?.length === 0 && searchController) {
            handleFetchDepartment(pageState, search, myedu_id, selectedTypeId, active);
            setSearchController(false);
            setMiniProgressSpinner(false);
        }

        if (search?.length < 2) {
            setMiniProgressSpinner(false);
            return;
        }

        setSearchController(true);
        const delay = setTimeout(() => {
            handleFetchDepartment(pageState, search, myedu_id, selectedTypeId, active);
            setMiniProgressSpinner(false);
        }, 1000);

        return () => {
            clearTimeout(delay);
        };
    }, [search]);

    useEffect(() => {
        if (selectedTypeId) {
            handleFetchDepartment(pageState, search, myedu_id, selectedTypeId, active);
        }
    }, [selectedTypeId]);

    useEffect(() => {
        setMyeduProgressSpinner(true);
        if (myedu_id?.length === 0 && myeduController) {
            handleFetchDepartment(pageState, search, myedu_id, selectedTypeId, active);
            setMyeduController(false);
            setMyeduProgressSpinner(false);
        }

        if (myedu_id && myedu_id?.length < 4) {
            setMyeduProgressSpinner(false);
            return;
        }

        setMyeduController(true);
        const delay = setTimeout(() => {
            handleFetchDepartment(pageState, search, myedu_id, selectedTypeId, active);
            setMyeduProgressSpinner(false);
        }, 1000);

        return () => {
            clearTimeout(delay);
        };
    }, [myedu_id]); 

    useEffect(() => {
        handleFetchCourseOpenStatus();
        handleFetchDepartment(1, '', null, null, null);
    }, []);

    if (contentNull) return <NotFound titleMessage="Данные отсутствуют" />;

    return (
        <div className="flex flex-col gap-4">
            {skeleton ? (
                <GroupSkeleton count={6} size={{ width: '100%', height: '5rem' }} />
            ) : (
                <div className="overflow-x-auto scrollbar-thin">
                    <div className="main-bg mb-2">
                        <h3 className="text-xl sm:text-2xl pb-1 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">Департамент</h3>

                        <div className="flex flex-col sm:flex-row gap-2 mb-2">
                            <div className="flex gap-3 items-center">
                                <div className={`flex items-center ${!selectedTypeId?.role_id ? 'opacity-45 pointer-events-none' : ''}`}>
                                    <label className="custom-radio p-0">
                                        <input
                                            type="checkbox"
                                            checked={active}
                                            className={`customCheckbox p-0`}
                                            onChange={() => {
                                                setActive((prev) => !prev);
                                                handleFetchDepartment(pageState, search, myedu_id, selectedTypeId, !active);
                                            }}
                                        />
                                        <span className="checkbox-mark"></span>
                                    </label>
                                    <p>Активные</p>
                                </div>
                                <div>
                                    <Dropdown value={selectedTypeId} onChange={(e: DropdownChangeEvent) => setSelectedTypeId(e.value)} options={cities} optionLabel="name" placeholder="..." className="w-full text-sm" />
                                </div>
                            </div>
                            <div className="w-full flex justify-center sm:justify-start items-center gap-1">
                                <InputText type="number" placeholder="myedu id" className="w-full sm:max-w-[120px] h-[48px]" onChange={(e) => setMyedu_id(e.target.value)} />
                                <div>{myeduProgressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}</div>
                            </div>
                        </div>

                        <div className="flex items-center relative mb-2">
                            <InputText placeholder="Поиск..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full p-inputtext-sm p-inputtext-rounded" />
                            <div className="absolute right-1">{miniProgressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}</div>
                        </div>
                    </div>

                    {/* Table */}
                    {mainProgressSpinner ? (
                        <div className="main-bg flex justify-center items-center h-[100vh]">
                            <ProgressSpinner style={{ width: '60px', height: '60px' }} />
                        </div>
                    ) : (
                        <div className="main-bg overflow-x-auto scrollbar-thin flex flex-col gap-2">
                            <DataTable value={roles || []} dataKey="id" emptyMessage="..." loading={forDisabled} breakpoint="960px" key={JSON.stringify(forDisabled)} rows={5} className="min-w-[640px] overflow-x-auto">
                                <Column header={() => <div className="text-[14px]">#</div>} body={(_, { rowIndex }) => rowIndex + 1} />

                                <Column
                                    header={() => <div className="text-[14px]">ФИО</div>}
                                    body={(rowData: any) => (
                                        <div className="text-[14px]">
                                            {rowData.last_name} {rowData.name} {rowData.father_name}
                                        </div>
                                    )}
                                />

                                {openTypes?.map((item) => {
                                    return (
                                        <Column
                                            header={item?.title}
                                            body={(rowData) => {
                                                const element = rowData?.course_type_access.find((el: { id: number }) => el.id === item.id);
                                                const isActive = Boolean(element?.pivot?.active);

                                                return (
                                                    <div className="text-center">
                                                        <div className="flex justify-center items-center">
                                                            {!isActive ? (
                                                                <button
                                                                    className={`theme-toggle ${forDisabled && 'opacity-50'}`}
                                                                    disabled={forDisabled}
                                                                    onClick={() => handleControlDepartament(rowData?.id, item?.id, true)}
                                                                    // onClick={() => console.log(rowData?.id, element?.id, item.id, true)}
                                                                    aria-pressed="false"
                                                                >
                                                                    <span className="right">
                                                                        <span className="option option-left" aria-hidden></span>
                                                                        <span className="option option-right" aria-hidden></span>
                                                                        <span className="knob" aria-hidden></span>
                                                                    </span>
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className={`theme-toggle ${forDisabled && 'opacity-50'}`}
                                                                    disabled={forDisabled}
                                                                    onClick={() => handleControlDepartament(rowData?.id, item?.id, false)}
                                                                    aria-pressed="false"
                                                                    // onClick={() => console.log(user, roles[idx])} aria-pressed="false"
                                                                >
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
                                                        </div>
                                                    </div>
                                                );
                                            }}
                                        />
                                    );
                                })}

                                {/* <Column
                                header="Закрытый"
                                body={(rowData) => {
                                    const element = rowData?.course_type_access[0];
                                    const isActive = Boolean(element?.pivot?.active);
                                    if (element)
                                        return (
                                            <div className="text-center">
                                                <div className="flex justify-center items-center">
                                                    {!isActive ? (
                                                        <button
                                                            className={`theme-toggle ${forDisabled && 'opacity-50'}`}
                                                            disabled={forDisabled}
                                                            // onClick={() => handleControlDepartament(user?.id, roles[idx]?.id, true)}
                                                            onClick={() => handleControlDepartament(rowData?.id, element?.id, true)}
                                                            aria-pressed="false"
                                                            // onClick={() => console.log(user?.roles, roles[idx])} aria-pressed="false"
                                                        >
                                                            <span className="right">
                                                                <span className="option option-left" aria-hidden></span>
                                                                <span className="option option-right" aria-hidden></span>
                                                                <span className="knob" aria-hidden></span>
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className={`theme-toggle ${forDisabled && 'opacity-50'}`}
                                                            disabled={forDisabled}
                                                            // onClick={() => handleControlDepartament(user?.id, roles[idx]?.id, false)}
                                                            onClick={() => handleControlDepartament(rowData?.id, element?.id, false)}
                                                            aria-pressed="false"
                                                            // onClick={() => console.log(user, roles[idx])} aria-pressed="false"
                                                        >
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
                                                </div>
                                            </div>
                                        );
                                }}
                            /> */}
                                {/* 
                            <Column
                                header="Открытый"
                                body={(rowData) => {
                                    const element = rowData?.course_type_access[1];
                                    const isActive = Boolean(element?.pivot?.active);
                                    if (element)
                                        return (
                                            <div className="text-center">
                                                <div className="flex justify-center items-center">
                                                    {!isActive ? (
                                                        <button
                                                            className={`theme-toggle ${forDisabled && 'opacity-50'}`}
                                                            disabled={forDisabled}
                                                            // onClick={() => handleControlDepartament(user?.id, roles[idx]?.id, true)}
                                                            onClick={() => handleControlDepartament(rowData?.id, element?.id, true)}
                                                            aria-pressed="false"
                                                            // onClick={() => console.log(user?.roles, roles[idx])} aria-pressed="false"
                                                        >
                                                            <span className="right">
                                                                <span className="option option-left" aria-hidden></span>
                                                                <span className="option option-right" aria-hidden></span>
                                                                <span className="knob" aria-hidden></span>
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className={`theme-toggle ${forDisabled && 'opacity-50'}`}
                                                            disabled={forDisabled}
                                                            // onClick={() => handleControlDepartament(user?.id, roles[idx]?.id, false)}
                                                            onClick={() => handleControlDepartament(rowData?.id, element?.id, false)}
                                                            aria-pressed="false"
                                                            // onClick={() => console.log(user, roles[idx])} aria-pressed="false"
                                                        >
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
                                                </div>
                                            </div>
                                        );
                                }}
                            /> */}
                            </DataTable>

                            <div className={`shadow-[0px_-11px_5px_-6px_rgba(0,_0,_0,_0.1)]`}>
                                <Paginator
                                    first={(pagination.current_page - 1) * pagination.per_page}
                                    rows={pagination.per_page}
                                    totalRecords={pagination.total}
                                    onPageChange={(e) => handlePageChange(e.page + 1)}
                                    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
