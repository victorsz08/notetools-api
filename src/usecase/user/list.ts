import { UserEntity } from "../../domain/entities/user.entity";
import {
    TUserListOuput,
    UserInterface,
} from "../../domain/interfaces/user.interface";
import { Usecase } from "../usecase";

export type SortOrderKey = "asc" | "desc";

export type ListUserInput = {
    page: number;
    offset: number;
    keywords: string | undefined;
    orderBy?:
        | {
              [K in keyof UserEntity]: SortOrderKey | undefined;
          }
        | undefined;
};

export type ListUserOutput = {
    users: Pick<
        UserEntity,
        | "id"
        | "username"
        | "firstName"
        | "lastName"
        | "avatarImageUrl"
        | "role"
        | "createdAt"
        | "updatedAt"
    >[];
    total: number;
    offset: number;
    pages: number;
};

export class ListUserUsecase
    implements Usecase<ListUserInput, ListUserOutput>
{
    private constructor(private readonly userRepo: UserInterface) {}

    public static build(userRepo: UserInterface) {
        return new ListUserUsecase(userRepo);
    }

    public async execute(
        input: ListUserInput,
    ): Promise<ListUserOutput> {
        const { page, offset, keywords, orderBy } = input;

        const aUsers = await this.userRepo.list({
            page,
            offset,
            keywords,
            orderBy,
        });

        const output = this.present(aUsers);
        return output;
    }

    private present({
        users,
        total,
        pages,
        offset,
    }: TUserListOuput): ListUserOutput {
        return {
            users: users.map((u) => ({
                id: u.id,
                username: u.username,
                firstName: u.firstName,
                lastName: u.lastName,
                avatarImageUrl: u.avatarImageUrl,
                role: u.role,
                createdAt: u.createdAt,
                updatedAt: u.updatedAt,
            })),
            total,
            offset,
            pages,
        };
    }
}
