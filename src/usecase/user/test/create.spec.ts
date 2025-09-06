import { test, describe, beforeAll, expect } from "vitest";
import { CreateUserInput, CreateUserUsecase } from "../create";
import { makeUserRepoMock } from "../../../test/mock/user-interface.mock";
import { UserEntity } from "../../../domain/entities/user.entity";
import { HttpException } from "../../../helpers/http-exceptions";

describe("CreateUserUsecase", () => {
    let mockRepoUser: ReturnType<typeof makeUserRepoMock>;
    let usecase: CreateUserUsecase;

    beforeAll(() => {
        mockRepoUser = makeUserRepoMock();
        usecase = CreateUserUsecase.build(mockRepoUser);
    });

    test("should a be create a new user successfully", async () => {
        mockRepoUser.findByUsername.mockResolvedValueOnce(undefined);
        mockRepoUser.create.mockResolvedValueOnce(undefined);

        const input: CreateUserInput = {
            username: "test-username",
            firstName: "test-firstname",
            lastName: "teste-lastname",
            password: "password-test123",
        };

        const output = await usecase.execute(input);

        expect(mockRepoUser.findByUsername).toHaveBeenCalledWith(
            "test-username",
        );
        expect(mockRepoUser.create).toHaveBeenCalled();
        expect(output).toHaveProperty("id");
    });

    test("should a be throw error username al ready exists", async () => {
        const user = {} as UserEntity;

        mockRepoUser.findByUsername.mockResolvedValueOnce(user);

        const input: CreateUserInput = {
            username: "test-username",
            firstName: "test-firstname",
            lastName: "teste-lastname",
            password: "password-test123",
        };

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(409, "username indisponível"),
        );
        expect(mockRepoUser.findByUsername).toHaveBeenCalledWith(
            "test-username",
        );
    });
});
