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

export async function getProcessesTree(area_id: string): Promise<ProcessTreeItem[]> {
  const { data } = await api.get(`/areas/${area_id}/tree`)
  return data
}

export async function createProcess(payload: CreateProcessDto) {
  const { data } = await api.post(`/processes`, payload)
  return data
}