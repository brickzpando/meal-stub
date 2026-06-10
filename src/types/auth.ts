import { Employee } from "./employee";

export type UserRole = "hr" | "pantry" | "admin" | "employee";

export interface AuthUser {
  role: UserRole;
  employee?: Employee;
}
