import { LangType } from "../language/LangType";
import { myMainCourseType } from "../myMainCourseType";

export interface CourseCategoryOption extends myMainCourseType {
    category: { title: string, id: number | null, description: string | null, },
    is_featured: boolean
    language: LangType
}