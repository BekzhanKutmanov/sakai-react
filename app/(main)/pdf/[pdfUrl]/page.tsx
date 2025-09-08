'use client';

// import PDFViewer from '@/app/components/PDFBook';
// import PDFViewer from '../PDFBook';
import dynamic from "next/dynamic";

const PDFViewer = dynamic(()=> import('@/app/components/PDFBook'), {
    ssr: false,
})

import { useParams } from 'next/navigation';

export default function PdfUrlViewer() {
    const { pdfUrl } = useParams();

    return <div>
        <PDFViewer url={pdfUrl || ''} />
    </div>;
}
