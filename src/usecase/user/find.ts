import { UserEntity } from "../../domain/entities/user.entity";
import { UserInterface } from "../../domain/interfaces/user.interface";
import { HttpException } from "../../helpers/http-exceptions";
import { Usecase } from "../usecase";

export type FindUserInput = {
    id: string;
};

export type FindUserOutput = Pick<
    UserEntity,
    | "id"
    | "username"
    | "firstName"
    | "lastName"
    | "avatarImageUrl"
    | "createdAt"
    | "updatedAt"
>;

export class FindUserUsecase
    implements Usecase<FindUserInput, FindUserOutput>
{
    private constructor(private readonly userRepo: UserInterface) {}

    public static build(userRepo: UserInterface) {
        return new FindUserUsecase(userRepo);
    }

    public async execute(
        input: FindUserInput,
    ): Promise<FindUserOutput> {
        const { id } = input;

        const user = await this.userRepo.find(id);
        if (!user) {
            throw new HttpException(
                404,
                "usuário não localizado com esse id",
            );
        }

        const output = this.present(user);
        return output;
    }

    private present(user: UserEntity): FindUserOutput {
        return {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarImageUrl: user.avatarImageUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
