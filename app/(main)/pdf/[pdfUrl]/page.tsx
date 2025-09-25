'use client';

// import PDFViewer from '@/app/components/PDFBook';
// import PDFViewer from '../PDFBook';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const PDFViewer = dynamic(() => import('@/app/components/PDFBook'), {
    ssr: false
});

import { useParams, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';

export default function PdfUrlViewer() {
    const { pdfUrl } = useParams();
    const router = useRouter();

    return (
        <div className='my-2'>
            <Button onClick={()=> router.back()} className='mini-button px-2 flex items-center gap-1 bg-[]'>
                <i className="pi pi-arrow-left text-[13px] cursor-pointer" style={{fontSize: '13px'}}></i>
                <button className="text-[13px] cursor-pointer ">Назад</button>
            </Button>
            <div className="max-h-[1000px] bg-red-500">
                <PDFViewer url={pdfUrl || ''} />
            </div>
        </div>
    );
}
