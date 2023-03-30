import http from "../options/baseUrl"
import LocalForage from "localforage"

async function getToken() {
    let token = await LocalForage.getItem("Authorization")
    return token
}

export default {
    async createClasses(object) {
        try {
            const token = await getToken()
            const path = `/classes/create`
            const req = await http.post(path, object, { headers: { "Authorization": token } })

            return req
        } catch (e) {
            return e
        }
    },
    async readClasses() {
        let token = await getToken()
        const path = `/classes`
        const req = await http.get(path, { headers: { "Authorization": token } })
        return req
    },
    async updateClasses(id, object) {
        try {
            const token = await getToken()
            const path = `/classes/update/${id}`
            const req = await http.put(path, object, { headers: { "Authorization": token } })

            return req
        } catch (e) {
            return e
        }
    },
    async deleteClasses(id) {
        try {
            const token = await getToken()
            const path = `/classes/delete/${id}`
            const req = await http.delete(path, { headers: { "Authorization": token } })

            return req
        } catch (e) {
            return e
        }
    }
}