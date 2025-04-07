import {
  closeTestDB,
  getTestDB,
  resetTestDB,
  setupTestDB,
} from "@kis/common";
import { UserEntity } from "@kis/wb-data/dist/entities";
import bcrypt from "bcryptjs";
import { register } from "./register";
import { RegisterDAO } from "./types";

beforeAll(async () => {
  await setupTestDB();
});

beforeEach(async () => {
  await resetTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe("Register function", () => {
  
  it("should return 400 if username already exists", async () => {
    const password = "password";
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = getTestDB().getRepository(UserEntity).create({
      username: "testuser",
      password_hash: hashedPassword,
    });
    await getTestDB().getRepository(UserEntity).save(existingUser);

    const registerPayload: RegisterDAO = { username: "testuser", password };

    const response = await register(registerPayload);

    expect(response.responseCode).toBe(400);
    expect(response.data?.error).toBe("Username already exists. Please choose another.");
  });

  it("should return 400 if password is too short", async () => {
    const registerPayload: RegisterDAO = { username: "newuser", password: "123" };

    const response = await register(registerPayload);

    expect(response.responseCode).toBe(400);
    expect(response.data?.error).toBe("password must be at least 6 characters");
  });

  it("should return 201 and new user info if registration is successful", async () => {
    const password = "validpassword";
    const registerPayload: RegisterDAO = { username: "newuser", password };

    const response = await register(registerPayload);

    expect(response.responseCode).toBe(201);
    expect(response.data).toHaveProperty("newUserId");
    expect(response.data).toHaveProperty("newUsername");
    expect(response.data?.newUsername).toBe("newuser");

    // Check if the user is saved to the database
    const savedUser = await getTestDB().getRepository(UserEntity).findOne({
      where: { username: "newuser" },
    });
    expect(savedUser).toBeDefined();
  });
});