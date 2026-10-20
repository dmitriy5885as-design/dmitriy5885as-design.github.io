export type Post={id:string;kind:string;title:string;summary:string;body:string;tags:string;link:string;published:number;created_at:string;updated_at:string};
export const kinds:Record<string,string>={material:'Материалы',lesson:'Занятия',article:'Статьи',project:'Проекты',quiz:'Квизы'};
export const singular:Record<string,string>={material:'Материал',lesson:'Занятие',article:'Статья',project:'Проект',quiz:'Квиз'};
