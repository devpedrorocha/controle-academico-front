import LocalForage from "localforage"

async function headers() {
    const token = await LocalForage.getItem("Authorization")
    return { 'Authorization': token }
}
export default { headers }