'use client';

import useErrorMessage from '@/hooks/useErrorMessage';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchItemsLessons } from '@/services/studentMain';
import Link from 'next/link';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useRef, useState } from 'react';
import ActivityPage from '@/app/components/Contribution';

// NOTE: The types below are assumed based on data structures observed in other components.
// They should be moved to a central types file and verified against the API responses.
interface PredmetUser {
  last_name: string;
  name: string;
  father_name: string;
}

interface PredmetType {
  id_curricula: number;
  title: string;
  image?: string;
  user?: PredmetUser; // Teacher
}

interface SemesterData {
  [key: string]: PredmetType | { semester: { name_kg: string } };
}

interface LessonsData {
  [semester: number]: SemesterData;
}

export default function StudentHome() {
  const { user, setMessage, contextNotifications } = useContext(LayoutContext);
  const showError = useErrorMessage();
  const ref = useRef<HTMLDivElement>(null);
  const media = useMediaQuery('(max-width: 640px)');

  const [lessonsData, setLessonsData] = useState<LessonsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalCourses, setTotalCourses] = useState(0);

  const handleFetchLessons = async () => {
    setLoading(true);

    // const data = await fetchItemsLessons();
    // if (data && data?.success) {
    //   setLessonsData(data.data);
    //   let count = 0;
    //   if (data.data) {
    //     Object.values(data.data).forEach((semester) => {
    //       count += Object.values(semester).filter((item): item is PredmetType => typeof item === 'object' && item !== null && 'id_curricula' in item).length;
    //     });
    //   }
    //   setTotalCourses(count);
    // } else {
    //   setMessage({
    //     state: true,
    //     value: { severity: 'error', summary: 'Ошибка!', detail: 'Не удалось загрузить курсы. Повторите позже.' }
    //   });
    //   if (data?.data?.response?.status) {
    //     showError(data.data.response.status);
    //   }
    // }
    setLoading(false);

  };

  useEffect(() => {
    if (user?.is_student) {
      // handleFetchLessons();
    }
  }, [user]);

  useEffect(() => {
    if (media) {
      if (ref.current) {
        ref.current.scrollLeft = ref.current.scrollWidth;
      }
    }
  }, [media]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Top Section: Greeting and Stats */}
      <div className="flex flex-col xl:flex-row gap-4">
        {/* 1. Greeting Section */}
        <div className="main-bg flex-1 flex flex-col justify-center p-6 relative overflow-hidden min-h-[200px]">
          <div className="z-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--titleColor)] mb-2">
              Здравствуйте, {user?.name || 'Студент'}!
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {user?.last_name} {user?.name} {user?.father_name}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
              <i className="pi pi-id-card"></i>
              <span>Студент</span>
            </div>
          </div>
          {/* Decorative background element */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <i className="pi pi-user text-[120px] sm:text-[150px] text-[var(--mainColor)] transform translate-x-10 translate-y-10"></i>
          </div>
          <div className='flex items-center gap-1'>
            <span className='font-bold px-2 py-1 bg-[var(--greenColor)] text-white text-sm'>{contextNotifications?.length}</span>
            <span className='text-sm'>Уведомлений</span>
          </div>
        </div>

        {/* 2. Stats Section */}
        <div className='main-bg flex flex-col justify-center p-6 min-h-[200px]'>
          <h3 className='font-bold'>Предстоящие события</h3>
          <div>
            <p>В ближайщее время событий нет</p>
          </div>
        </div>
      </div>

      {/* {lessonsData && Object.keys(lessonsData).length > 0 ? ( */}
      <div>
        {/* activity */}
        <div ref={ref} className="w-full main-bg p-2">
          <h2 style={{ marginBottom: 20 }} className="text-md sm:text-lg flex items-center justify-center gap-2">
            <span>Активность преподавателя</span>
          </h2>
          <ActivityPage value={[]} />
          <div className='flex items-center gap-3 my-2 text-sm'>
            <div className='flex items-start flex-col gap-1 font-bold'>
              <span className='text-[var(--mainColor)]'>xx-xx-xx</span>
              <span>Последнее посещение</span>
            </div>
            <div className='flex items-start flex-col gap-1 font-bold'>
              <span className='text-[var(--mainColor)]'>xx-xx-xx</span>
              <span>Дней посещено без перерыва</span>
            </div>
          </div>
        </div>
      </div>
      {/* // ) : (
        // <div className="main-bg p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
        //   <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        //     <i className="pi pi-folder-open text-3xl text-gray-400"></i>
        //   </div>
        //   <h3 className="text-xl font-semibold text-gray-700 mb-2">Курсы не найдены</h3>
        //   <p className="text-gray-500 max-w-md">У вас пока нет назначенных курсов. Если вы считаете, что это ошибка, обратитесь в администрацию.</p>
        // </div>
      // )} */}
    </div>
  );
}