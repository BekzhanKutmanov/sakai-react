'use client';

import FormModal from '@/app/components/popUp/FormModal';
import Redacting from '@/app/components/popUp/Redacting';
import useErrorMessage from '@/hooks/useErrorMessage';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { addForumMessage, deleteMessageForum, forumDetails, forumDetailsShow, updateMessageForum } from '@/services/forum';
import { getConfirmOptions } from '@/utils/getConfirmOptions';
import { getRedactor } from '@/utils/getRedactor';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useRef, useState } from 'react';

export default function Forum() {
    type OptionsType = Intl.DateTimeFormatOptions;

    // data
    interface answerType {
        created_at: string;
        description: string;
        forum_id: number;
        id: number;
        parent_id: number | null;
        steps_id: number;
        updated_at: string;
        user: { id: number; name: string };
        user_id: number;
    }

    // main
    interface mainAnswerType {
        current_page: number;
        data: answerType[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: [{ url: string | null; label: string; active: boolean }];
        next_page_url: null;
        path: string;
        per_page: number;
        prev_page_url: null;
        to: number;
        total: number;
    }

    const { stepId, id_parent, forum_id } = useParams();

    const { user, setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();
    const media = useMediaQuery('(max-width: 640px)');
    const scrollRef = useRef();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [selectId, setSelectId] = useState<number | null>(null);
    const [visible, setVisisble] = useState(false);
    const [isLoadingOlder, setIsLoadingOlder] = useState(false);
    const [forumValue, setForumValue] = useState<mainAnswerType>({
        current_page: 0,
        data: [],
        first_page_url: '',
        from: 0,
        last_page: 0,
        last_page_url: '',
        links: [{ url: '', label: '', active: false }],
        next_page_url: null,
        path: '',
        per_page: 0,
        prev_page_url: null,
        to: 0,
        total: 0
    });
    const [sendMessage, setSendMessage] = useState('');
    const [progressSpinner, setProgressSpinner] = useState(false);
    const [bigProgressSpinner, setBigProgressSpinner] = useState(false);
    const [sendBtnDisabled, setSendBtnDisabled] = useState(false);
    const [currentPage, setCurrentPage] = useState<number | null>(0);
    const [editingLesson, setEditingLesson] = useState<{ description: string } | null>(null);

    // 2. Функция, выполняющая прокрутку
    const scrollToTop = () => {
        if (messagesEndRef.current) {
            // Устанавливаем scrollTop в 0 для прокрутки в самый верх
            messagesEndRef.current.scrollTop = 0;
        }
    };

    const dateTime = (createdAt: string | null) => {
        const invalidDate = <span>---</span>;
        if (createdAt) {
            const dateObject = new Date(createdAt);
            if (dateObject) {
                const options: OptionsType = {
                    month: 'short', // 'long', 'short', 'numeric'
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false // 24-часовой формат
                };
                const formattedString = dateObject.toLocaleString('ru-RU', options);
                const result = formattedString?.replace(/,/g, '');
                if (formattedString) {
                    return <span>{result}</span>;
                } else {
                    return invalidDate;
                }
            } else {
                return invalidDate;
            }
        } else {
            return invalidDate;
        }
    };

    const handleForumDetails = async () => {
        setIsLoadingOlder(true); // сразу же отключаем запрос
        setProgressSpinner(true);
        const data = await forumDetails(Number(forum_id), currentPage);
        if (data && Object.values(data).length > 0) {
            // setTimeout(() => {
            setProgressSpinner(false);
            if (data?.data?.length < 1) {
                // если очередной или первый запрос возвращает пустой массив то отключам состояние и прекращаем на этом делать новые запросы
                setIsLoadingOlder(true);
            } else {
                setIsLoadingOlder(false); // если же данные пришли то значит и дальше есть скорее есть данные значит включаем состояние
            }

            const forData = [...(forumValue?.data ?? []), ...(data?.data || [])];
            const newStructure = {
                current_page: data?.current_page,
                first_page_url: '',
                data: forData,
                from: data?.from,
                last_page: data?.last_page,
                last_page_url: data?.last_page_url,
                links: [{ url: '', label: '', active: false }],
                next_page_url: data?.next_page_url,
                path: data?.path,
                per_page: data?.per_page,
                prev_page_url: data?.prev_page_url,
                to: data?.to,
                total: data?.total
            };
            console.log(newStructure);
            setForumValue(newStructure);
            // }, 1000);
        } else {
            setIsLoadingOlder(true); // останавливаем если ошибка
            setProgressSpinner(false);
        }
    };

    const editing = async (id: number) => {
        const data = await forumDetailsShow(id);
        console.log(data);

        if (data && Object.values(data).length) {
            setEditingLesson({ description: data?.description });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка!', detail: 'Повторите позже' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const selectedForEditing = (id: number) => {
        console.log(id);

        setSelectId(id);
        setVisisble(true);
        editing(id);
    };

    // const handleForumMore = () => {
    // };

    // ДОБАВЛЕНИЕ СООБЩЕНИЙ
    const handleAddMessage = async () => {
        setIsLoadingOlder(true);
        setProgressSpinner(true);
        const data = await addForumMessage(Number(stepId), null, sendMessage);
        console.log(data);

        if (data.success) {
            setSendMessage('');
            setIsLoadingOlder(false);
            setProgressSpinner(false);
            setForumValue((prev) => (prev ? { ...prev, data: [...prev.data, data?.data] } : prev));
            // setForumValue(data?.data);
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно добавлен!', detail: '' }
            });
        } else {
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при добавлении!', detail: '' }
            });
            if (data.response.status) {
                showError(data.response.status);
            }
        }
    };

    const handleDelete = async (id: number) => {
        setBigProgressSpinner(true);

        const data = await deleteMessageForum(id);
        console.log(data);

        if (data.success) {
            setBigProgressSpinner(false);
            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно удалено!', detail: '' }
            });
            setForumValue((prev) =>
                prev
                    ? {
                          ...prev,
                          data: prev.data.filter((item) => {
                              return item?.id !== id;
                          })
                      }
                    : prev
            );
        } else {
            setBigProgressSpinner(false);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при удалении!', detail: '' }
            });
            if (data.response.status) {
                showError(data.response.status);
            }
        }
    };

    // update document
    const handleUpdate = async () => {
        setBigProgressSpinner(true);
        const data = await updateMessageForum(selectId, (editingLesson && editingLesson?.description) || '');
        console.log(data);

        if (data?.success) {
            setBigProgressSpinner(false);
            setForumValue((prev) =>
                prev
                    ? {
                          ...prev,
                          data: prev.data.map((item) =>
                              item.id === data.data.id
                                  ? { ...item, description: data.data.description } // обновляем нужное поле
                                  : item
                          )
                      }
                    : prev
            );

            setMessage({
                state: true,
                value: { severity: 'success', summary: 'Успешно изменено!', detail: '' }
            });
        } else {
            setBigProgressSpinner(false);
            setEditingLesson({ description: '' });
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Ошибка при изменении!', detail: '' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    const handleScroll = (e: { currentTarget: { scrollTop: number; clientHeight: number; scrollHeight: number } }) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

        // Рассчитываем, насколько близко мы к низу.
        // Мы на самом низу, когда: scrollTop + clientHeight === scrollHeight
        // Устанавливаем "зазор" (например, 100px), чтобы начать загрузку заранее:
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 200;
        // clientHeight -

        if (isNearBottom && !isLoadingOlder) {
            // Вызов функции для загрузки БОЛЕЕ НОВЫХ сообщений
            // handleAddMessage();
            handleForumDetails();

            console.log('up');
        }
    };
    // Вызываем детаилс
    useEffect(() => {
        handleForumDetails();
        // scrollToTop();
    }, []);

    useEffect(() => {
        console.log(forumValue);
        if (forumValue?.current_page) {
            setCurrentPage(forumValue.current_page);
        }
    }, [forumValue]);

    useEffect(() => {
        console.log('currentpage', currentPage);
    }, [currentPage]);

    return (
        <div className="main-bg">
            <div className="flex flex-col gap-4">
                {/* header section */}
                <div className="flex flex-col gap-2">
                    {/* <div className="flex justify-between shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)] pb-2">
                        <div className="flex flex-col sm:flex-row items-center gap-1 text-xl">
                            <h3 className="m-0">Название курса {!media && '-'}</h3>
                            <h3 className="m-0">Название темы</h3>
                        </div>
                        <span>xx-xx-xx</span>
                    </div> */}
                    <div className="flex justify-between items-start shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)] pb-2">
                        <div className="flex flex-col gap-1">
                            <h3 className="m-0 w-full break-words text-lg">Название форума Название форума Название форума</h3>
                            <span className="text-[13px]">Иван Иванов</span>
                        </div>
                        <span className="w-[180px] text-sm flex justify-end">xx-xx-xx</span>
                    </div>
                </div>

                {/* chat */}
                <div className="relative">
                    {bigProgressSpinner && (
                        <div className="absolute w-full h-full bg-black/50 flex justify-center items-center">
                            <ProgressSpinner className="text-white text-lg" style={{ width: '54px', height: '54px' }} />
                        </div>
                    )}
                    <div onScroll={handleScroll} ref={messagesEndRef} className="flex flex-col gap-2 p-3 lesson-card-border rounded max-h-[350px] sm:max-h-[400px] overflow-x-auto">
                        {Array.isArray(forumValue?.data) &&
                            forumValue?.data?.map((item) => {
                                return (
                                    <div key={item?.id}>
                                        <div className={`w-full flex flex-col justify-center shadow p-2 gap-2 ${user?.id === item?.user?.id ? 'bg-[#ddc4f51a]' : ''}`}>
                                            <div className="w-full flex justify-between">
                                                <b className="w-full text-sm text-[var(--mainColor)]">{item?.user?.name}</b>

                                                <div className="w-full h-full relative flex flex-col items-end gap-2 justify-between">
                                                    {user?.id === item?.user?.id && <Redacting redactor={getRedactor('null', item, { onEdit: selectedForEditing, getConfirmOptions, onDelete: handleDelete })} textSize={'14px'} />}
                                                </div>
                                            </div>
                                            <div className='flex justify-between gap-2 items-center'>
                                                <div className="w-full break-words text-sm ">{item?.description}</div>
                                                <p className="text-[10px] m-0 w-full flex justify-end">{dateTime(item?.updated_at)}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        {progressSpinner && <ProgressSpinner style={{ width: '70px', height: '50px' }} animationDuration=".5s" />}
                    </div>
                </div>

                {/* send area */}
                <div className="flex items-center gap-1">
                    <InputText className="w-full p-2 p-inputtext-sm" value={sendMessage} onChange={(e) => setSendMessage((prev) => (prev = e.target.value))} />
                    <button
                        disabled={progressSpinner || sendBtnDisabled}
                        onClick={() => {
                            handleAddMessage();
                            setSendBtnDisabled(true);
                            setTimeout(() => {
                                setSendBtnDisabled(false);
                            }, 1000);
                        }}
                        className={`pi pi-send cursor-pointer ${
                            progressSpinner && 'opacity-50'
                        } transform rotate-[47deg] bg-[var(--mainColor)] p-[10px] sm:p-[12px] rounded-full text-white text-lg sm:text-xl hover:bg-[var(--mainBorder)] hover:text-[var(--mainColor)]`}
                    ></button>
                </div>
            </div>

            <FormModal title={'Редактировать'} fetchValue={() => handleUpdate()} clearValues={() => {}} visible={visible} setVisible={setVisisble} start={false} footerValue={{ footerState: true, reject: 'Закрыть', next: 'Сохранить' }}>
                <div className="flex flex-col gap-1">
                    <div className="flex relative">
                        <InputText
                            value={editingLesson?.description}
                            disabled={progressSpinner === true ? true : false}
                            className="w-full"
                            onChange={(e) => {
                                setEditingLesson(
                                    (prev) =>
                                        prev && {
                                            ...prev,
                                            description: e.target.value
                                        }
                                );
                            }}
                        />
                        {progressSpinner && <ProgressSpinner style={{ width: '15px', height: '15px' }} strokeWidth="8" fill="white" className="!stroke-green-500" animationDuration=".5s" />}
                    </div>
                </div>
            </FormModal>
        </div>
    );
}
