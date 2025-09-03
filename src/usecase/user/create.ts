import { UserInterface } from "../../domain/interfaces/user.interface";
import { Usecase } from "../usecase";
import { HttpException } from "../../helpers/http-exceptions";
import { UserEntity } from "../../domain/entities/user.entity";

export type CreateUserInput = {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
};

export type CreateUserOutput = {
    id: string;
};

export class CreateUserUsecase
    implements Usecase<CreateUserInput, CreateUserOutput>
{
    private constructor(private readonly userRepo: UserInterface) {}

    public async build(userRepo: UserInterface) {
        return new CreateUserUsecase(userRepo);
    }

    public async execute(
        input: CreateUserInput,
    ): Promise<CreateUserOutput> {
        const { username, firstName, lastName, password } = input;

        const usernameAlreadyExists =
            await this.userRepo.findByUsername(username);
        if (usernameAlreadyExists) {
            throw new HttpException(409, "username indisponível");
        }

        const aUser = await UserEntity.build({
            username,
            firstName,
            lastName,
            password,
        });

        await this.userRepo.create(aUser);

        const output: CreateUserOutput = {
            id: aUser.id,
        };

        return output;
    }
}
