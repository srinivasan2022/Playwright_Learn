import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
 
// Read from ".env" file.
dotenv.config({ path: path.resolve(__dirname, '.env') });

test('Login to OneDrive and open My Files', async ({ page, context }) => {
  const email = process.env.onedrive_email;
  const password = process.env.onedrive_password;
  // Go to OneDrive online cloud storage landing page
  await page.goto('https://www.microsoft.com/en-in/microsoft-365/onedrive/online-cloud-storage');

  // Click on "Sign in" which opens a new tab
  const [loginPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: 'Sign in - Login to OneDrive' }).click()
  ]);

  // Wait for the iframe and interact with it
  const signInFrame = await loginPage.frameLocator('iframe[title="Sign in"]');

  // Fill in email/phone
  await signInFrame.getByRole('textbox', { name: /email, phone, or skype/i }).fill(email || '');

  await signInFrame.getByRole('button', { name: 'Next' }).click();

  // Wait for main page login fields
  await loginPage.waitForLoadState('domcontentloaded');
  await loginPage.getByRole('textbox', { name: /enter the password/i }).fill(password || '');
  await loginPage.getByRole('button', { name: 'Sign in' }).click();

  // Confirm "Stay signed in?" prompt
  try {
    await loginPage.getByRole('button', { name: 'Yes' }).click({ timeout: 5000 });
  } catch (e) {
    console.log('No "Yes" prompt appeared after login.');
  }

  // Go to OneDrive file location
  await loginPage.goto('https://cloudslize-my.sharepoint.com/');

  // Open "My files"
  await loginPage.getByRole('link', { name: 'My files', exact: true }).click();
  await expect(loginPage.getByRole('link', { name: 'My files', exact: true })).toBeVisible();

});
