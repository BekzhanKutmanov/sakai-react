export interface mainStepsType {
    id: number;
    id_parent: number | null;
    type_id: number;
    user_id: number;
    lesson_id: number;
    step: number;
    type: { active: true; created_at: string; id: 1; logo: string; modelName: string; name: string; title: string; updated_at: string };
    updated_at: string;
}
