export type User = {
  id: string;
  email: string;
  role: "admin" | "manager";
  username: string;
  token: string;
};
