'use client';

// import React, { useContext, useEffect, useRef, useState } from 'react';
// import HTMLFlipBook from 'react-pageflip'; // Импортируем flipbook
// import GroupSkeleton from './skeleton/GroupSkeleton';

// // import * as pdfjsLib from "pdfjs-dist";
// // pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// import * as pdfjsLib from 'pdfjs-dist';
// import { useMediaQuery } from '@/hooks/useMediaQuery';
// import { LayoutContext } from '@/layout/context/layoutcontext';
// import { NotFound } from './NotFound';

// // Указываем путь к файлу mjs
// pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

export default function PDFView({ url }: { url: string }) {
    // const { setMessage } = useContext(LayoutContext);

    // const [pages, setPages] = useState<React.JSX.Element[]>([]);
    // const [skeleton, setSkeleton] = useState(false);
    // const [hasPdf, setHasPdf] = useState(false);

    // const containerRef = useRef<HTMLDivElement>(null);
    // const bookRef = useRef<any>(null);
    // const [bookSize, setBookSize] = useState({ width: 0, height: 0, aspectRatio: 0 });

    // const FIXED_BOOK_HEIGHT = 800; // Фиксированная высота книги
    // const media = useMediaQuery('(max-width: 640px)');
    // const [totalPages, setTotalPages] = useState<number>(0);
    // const [currentPage, setCurrentPage] = useState<number>(1);

    // useEffect(() => {
    //     const renderPDF = async () => {
    //         if (!url) return;

    //         setSkeleton(true);
    //         try {
    //             // Проверяем, одна ли страница в документе
    //             // let newUrl = `https://api.mooc.oshsu.kg/public/temprory-file/${url}`;
    //             const inApiString = process.env.NEXT_PUBLIC_BASE_URL;
    //             let newUrl = `${inApiString?.substring(0, inApiString?.length - 4)}/temprory-file/${url}`;
                
    //             const pdf = await pdfjsLib.getDocument(newUrl).promise;
    //             setTotalPages(pdf.numPages);
    //             const tempPages = [];
    //             const firstPage = await pdf.getPage(1);

    //             // Получаем оригинальное соотношение сторон первой страницы
    //             const viewport = firstPage.getViewport({ scale: 1.5 });
    //             const aspectRatio = viewport.width / viewport.height;

    //             for (let i = 1; i <= pdf.numPages; i++) {
    //                 const page = await pdf.getPage(i);
    //                 const desiredScale = FIXED_BOOK_HEIGHT / page.getViewport({ scale: 1.0 }).height;
    //                 const viewport = page.getViewport({ scale: desiredScale });

    //                 // Создаем элемент <canvas>
    //                 const canvas = document.createElement('canvas');
    //                 const context = canvas.getContext('2d');

    //                 if (!context) {
    //                     // в последний раз добавил эту строку если что
    //                     setHasPdf(true);
    //                     setMessage({
    //                         state: true,
    //                         value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка загрузки или отображения документа' }
    //                     });
    //                     throw new Error('Canvas context is not supported.');
    //                 }

    //                 canvas.height = viewport.height;
    //                 canvas.width = viewport.width;

    //                 await page.render({
    //                     canvas, // в последний раз добавил эту строку если что
    //                     canvasContext: context,
    //                     viewport
    //                 }).promise;

    //                 // Превращаем canvas в изображение (Data URL) и добавляем в массив
    //                 const imageDataUrl = canvas.toDataURL();
    //                 tempPages.push(
    //                     <div key={i} className="page">
    //                         <img src={imageDataUrl} alt={`Page ${i}`} style={{ width: '100%' }} />
    //                     </div>
    //                 );
    //             }

    //             // Обновляем состояние с данными только после успешной загрузки
    //             setPages(tempPages);
    //             if (containerRef.current) {
    //                 // в последний раз добавил эту проверку если что
    //                 setBookSize({
    //                     width: containerRef.current.offsetWidth,
    //                     height: FIXED_BOOK_HEIGHT,
    //                     aspectRatio: aspectRatio
    //                 });
    //                 setHasPdf(false);
    //             }
    //             setSkeleton(false);
    //         } catch (error) {
    //             console.error('Ошибка при загрузке или рендеринге PDF:', error);
    //             setHasPdf(true);
    //             setSkeleton(false);
    //             setMessage({
    //                 state: true,
    //                 value: { severity: 'error', summary: 'Ошибка', detail: 'Ошибка загрузки или отображения документа' }
    //             });
    //         } finally {
    //             setSkeleton(false);
    //         }
    //     };

    //     renderPDF();
    // }, [url]);

    // useEffect(() => {
    //     const updateBookSize = () => {
    //         if (containerRef.current) {
    //             const containerWidth = containerRef.current.offsetWidth;
    //             const width = Math.min(containerWidth, 1000);
    //             const height = width / (bookSize.aspectRatio || 1.5); // пример пропорции, или FIXED_BOOK_HEIGHT
    //             setBookSize({ width, height, aspectRatio: width / height });
    //         }
    //     };
    //     updateBookSize();
    //     window.addEventListener('resize', updateBookSize);
    //     return () => window.removeEventListener('resize', updateBookSize);
    // }, [bookSize.aspectRatio]);

    // useEffect(() => {
    //     const container = containerRef.current;
    //     if (!container) return;

    //     const onScroll = () => {
    //         const pageElements = container.querySelectorAll<HTMLDivElement>('.page');
    //         let visiblePage = 1;

    //         pageElements.forEach((page, index) => {
    //             const rect = page.getBoundingClientRect();
    //             if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
    //                 visiblePage = index + 1; // страницы начинаются с 1
    //             }
    //         });
    //     };

    //     container.addEventListener('scroll', onScroll);
    //     return () => container.removeEventListener('scroll', onScroll);
    // }, [pages]);

    return (
        <div>

        </div>
        // <div
        //     style={{
        //         position: 'relative',
        //         overflow: 'hidden',
        //         isolation: 'isolate',
        //         maxWidth: '900px',
        //         margin: '0 auto'
        //     }}
        // >
        //     <div
        //         ref={containerRef}
        //         className="w-[900px]"
        //         style={{
        //             width: '100%', // или фиксированная ширина, например 800px
        //             maxWidth: '900px', // не даём контейнеру быть бесконечно широким
        //             margin: '0 auto'
        //             // maxHeight: '1000px'
        //         }}
        //     >
        //         {hasPdf ? (
        //             <NotFound titleMessage={'Повторите позже'} />
        //         ) : (
        //             <>
        //                 {skeleton ? (
        //                     <div className="w-[300px] sm:w-[800px]">
        //                         <GroupSkeleton count={1} size={{ width: '100%', height: '15rem' }} />
        //                     </div>
        //                 ) : media ? (
        //                     <>
        //                         <div className="w-full flex justify-center gap-1 items-center ">
        //                             <button
        //                                 onClick={() => {
        //                                     if (bookRef.current) {
        //                                         bookRef.current.pageFlip().flipPrev();
        //                                     }
        //                                 }}
        //                                 className="pi pi-chevron-left text-sm px-3 py-1 border rounded cursor-pointer hover:text-white hover:bg-[var(--mainColor)] transition"
        //                             ></button>
        //                             <span className='text-[13px]'>Страница {currentPage} / {totalPages}</span>
        //                             <button
        //                                 onClick={() => {
        //                                     if (bookRef.current) {
        //                                         bookRef.current.pageFlip().flipNext();
        //                                     }
        //                                 }}
        //                                 className="pi pi-chevron-right text-sm px-3 py-1 border rounded cursor-pointer hover:text-white hover:bg-[var(--mainColor)] transition"
        //                             ></button>
        //                         </div>
        //                         <HTMLFlipBook
        //                             ref={bookRef}
        //                             // width={Math.min(bookSize.width, 600)} // ограничиваем ширину страницы
        //                             width={300} // ограничиваем ширину страницы
        //                             height={bookSize.height}
        //                             size="stretch"
        //                             minWidth={320}
        //                             maxWidth={600} // ограничиваем maxWidth для PageFlip
        //                             minHeight={420}
        //                             maxHeight={bookSize.height}
        //                             showCover={false}
        //                             usePortrait={true}
        //                             // news
        //                             startZIndex={0}
        //                             autoSize={true}
        //                             maxShadowOpacity={0.5}
        //                             mobileScrollSupport={true}
        //                             swipeDistance={30}
        //                             clickEventForward={true}
        //                             useMouseEvents={true}
        //                             renderOnlyPageLengthChange={false}
        //                             className=""
        //                             style={{}}
        //                             // onFlip={() => {}}
        //                             onFlip={() => {
        //                                 if (bookRef.current) {
        //                                     const current = bookRef.current.pageFlip().getCurrentPageIndex();
        //                                     setCurrentPage(current + 1);
        //                                 }
        //                             }}
        //                             onChangeOrientation={() => {}}
        //                             onChangeState={() => {}}
        //                             onInit={() => {}}
        //                             onUpdate={() => {}}
        //                             startPage={0}
        //                             drawShadow={true}
        //                             flippingTime={900}
        //                             showPageCorners={true}
        //                             disableFlipByClick={false}
        //                         >
        //                             {pages.map((page, index) => (
        //                                 <div key={index} className="page">
        //                                     <div className="page-content">
        //                                         {' '}
        //                                         {/* Добавляем класс для содержимого страницы */}
        //                                         {page}
        //                                     </div>
        //                                 </div>
        //                             ))}
        //                         </HTMLFlipBook>
        //                     </>
        //                 ) : (
        //                     <>
        //                         <div className="w-full flex justify-center gap-1 items-center ">
        //                             <button
        //                                 onClick={() => {
        //                                     if (bookRef.current) {
        //                                         bookRef.current.pageFlip().flipPrev();
        //                                     }
        //                                 }}
        //                                 className="pi pi-chevron-left text-sm px-3 py-1 border rounded cursor-pointer hover:text-white hover:bg-[var(--mainColor)] transition"
        //                             ></button>
        //                             Страница {currentPage} / {totalPages}
        //                             <button
        //                                 onClick={() => {
        //                                     if (bookRef.current) {
        //                                         bookRef.current.pageFlip().flipNext();
        //                                     }
        //                                 }}
        //                                 className="pi pi-chevron-right text-sm px-3 py-1 border rounded cursor-pointer hover:text-white hover:bg-[var(--mainColor)] transition"
        //                             ></button>
        //                         </div>
        //                         <HTMLFlipBook
        //                             ref={bookRef}
        //                             // width={Math.min(bookSize.width, 600)} // ограничиваем ширину страницы
        //                             width={Math.min(bookSize.width, 1000)} // ограничиваем ширину страницы
        //                             height={bookSize.height}
        //                             size="stretch"
        //                             minWidth={media ? 320 : 600}
        //                             maxWidth={800} // ограничиваем maxWidth для PageFlip
        //                             minHeight={420}
        //                             maxHeight={bookSize.height}
        //                             showCover={false}
        //                             usePortrait={true}
        //                             // news
        //                             startZIndex={0}
        //                             autoSize={true}
        //                             maxShadowOpacity={0.5}
        //                             mobileScrollSupport={true}
        //                             swipeDistance={30}
        //                             clickEventForward={true}
        //                             useMouseEvents={true}
        //                             renderOnlyPageLengthChange={false}
        //                             className=""
        //                             style={{}}
        //                             // onFlip={() => {}}
        //                             onFlip={() => {
        //                                 if (bookRef.current) {
        //                                     const current = bookRef.current.pageFlip().getCurrentPageIndex();
        //                                     setCurrentPage(current + 1);
        //                                 }
        //                             }}
        //                             onChangeOrientation={() => {}}
        //                             onChangeState={() => {}}
        //                             onInit={() => {}}
        //                             onUpdate={() => {}}
        //                             startPage={0}
        //                             drawShadow={true}
        //                             flippingTime={900}
        //                             showPageCorners={true}
        //                             disableFlipByClick={false}
        //                         >
        //                             {pages.map((page, index) => (
        //                                 <div key={index} className="page">
        //                                     <div className="page-content">
        //                                         {' '}
        //                                         {/* Добавляем класс для содержимого страницы */}
        //                                         {page}
        //                                     </div>
        //                                 </div>
        //                             ))}
        //                         </HTMLFlipBook>
        //                     </>
        //                 )}
        //             </>
        //         )}
        //     </div>
        // </div>
    );
}