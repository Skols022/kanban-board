describe('Kanban Board Drag-and-Drop', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('moves a task from one column to another', () => {
    cy.get('[data-testid="task-1"]')
      .first()
      .trigger('mousedown', { which: 1, force: true })
      .wait(200)
      .trigger('mousemove', { clientX: 500, clientY: 300, force: true });

    cy.get('[data-testid="column-inProgress"]').find('[data-testid="task-1"]').should('exist');
    cy.get('[data-testid="column-todo"]').find('[data-testid="task-1"]').should('not.exist');
  });
});
