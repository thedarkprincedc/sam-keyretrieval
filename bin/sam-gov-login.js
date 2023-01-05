const { chromium } = require('playwright');
const { generateToken } = require("authenticator");
const prompt = require('./prompts/sam-gov-prompt');
const { readEmail } = require('./sam-gov-email-reader');
const config = require("config");

(async () => {
  await prompt.cliPrompt(config.samdotgov)

  const browser = await chromium.launch(config.chromium);

  const emailAddress = config.samdotgov.emailAddress;
  const password = config.samdotgov.password;
  const secretKey = config.samdotgov.secretKey;

  const otp = generateToken(secretKey);
  console.log('Authenticator (One-Time Password): %s', otp)

  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://sam.gov/content/home');
  await page.getByRole('button', { name: 'Close Modal' }).click();
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.getByRole('button', { name: 'Accept' }).click();
  await page.getByLabel('Email address').click();
  await page.getByLabel('Email address').fill(emailAddress);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByText('Remember this browser').click();
  await page.getByLabel('One-time code').click();
  await page.getByLabel('One-time code').fill(otp);
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('link', { name: 'Profile' }).click();
  await page.getByText(config.samdotgov.emailAddress).click();

  await page.locator('#eye-icon-api-key-0').click()

  await page.waitForTimeout(config.email.waitToCheckEmail)
  const emailOtp = await readEmail()
  console.log("Email (One-Time Password): %s", emailOtp)
  
  await page.locator('#password-input').fill(emailOtp)
  await page.getByRole('button', { name: 'Submit' }).click();

  await page.waitForTimeout(10000)
  const key = await page.locator('input#input-api-key-0').getAttribute('value')
  
  console.log("\nSAM.gov (API Key): %s\n", key)
  await page.getByRole('link', { name: 'Sign Out' }).click();
  // ---------------------
  await context.close();
  await browser.close();
})();