import type { Role } from './auth';

export interface User {
  username: string;
  passwordHash: string;
  role: Role;
}

const users = new Map<string, User>();

export function addUser(user: User) {
  users.set(user.username, user);
}

export function getUser(username: string) {
  return users.get(username);
}
