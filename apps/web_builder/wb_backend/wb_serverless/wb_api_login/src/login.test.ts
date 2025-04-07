import { UserEntity } from "@kis/wb-data/dist/entities";
import bcrypt from "bcryptjs";
import { login } from "./login";
import { LoginDAO } from "./types";
import { 
  closeTestDB, 
  getTestDB, 
  resetTestDB, 
  setupTestDB 
} from "@kis/common";

beforeAll(async () => {
  await setupTestDB();
});

beforeEach(async () => {
  await resetTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe("Login function", () => {
  
  it("should return 404 if user does not exist", async () => {
    const loginPayload: LoginDAO = { username: "nonexistent", password: "password" };

    const response = await login(loginPayload);

    expect(response.responseCode).toBe(404);
    expect(response.data?.error).toBe("User not found!");
  });

  it("should return 400 if password is incorrect", async () => {
    const password = "correctpassword";
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = getTestDB().getRepository(UserEntity).create({
      username: "testuser",
      password_hash: hashedPassword,
    });
    await getTestDB().getRepository(UserEntity).save(user);

    const loginPayload: LoginDAO = { username: "testuser", password: "wrongpassword" };

    const response = await login(loginPayload);

    expect(response.responseCode).toBe(400);
    expect(response.data?.error).toBe("Username or password is invalid!");
  });

  it("should return 403 if user is deactivated", async () => {
    const password = "correctpassword";
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = getTestDB().getRepository(UserEntity).create({
      username: "testuser",
      password_hash: hashedPassword,
      deletedAt: new Date(), // Mark user as deactivated
    });
    await getTestDB().getRepository(UserEntity).save(user);

    const loginPayload: LoginDAO = { username: "testuser", password };

    const response = await login(loginPayload);

    expect(response.responseCode).toBe(403);
    expect(response.data?.error).toBe("User is deactivated");
  });

  it("should return 200 and tokens if login is successful", async () => {
    const password = "validpassword";
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = getTestDB().getRepository(UserEntity).create({
      username: "testuser",
      password_hash: hashedPassword,
    });
    await getTestDB().getRepository(UserEntity).save(user);

    const loginPayload: LoginDAO = { username: "testuser", password };

    const response = await login(loginPayload);

    expect(response.responseCode).toBe(200);
    expect(response.data).toHaveProperty("accessToken");
    expect(response.data).toHaveProperty("refreshToken");
    expect(response.data?.username).toBe("testuser");
  });
});