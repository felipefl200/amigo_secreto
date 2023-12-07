import { getToday } from "../utils/getToday";

const currentPassword = getToday().split("/").join("");

export const validatePassword = (password: string): boolean => {
  return password === currentPassword;
};

export const createToken = () => {
  return `${process.env.DEFAULT_TOKEN}${currentPassword}`;
};

export const validateToken = (token: string) => {
  const currentToken = createToken();
  return token === currentToken;
};
