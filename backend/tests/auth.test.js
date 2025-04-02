const request = require("supertest");
const app = require("../app"); // Adjust the path to your app
const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

describe("Authentication API", () => {
  beforeAll(async () => {
    // Set up the database connection and clean up before tests
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "testuser@example.com",
          password: "password123",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user.name).toBe("Test User");
    });

    it("should not register a user with an existing email", async () => {
      const existingUser = await User.create({
        name: "Existing User",
        email: "existing@example.com",
        password: "password123",
      });

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "New User",
          email: existingUser.email, // Same email
          password: "password123",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("User already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should log in a user", async () => {
      const user = await User.create({
        name: "Test Login",
        email: "login@example.com",
        password: "password123",
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "login@example.com",
          password: "password123",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    it("should not log in with invalid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "invalid@example.com",
          password: "wrongpassword",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid credentials");
    });
  });
});