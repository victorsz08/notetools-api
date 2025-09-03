import { UserInterface } from "../../domain/interfaces/user.interface";
import { compareCrypt, crypt } from "../../helpers/crypt.helper";
import { dateNow } from "../../helpers/date.helper";
import { HttpException } from "../../helpers/http-exceptions";
import { Usecase } from "../usecase";

export type UpdatePasswordUserInput = {
    id: string;
    currentPassword: string;
    newPassword: string;
};

export type UpdatePasswordUserOutput = void;

export class UpdatePasswordUserUsecase
    implements
        Usecase<UpdatePasswordUserInput, UpdatePasswordUserOutput>
{
    private constructor(private readonly userRepo: UserInterface) {}

    public static build(userRepo: UserInterface) {
        return new UpdatePasswordUserUsecase(userRepo);
    }

    public async execute(
        input: UpdatePasswordUserInput,
    ): Promise<void> {
        const { id, currentPassword, newPassword } = input;

        const aUser = await this.userRepo.find(id);
        if (!aUser)
            throw new HttpException(
                404,
                "usuário não encontrado com esse id",
            );

        const validatePassword = await compareCrypt(
            currentPassword,
            aUser.password,
        );
        if (!validatePassword)
            throw new HttpException(400, "senha atual incorreta.");

        const passwordHashed = await crypt(newPassword);
        const updatedAt = dateNow(new Date());

        await this.userRepo.updatePassword({
            id,
            password: passwordHashed,
            updatedAt,
        });

        return;
    }
}
