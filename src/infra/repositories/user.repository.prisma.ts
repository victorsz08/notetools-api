import { Prisma, PrismaClient } from "@prisma/client";
import { UserEntity } from "../../domain/entities/user.entity";
import {
    TUserListInput,
    TUserListOuput,
    UserInterface,
} from "../../domain/interfaces/user.interface";
import { RoleEnum } from "../../domain/enum/role.enum";
import { _ } from "vitest/dist/chunks/reporters.d.BFLkQcL6";

export class UserRepositoryPrisma implements UserInterface {
    private constructor(private readonly repo: PrismaClient) {}

    public static build(repo: PrismaClient) {
        return new UserRepositoryPrisma(repo);
    }

    public async create(user: UserEntity): Promise<void> {
        const {
            id,
            username,
            firstName,
            lastName,
            avatarImageUrl,
            password,
            role,
            createdAt,
            updatedAt,
        } = user;

        await this.repo.user.create({
            data: {
                id,
                username,
                name: firstName,
                lastname: lastName,
                avatarImageUrl,
                password,
                role,
                createdAt,
                updatedAt,
            },
        });

        return;
    }

    public async find(id: string): Promise<UserEntity | undefined> {
        const user = await this.repo.user.findUnique({
            where: { id },
        });

        if (!user) {
            return;
        }

        const output = UserEntity.with({
            id: user.id,
            username: user.username,
            firstName: user.name,
            lastName: user.lastname,
            avatarImageUrl: user.avatarImageUrl ?? "",
            role: user.role as RoleEnum,
            password: user.password,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });

        return output;
    }

    public async list(
        query: TUserListInput,
    ): Promise<TUserListOuput> {
        const { page, offset, keywords, orderBy } = query;

        const queryArgs: Prisma.UserFindManyArgs = {
            where: {},
            take: offset,
            skip: (page - 1) * offset,
        };

        const countArgs: Prisma.UserCountArgs = {
            where: {},
        };

        if (keywords) {
            queryArgs.where = {
                AND: [
                    {
                        username: {
                            contains: keywords,
                            mode: "insensitive",
                        },
                    },
                    {
                        name: {
                            contains: keywords,
                            mode: "insensitive",
                        },
                    },
                    {
                        lastname: {
                            contains: keywords,
                            mode: "insensitive",
                        },
                    },
                ],
            };

            countArgs.where = {
                AND: [
                    {
                        username: {
                            contains: keywords,
                            mode: "insensitive",
                        },
                    },
                    {
                        name: {
                            contains: keywords,
                            mode: "insensitive",
                        },
                    },
                    {
                        lastname: {
                            contains: keywords,
                            mode: "insensitive",
                        },
                    },
                ],
            };
        }

        if (orderBy) {
            queryArgs.orderBy = Object.fromEntries(
                Object.entries(orderBy).filter(
                    ([_, value]) => value !== undefined,
                ),
            );
        }

        const [users, total] = await Promise.all([
            this.repo.user.findMany(queryArgs),
            this.repo.user.count(countArgs),
        ]);

        const userList = users.map((user) => {
            return UserEntity.with({
                id: user.id,
                username: user.username,
                firstName: user.name,
                lastName: user.lastname,
                avatarImageUrl: user.avatarImageUrl ?? "",
                role: user.role as RoleEnum,
                password: user.password,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        });

        const pages = Math.ceil(total / offset);

        return {
            users: userList,
            offset,
            pages,
            total,
        };
    }

    public async findByUsername(
        username: string,
    ): Promise<UserEntity | undefined> {
        const user = await this.repo.user.findUnique({
            where: { username },
        });

        if (!user) return;

        const output = UserEntity.with({
            id: user.id,
            username: user.username,
            firstName: user.name,
            lastName: user.lastname,
            avatarImageUrl: user.avatarImageUrl ?? "",
            role: user.role as RoleEnum,
            password: user.password,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });

        return output;
    }

    public async update(
        input: Pick<
            UserEntity,
            | "id"
            | "username"
            | "firstName"
            | "lastName"
            | "avatarImageUrl"
            | "updatedAt"
        >,
    ): Promise<void> {
        const {
            id,
            username,
            firstName,
            lastName,
            avatarImageUrl,
            updatedAt,
        } = input;

        await this.repo.user.update({
            where: { id },
            data: {
                username,
                name: firstName,
                lastname: lastName,
                avatarImageUrl,
                updatedAt,
            },
        });

        return;
    }

    public async updatePassword(
        input: Pick<UserEntity, "id" | "password" | "updatedAt">,
    ): Promise<void> {
        const { id, password, updatedAt } = input;

        await this.repo.user.update({
            where: { id },
            data: {
                password,
                updatedAt,
            },
        });

        return;
    }

    public async delete(id: string): Promise<void> {
        await this.repo.user.delete({
            where: { id },
        });

        return;
    }
}
