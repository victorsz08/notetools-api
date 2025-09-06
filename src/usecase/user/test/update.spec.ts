import { describe, test, beforeAll, expect } from "vitest";
import { makeUserRepoMock } from "../../../test/mock/user-interface.mock";
import { UpdateUserInput, UpdateUserUsecase } from "../update";
import { UserEntity } from "../../../domain/entities/user.entity";
import { dateNow } from "../../../helpers/date.helper";
import { HttpException } from "../../../helpers/http-exceptions";

describe("UpdateUserUsecase", () => {
    let mockRepoUser: ReturnType<typeof makeUserRepoMock>;
    let usecase: UpdateUserUsecase;

    beforeAll(() => {
        mockRepoUser = makeUserRepoMock();
        usecase = UpdateUserUsecase.build(mockRepoUser);
    });

    test("should a be update user sucessfully", async () => {
        const input: UpdateUserInput = {
            id: "test-id",
            username: "test-username",
            firstName: "test-firstName",
            lastName: "test-lastName",
            avatarImageUrl: "test-url",
        };

        const user = {} as UserEntity;
        mockRepoUser.find.mockResolvedValueOnce(user);
        mockRepoUser.update.mockResolvedValueOnce(undefined);
        mockRepoUser.findByUsername.mockResolvedValueOnce(undefined);

        await usecase.execute(input);

        expect(mockRepoUser.find).toHaveBeenCalledWith("test-id");
        expect(mockRepoUser.findByUsername).toHaveBeenCalledWith(
            "test-username",
        );
        expect(mockRepoUser.update).toHaveBeenCalledWith({
            id: input.id,
            username: input.username,
            firstName: input.firstName,
            lastName: input.lastName,
            avatarImageUrl: input.avatarImageUrl,
            updatedAt: expect.any(Date),
        });
    });

    test("should a be to throw not found user", async () => {
        const input: UpdateUserInput = {
            id: "test-id",
            username: "test-username",
            firstName: "test-firstName",
            lastName: "test-lastName",
            avatarImageUrl: "test-url",
        };

        mockRepoUser.find.mockResolvedValueOnce(undefined);

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(
                404,
                "usuário não localizado com esse id",
            ),
        );
        expect(mockRepoUser.find).toHaveBeenCalledWith("test-id");
    });

    test("should a be to throw username already exists", async () => {
        const user = {} as UserEntity;
        const input: UpdateUserInput = {
            id: "test-id",
            username: "test-username",
            firstName: "test-firstName",
            lastName: "test-lastName",
            avatarImageUrl: "test-url",
        };

        mockRepoUser.find.mockResolvedValueOnce(user);
        mockRepoUser.findByUsername.mockResolvedValueOnce(user);

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(409, "username indisponível."),
        );
        expect(mockRepoUser.find).toHaveBeenCalledWith("test-id");
        expect(mockRepoUser.findByUsername).toHaveBeenCalledWith(
            "test-username",
        );
    });
});
