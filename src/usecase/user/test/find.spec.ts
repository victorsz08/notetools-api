import { test, describe, expect, beforeAll } from "vitest";
import { makeUserRepoMock } from "../../../test/mock/user-interface.mock";
import {
    FindUserInput,
    FindUserOutput,
    FindUserUsecase,
} from "../find";
import { UserEntity } from "../../../domain/entities/user.entity";
import { HttpException } from "../../../helpers/http-exceptions";

describe("FindUserUsecase", () => {
    let mockUserRepo: ReturnType<typeof makeUserRepoMock>;
    let usecase: FindUserUsecase;

    beforeAll(() => {
        mockUserRepo = makeUserRepoMock();
        usecase = FindUserUsecase.build(mockUserRepo);
    });

    test("should a be find user successfully", async () => {
        const user = {} as UserEntity;
        const input: FindUserInput = {
            id: "id-test",
        };

        mockUserRepo.find.mockResolvedValueOnce(user);

        const mockOutput: FindUserOutput = {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarImageUrl: user.avatarImageUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        const output = await usecase.execute(input);

        expect(output).toEqual(mockOutput);
        expect(mockUserRepo.find).toHaveBeenCalledWith("id-test");
        expect(output).toHaveProperty("id");
    });

    test("should a be to throw error not found user with id", async () => {
        const input: FindUserInput = {
            id: "not-id-test",
        };

        mockUserRepo.find.mockResolvedValueOnce(undefined);

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(
                404,
                "usuário não localizado com esse id",
            ),
        );
        expect(mockUserRepo.find).toHaveBeenCalledWith("not-id-test");
    });
});
