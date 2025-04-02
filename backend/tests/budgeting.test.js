describe("POST /api/budget", () => {
  it("should create a new budget", async () => {
    const response = await request(app)
      .post("/api/budget")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        month: "March",
        year: 2025,
        amount: 500,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.month).toBe("March");
    expect(response.body.year).toBe(2025);
    expect(response.body.amount).toBe(500);
  });

  it("should return an error when amount is missing", async () => {
    const response = await request(app)
      .post("/api/budget")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        month: "March",
        year: 2025,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Amount is required");
  });
});

describe("GET /api/budget", () => {
  it("should fetch the current budget", async () => {
    const response = await request(app)
      .get("/api/budget")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("amount");
  });
});