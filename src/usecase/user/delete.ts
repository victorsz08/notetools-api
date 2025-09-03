import { UserInterface } from "../../domain/interfaces/user.interface";
import { HttpException } from "../../helpers/http-exceptions";
import { Usecase } from "../usecase";

export type DeleteUserInput = {
    id: string;
};

export type DeleteUserOutput = void;

export class DeleteUserUsecase
    implements Usecase<DeleteUserInput, DeleteUserOutput>
{
    private constructor(private readonly userRepo: UserInterface) {}

    public static build(userRepo: UserInterface) {
        return new DeleteUserUsecase(userRepo);
    }

    public async execute(input: DeleteUserInput): Promise<void> {
        const { id } = input;

        const aUser = await this.userRepo.find(id);
        if (!aUser)
            throw new HttpException(
                404,
                "usuário não localizado com esse id",
            );

        await this.userRepo.delete(id);
        return;
    }
}
