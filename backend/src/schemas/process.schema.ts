import { ApiProperty } from "@nestjs/swagger";
import { ProcessStatus, ProcessType } from "generated/prisma/enums";

export class ToolDto {
  @ApiProperty({ example: "Notion" })
  name: string;

  @ApiProperty({ example: "TOOL" })
  type?: string;

  @ApiProperty({ example: "https://notion.so/..." })
  url?: string;
}

export class DocDto {
  @ApiProperty({ example: "Política de Pagamentos" })
  title: string;

  @ApiProperty({ example: "https://drive.google.com/..." })
  url: string;
}

export class OwnerDto {
  @ApiProperty({ format: "uuid" })
  people_id: string;
}

export class ProcessSchema {
  @ApiProperty({ format: "uuid" })
  id: string;

  @ApiProperty({ format: "uuid" })
  area_id: string;

  @ApiProperty({ format: "uuid", nullable: true })
  parent_id: string | null;

  @ApiProperty({ example: "Recrutamento e seleção" })
  title: string;

  @ApiProperty({ example: "..." , nullable: true})
  description: string | null;

  @ApiProperty({ enum: ProcessType })
  type: ProcessType;

  @ApiProperty({ enum: ProcessStatus })
  status: ProcessStatus;

  @ApiProperty({ example: 0 })
  position: number;

  @ApiProperty({ type: [ToolDto] })
  tools: ToolDto[];

  @ApiProperty({ type: [DocDto] })
  docs: DocDto[];

  @ApiProperty({ type: [OwnerDto] })
  owners: OwnerDto[];
}

export class ProcessTreeSchema {
  @ApiProperty({ format: "uuid" })
  id: string;

  @ApiProperty({ format: "uuid", nullable: true })
  parent_id: string | null;

  @ApiProperty({ example: "Recrutamento e seleção" })
  title: string;

  @ApiProperty({ example: "..." , nullable: true})
  description: string | null;

  @ApiProperty({ enum: ProcessType })
  type: ProcessType;

  @ApiProperty({ enum: ProcessStatus })
  status: ProcessStatus;

  @ApiProperty({ example: 0 })
  position: number;

  @ApiProperty({ isArray: true, type: ProcessSchema })
  children: ProcessSchema[]
}
