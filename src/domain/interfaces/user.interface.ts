import { UserEntity } from "../entities/user.entity";

export type SortOrderKey = "asc" | "desc";
export type TUserListOuput = {
    users: UserEntity[];
    total: number;
    offset: number;
    pages: number;
};

export type TUserListInput = {
    page: number;
    offset: number;
    keywords: string | undefined;
    orderBy?:
        | {
              [K in keyof UserEntity]: SortOrderKey | undefined;
          }
        | undefined;
};

export interface UserInterface {
    create(user: UserEntity): Promise<void>;
    find(id: string): Promise<UserEntity | undefined>;
    list(query: TUserListInput): Promise<TUserListOuput>;
    findByUsername(username: string): Promise<UserEntity | undefined>;
    update(
        input: Pick<
            UserEntity,
            | "id"
            | "username"
            | "firstName"
            | "lastName"
            | "avatarImageUrl"
            | "updatedAt"
        >,
    ): Promise<void>;
    updatePassword(
        input: Pick<UserEntity, "id" | "password" | "updatedAt">,
    ): Promise<void>;
    delete(id: string): Promise<void>;
}
