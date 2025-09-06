import { describe, test, beforeAll, expect } from "vitest";
import { makeUserRepoMock } from "../../../test/mock/user-interface.mock";
import { DeleteUserInput, DeleteUserUsecase } from "../delete";
import { UserEntity } from "../../../domain/entities/user.entity";
import { HttpException } from "../../../helpers/http-exceptions";

describe("DeleteUserUsecase", () => {
    let mockRepoUser: ReturnType<typeof makeUserRepoMock>;
    let usecase: DeleteUserUsecase;

    beforeAll(() => {
        mockRepoUser = makeUserRepoMock();
        usecase = DeleteUserUsecase.build(mockRepoUser);
    });

    test("should a be delete user sucessfully", async () => {
        const input: DeleteUserInput = {
            id: "test-id",
        };

        const user = {} as UserEntity;

        mockRepoUser.find.mockResolvedValueOnce(user);
        mockRepoUser.delete.mockResolvedValueOnce(undefined);

        await usecase.execute(input);

        expect(mockRepoUser.find).toHaveBeenCalledWith("test-id");
        expect(mockRepoUser.delete).toHaveBeenCalledWith("test-id");
    });

    test("should a be to throw not found user exception", async () => {
        const input: DeleteUserInput = {
            id: "test-id",
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
});
