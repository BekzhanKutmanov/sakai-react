'use client';

// import PDFViewer from '@/app/components/PDFBook';
// import PDFViewer from '../PDFBook';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const PDFViewer = dynamic(() => import('@/app/components/PDFBook'), {
    ssr: false
});

import { useParams, useRouter } from 'next/navigation';

export default function PdfUrlViewer() {
    const { pdfUrl } = useParams();
    const router = useRouter();

    return (
        <div className='my-2'>
            <button onClick={()=> router.back()} className='cursor-pointer flex items-center gap-1 bg-[]'>
                <i className="pi pi-arrow-left text-[13px]" style={{fontSize: '13px'}}></i>
                <button className="text-[13px]">Назад</button>
            </button>
            <div className="max-h-[800px] bg-red-500">
                <PDFViewer url={pdfUrl || ''} />
            </div>
        </div>
    );
}
