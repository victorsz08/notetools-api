import { Mocked, vi } from "vitest";
import { UserInterface } from "../../domain/interfaces/user.interface";

export const makeUserRepoMock = (): Mocked<UserInterface> => {
    return {
        findByUsername: vi.fn(),
        create: vi.fn(),
        find: vi.fn(),
        list: vi.fn(),
        update: vi.fn(),
        updatePassword: vi.fn(),
        delete: vi.fn(),
    } as unknown as Mocked<UserInterface>;
};
