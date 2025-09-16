'use client';

import { LayoutContext } from "@/layout/context/layoutcontext";
import { useParams } from "next/navigation";
import { useContext, useEffect } from "react";

export default function LessonCheck() {
    const { contextFetchThemes, contextThemes } = useContext(LayoutContext);

    const {id_kafedra, course_id} = useParams();
    // const p = useParams();
    // console.log(p);

    useEffect(()=>{
        contextFetchThemes(Number(course_id), id_kafedra ? Number(id_kafedra) : null);
    },[]);
    
    return <div>page</div>;
}
