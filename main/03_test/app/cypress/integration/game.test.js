describe('Game', () => {
  it('winner X', () => {
    cy.visit('localhost:3000');
    cy.get('[data-square=square_0]').click();
    cy.get('[data-square=square_3]').click();
    cy.get('[data-square=square_1]').click();
    cy.get('[data-square=square_4]').click();
    cy.get('[data-square=square_2]').click();
    cy.get('[data-game=status]').should('have.text', 'Winner: X');
  })

  it('draw', () => {
    cy.visit('localhost:3000');
    cy.get('[data-square=square_0]').click();
    cy.get('[data-square=square_4]').click();
    cy.get('[data-square=square_6]').click();
    cy.get('[data-square=square_3]').click();
    cy.get('[data-square=square_5]').click();
    cy.get('[data-square=square_1]').click();
    cy.get('[data-square=square_7]').click();
    cy.get('[data-square=square_8]').click();
    cy.get('[data-square=square_2]').click();
    cy.get('[data-game=status]').should('have.text', 'Draw!');
  })
})