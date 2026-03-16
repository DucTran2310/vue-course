import { AuthRequest } from "@/types/index.js";

export interface InsertAuditFields {
  createduser: string;
  updateduser: string;
}

export interface UpdateAuditFields {
  updateduser: string;
}

export interface SoftDeleteFields {
  isdeleted: boolean;
  deleteduser: string;
  deleteddate: string;
  deletednote: string;
}

export function getInsertAuditFields(req: AuthRequest): InsertAuditFields {
  const userEmail = req.user?.email || "SYSTEM";
  return {
    createduser: userEmail,
    updateduser: userEmail,
  };
}

export function getUpdateAuditFields(req: AuthRequest): UpdateAuditFields {
  const userEmail = req.user?.email || "SYSTEM";
  return {
    updateduser: userEmail,
  };
}

export function getSoftDeleteFields(req: AuthRequest, note?: string): SoftDeleteFields {
  const userEmail = req.user?.email || "SYSTEM";
  return {
    isdeleted: true,
    deleteduser: userEmail,
    deleteddate: new Date().toISOString(),
    deletednote: note || "Deleted by user",
  };
}

export function getActiveRecordsFilter(): string {
  return "isdeleted = FALSE";
}

export function getDeletedRecordsFilter(): string {
  return "isdeleted = TRUE";
}
