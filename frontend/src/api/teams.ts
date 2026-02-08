import api from "./client";
import type { Person } from "./people";

export type Team = {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    people: Person[]
}

export type CreateTeamDto = {
    name: string;
    description?: string;
    peopleIds?: string[];
}

export type UpdateTeamDto = {
    name?: string
    description?: string
    peopleIds?: string[]
}

export async function createTeam(payload: CreateTeamDto): Promise<Team> {
    const { data } = await api.post("/teams", payload)
    return data
}

export async function getTeams(): Promise<Team[]> {
    const { data } = await api.get("/teams")
    return data
}

export async function updateTeam(team_id: string, payload: UpdateTeamDto) {
    return await api.patch(`/teams/${team_id}`, payload)
}

export async function deleteTeam(id: string): Promise<void> {
    await api.delete(`/teams/${id}`)
}