import api from "./client"

export type Area = {
    id: string
    name: string,
    description: string,
    created_at: Date,
    updated_at: Date
}

export type CreateArea = {
    name: string
    description?: string
}

export async function getAreas(): Promise<Area[]> {
    const { data } = await api.get('/areas')
    return data
}

export async function createArea(area: CreateArea) {
    const { data } = await api.post('areas', area)
    return data
}
