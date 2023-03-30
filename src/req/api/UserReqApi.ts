import http from "../options/baseUrl.js"
import LocalForage from "localforage"



interface UserContainer {
    cpf: string;
    email: string;
    name: string;
    surname: string;
    password: string;
    telephone: string;
    address: string;
}

export async function getToken(): Promise<string> {
    let token: string = await LocalForage.getItem("Authorization") as string
    return token
}

export default {
    async createUsers(objeto: UserContainer) {
        const token = await getToken()
        const path = `/users/create`
        const req = await http.post(path, objeto, { headers: { 'Authorization': token } })
        return req
    },

    async readUsers() {
        const token = await getToken()
        const path = `/users`;
        const req = await http.get(path, { headers: { "Authorization": token } });
        return req
    },

    async updateUser(id, object) {
        const token = await getToken()
        const path = `/users/update/${id}`

        const req = await http.put(path, object, { headers: { "Authorization": token } })

        return req
    },

    async deleteUser(id) {
        const token = await getToken()
        const path = `/users/delete/${id}`

        const req = await http.delete(path, { headers: { 'Authorization': token } })
        return req
    },

    async LoginUser(cpf, password) {
        const path = `/login`;
        const req = await http.post(path, { cpf: cpf, password: password });

        if (req.headers['authorization']) {

            LocalForage.clear()
            await LocalForage.setItem('Authorization', req.headers['authorization'])
            await LocalForage.setItem('username', req.data.data.name)
            await LocalForage.setItem('enrolleds', req.data.data.register)
            await LocalForage.setItem('register', req.data.register)
        }
        return req
    },
    async Logout() {
        const token = await getToken()
        const path = '/logout';

        const req = await http.get(path, { headers: { "Authorization": token } });

        return req
    }
}