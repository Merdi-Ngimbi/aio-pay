/**
 * ============================================================
 * AIO PAY - Service Universités & Banques
 * ============================================================
 *
 * Fournit la liste des universités partenaires et de leurs
 * banques de convenance.
 *
 * Universités supportées (MVP multi-universités) :
 * UNIKIN, UPC, UPN, UFASIC, ABA, ISAU, ISP GOMBE, HEC
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
    { id: "unikin-001", name: "Université de Kinshasa (UNIKIN)", code: "UNIKIN", isActive: true, createdAt: new Date().toISOString() },
    { id: "upc-001", name: "Université Protestante au Congo (UPC)", code: "UPC", isActive: true, createdAt: new Date().toISOString() },
    { id: "upn-001", name: "Université Pédagogique Nationale (UPN)", code: "UPN", isActive: true, createdAt: new Date().toISOString() },
    { id: "ufasic-001", name: "Université Francophone Afrique-Sicile (UFASIC)", code: "UFASIC", isActive: true, createdAt: new Date().toISOString() },
    { id: "aba-001", name: "Académie des Beaux-Arts (ABA)", code: "ABA", isActive: true, createdAt: new Date().toISOString() },
    { id: "isau-001", name: "Institut Supérieur d'Architecture et d'Urbanisme (ISAU)", code: "ISAU", isActive: true, createdAt: new Date().toISOString() },
    { id: "isp-gombe-001", name: "Institut Supérieur Pédagogique de la Gombe (ISP GOMBE)", code: "ISP-GOMBE", isActive: true, createdAt: new Date().toISOString() },
    { id: "hec-001", name: "Hautes Études Commerciales (HEC)", code: "HEC", isActive: true, createdAt: new Date().toISOString() },
  ];

  private banks: Bank[] = [
    // Banques génériques disponibles pour toutes les universités (MVP)
    { id: "bank-equity", name: "Equity BCDC", code: "EQUITY", universityId: "unikin-001", isActive: true },
    { id: "bank-rawbank", name: "Rawbank", code: "RAWBANK", universityId: "unikin-001", isActive: true },
    { id: "bank-tmb", name: "TMB", code: "TMB", universityId: "unikin-001", isActive: true },
    { id: "bank-equity-upc", name: "Equity BCDC", code: "EQUITY", universityId: "upc-001", isActive: true },
    { id: "bank-rawbank-upc", name: "Rawbank", code: "RAWBANK", universityId: "upc-001", isActive: true },
    { id: "bank-tmb-upc", name: "TMB", code: "TMB", universityId: "upc-001", isActive: true },
    { id: "bank-equity-upn", name: "Equity BCDC", code: "EQUITY", universityId: "upn-001", isActive: true },
    { id: "bank-rawbank-upn", name: "Rawbank", code: "RAWBANK", universityId: "upn-001", isActive: true },
    { id: "bank-equity-ufasic", name: "Equity BCDC", code: "EQUITY", universityId: "ufasic-001", isActive: true },
    { id: "bank-rawbank-ufasic", name: "Rawbank", code: "RAWBANK", universityId: "ufasic-001", isActive: true },
    { id: "bank-equity-aba", name: "Equity BCDC", code: "EQUITY", universityId: "aba-001", isActive: true },
    { id: "bank-rawbank-aba", name: "Rawbank", code: "RAWBANK", universityId: "aba-001", isActive: true },
    { id: "bank-equity-isau", name: "Equity BCDC", code: "EQUITY", universityId: "isau-001", isActive: true },
    { id: "bank-rawbank-isau", name: "Rawbank", code: "RAWBANK", universityId: "isau-001", isActive: true },
    { id: "bank-equity-isp", name: "Equity BCDC", code: "EQUITY", universityId: "isp-gombe-001", isActive: true },
    { id: "bank-rawbank-isp", name: "Rawbank", code: "RAWBANK", universityId: "isp-gombe-001", isActive: true },
    { id: "bank-equity-hec", name: "Equity BCDC", code: "EQUITY", universityId: "hec-001", isActive: true },
    { id: "bank-rawbank-hec", name: "Rawbank", code: "RAWBANK", universityId: "hec-001", isActive: true },
    { id: "bank-tmb-hec", name: "TMB", code: "TMB", universityId: "hec-001", isActive: true },
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
