import { SubjectsContainer } from "../../interfaces/subjects"
import { BodyTabelaSubjectsContainer } from "../../views/Views-CA/SubjectsView.vue"
import http from "../options/baseUrl"
import headers from "../options/headers"
import { getToken } from "./UserReqApi"

export default {
    async readSubjects() {
        const path = '/subjects'
        const req = await http.get(path, { headers: await headers.headers() })
        return req
    },
}

export async function readSubjectsById(id: string): Promise<SubjectsContainer | unknown> {
    try {
        const token = await getToken()
        const path = `/subjects/${id}`
        const req = await http.get(path, { headers: { "Authorization": token } })
        if (req.data.data) {
            return req.data.data
        }
    } catch (error) {
        return error
    }
}

export async function updateSubject(id: string, object: BodyTabelaSubjectsContainer | undefined) {
    try {
        const token = await getToken()
        const path = `/subjects/update/${id}`
        const req = await http.put(path, object, { headers: { "Authorization": token } })
        return req
    } catch (error) {
        console.log(error)
    }
}

export async function createSubject(objeto: BodyTabelaSubjectsContainer): Promise<SubjectsContainer | undefined> {
    try {
        const token = await getToken()
        const path = `/subjects/create`
        const req = await http.post(path, objeto, { headers: { 'Authorization': token } })
        if(req.data.data) {
            return req.data.data as SubjectsContainer
        }
    } catch (error) {
        console.log(error)
    }
}

export async function deleteSubject(id: string) {
    const token = await getToken()
    const path = `/subjects/delete/${id}`
    const req = await http.delete(path, { headers: { 'Authorization': token } })
    return req
}
