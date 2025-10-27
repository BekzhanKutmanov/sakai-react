'use client';

import Link from 'next/link';

export default function Forum() {
    type OptionsType = Intl.DateTimeFormatOptions;

    const dateTime = (createdAt: string | null) => {
        const invalidDate = <div>---</div>;
        if (createdAt) {
            const dateObject = new Date(createdAt);
            if (dateObject) {
                const options: OptionsType = {
                    year: '2-digit',
                    month: 'short', // 'long', 'short', 'numeric'
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false // 24-часовой формат
                };
                const formattedString = dateObject.toLocaleString('ru-RU', options);
                const result = formattedString?.replace(/,/g, '');
                if (formattedString) {
                    return <div>{result}</div>;
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

    const userChat = (
        <div className="w-[90%] flex flex-col justify-center shadow p-2 gap-2">
            <div className="w-full flex justify-between">
                <b className="w-full text-[var(--mainColor)]">Иван Иванов</b>

                <div className="w-full relative flex">
                    <p className="absolute right-0 -top-3 text-[10px] m-0">{dateTime('')}</p>
                </div>
            </div>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem veritatis culpa cumque deserunt ut libero? Reiciendis facere pariatur sint esse possimus inventore quod minus nobis quas. Odio iure aliquid deserunt!Lorem ipsum dolor sit
                amet, consectetur adipisicing elit. Rem veritatis culpa cumque deserunt ut libero? Reiciendis facere pariatur sint esse possimus inventore quod minus nobis quas. Odio iure aliquid deserunt! Lorem ipsum dolor sit amet,
            </div>
            <div className="flex items-center justify-end gap-1">
                <i className="m-0 pi pi-heart text-[13px]"></i>
                <span className="text-[14px]">12</span>
            </div>
        </div>
    );

    return (
        <div className="main-bg">
            <div className="flex flex-col gap-4">
                {/* header section */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)] pb-2">
                        <div className="flex flex-col gap-1 text-xl">
                            <h3 className="m-0">Название курса</h3>
                            <h3 className="m-0">Название темы</h3>
                        </div>
                        <span>xx-xx-xx</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="m-0">Название форума</h3>
                        <span className="text-[13px]">Иван Иванов</span>
                    </div>
                </div>

                {/* chat */}
                <div className="flex flex-col gap-2 p-3 lesson-card-border rounded max-h-[350px] sm:max-h-[400px] overflow-x-auto">
                    {userChat}
                    {userChat}
                    {userChat}
                    {userChat}
                    {userChat}
                    {userChat}
                    {userChat}
                    {userChat}
                </div>

                {/* send area */}
                <div>
                    
                </div>
            </div>
        </div>
    );
}
