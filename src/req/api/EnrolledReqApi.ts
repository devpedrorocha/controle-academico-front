import http from '../options/baseUrl.js'
import LocalForage from "localforage"
import headers from '../options/headers.js'
import { EnrolledObject } from '../../interfaces/enrolled.js'

async function getToken() {
    let token = await LocalForage.getItem("Authorization")
    return token
}

export default {
    async createEnrolled(object) {
        try {
            const token = await getToken()
            const path = '/enrolled/create'
            const req = await http.post(path, object, { headers: { 'Authorization': token } })
            return req
        } catch (error){
            return error
        }
        
    },
    async readEnrolleds() {
        const token = await getToken()
        const path = `/enrolled`;
        const req = await http.get(path, { headers: { 'Authorization': token } })
        return req
    },
    async updateEnrolleds(id: string, object: EnrolledObject) {

        const token = await getToken()
        const path = `/enrolled/update/${id}`

        const req = await http.put(path, object, { headers: { 'Authorization': token } })

        return req
    },
    async deleteEnrolleds(id) {
        const token = await getToken()
        const path = `/enrolled/delete/${id}`
        const req = await http.delete(path, { headers: { 'Authorization': token } })
        return req
    }
}
