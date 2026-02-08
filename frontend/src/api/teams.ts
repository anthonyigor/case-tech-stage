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

export async function createTeam(payload: CreateTeamDto): Promise<Team> {
    const { data } = await api.post("/teams", payload)
    return data
}

export async function getTeams(): Promise<Team[]> {
    const { data } = await api.get("/teams")
    return data
}