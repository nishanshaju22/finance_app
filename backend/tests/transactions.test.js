describe("POST /api/transactions", () => {
  it("should create a new transaction", async () => {
    const response = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${validToken}`)  // Assume validToken is from logged-in user
      .send({
        category: "Food",
        amount: 50,
        description: "Grocery shopping",
        date: "2025-03-25",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.category).toBe("Food");
    expect(response.body.amount).toBe(50);
  });

  it("should return an error when required fields are missing", async () => {
    const response = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        category: "Food",
        description: "Grocery shopping",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Amount is required");
  });
});


describe("GET /api/transactions", () => {
  it("should fetch all transactions", async () => {
    const response = await request(app)
      .get("/api/transactions")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);  // Assuming there are existing transactions
  });
});

describe("GET /api/transactions/:id", () => {
  it("should fetch a transaction by its ID", async () => {
    const transaction = await Transaction.create({
      category: "Food",
      amount: 50,
      description: "Grocery shopping",
      date: "2025-03-25",
    });

    const response = await request(app)
      .get(`/api/transactions/${transaction._id}`)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(transaction._id.toString());
    expect(response.body.category).toBe("Food");
  });

  it("should return an error if transaction not found", async () => {
    const invalidId = "60c72b2f5f4e4c9f1c1b2c3c";
    const response = await request(app)
      .get(`/api/transactions/${invalidId}`)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Transaction not found");
  });
});

describe("DELETE /api/transactions/:id", () => {
  it("should delete a transaction", async () => {
    const transaction = await Transaction.create({
      category: "Food",
      amount: 50,
      description: "Grocery shopping",
      date: "2025-03-25",
    });

    const response = await request(app)
      .delete(`/api/transactions/${transaction._id}`)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Transaction deleted successfully");
  });

  it("should return an error if transaction not found", async () => {
    const invalidId = "60c72b2f5f4e4c9f1c1b2c3c";
    const response = await request(app)
      .delete(`/api/transactions/${invalidId}`)
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Transaction not found");
  });
});

