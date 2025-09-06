import { UserEntity } from "../../domain/entities/user.entity";
import { UserInterface } from "../../domain/interfaces/user.interface";
import { dateNow } from "../../helpers/date.helper";
import { HttpException } from "../../helpers/http-exceptions";
import { Usecase } from "../usecase";

export type UpdateUserInput = Pick<
    UserEntity,
    "id" | "username" | "firstName" | "lastName" | "avatarImageUrl"
>;

export type UpdateUserOutput = void;

export class UpdateUserUsecase
    implements Usecase<UpdateUserInput, UpdateUserOutput>
{
    private constructor(private readonly userRepo: UserInterface) {}

    public static build(userRepo: UserInterface) {
        return new UpdateUserUsecase(userRepo);
    }

    public async execute(input: UpdateUserInput): Promise<void> {
        const { id, username, firstName, lastName, avatarImageUrl } =
            input;
        const updatedAt = dateNow(new Date());

        const aUser = await this.userRepo.find(id);
        if (!aUser) {
            throw new HttpException(
                404,
                "usuário não localizado com esse id",
            );
        }

        if (aUser.username !== username) {
            const usernameAlreadyExists =
                await this.userRepo.findByUsername(username);
            if (usernameAlreadyExists)
                throw new HttpException(
                    409,
                    "username indisponível.",
                );
        }

        await this.userRepo.update({
            id,
            username,
            firstName,
            lastName,
            avatarImageUrl,
            updatedAt,
        });

        return;
    }
}
