/**
 * ============================================================
 * AIO PAY - DTOs d'authentification
 * ============================================================
 *
 * Les DTOs (Data Transfer Objects) définissent la forme exacte
 * des données que le frontend doit envoyer.
 *
 * class-validator vérifie automatiquement ces règles
 * grâce au ValidationPipe global configuré dans main.ts.
 * ============================================================
 */

import { IsString, IsNotEmpty, Length, Matches } from "class-validator";

/**
 * DTO pour la demande d'OTP
 * Exemple de corps de requête :
 * { "phone": "0812345678" }
 */
export class RequestOtpDto {
  @IsString({ message: "Le numéro de téléphone doit être une chaîne de caractères" })
  @IsNotEmpty({ message: "Le numéro de téléphone est obligatoire" })
  phone: string;
}

/**
 * DTO pour la vérification d'OTP
 * Exemple de corps de requête :
 * { "phone": "0812345678", "otp": "483921" }
 */
export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty({ message: "Le numéro de téléphone est obligatoire" })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: "Le code OTP est obligatoire" })
  @Length(6, 6, { message: "Le code OTP doit contenir exactement 6 chiffres" })
  @Matches(/^[0-9]{6}$/, { message: "Le code OTP ne doit contenir que des chiffres" })
  otp: string;
}
