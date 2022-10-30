
describe('nform-demo-app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    cy.get('.mat-display-3').contains('nForm');
  });
});
