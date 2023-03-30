import { EnrolledObject } from "./enrolled"
import { SubjectsContainer } from "./subjects"

export interface ClassesContainer {
    _id?: string;
    name: string;
    vacancy: string;
    dateStart: string;
    dateEnd: string;
    enrroled: Array<EnrolledObject>;
    subject: SubjectsContainer;
}