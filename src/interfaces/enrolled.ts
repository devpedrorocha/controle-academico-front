import { RoleContainer } from "./role";

export interface EnrolledObject {
    idUser: string;
    role: RoleContainer,
    classGroup: string;
    finalGrade: string;
    frequency: string;
}