import { ClassesContainer } from "./classes"

export interface SubjectsContainer {
    _id: string;
    name: string
    workLoad: number
    menu: string,
    classes: ClassesContainer[]
}