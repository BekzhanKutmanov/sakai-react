// 'use client';
// import React from 'react';
// import dynamic from 'next/dynamic';

// const Heatmap = dynamic(() => import('contribution-heatmap').then((mod) => mod.Heatmap as React.ComponentType<any>), { ssr: false });

// interface ContributionDay {
//     date: string;
//     count: number;
// }

// const ActivityHeatmap = () => {
//     const data: ContributionDay[] = [
//         { date: '2025-10-01', count: 3 }, // Ячейка будет цвета уровня 3
//         { date: '2025-10-15', count: 1 }, // Ячейка будет цвета уровня 1
//         { date: '2025-10-31', count: 0 }
//     ];
//     const start = new Date('2025-10-01');
//     const end = new Date('2025-10-31');

//     return (
//         <div style={{ width: 400, margin: '0' }}>
//             <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Activity Heatmap</h2>
//             <Heatmap
//                 values={data}
//                 rectSize={11}
//                 legendCellSize={11}
//                 space={2}
//                 monthPlacement={'top'}
//                 rectProps={2}
//                 weekLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
//                 monthLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}

//                 startDate={start}
//                 endDate={end}
//                 panelColors={{
//                     0: '#ebedf0',
//                     1: '#9be9a8',
//                     2: '#40c463',
//                     3: '#30a14e',
//                     4: '#216e39'
//                 }}
//                 onClick={(value: ContributionDay) => console.log('Clicked:', value)}
//             />
//         </div>
//     );
// };

// export default ActivityHeatmap;

'use client';
import React from 'react';
import HeatMap from '@uiw/react-heat-map'; // <-- Новый импорт!
import { ContributionDay } from '@/types/ContributionDay';

// Интерфейс для данных остается прежним (но у HeatMap используется prop 'value')

const ActivityHeatmap = ({value}: {value: ContributionDay[] | null}) => {
    // Ваши тестовые данные. Дни, которых нет в этом массиве, останутся пустыми.
    // const realActivityData:  = [
    //     { date: '2025/01/05', count: 4 }, // Высокая активность в начале года
    //     { date: '2025/03/10', count: 4 },
    //     { date: '2025/07/20', count: 1 },
    //     { date: '2025/11/01', count: 3 }
    //     // ... и т.д. Только дни с активностью!
    // ];

    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
    const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] 

    const start = new Date('2025-01-01'); // 1 января
    const end = new Date('2025-12-31'); // 31 декабря

    return (
        <div className="mx-auto w-full overflow-x-auto scrollbar-thin">
            <h2 style={{ textAlign: 'center', marginBottom: 20 }} className='text-md sm:text-lg'>Активность студента</h2>
            {value && 
                <HeatMap
                    value={value} // <-- Используется пропс 'value'
                    startDate={start}
                    endDate={end}
                    legendCellSize={16} // Размер ячейки
                    rectSize={14}
                    space={2}
                    panelColors={{
                        0: '#ebedf0',
                        1: '#9be9a8',
                        2: '#40c463',
                        3: '#30a14e',
                        4: '#216e39'
                    }}
                    monthLabels={months}
                    weekLabels={weekdays}
                    className="w-full min-w-[900px] m-auto flex "
                    // onClick в этой библиотеке называется rectRender или нужно использовать обертку
                    // Здесь мы его пока опустим, чтобы сфокусироваться на отображении
                />
            }
        </div>
    );
};

export default ActivityHeatmap;
