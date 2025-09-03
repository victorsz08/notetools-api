import { compare } from "bcryptjs";
import { hash } from "bcryptjs";

export async function crypt(str: string): Promise<string> {
    return await hash(str, 10);
}

export async function compareCrypt(
    password: string,
    hash: string,
): Promise<boolean> {
    return await compare(password, hash);
}
