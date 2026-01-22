'use client';

import useErrorMessage from '@/hooks/useErrorMessage';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchItemsLessons, fetchStudentActivity, fetchStudentStatistic } from '@/services/studentMain';
import Link from 'next/link';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext, useEffect, useRef, useState } from 'react';
import ActivityPage from '@/app/components/Contribution';
import { fetchStudentImg } from '@/services/student/studentpage';
import MyDateTime from '@/app/components/MyDateTime';
import { OptionsType } from '@/types/OptionsType';
import { ContributionDay } from '@/types/ContributionDay';

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

interface StudentStatistic {
  all_active_dates: number,
  last_visit: string,
  streak: number
}

export default function StudentHome() {
  const { user, setMessage, contextNotifications } = useContext(LayoutContext);
  const showError = useErrorMessage();
  const ref = useRef<HTMLDivElement>(null);
  const media = useMediaQuery('(max-width: 640px)');

  const [lessonsData, setLessonsData] = useState<LessonsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalCourses, setTotalCourses] = useState(0);
  const [studentImg, setStudentImg] = useState<{ image_url: string, id: string } | null>(null);
  const [studentStatistic, setStudentStatistic] = useState<StudentStatistic | null>(null);
  const [contribution, setContribution] = useState<ContributionDay[] | null>(null);

  const options: OptionsType = {
    year: '2-digit',
    month: 'short', // 'long', 'short', 'numeric'
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // 24-часовой формат
  };

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


  const handleFetchStudentImg = async () => {
    const data = await fetchStudentImg();
    if (data && data?.success) {
      setStudentImg(data?.data);
    }
  };

  const handleFetchStudentStatistic = async () => {
    const data = await fetchStudentStatistic();
    if (data && data?.success) {
      setStudentStatistic(data?.data);
    }
  };

  const handleFetchStudentActivity = async () => {
    const data = await fetchStudentActivity();
    if (data && data?.length) {
      setContribution(data);
    }
  };

  useEffect(() => {
    if (media) {
      if (ref.current) {
        ref.current.scrollLeft = ref.current.scrollWidth;
      }
    }
  }, [media]);

  useEffect(() => {
    if (user?.is_student) {
      // handleFetchLessons();
      handleFetchStudentImg();
      handleFetchStudentStatistic();
      handleFetchStudentActivity();
    }
  }, [user]);

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
        <div className="main-bg flex-1 flex flex-col justify-center p-2 sm:p-6 relative overflow-hidden min-h-[200px]">
          <div className="z-10 flex flex-col sm:flex-row items-center gap-2">
            <div className='min-w-[180px] min-h-[180px] max-w-[180px] max-h-[180px] flex items-center justify-center'>
              <img src={studentImg?.image_url?.length ? studentImg?.image_url : '/layout/images/no-image.png'} alt="Фото" className='w-full object-cover overflow-hidden rounded-full'/>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl text-center font-bold text-[var(--titleColor)] mb-2">
                Здравствуйте, {user?.name || 'Студент'}
              </h1>
              <div className='flex flex-col items-center gap-1'>
                <p className="text-lg text-gray-600 m-0 text-center">
                  {user?.last_name} {user?.name} {user?.father_name}
                </p>
                <div className='flex items-center justify-center gap-1'>
                  <span className='font-bold px-2 py-1 bg-[var(--greenColor)] text-white text-[13px]'>{contextNotifications?.length}</span>
                  <span className='text-[13px]'>Уведомлений</span>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative background element */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <i className="pi pi-user text-[120px] sm:text-[150px] text-[var(--mainColor)] transform translate-x-10 translate-y-10"></i>
          </div>
        </div>

        {/* 2. Stats Section */}
        <div className='main-bg flex flex-col justify-center p-2 sm:p-6 min-h-[200px]'>
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
            <span>Активность</span>
          </h2>
          <ActivityPage value={contribution} />

          <div className='flex items-end gap-3 my-2'>
            <div className='flex items-start flex-col gap-1 font-bold'>
              <span className='text-[var(--mainColor)]'>{<MyDateTime options={options} createdAt={studentStatistic?.last_visit || ''} />}</span>
              <span className='text-sm'>Последнее посещение</span>
            </div>
            <div className='flex items-start flex-col gap-1 font-bold'>
              <span className='text-[var(--mainColor)] text-lg'>{studentStatistic?.streak}</span>
              <span className='text-sm'>Дней посещено без перерыва</span>
            </div>
            <div className='flex items-start flex-col gap-1 font-bold'>
              <span className='text-[var(--mainColor)] text-lg'>{studentStatistic?.all_active_dates}</span>
              <span className='text-sm'>Дней посещено в общем</span>
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