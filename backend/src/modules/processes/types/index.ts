import { ProcessStatus, ProcessType } from "generated/prisma/enums";

export type FilteredProcess = {
    id: string;
    parent_id: string | null;
    title: string;
    description: string | null;
    type: ProcessType;
    status: ProcessStatus;
    position: number;
}