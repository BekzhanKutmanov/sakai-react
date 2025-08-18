'use client';

import ItemCard from '@/app/components/cards/ItemCard';
import { NotFound } from '@/app/components/NotFound';
import GroupSkeleton from '@/app/components/skeleton/GroupSkeleton';
import useErrorMessage from '@/hooks/useErrorMessage';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { fetchItemsLessons } from '@/services/studentMain';
import { Dropdown } from 'primereact/dropdown';
import { useContext, useEffect, useState } from 'react';

export default function Teaching() {
    interface sortOptType {
        name: string;
        page: number;
    }
    const [skeleton, setSkeleton] = useState(false);
    const [lessons, setLessons] = useState<{}>({});
    const [lessonsDisplay, setLessonsDisplay] = useState<[]>([]);
    const [hasLessons, setHasLessons] = useState(false);
    const [selectedSort, setSelectedSort] = useState({name: 'Баары', code: 1});
    // const [sortOpt, setSortOpt] = useState<sortOptType[]>
    [{ name: '1-семестр', page: 0 }];
    const sortOpt = [
        { name: 'Баары', code: 1 },
        { name: 'London', code: 2 },
        { name: 'Paris', code: 3 },
        { name: 'Баары', code: 1 },
        { name: 'London', code: 2 },
        { name: 'Paris', code: 3 },
    ];

//     semesters.map((semester, index) => (
//   <>
//     <h3>{index + 1}-семестр</h3>
//     {semester.items.map((item) => (
//       <div>{item.name}</div>
//     ))}
//   </>
// ))
    
    const { setMessage } = useContext(LayoutContext);
    const showError = useErrorMessage();

    // functions
    const toggleSortSelect = (e: sortOptType) => {
        console.log(e);
        setSelectedSort(e);
    };

    const toggleSkeleton = () => {
        setSkeleton(true);
        setTimeout(() => {
            setSkeleton(false);
        }, 1000);
    };

    // fetch lessons
    const handleFetchLessons = async () => {
        // skeleton = false
        const data = await fetchItemsLessons();
        console.log(data);
        toggleSkeleton();
        if (data?.success) {
            setLessons(data.data);
            // setLessonsDisplay(data[0]);
            setHasLessons(false);
        } else {
            setHasLessons(true);
            setMessage({
                state: true,
                value: { severity: 'error', summary: 'Катаа!', detail: 'Байланышы менен көйгөй' }
            });
            if (data?.response?.status) {
                showError(data.response.status);
            }
        }
    };

    useEffect(() => {
        if (lessons?.length > 0) {
            // setLessonsDisplay(lessons.data[selectedSort.page]);
        }
    }, [selectedSort]);

    useEffect(() => {
        if (lessons['1']) {
            console.log(lessons['1'][0].semester.name_kg);

            setSelectedSort(lessons['1']);
        }
        // console.log('v ', lessons['1'][0]);

        // if(lessons.length > 0){
        //     const forSelect = lessons['0'][0].semestr.name_kg

        // }
    }, [lessons]);

    // useEffect(() => {
    //     console.log(selectedSort);

    //     if (selectedSort) {
    //         const forSelect = selectedSort.map((item) => {
    //             return { name: item.title, status: item.is_link, id: item.id };
    //         });

    //         setVideoSelect(forSelect);
    //         setSelectedCity(forSelect[0]);
    //     }
    // }, [selectedSort]);

    useEffect(() => {
        handleFetchLessons();
    }, []);

    return (
        <div className="w-full flex justify-between items-start gap-2 xl:gap-5">
            <div className="py-4 w-full">
                {/* info section */}
                {skeleton ? (
                    <GroupSkeleton count={1} size={{ width: '100%', height: '4rem' }} />
                ) : (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-4 py-2 shadow-[0_2px_1px_0px_rgba(0,0,0,0.1)]">
                        <h3 className="text-[20px] sm:text-[28px] m-0">Менин окуу планым</h3>

                        <Dropdown
                            value={selectedSort}
                            onChange={(e) => {
                                toggleSortSelect(e.value);
                            }}
                            options={sortOpt}
                            optionLabel="name"
                            placeholder=""
                            className="w-[213px]  md:w-14rem"
                        />
                    </div>
                )}

                {/* lesson section */}
                {!hasLessons ? (
                    <NotFound titleMessage={'Сабактар убактылуу жетклиликсиз'} />
                ) : (
                    <div>
                        {skeleton ? (
                            <GroupSkeleton count={10} size={{ width: '100%', height: '3rem' }} />
                        ) : (
                            <div className='flex gap-2 items-center justify-around flex-wrap'>
                                {sortOpt.map((item) => {
                                    return <>
                                        <ItemCard />
                                    </>;
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
