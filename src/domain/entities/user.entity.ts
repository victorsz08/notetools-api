import { crypt } from "../../helpers/crypt.helper";
import { dateNow } from "../../helpers/date.helper";
import { generateId } from "../../helpers/uuid";
import { RoleEnum } from "../enum/role.enum";

export type UserProps = {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    role: RoleEnum;
    avatarImageUrl: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
};

type TUserBuildKey = Pick<UserProps, 'username' | 'firstName' | 'lastName' | 'password'>;

export class UserEntity {
    private constructor(private readonly props: UserProps) {}

    public static async build({
        username,
        firstName,
        lastName,
        password,
    }: TUserBuildKey) {
        return new UserEntity({
            id: generateId(),
            username,
            firstName,
            lastName,
            role: RoleEnum.user,
            avatarImageUrl: "",
            password: await crypt(password),
            createdAt: dateNow(new Date()),
            updatedAt: dateNow(new Date()),
        });
    }

    public static with(props: UserProps) {
        return new UserEntity(props);
    };

    public get id() {
        return this.props.id;
    };

    public get username() {
        return this.props.username;
    };

    public get firstName() {
        return this.props.firstName;
    };

    public get lastName() {
        return this.props.lastName;
    };

    public get avatarImageUrl() {
        return this.props.avatarImageUrl;
    };

    public get role() {
        return this.props.role;
    };

    public get password() {
        return this.props.password;
    };

    public get createdAt() {
        return this.props.createdAt;
    };

    public get updatedAt() {
        return this.props.updatedAt;
    };
}