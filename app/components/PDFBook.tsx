// PDFViewer.js
'use client';

import React, { useEffect, useState } from "react";
// import * as pdfjsLib from "pdfjs-dist";
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

import * as pdfjsLib from "pdfjs-dist";

// Указываем путь к файлу mjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

export default function PDFViewer({ url }: {url: string}) {
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPDF = async () => {
      if (!url) {
        return;
      }
      
      try {
        setLoading(true);
        // Загрузка документа PDF
        
        const pdf = await pdfjsLib.getDocument(url).promise;
        
        // Получение количества страниц и вывод в консоль
        const totalPages = pdf.numPages;
        console.log("PDF загружен. Всего страниц:", totalPages);
        setNumPages(totalPages);
        
      } catch (error) {
        console.error("Ошибка при загрузке PDF:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPDF();
  }, [url]);

  if (loading) {
    return <div>Загрузка документа...</div>;
  }

  if (!numPages) {
    return <div>Не удалось загрузить PDF.</div>;
  }

  return (
    <div>
      <p>PDF успешно загружен. Всего страниц: {numPages}</p>
      {/* Здесь будет код для рендеринга страниц, но пока что просто проверим количество */}
    </div>
  );
}