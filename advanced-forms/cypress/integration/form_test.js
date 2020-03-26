describe("Test our inputs and submit our form", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3001/");
  });
  it("Add text to inputs and submit form", () => {
    cy.get('input[name="name"]')
      .type("Danial")
      .should("have.value", "Danial");
    cy.get("input[name='email']")
      .type("test@test.com")
      .should("have.value", "test@test.com");
    cy.get('input[name="password"]')
      .type("12345")
      .should("have.value", "12345");
    cy.get('input[name="terms"]')
      .check()
      .should("be.checked");
    cy.get('button[name="submit"]').click();
  });
});
