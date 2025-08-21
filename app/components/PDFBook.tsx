// PDFViewer.js
'use client';

import React, { useEffect, useState } from 'react';
// import * as pdfjsLib from "pdfjs-dist";
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

import * as pdfjsLib from 'pdfjs-dist';

// Указываем путь к файлу mjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;
import HTMLFlipBook from 'react-pageflip'; // Импортируем flipbook
import GroupSkeleton from './skeleton/GroupSkeleton';

export default function PDFViewer({ url }: { url: string }) {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [skeleton, setSkeleton] = useState(false);

    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        const updateWidth = () => setWindowWidth(window.innerWidth);
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const FIXED_BOOK_WIDTH = 1000; // Фиксированная ширина книги
    const FIXED_BOOK_HEIGHT = 800; // Фиксированная высота книги
    const [isSinglePage, setIsSinglePage] = useState(false); // Новое состояние

    useEffect(() => {
        const renderPDF = async () => {
            if (!url) return;

            setSkeleton(true);
            try {
                // Проверяем, одна ли страница в документе

                const newUrl = `http://api.mooc.oshsu.kg/temprory-file/${url}`;
                const pdf = await pdfjsLib.getDocument(newUrl).promise;
                const numPages = pdf.numPages;
                if (numPages === 1) {
                    setIsSinglePage(true);
                } else {
                    setIsSinglePage(false);
                }

                const tempPages = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const desiredScale = FIXED_BOOK_HEIGHT / page.getViewport({ scale: 1.0 }).height;
                    const viewport = page.getViewport({ scale: desiredScale });

                    // Создаем элемент <canvas>
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    await page.render({
                        canvasContext: context,
                        viewport
                    }).promise;

                    // Превращаем canvas в изображение (Data URL) и добавляем в массив
                    const imageDataUrl = canvas.toDataURL();
                    tempPages.push(
                        <div key={i} className="page">
                            <img src={imageDataUrl} alt={`Page ${i}`} style={{ width: '100%', height: 'auto' }} />
                        </div>
                    );
                }
                setPages(tempPages);
            } catch (error) {
                console.error('Ошибка при загрузке или рендеринге PDF:', error);
            } finally {
                setSkeleton(false);
            }
        };

        renderPDF();
    }, [url]);

    // if (isSinglePage) {
    //     return (
    //         <div
    //             style={{
    //                 width: `${FIXED_BOOK_WIDTH}px`,
    //                 height: `${300}px`,
    //                 display: 'flex',
    //                 justifyContent: 'center',
    //                 alignItems: 'center',
    //                 border: '1px solid #ccc',
    //                 borderRadius: '5px',
    //                 boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
    //             }}
    //         >
    //             {pages[0]}
    //         </div>
    //     );
    // }

    return (
        <div style={{ width: '100%', maxWidth: 1000, margin: '0 auto', border: 'solid 1px' }}>
            {skeleton ? (
                <GroupSkeleton count={1} size={{ width: '100%', height: '20rem' }} />
            ) : (
                <HTMLFlipBook className="book-container" width={FIXED_BOOK_WIDTH} height={FIXED_BOOK_HEIGHT} size="stretch" minWidth={200} maxWidth={1000} minHeight={300} maxHeight={600} showCover={true} flippingTime={1000}>
                    {pages.map((page, index) => (
                        <div key={index} className="page">
                            <div className="page-content">
                                {' '}
                                {/* Добавляем класс для содержимого страницы */}
                                {page}
                            </div>
                        </div>
                    ))}
                </HTMLFlipBook>
            )}
        </div>
    );
}
