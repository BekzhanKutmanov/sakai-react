'use client';

// import PDFViewer from '@/app/components/PDFBook';
// import PDFViewer from '../PDFBook';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('@/app/components/PDFBook'), {
    ssr: false
});

import { useParams, useRouter } from 'next/navigation';

export default function PdfUrlViewer() {
    
    const { pdfUrl } = useParams();
    const router = useRouter();
    
    console.log(pdfUrl);
    return (
        <div className='my-2'>
            <div className='max-w-4xl m-auto'>
                <button onClick={() => router.back()} className="text-[var(--mainColor)] underline px-2 flex items-center gap-1">
                    <i className="pi pi-arrow-left text-[13px] cursor-pointer hover:shadow-2xl" style={{ fontSize: '13px' }}></i>
                    <span className="text-[13px] cursor-pointer">Назад</span>
                </button>
            </div>
            <div className="max-h-[1000px] bg-red-500">
                <PDFViewer url={pdfUrl || ''} />
            </div>
        </div>
    );
}
