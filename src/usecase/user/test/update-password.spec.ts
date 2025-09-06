import { describe, test, beforeAll, expect } from "vitest";
import { makeUserRepoMock } from "../../../test/mock/user-interface.mock";
import {
    UpdatePasswordUserInput,
    UpdatePasswordUserUsecase,
} from "../update-password";
import { UserEntity } from "../../../domain/entities/user.entity";
import { compareCrypt, crypt } from "../../../helpers/crypt.helper";
import { userInfo } from "os";

describe("UpdatePasswordUserUsecase", () => {
    let mockRepoUser: ReturnType<typeof makeUserRepoMock>;
    let usecase: UpdatePasswordUserUsecase;

    beforeAll(() => {
        mockRepoUser = makeUserRepoMock();
        usecase = UpdatePasswordUserUsecase.build(mockRepoUser);
    });

    test("should a be update password sucessfully", async () => {
        const input: UpdatePasswordUserInput = {
            id: "test-id",
            currentPassword: "test1234",
            newPassword: "test4321",
        };

        const user = {
            id: "test-id",
            username: "test-username",
            firstName: "test-firstname",
            lastName: "test-lastname",
            role: "USER",
            avatarImageUrl: "",
            password: await crypt(input.currentPassword),
            createdAt: new Date(),
            updatedAt: new Date(),
        } as UserEntity;

        (user as any).id = "test-id";

        mockRepoUser.find.mockResolvedValueOnce(user);
        mockRepoUser.updatePassword.mockResolvedValueOnce(undefined);

        await usecase.execute(input);

        expect(mockRepoUser.find).toHaveBeenCalledWith("test-id");

        const [[updateArgs]] = mockRepoUser.updatePassword.mock
            .calls as [
            [Pick<UserEntity, "id" | "password" | "updatedAt">],
        ];

        expect(updateArgs.id).toBe(input.id);
        expect(updateArgs.updatedAt).toBeInstanceOf(Date);

        const isValid = await compareCrypt(
            input.newPassword,
            updateArgs.password,
        );
        expect(isValid).toBe(true);
    });
});
