import http from "../options/baseUrl"
import headers from "../options/headers"

export default {

    async readRoles() {
        const path = '/roles';
        const req = await http.get(
            path, 
            { headers: await headers.headers() }
        );
        return req;
    },

    async createRole(name, actions) {
        const path = '/roles/create';
        const req = await http.post(
            path,
            { name: name, actions: actions },
            { headers: await headers.headers() }
        );
        return req;
    },

    async deleteRole(id) {
        const path = `/roles/delete/${id}`;
        const req = await http.delete(
            path,
            { headers: await headers.headers() }
        );
        return req;
    },

    async addActionsInRole(id, actionName) {
        const path = `/roles/actions/${id}`;
        const req = await http.patch(
            path,
            null,
            { params: { action: actionName }, headers: await headers.headers() }
        );
        return req;
    },

    async deleteActionsInRole(id, actionName) {
        const path = `/roles/actions/delete/${id}`;
        const req = await http.delete(
            path,
            { params: { action: actionName }, headers: await headers.headers() }
        );
        return req;
    },

}