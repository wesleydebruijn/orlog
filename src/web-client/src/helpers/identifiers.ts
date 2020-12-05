import { v4 as uuidv4 } from "uuid";

export function getUserId(): string {
  let userId = localStorage.getItem("orlog:userId");

  if (userId === null) {
    userId = createUuid();

    localStorage.setItem("orlog:userId", userId);
  }

  return userId;
}

export function createUuid(): string {
  return uuidv4();
}