import { confirmDialog } from 'primereact/confirmdialog';

export const getRedactor = (rowData: any, handlers) => [
    {
        label: '',
        icon: 'pi pi-pencil',
        command: () => {            
            handlers.onEdit(rowData.id, rowData?.type);
        }
    },
    {
        label: '',
        icon: 'pi pi-trash',
        command: () => {
            confirmDialog(handlers.getConfirmOptions(rowData.id, handlers.onDelete ));
        }
    }
];
