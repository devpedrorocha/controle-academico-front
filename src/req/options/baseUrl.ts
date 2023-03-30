import axios, { AxiosInstance } from "axios"

const client: AxiosInstance = axios.create({baseURL:'http://localhost:3333'})

export default client;