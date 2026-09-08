/**
 * ============================================================
 * AIO PAY - Service Utilisateurs
 * ============================================================
 *
 * Rôle :
 * - Créer un nouvel utilisateur (lors de la première connexion)
 * - Retrouver un utilisateur par téléphone ou par ID
 *
 * Stockage :
 * Pour le MVP on utilise un tableau en mémoire.
 * Plus tard → PostgreSQL via Prisma (comme prévu dans la roadmap).
 * ============================================================
 */

import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  phone: string;
  fullName?: string;
  studentNumber?: string;
  role: "STUDENT" | "UNIVERSITY" | "ADMIN";
  universityId?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class UsersService {
  /** Base de données temporaire en mémoire */
  private users: User[] = [];

  /**
   * Recherche un utilisateur par son numéro de téléphone
   * Retourne null s'il n'existe pas encore
   */
  async findByPhone(phone: string): Promise<User | null> {
    return this.users.find((u) => u.phone === phone) || null;
  }

  /**
   * Recherche un utilisateur par son ID unique
   */
  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null;
  }

  /**
   * Crée un nouvel utilisateur
   * Appelé automatiquement lors de la première vérification d'OTP
   */
  async create(data: {
    phone: string;
    role?: "STUDENT" | "UNIVERSITY" | "ADMIN";
    fullName?: string;
  }): Promise<User> {
    const now = new Date().toISOString();
    const user: User = {
      id: uuidv4(),
      phone: data.phone,
      fullName: data.fullName,
      role: data.role || "STUDENT",
      createdAt: now,
      updatedAt: now,
    };
    this.users.push(user);
    console.log(`[USERS] Nouvel utilisateur créé : ${user.phone} (${user.id})`);
    return user;
  }
}
