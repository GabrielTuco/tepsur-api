import bcrypt from "bcryptjs";

export const verifyPassword = (password: string, hash: string) => {
    return bcrypt.compareSync(password, hash);
};
