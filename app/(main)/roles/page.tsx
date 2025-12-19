'use client';

import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { controlRolesUsers, fetchRolesList, fetchRolesUsers } from '@/services/roles/roles';
import { PaginationType } from '@/types/pagination/PaginationType';
import { RoleUserType } from '@/types/roles/RoleUserType';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useState } from 'react';

// export default function Roles() {
//     // types
//     interface Role {
//         id: number;
//         title: string;
//         created_at: string;
//         updated_at: string;
//     }

//     interface Role_idType {
//         name: string;
//         role_id: number | null;
//     }

//     const showError = useErrorMessage();
//     const { setMessage } = useContext(LayoutContext);

//     const [roles, setRoles] = useState<Role[] | null>(null);
//     const [userPagination, setUserPagintaion] = useState<PaginationType | null>(null); // если нужна пагинация юсеров слишком много
//     const [users, setUsers] = useState<RoleUserType[] | null>(null);

//     const [skeleton, setSkeleton] = useState(false);
//     const [contentNull, setContentNull] = useState<boolean>(false);
//     const [mainProgressSpinner, setMainProgressSpinner] = useState(false);
//     const [miniProgressSpinner, setMiniProgressSpinner] = useState(false);
//     const [myeduProgressSpinner, setMyeduProgressSpinner] = useState(false);
//     const [search, setSearch] = useState<string>('');
//     const [searchController, setSearchController] = useState(false);
//     const [myeduController, setMyeduController] = useState(false);
//     const [active, setActive] = useState(false);
//     const [myedu_id, setMyedu_id] = useState<string | null>(null);
//     const [pagination, setPagination] = useState<{ currentPage: number; total: number; perPage: number }>({
//         currentPage: 1,
//         total: 0,
//         perPage: 0
//     });
//     const [pageState, setPageState] = useState<number>(1);
//     const [selectedRole_idType, setSelectedRole_idType] = useState<Role_idType | null>({ name: 'Все', role_id: null });
//     const [cities, setCities] = useState<Role_idType[]>([{ name: 'Все', role_id: null }]);
//     const [forDisabled, setForDisabled] = useState(false);

//     const handleFetchRoles = async () => {
//         setSkeleton(true);
//         setMainProgressSpinner(true);
//         const data = await fetchRolesList();
//         if (data && Array.isArray(data)) {
//             if (data.length > 0) {
//                 setContentNull(false);
//                 setRoles(data);
//                 setCities([{ name: 'Все', role_id: null }]);
//                 const forSelectedRole_id: any = data?.map((item) => {
//                     return { name: item?.title, role_id: item?.id };
//                 });

//                 if (forSelectedRole_id) setCities((prev) => [...prev, ...forSelectedRole_id]);
//             } else {
//                 setContentNull(true);
//             }
//         } else {
//             setContentNull(false);
//             setMessage({ state: true, value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' } });
//             if (data?.response?.status) {
//                 showError(data.response.status);
//             }
//         }
//         setSkeleton(false);
//         setMainProgressSpinner(false);
//     };

//     const handleFetchUsers = async (page: number, search: string, myedu_id: string | null, selectedRole_idType: Role_idType | null, active: boolean | null) => {
//         const res = await fetchRolesUsers(page, search, myedu_id, selectedRole_idType?.role_id ? selectedRole_idType?.role_id : null, active);
//         if (res?.success) {
//             setUserPagintaion(res?.data);
//             setPagination({
//                 currentPage: res?.data?.current_page,
//                 total: res?.data?.total,
//                 perPage: res?.data?.per_page
//             });
//             const validRolesPosition = res?.data?.data?.map((item: any) => {
//                 if (item?.roles?.length > 1) {
//                     const [first, second] = item.roles;
//                     return {
//                         ...item,
//                         roles: [second, first]
//                     };
//                 }
//                 return item;
//             });
//             console.warn(validRolesPosition);
//             if (validRolesPosition) {
//                 setUsers(validRolesPosition);
//             }
//         } else {
//             setMessage({ state: true, value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' } });
//             if (res?.response?.status) {
//                 showError(res.response.status);
//             }
//         }
//         console.log(res);
//     };

//     const handleControlUsersRole = async (worker_id: number, selectedRole_idTypeParam: number | null, activeParam: boolean | null) => {
//         console.log(selectedRole_idTypeParam);
//         setForDisabled(true);
//         const res = await controlRolesUsers(worker_id, selectedRole_idTypeParam ? selectedRole_idTypeParam : null, activeParam);
//         console.log(res);
//         if (res?.success) {
//             handleFetchRoles();
//             setTimeout(() => {
//                 handleFetchUsers(pageState, search, myedu_id, selectedRole_idType, active);
//             }, 1000);
//             setMessage({ state: true, value: { severity: 'success', summary: 'Успешно изменено!', detail: '' } });
//         } else {
//             setMessage({ state: true, value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' } });
//             if (res?.response?.status) {
//                 showError(res.response.status);
//             }
//         }
//         setForDisabled(false);
//     };
    
//     // Ручное управление пагинацией
//     const handlePageChange = (page: number) => {
//         handleFetchUsers(page, search, myedu_id, selectedRole_idType, active);
//         setPageState(page);
//     };

//     useEffect(() => {
//         setMiniProgressSpinner(true);
//         if (search?.length === 0 && searchController) {
//             handleFetchUsers(pageState, search, myedu_id, selectedRole_idType, active);
//             setSearchController(false);
//             setMiniProgressSpinner(false);
//         }

//         if (search?.length < 2) {
//             setMiniProgressSpinner(false);
//             return;
//         }

//         setSearchController(true);
//         const delay = setTimeout(() => {
//             handleFetchUsers(pageState, search, myedu_id, selectedRole_idType, active);
//             setMiniProgressSpinner(false);
//         }, 1000);

//         return () => {
//             clearTimeout(delay);
//         };
//     }, [search]);

//     useEffect(() => {
//         if (selectedRole_idType) {
//             handleFetchUsers(pageState, search, myedu_id, selectedRole_idType, active);
//         }
//     }, [selectedRole_idType]);

//     useEffect(() => {
//         setMyeduProgressSpinner(true);
//         if (myedu_id?.length === 0 && myeduController) {
//             handleFetchUsers(pageState, search, myedu_id, selectedRole_idType, active);
//             setMyeduController(false);
//             setMyeduProgressSpinner(false);
//         }

//         if (myedu_id && myedu_id?.length < 4) {
//             setMyeduProgressSpinner(false);
//             return;
//         }

//         setMyeduController(true);
//         const delay = setTimeout(() => {
//             handleFetchUsers(pageState, search, myedu_id, selectedRole_idType, active);
//             setMyeduProgressSpinner(false);
//         }, 1000);

//         return () => {
//             clearTimeout(delay);
//         };
//     }, [myedu_id]);

//     useEffect(()=> {
//         console.log(pagination);
        
//     },[pagination]);

//     useEffect(() => {
//         handleFetchRoles();
//         handleFetchUsers(1, '', null, null, null);
//     }, []);

//     if (mainProgressSpinner)
//         return (
//             <div className="main-bg flex justify-center items-center h-[100vh]">
//                 <ProgressSpinner style={{ width: '60px', height: '60px' }} />
//             </div>
//         );

//     if (contentNull) return <NotFound titleMessage="Данные отсутствуют" />;

//     return (
//         <div className="flex flex-col gap-4">
//             {skeleton ? (
//                 <GroupSkeleton count={5} size={{ width: '100%', height: '3rem' }} />
//             ) : (
//                 <div className="overflow-x-auto scrollbar-thin">
//                     <div className="main-bg mb-2">
//                         <h3 className="text-xl sm:text-2xl pb-1 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">Админ</h3>

//                         <div className="flex flex-col sm:flex-row gap-2 mb-2">
//                             <div className="flex gap-3 items-center">
//                                 <div className={`flex items-center ${!selectedRole_idType?.role_id ? 'opacity-45 pointer-events-none' : ''}`}>
//                                     <label className="custom-radio p-0">
//                                         <input
//                                             type="checkbox"
//                                             checked={active}
//                                             className={`customCheckbox p-0`}
//                                             onChange={() => {
//                                                 setActive((prev) => !prev);
//                                                 handleFetchUsers(pageState, search, myedu_id, selectedRole_idType, !active);
//                                             }}
//                                         />
//                                         <span className="checkbox-mark"></span>
//                                     </label>
//                                     <p>Активные</p>
//                                 </div>
//                                 <div>
//                                     <Dropdown value={selectedRole_idType} onChange={(e: DropdownChangeEvent) => setSelectedRole_idType(e.value)} options={cities} optionLabel="name" placeholder="..." className="w-full text-sm" />
//                                 </div>
//                             </div>
//                             <div className="w-full flex justify-center sm:justify-start items-center gap-1">
//                                 <InputText type="number" placeholder="myedu id" className="w-full sm:max-w-[120px] h-[48px]" onChange={(e) => setMyedu_id(e.target.value)} />
//                                 <div>{myeduProgressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}</div>
//                             </div>
//                         </div>

//                         <div className="flex items-center relative mb-2">
//                             <InputText placeholder="Поиск..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full p-inputtext-sm p-inputtext-rounded" />
//                             <div className="absolute right-1">{miniProgressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}</div>
//                         </div>
//                     </div>

//                     <div className="main-bg overflow-x-auto scrollbar-thin flex flex-col gap-2">
//                         <DataTable value={users || []} dataKey="id" emptyMessage="Загрузка" breakpoint="960px" key={JSON.stringify(forDisabled)} rows={5} className=" min-w-[640px] overflow-x-auto">
//                             <Column header={() => <div className="text-[14px]">#</div>} body={(_, { rowIndex }) => rowIndex + 1} />

//                             <Column
//                                 header={() => <div className="text-[14px]">ФИО</div>}
//                                 body={(rowData: any) => (
//                                     <div className="text-[14px]">
//                                         {rowData.last_name} {rowData.name} {rowData.father_name}
//                                     </div>
//                                 )}
//                             />
//                             {roles?.map((role, idx) => {
//                                 return (
//                                     <Column
//                                         key={role.id}
//                                         header={() => <div className="text-[14px]">{role.title}</div>}
//                                         body={(user) => {
//                                             console.log(user.roles);
//                                             const userRole = user?.roles?.find((r: { id: number }) => r.id === role.id);

//                                             const isActive = Boolean(userRole?.pivot?.active);

//                                             return (
//                                                 <div className="text-center">
//                                                     <div className="flex justify-center items-center">
//                                                         {!isActive ? (
//                                                             <button
//                                                                 className={`theme-toggle ${forDisabled && 'opacity-50'}`}
//                                                                 disabled={forDisabled}
//                                                                 onClick={() => handleControlUsersRole(user?.id, roles[idx]?.id, true)}
//                                                                 aria-pressed="false"
//                                                                 // onClick={() => console.log(user?.roles, roles[idx])} aria-pressed="false"
//                                                             >
//                                                                 <span className="right">
//                                                                     <span className="option option-left" aria-hidden></span>
//                                                                     <span className="option option-right" aria-hidden></span>
//                                                                     <span className="knob" aria-hidden></span>
//                                                                 </span>
//                                                             </button>
//                                                         ) : (
//                                                             <button
//                                                                 className={`theme-toggle ${forDisabled && 'opacity-50'}`}
//                                                                 disabled={forDisabled}
//                                                                 onClick={() => handleControlUsersRole(user?.id, roles[idx]?.id, false)}
//                                                                 aria-pressed="false"
//                                                                 // onClick={() => console.log(user, roles[idx])} aria-pressed="false"
//                                                             >
//                                                                 <span className="track">
//                                                                     <span className="option option-left" aria-hidden></span>

//                                                                     <span className="option option-right" aria-hidden>
//                                                                         <svg
//                                                                             xmlns="http://www.w3.org/2000/svg"
//                                                                             width="24"
//                                                                             height="24"
//                                                                             fill="none"
//                                                                             stroke="green"
//                                                                             stroke-width="2"
//                                                                             stroke-linecap="round"
//                                                                             stroke-linejoin="round"
//                                                                             viewBox="0 0 24 24"
//                                                                             aria-label="Опубликовано"
//                                                                         >
//                                                                             <circle cx="12" cy="12" r="10"></circle>
//                                                                             <path d="M9 12l2 2 4-4"></path>
//                                                                         </svg>
//                                                                     </span>

//                                                                     <span className="knob" aria-hidden></span>
//                                                                 </span>
//                                                             </button>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             );
//                                         }}
//                                     />
//                                 );
//                             })}
//                         </DataTable>

//                         <div className={`shadow-[0px_-11px_5px_-6px_rgba(0,_0,_0,_0.1)]`}>
//                             <Paginator
//                                 first={(pagination.currentPage - 1) * pagination.perPage}
//                                 rows={pagination.perPage}
//                                 totalRecords={pagination.total}
//                                 onPageChange={(e) => handlePageChange(e.page + 1)}
//                                 template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

export default function Roles() {
    return null;
}