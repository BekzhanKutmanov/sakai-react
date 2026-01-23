import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import MobileAnswersTable from './MobileAnswersTable';
import useMediaQuery from '@/hooks/useMediaQuery';
import { Paginator } from 'primereact/paginator';

interface Answer {
    themeName: string;
    submissionDate: string;
    teacherResponse: boolean;
    teacherResponseDate: string;
}

const AnswersTable = ({report, paginationProp}: {report: any, paginationProp: { currentPage: number; total: number; perPage: number }}) => {
    const media = useMediaQuery(`(max-width: 640px)`);

    const answers: Answer[] = [
        { themeName: 'Введение в React', submissionDate: '2024-01-15', teacherResponse: true, teacherResponseDate: '2024-01-16' },
        { themeName: 'Компоненты и пропсы', submissionDate: '2024-01-22', teacherResponse: true, teacherResponseDate: '2024-01-23' },
        { themeName: 'Состояние и жизненный цикл', submissionDate: '2024-01-29', teacherResponse: false, teacherResponseDate: '-' },
        { themeName: 'Обработка событий', submissionDate: '2024-02-05', teacherResponse: true, teacherResponseDate: '2024-02-06' },
        { themeName: 'Условный рендеринг', submissionDate: '2024-02-12', teacherResponse: false, teacherResponseDate: '-' }
    ];

    const [pageState, setPageState] = useState<number>(1);
    const [pagination, setPagination] = useState<{ currentPage: number; total: number; perPage: number }>(paginationProp);

    // Ручное управление пагинацией
    const handlePageChange = (page: number) => {
        // handleFetchOpenCourse(page, free === 'paid' ? '3' : free === 'free' ? '2' : '', search, categorySelectedId?.id || null, language_id);
        setPageState(page);
    };

    const teacherResponseTemplate = (rowData: Answer) => {
        return rowData.teacherResponse ? (
            <div className="flex items-center gap-1">
                <i className="pi pi-check text-[green]" style={{ fontSize: '12px' }}></i>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ответил</span>
            </div>
        ) : (
            <div className="flex items-center gap-1">
                <i className="pi pi-times text-[red]" style={{ fontSize: '12px' }}></i>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Нет ответа</span>
            </div>
        );
    };

    return (
        <div>
            <h3 className="text-xl shadow-[var(--bottom-shadow)] m-0 pb-2">Отчёт</h3>
            {media ? (
                <MobileAnswersTable />
            ) : (
                <div className="my-2">
                    <DataTable value={answers} tableStyle={{ minWidth: '50rem' }} rows={5} className="text-sm">
                        <Column field="themeName" header="Название темы" style={{ width: '35%' }}></Column>
                        <Column field="submissionDate" header="Дата отправки" style={{ width: '25%' }}></Column>
                        <Column field="teacherResponse" header="Ответ преподавателя" body={teacherResponseTemplate} style={{ width: '25%' }}></Column>
                        <Column field="teacherResponseDate" header="Дата ответа" style={{ width: '15%' }}></Column>
                    </DataTable>
                </div>
            )}
            <Paginator
                first={(pagination.currentPage - 1) * pagination.perPage}
                rows={pagination.perPage}
                totalRecords={pagination.total}
                onPageChange={(e) => handlePageChange(e.page + 1)}
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            />
        </div>
    );
};

export default AnswersTable;
