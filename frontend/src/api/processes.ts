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

export async function getProcessesTree(area_id: string): Promise<ProcessTreeItem[]> {
  const { data } = await api.get(`/areas/${area_id}/tree`)
  return data
}