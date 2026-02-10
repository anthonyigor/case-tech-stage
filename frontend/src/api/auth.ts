import api from "./client"

export type LoginDto = {
    username: string
    password: string
}

export async function login(data: LoginDto) {
    return await api.post('/auth/login', data)
}