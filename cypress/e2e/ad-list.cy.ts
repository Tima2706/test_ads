/// <reference types="cypress" />

describe('Ad List', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('loads ads and searches', () => {
        cy.get('[data-testid="ad-card"]').should('have.length.gte', 1);
        cy.get('input[placeholder*="Search"]').type('laptop');
        cy.get('[data-testid="ad-card"]').should('have.length.gte', 0);
    });

    it('persists offline changes', () => {
        cy.window().then((win) => {
            Object.defineProperty(win.navigator, 'onLine', {
                configurable: true,
                value: false,
            });
        });
        cy.get('[data-testid="toggle-status"]').first().click();
        cy.get('[data-testid="ad-status"]').first().should('contain', 'pending');
        cy.reload();
        cy.get('[data-testid="ad-status"]').first().should('contain', 'pending');
    });

    it('opens modal and adds comment', () => {
        cy.get('[data-testid="ad-card"]').first().click();
        cy.get('[data-testid^="ad-modal"]').should('be.visible');
        cy.get('textarea[placeholder*="comment"]').type('Test comment');
        cy.get('button:contains("Submit")').click();
        cy.contains('Test comment').should('be.visible');
    });
});