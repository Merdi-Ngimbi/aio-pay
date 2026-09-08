/**
 * ============================================================
 * AIO PAY - Contrôleur Universités
 * ============================================================
 *
 * Routes :
 * GET /api/universities              → Liste des universités
 * GET /api/universities/:id/banks    → Banques d'une université
 * ============================================================
 */

import { Controller, Get, Param } from "@nestjs/common";
import { UniversitiesService } from "./universities.service";

@Controller("universities")
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Get()
  async findAll() {
    const data = await this.universitiesService.findAll();
    return { success: true, data };
  }

  @Get(":id/banks")
  async findBanks(@Param("id") id: string) {
    const data = await this.universitiesService.findBanksByUniversity(id);
    return { success: true, data };
  }
}
