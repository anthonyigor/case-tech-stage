import api from "./client";

export type Person = {
  id: string;
  name: string;
  email: string | null;
  role: string | null;
  team_id: string | null;
  team?: { name: string } | null;
  created_at: string;
};

export type CreatePersonDto = {
    name: string;
    email: string;
    role?: string;
    team_id?: string
}

export async function createPerson(payload: CreatePersonDto): Promise<Person> {
    const { data } = await api.post("/people", payload);
    return data;
}

export async function getPeople(): Promise<Person[]> {
    const { data } = await api.get("/people");
    return data;
}

export async function removePerson(id: string) {
    await api.delete(`/people/${id}`);
}