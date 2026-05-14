'use client';

import React, { useContext, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button } from 'primereact/button';

export const CourseDetailMenu = () => {
    const pathname = usePathname();
    const { contextMobileLessons } = useContext(LayoutContext);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showScrollButtons, setShowScrollButtons] = useState(false);

    const lessons = contextMobileLessons?.lessons?.data || [];

    // Extract course_id and lesson_id from the URL
    const pathSegments = pathname.split('/');
    const currentCourseId = pathSegments[pathSegments.indexOf('courseDetail') + 1];
    const currentLessonId = pathSegments[pathSegments.indexOf('courseDetail') + 2];

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200; // Adjust as needed
            if (direction === 'left') {
                scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    // Only render on small screens (hidden above sm)
    if (lessons.length === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
            <nav className="flex items-center justify-between w-full bg-white/50 backdrop-blur-md border border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-2 px-2">
                {lessons.length > 3 && ( // Show scroll buttons if there are more than 3 lessons (adjust as needed)
                    <Button
                        icon="pi pi-angle-left"
                        className="p-button-rounded p-button-text p-button-plain text-gray-600 hover:text-[var(--mainColor)]"
                        onClick={() => scroll('left')}
                    />
                )}
                <div
                    ref={scrollContainerRef}
                    className="flex-1 flex overflow-x-auto whitespace-nowrap scrollbar-hide"
                    onMouseEnter={() => setShowScrollButtons(true)}
                    onMouseLeave={() => setShowScrollButtons(false)}
                >
                    {lessons.map((lesson: any) => {
                        const isActive = lesson.id === currentLessonId;
                        const courseIdForLink = lesson.course_id || currentCourseId; // Use lesson's course_id if available, otherwise current URL's

                        return (
                            <Link
                                key={lesson.id}
                                href={`/course/courseDetail/${courseIdForLink}/${lesson.id}`}
                                className={`flex flex-col items-center justify-center px-3 py-1 mx-1 rounded-lg transition-all duration-300 ${
                                    isActive ? 'bg-[var(--mainColor)]/10 text-[var(--mainColor)] font-bold' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <span className="text-xs text-center">{lesson.title}</span>
                            </Link>
                        );
                    })}
                </div>
                {lessons.length > 3 && ( // Show scroll buttons if there are more than 3 lessons (adjust as needed)
                    <Button
                        icon="pi pi-angle-right"
                        className="p-button-rounded p-button-text p-button-plain text-gray-600 hover:text-[var(--mainColor)]"
                        onClick={() => scroll('right')}
                    />
                )}
            </nav>
        </div>
    );
};
