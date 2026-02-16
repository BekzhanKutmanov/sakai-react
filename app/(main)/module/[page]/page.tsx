'use client';

import { fetchFaculty } from '@/services/faculty';
import { fetchSpeciality } from '@/services/student/studentSearch';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useState } from 'react';
import ModuleChartCard from '@/app/components/cards/ModuleChartCard';
import { set } from 'react-hook-form';
import SubTitle from '@/app/components/SubTitle';
import { fetchModuleShedule, fetchSemestr, sheduleSave } from '@/services/module/module';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import Message from '@/app/components/messages/Message';
import { connect } from 'http2';
import { log } from 'console';
import { confirmDialog } from 'primereact/confirmdialog';
import { Panel } from 'primereact/panel';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { LayoutContext } from '@/layout/context/layoutcontext';

export default function Module() {
    const params = new URLSearchParams();
    const { setMessage } = useContext(LayoutContext);

    const [timeMode, setTimeMode] = useState<{ name_ru: string; code: number | null; id: number | null } | null>({ name_ru: '', code: null, id: null });
    const [timeModeOptions, setTimeModeOptions] = useState<any>(null);
    const [searchController, setSearchController] = useState(false);

    const [speciality, setSpecialyty] = useState<{ name_ru: string; code: number | null; id: number | null } | null>(null);
    const [specialityOptions, setSpecialityOptions] = useState<any>([]);

    const [currentFacultyId, setCurrentFacultyId] = useState<number | null>(null);
    const [currentSpecialityId, setCurrentSpecialityId] = useState<number | number[] | null>(null);

    const [period, setPeriod] = useState<{ name_ru: string; code: number | null; id: number | null } | null>(null);
    const [periodOptions, setPeriodOptions] = useState<any>([
        { name_ru: 'Все', id: null },
        { name_ru: 'Летний', id: 1 },
        { name_ru: 'Зимний', id: 2 }
    ]);

    const [semestr, setSemestr] = useState<{ name_ru: string; id: number | null } | null>(null);
    const [semestrOptions, setSemestrOptions] = useState<any>([]);

    const [progressSpinner, setProgressSpinner] = useState(false);
    const [skeleton, setSkeleton] = useState(false);
    const [search, setSearch] = useState<string>('');

    const [connectIds, setConnectIds] = useState<number[] | null>(null);
    const [currentStream, setCurrentStream] = useState<any>(null);
    const [connects, setConnects] = useState<any>([]);

    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [visible, setVisible] = useState(false);
    // const [allSelectFl, setAllSelectFl] = useState([{ state: false, id: null }]);
    const [allSelectFl, setAllSelectFl] = useState<number[]>([]);

    const [accrodionIndex, setAccrodionIndex] = useState(0);
    const [emptySpeciality, setEmptySpeciality] = useState(false);

    const [from, setFrom] = useState<Nullable<Date>>(null);
    const [to, setTo] = useState<Nullable<Date>>(null);

    const [saveBtnDisabled, setSaveBtnDisabled] = useState(false);

    const handleFetchFaculty = async () => {
        const data = await fetchFaculty();
        if (data && data?.length) {
            // const alls = { name_ru: 'Все', code: null, id: null };
            // data.unshift(alls);
            setTimeModeOptions(data);
        }
    };

    const handleStudentSpeciality = async (id_faculty: number) => {
        const data = await fetchSpeciality(id_faculty);
        if (data && data?.length) {
            setSpecialityOptions(data);
            // setStudents(data?.data);
        }
    };

    const handleFetchModuleShedule = async (specialityIds: any, periodId: number | null, semesterId: number | null) => {
        setProgressSpinner(true);
        const data = await fetchModuleShedule(Array.isArray(specialityIds) ? specialityIds : [specialityIds], periodId, semesterId);
        console.log(data);

        if (data && data?.length > 0) {
            setConnects(data);
            setEmptySpeciality(false);
            startSheduleCheck(data);
        } else {
            setEmptySpeciality(true);
        }
        setProgressSpinner(false);
    };

    const handleFetchSemestr = async () => {
        setProgressSpinner(true);
        const data = await fetchSemestr();
        if (data && data?.length) {
            setSemestrOptions(data);
            setSemestr({ id: data[0]?.id, name_ru: data[0]?.name_ru });
        }
        setProgressSpinner(false);
    };

    const handleSave = async () => {
        setProgressSpinner(true);
        const data = await sheduleSave(from, to, period?.id ? period?.id : null, semestr?.id ? semestr?.id : null, allSelectFl, connectIds);
        console.log(data);
        if (data && data?.success) {
            setMessage({
                state: true,
                value: { severity: 'success', summary: data?.message, detail: '' }
            });
            handleFetchModuleShedule(currentSpecialityId, period?.id ? period?.id : null, semestr?.id ? semestr?.id : null);
            // setSemestrOptions(data);
            // setSemestr({ id: data[0]?.id, name_ru: data[0]?.name_ru });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
        }
        setProgressSpinner(false);
    };

    const handleEdit = (id: number, e: { checked: boolean }, specialityId: number) => {
        if (e.checked) {
            // console.warn('clear ');
            if (connectIds) {
                !connectIds?.includes(id) && setConnectIds([...connectIds, id]);
            } else {
                setConnectIds([id]);
            }
        } else {
            setAllSelectFl((prev) => prev && prev?.filter((id) => id !== specialityId));
            // console.warn('no clear ');
            setConnectIds((prev) => prev && prev?.filter((item) => item !== id));
        }
    };

    const specialityWithAll = [{ id: null, code: 1, name_ru: 'По всем специальностям' }, ...specialityOptions];

    const startSheduleCheck = (connects: number[]) => {
        if (connects) {
            const activeStreamIds = connects
                .flatMap((c: any) => c?.streams)
                .filter((s: any) => s.schedule?.active)
                .map((s: any) => s?.id_stream);

            console.log(activeStreamIds); // [1, 3, 4]
            if (activeStreamIds) {
                setConnectIds(activeStreamIds);
            }
        }
    };

    const confirm1 = (id: number) => {
        confirmDialog({
            message: 'Вы точно хотите записаться на курс?',
            header: 'Подтверждение',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            acceptLabel: 'Записаться',
            rejectLabel: 'Назад',
            rejectClassName: 'p-button-secondary reject-button',
            accept: () => console.log(id)
        });
    };

    useEffect(() => {
        if (timeMode?.id) {
            setCurrentFacultyId(timeMode?.id);
        }
    }, [timeMode]);

    useEffect(() => {
        if (currentFacultyId) {
            handleStudentSpeciality(currentFacultyId);
        }
    }, [currentFacultyId]);

    useEffect(() => {
        if (speciality) {
            if (speciality?.code === 1) {
                const forAllSpecialityIds = specialityWithAll?.map((item) => item?.id)?.filter((item) => item);
                // handleFetchModuleShedule(forAllSpecialityIds, period?.id ? period?.id : null, semestr?.id ? semestr?.id : null);
                setCurrentSpecialityId(forAllSpecialityIds);
            } else {
                if (speciality?.id) {
                    setCurrentSpecialityId(speciality?.id);
                    // handleFetchModuleShedule([speciality?.id], period?.id ? period?.id : null, semestr?.id ? semestr?.id : null);
                }
            }
        }
    }, [speciality]);

    useEffect(() => {
        setCurrentStream(connects[accrodionIndex]?.streams);
    }, [accrodionIndex]);

    useEffect(() => {
        console.log('specialitys', allSelectFl);
    }, [allSelectFl]);

    useEffect(() => {
        console.log('connects', connectIds);
    }, [connectIds]);

    useEffect(() => {
        if (connects?.length > 0) {
            setSaveBtnDisabled(false);
        } else {
            setSaveBtnDisabled(true);
        }
    }, [connects]);

    useEffect(() => {
        handleFetchFaculty();
        handleFetchSemestr();
    }, []);

    const footerContent = (
        <div>
            <Button
                label="Назад"
                className="reject-button"
                icon="pi pi-times"
                size='small'
                onClick={() => {
                    setVisible(false);
                }}
            />

            <Button
                label="Сохранить"
                icon="pi pi-check"
                size='small'
                onClick={() => {
                    setVisible(false);
                    handleSave();
                }}
                autoFocus
            />
        </div>
    );

    return (
        <div className="flex flex-col gap-2">
            {/* filter */}
            <div className="main-bg flex flex-col gap-1 my-1 p-3 sm:p-4">
                <div className="shadow-[var(--bottom-shadow)] pb-2">
                    <SubTitle mobileTitleSize="xl" title="График модулей" titleSize="2xl" />
                </div>
                <div className="flex sm:items-center gap-2 flex-col sm:flex-row my-2 ">
                    <div className="sm:max-w-[40%] overflow-hidden flex flex-col items-start gap-2">
                        <b className="px-1 inline">Выберите факультет</b>
                        <div className="sm:max-w-[40%] overflow-hidden flex juctify-center items-start">
                            <Dropdown value={timeMode} optionLabel="name_ru" options={timeModeOptions} onChange={(e) => setTimeMode(e.value)} placeholder="Выберите факультет" className="text-wrap word-break sm:text-nowrap sm:max-w-full" />
                        </div>
                    </div>

                    <div className="sm:max-w-[40%] overflow-hidden flex flex-col gap-2">
                        <b className="px-1">Специальность</b>
                        <div className="sm:max-w-[40%] overflow-hidden flex juctify-center items-start">
                            <Dropdown
                                value={speciality}
                                optionLabel="name_ru"
                                options={specialityWithAll}
                                onChange={(e) => setSpecialyty(e.value)}
                                placeholder="Выберите специальность"
                                className={`${specialityOptions?.length < 1 ? 'pointer-events-none opacity-50' : ''} w-full text-sm`}
                            />
                        </div>
                    </div>

                    <div className="sm:max-w-[60%] overflow-hidden flex flex-col gap-2">
                        <b className="px-1">Период</b>
                        <div className="sm:max-w-[60%] overflow-hidden flex juctify-center items-start">
                            <Dropdown
                                value={period}
                                optionLabel="name_ru"
                                options={periodOptions}
                                onChange={(e) => setPeriod(e.value)}
                                placeholder="Выберите период"
                                className={`${specialityOptions?.length < 1 ? 'pointer-events-none opacity-50' : ''} w-full text-sm`}
                            />
                        </div>
                    </div>

                    <div className="sm:max-w-[60%] overflow-hidden flex flex-col gap-2">
                        <b className="px-1">Семестр</b>
                        <div className="sm:max-w-[60%] overflow-hidden flex juctify-center items-start">
                            <Dropdown
                                value={semestr}
                                optionLabel="name_ru"
                                options={semestrOptions}
                                onChange={(e) => setSemestr(e.value)}          
                                placeholder="Выберите семестр"
                                className={`${specialityOptions?.length < 1 ? 'pointer-events-none opacity-50' : ''} w-full text-sm`}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex">
                    <Button
                        className=""
                        label="Поиск"
                        onClick={() => {
                            handleFetchModuleShedule(currentSpecialityId, period?.id ? period?.id : null, semestr?.id ? semestr?.id : null);
                        }}
                    />
                </div>
            </div>
            <div>
                {emptySpeciality ? (
                    <div className="main-bg my-4 flex justify-center">
                        <b>Данных нет</b>
                    </div>
                ) : progressSpinner ? (
                    <div className="main-bg my-4 flex justify-center">
                        <ProgressSpinner style={{ width: '45px', height: '45px' }} />
                    </div>
                ) : (
                    <div className="main-bg flex flex-col gap-3">
                        {connects.map((course: any, idx: number) => {
                            const isOpen = openIndex === idx;
                            return (
                                <Panel
                                    key={course.id}
                                    toggleable
                                    collapsed={!isOpen}
                                    onToggle={() => {
                                        setOpenIndex(isOpen ? null : idx);
                                        // setConnectIds([]);
                                    }}
                                    className="w-full"
                                    header={
                                        <div className="flex items-center justify-between w-full">
                                            {/* ЛЕВАЯ ЧАСТЬ */}
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center shrink-0">
                                                    <label className="custom-radio text-xl leading-none">
                                                        <input
                                                            type="checkbox"
                                                            className={`customCheckbox p-2`}
                                                            checked={allSelectFl.some((s) => s === course?.id) ? true : false}
                                                            onChange={(e) => {
                                                                setAllSelectFl((prev) => {
                                                                    const exists = prev.includes(course.id);
                                                                    if (exists) {
                                                                        const streamArr = course?.streams?.map((stream: any) => stream.id_stream);
                                                                        setConnectIds((prev) => prev && prev.filter((id) => !streamArr?.includes(id)));
                                                                        return prev.filter((id) => id !== course.id);
                                                                    } else {
                                                                        const forConnects = course?.streams?.map((stream: any) => {
                                                                            return stream?.id_stream;
                                                                        });
                                                                        if (connectIds) {
                                                                            const f = [...connectIds];
                                                                            setConnectIds([...f, ...forConnects]);
                                                                        } else {
                                                                            setConnectIds(forConnects);
                                                                        }
                                                                        return [...prev, course.id];
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                        <span className="checkbox-mark"></span>
                                                    </label>
                                                </div>
                                                <span className="font-semibold">
                                                    {idx + 1}. {course.name_ru}
                                                </span>
                                            </div>
                                        </div>
                                    }
                                >
                                    <div className="flex flex-col gap-2 mt-2 w-full">
                                        {course?.streams?.length > 0 ? (
                                            course.streams.map((item: any) => (
                                                <ModuleChartCard
                                                    key={item?.id}
                                                    title={item?.subject_data?.name_ru}
                                                    shedule={item?.schedule}
                                                    connectId={item?.id_stream}
                                                    handleEdit={(id, checked) => handleEdit(id, checked, course?.id)}
                                                    allIds={connectIds}
                                                    date="---"
                                                />
                                            ))
                                        ) : (
                                            <div className="main-bg flex justify-center">
                                                <b>Данных нет</b>
                                            </div>
                                        )}
                                    </div>
                                </Panel>
                            );
                        })}
                        <div className="flex justify-end">
                            <Button label="Сохранить" disabled={saveBtnDisabled} onClick={() => setVisible(true)} className="" />
                        </div>
                    </div>
                )}
            </div>
            <Dialog
                header={'Изменить график модулей'}
                visible={visible}
                onHide={() => {
                    if (!visible) return;
                    setVisible(false);
                }}
                footer={footerContent}
            >
                <div>
                    <div className="w-full flex flex-col">
                        <div className="w-full flex flex-col sm:flex-row justify-evenly items-center gap-1">
                            <div className="flex flex-col items-center">
                                <span className="text-sm">Начало модуля</span>
                                <Calendar
                                    value={from}
                                    locale="ru" // Указываем русскую локаль
                                    dateFormat="dd.mm.yy"
                                    className="p-inputtext-sm"
                                    onChange={(e) => setFrom(e.value)}
                                />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-sm">Конец модуля</span>
                                <Calendar
                                    value={to}
                                    locale="ru" // Указываем русскую локаль
                                    dateFormat="dd.mm.yy"
                                    className="p-inputtext-sm"
                                    onChange={(e) => setTo(e.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
