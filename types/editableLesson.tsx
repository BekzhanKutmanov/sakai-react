export interface EditableLesson {
        title: string;
        description?: string;
        document?: File | null;
        url?: string | null;
    }