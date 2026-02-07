import api from "./client";

export type ProcessTreeItem = {
  id: string;
  parent_id: string | null;
  title: string;
  description: string | null;
  type: "MANUAL" | "SYSTEM";
  status: "ACTIVE" | "DRAFT" | "INACTIVE";
  position: number;
  children: ProcessTreeItem[];
};

export type ProcessType = "MANUAL" | "SYSTEM";
export type ProcessStatus = "ACTIVE" | "DRAFT" | "INACTIVE";

export type CreateProcessDto = {
  area_id: string;
  parent_id?: string | null;
  title: string;
  description?: string;
  type?: ProcessType;
  status?: ProcessStatus;
  position?: number;
}

export type ToolType = "TOOL" | "SYSTEM" | null;

type ToolDetail = {
  id: string; 
  name: string; 
  type?: ToolType; 
  url?: string | null;
}

type DocDetail = {
  id: string; 
  title: string;
  url: string
}

type OwnerDetail = {
  id: string;
  people_id: string;
  people: { 
    id: string; 
    name: string; 
    email: string | null; 
    team?: { name: string } | null };
}

export type ProcessDetail = {
  id: string;
  area_id: string;
  parent_id: string | null;
  title: string;
  description: string | null;
  type: ProcessType;
  status: ProcessStatus;
  position: number;

  created_at: string;
  updated_at: string;

  tools: ToolDetail[];
  docs: DocDetail[];
  owners: OwnerDetail[];
}

export async function getProcessesTree(area_id: string): Promise<ProcessTreeItem[]> {
  const { data } = await api.get(`/areas/${area_id}/tree`)
  return data
}

export async function createProcess(payload: CreateProcessDto) {
  const { data } = await api.post(`/processes`, payload)
  return data
}

export async function getProcessDetail(process_id: string): Promise<ProcessDetail> {
  const { data } = await api.get(`/processes/${process_id}`)
  return data
}

export function updateProcess(
  id: string,
  payload: Partial<{
    title: string;
    description?: string;
    type?: ProcessType;
    status?: ProcessStatus;
    position?: number;
    parent_id?: string | null;
  }>
) {
  return api.patch(`/processes/${id}`, payload)
}

export async function addTool(process_id: string, payload: { name: string; type?: ToolType; url?: string }) {
  const { data } = await api.post(`/processes/${process_id}/tools`, payload)
  return data
}

export async function addDoc(process_id: string, payload: { title: string; url: string }) {
  const { data } = await api.post(`/processes/${process_id}/docs`, payload)
  return data
}

export async function addOwner(process_id: string, payload: { people_id: string }) {
  const { data } = await api.post(`/processes/${process_id}/owners`, payload)
  return data
}