const SELECTOR_MODAL = '[data-cy=modal]';
const SELECTOR_BUN1 = '[data-cy=bun1]';
const SELECTOR_MAIN1 = '[data-cy=main1]';
const SELECTOR_SAUCE1 = '[data-cy=sauce1]';
const SELECTOR_SAUCE2 = '[data-cy=sauce2]';
const SELECTOR_CONSTRUCTOR_BUN_UP = '[data-cy=constuctor-bun-up]';
const SELECTOR_CONSTRUCTOR_BUN_DOWN = '[data-cy=constuctor-bun-down]';
const SELECTOR_CONSTRUCTOR_INGREDIENT_MAIN1 =
  '[data-cy=constructor-ingredient-main1]';
const SELECTOR_CONSTRUCTOR_INGREDIENT_SAUCE1 =
  '[data-cy=constructor-ingredient-sauce1]';

describe('Site accessibility', function () {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients' });
    cy.visit('/');
  });

  describe('Modal windows', function () {
    beforeEach(() => {
      cy.get(SELECTOR_SAUCE2).click();
      cy.get(SELECTOR_MODAL).as('modal');
    });

    it('should open the modal window', function () {
      cy.get('@modal').contains('Соус барбекю').should('exist');
    });

    it('should close the modal by clicking the close button', function () {
      cy.get(`${SELECTOR_MODAL} button`).click();
      cy.get('@modal').should('not.exist');
    });

    it('should close the modal by clicking on the overlay', function () {
      cy.get('body').click(0, 0);
      cy.get('@modal').should('not.exist');
    });
  });

  describe('Adding ingredients', function () {
    it('should add a bun to the constructor', function () {
      cy.addIngredient(
        SELECTOR_BUN1,
        'Булка небесная',
        SELECTOR_CONSTRUCTOR_BUN_UP,
        SELECTOR_CONSTRUCTOR_BUN_DOWN
      );
    });

    it('should add meat to the constructor', function () {
      cy.addIngredient(
        SELECTOR_MAIN1,
        'Котлета классическая',
        SELECTOR_CONSTRUCTOR_INGREDIENT_MAIN1
      );
    });

    it('should add sauce to the constructor', function () {
      cy.addIngredient(
        SELECTOR_SAUCE1,
        'Соус сырный',
        SELECTOR_CONSTRUCTOR_INGREDIENT_SAUCE1
      );
    });
  });

  describe('Placing an order', function () {
    beforeEach(() => {
      cy.intercept('GET', 'api/auth/user', { fixture: 'user' });
      cy.intercept('POST', 'api/orders', { fixture: 'order-response' });
      window.localStorage.setItem(
        'refreshToken',
        JSON.stringify('testRefreshToken')
      );
      cy.setCookie('accessToken', 'testAccessToken');
    });

    afterEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
    });

    it('should fill the constructor and place the order', function () {
      cy.addIngredient(
        SELECTOR_BUN1,
        'Булка небесная',
        SELECTOR_CONSTRUCTOR_BUN_UP,
        SELECTOR_CONSTRUCTOR_BUN_DOWN
      );
      cy.addIngredient(
        SELECTOR_MAIN1,
        'Котлета классическая',
        SELECTOR_CONSTRUCTOR_INGREDIENT_MAIN1
      );
      cy.addIngredient(
        SELECTOR_SAUCE1,
        'Соус сырный',
        SELECTOR_CONSTRUCTOR_INGREDIENT_SAUCE1
      );
      cy.get(SELECTOR_CONSTRUCTOR_BUN_UP)
        .contains('Булка небесная')
        .should('exist');
      cy.get(SELECTOR_CONSTRUCTOR_BUN_DOWN)
        .contains('Булка небесная')
        .should('exist');
      cy.get(SELECTOR_CONSTRUCTOR_INGREDIENT_MAIN1)
        .contains('Котлета классическая')
        .should('exist');
      cy.get(SELECTOR_CONSTRUCTOR_INGREDIENT_SAUCE1)
        .contains('Соус сырный')
        .should('exist');
      cy.contains('Оформить заказ').should('be.visible').click();
      cy.log('Ожидание появления модального окна заказа');
      cy.get(SELECTOR_MODAL, { timeout: 15000 })
        .should('exist')
        .contains('77123')
        .should('exist');
      cy.get(`${SELECTOR_MODAL} button`).click();
      cy.get(SELECTOR_MODAL).should('not.exist');
      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});
