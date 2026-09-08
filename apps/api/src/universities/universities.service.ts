/**
 * ============================================================
 * AIO PAY - Service Universités & Banques
 * ============================================================
 *
 * Fournit la liste des universités partenaires et de leurs
 * banques de convenance.
 *
 * Pour le MVP on hardcode UPC + 2 banques.
 * Plus tard → table PostgreSQL.
 * ============================================================
 */

import { Injectable } from "@nestjs/common";

export interface University {
  id: string;
  name: string;
  code: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Bank {
  id: string;
  name: string;
  code: string;
  universityId: string;
  isActive: boolean;
}

@Injectable()
export class UniversitiesService {
  private universities: University[] = [
    {
      id: "upc-001",
      name: "Université Protestante au Congo (UPC)",
      code: "UPC",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  private banks: Bank[] = [
    {
      id: "bank-equity",
      name: "Equity BCDC",
      code: "EQUITY",
      universityId: "upc-001",
      isActive: true,
    },
    {
      id: "bank-rawbank",
      name: "Rawbank",
      code: "RAWBANK",
      universityId: "upc-001",
      isActive: true,
    },
    {
      id: "bank-tmb",
      name: "TMB",
      code: "TMB",
      universityId: "upc-001",
      isActive: true,
    },
  ];

  async findAll(): Promise<University[]> {
    return this.universities.filter((u) => u.isActive);
  }

  async findBanksByUniversity(universityId: string): Promise<Bank[]> {
    return this.banks.filter(
      (b) => b.universityId === universityId && b.isActive
    );
  }
}
