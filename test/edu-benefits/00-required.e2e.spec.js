if (!process.env.BUILDTYPE || process.env.BUILDTYPE === 'development') {
  const E2eHelpers = require('../util/e2e-helpers');
  const Timeouts = require('../util/timeouts.js');
  const EduHelpers = require('../util/edu-helpers');

  module.exports = E2eHelpers.createE2eTest(
    (client) => {
      EduHelpers.initApplicationSubmitMock();

      const advance = () => {
        const selector = '.form-progress-buttons .usa-button-primary';
        client
          .moveToElement(selector, 0, 0)
          .click(selector);
      };

      // Ensure introduction page renders.
      client
        .url(`${E2eHelpers.baseUrl}/education/apply-for-education-benefits/application/`)
        .waitForElementVisible('body', Timeouts.normal)
        .assert.title('Apply for education benefits: Vets.gov')
        .waitForElementVisible('div.form-progress-buttons', Timeouts.slow);
      advance();
      E2eHelpers.overrideVetsGovApi(client);
      E2eHelpers.overrideSmoothScrolling(client);
      E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

      // Veteran information page.
      client
        .expect.element('input[name="fname"]').to.be.visible;
      EduHelpers.completeVeteranInformation(client, EduHelpers.testValues, true);
      advance();
      E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information');

      // Benefits eligibility
      client
        .expect.element('input[name="chapter33"]').to.be.present;
      EduHelpers.completeBenefitsSelection(client, EduHelpers.testValues, true);
      advance();
      E2eHelpers.expectNavigateAwayFrom(client, '/benefits-elibility/benefits-selection');

      // Service periods page.
      client
        .expect.element('input[name="serviceBranch"]').to.be.visible;
      EduHelpers.completeServicePeriods(client, EduHelpers.testValues, true);
      advance();
      E2eHelpers.expectNavigateAwayFrom(client, '/military-history/service-periods');

      // Military service page.
      client
        .expect.element('input[name="serviceAcademyGraduationYear"]').to.be.visible;
      EduHelpers.completeMilitaryService(client, EduHelpers.testValues, true);
      advance();
      E2eHelpers.expectNavigateAwayFrom(client, '/military-history/military-service');

      // ROTC History
      advance();
      E2eHelpers.expectNavigateAwayFrom(client, '/military-history/rotc-history');

      // Contributions
      advance();
      E2eHelpers.expectNavigateAwayFrom(client, '/military-history/contributions');

      // Education history
      client.click('input[name="highSchoolOrGedCompletionDateYear"]');
      advance();
      E2eHelpers.expectNavigateAwayFrom(client, '/education-history/education-information');

      // Employment history
      advance();
      E2eHelpers.expectNavigateAwayFrom(client, '/employment-history/employment-information');

      // School selection
      advance();
      E2eHelpers.expectNavigateAwayFrom(client, '/school-selection/school-information');

      // Contact information page.
      client
        .expect.element('select[name="country"]').to.be.visible;
      EduHelpers.completeContactInformation(client, EduHelpers.testValues, true);
      advance();
      E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/contact-information');

      // Secondary contact page
      advance();
      E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/secondary-contact');

      // Direct deposit page
      advance();
      E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/direct-deposit');

      // Review and Submit Page.
      client
        .click('input[name="privacyAgreement"]');

      advance();
      client.expect.element('.js-test-location').attribute('data-location')
        .to.not.contain('/review-and-submit').before(Timeouts.submission);

      // Submit message
      client
        .expect.element('.edu-benefits-submit-success').to.be.visible;

      client.end();
    }
  );
}
