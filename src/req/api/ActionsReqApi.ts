import http from '../options/baseUrl'
import LocalForage from "localforage"
import { info } from 'console'

async function getToken() {
    let token = await LocalForage.getItem("Authorization")
    return token
}

export default {
    async readActions() {
        const token = await getToken()
        const path = '/actions'
        const req = await http.get(path, { headers: { 'Authorization': token } })
        return req
    },

    async createAction(name, methods) {
        const token = await getToken()
        const path = '/actions/create'
        const req = await http.post(
            path,
            { name: name, methods: methods },
            { headers: { 'Authorization': token } })
        return req
    },

    async updateActions(objetoReq) {
        const token = await getToken()
        const path = `/actions/update/${objetoReq._id}`
        const req = await http.put(path, objetoReq, { headers: { 'Authorization': token } })
        return req
    },

    async deleteActions(id) {
        const token = await getToken()
        const path = `/actions/delete/${id}`;
        const req = await http.delete(path, { headers: { 'Authorization': token } })
        return req
    },

    async addMethodInActions(id, methodName) {
        const token = await getToken()
        const path = `/actions/methods/${id}`
        const req = await http.patch(
            path,
            null,
            { params: { method: methodName }, headers: { 'Authorization': token } }
        )
        return req
    },

    async deleteMethodInActions(id, methodName) {
        const token = await getToken()
        const path = `/actions/methods/delete/${id}`
        const req = await http.patch(
            path,
            { params: { method: methodName }, headers: { 'Authorization': token } })
        return req
    }
}