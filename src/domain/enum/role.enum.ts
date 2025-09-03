
export type RoleEnum = "USER" | "ADMIN";
export const RoleEnum = {
    user: "USER" as RoleEnum,
    admin: "ADMIN" as RoleEnum,
} as const;