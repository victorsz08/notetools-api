import { beforeAll, test, describe, expect } from "vitest";
import { makeUserRepoMock } from "../../../test/mock/user-interface.mock";
import {
    ListUserInput,
    ListUserOutput,
    ListUserUsecase,
} from "../list";
import { TUserListOuput } from "../../../domain/interfaces/user.interface";
import { UserEntity } from "../../../domain/entities/user.entity";

describe("ListUserUsecase", () => {
    let mockUserRepo: ReturnType<typeof makeUserRepoMock>;
    let usecase: ListUserUsecase;

    beforeAll(() => {
        mockUserRepo = makeUserRepoMock();
        usecase = ListUserUsecase.build(mockUserRepo);
    });

    test("should a be return's a list user successfully", async () => {
        const input: ListUserInput = {
            page: 1,
            offset: 10,
            keywords: "",
        };
        const mockListUser: TUserListOuput = {
            users: [],
            pages: 0,
            offset: 10,
            total: 0,
        };

        mockUserRepo.list.mockResolvedValueOnce(mockListUser);

        const mockOutput: ListUserOutput = {
            users: mockListUser.users.map((u) => ({
                id: u.id,
                username: u.username,
                firstName: u.firstName,
                lastName: u.lastName,
                role: u.role,
                avatarImageUrl: u.avatarImageUrl,
                createdAt: u.createdAt,
                updatedAt: u.updatedAt,
            })),
            offset: mockListUser.offset,
            pages: mockListUser.pages,
            total: mockListUser.total,
        };

        const output = await usecase.execute(input);

        expect(output).toEqual(mockOutput);
        expect(mockUserRepo.list).toHaveBeenCalledWith(input);
    });
});
