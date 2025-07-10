import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
 
// Read from ".env" file.
//dotenv.config({ path: path.resolve(__dirname, '.env') });

test('Login to OneDrive and download demo.txt file', async ({ page, context }) => {
  const email = process.env.onedrive_email  // fallback for demo
  const password = process.env.onedrive_password  // fallback for demo

  // Step 1: Go to OneDrive landing page
  await page.goto('https://www.microsoft.com/en-in/microsoft-365/onedrive/online-cloud-storage');

  // Step 2: Click "Sign in", which opens a new tab
  const [loginPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: 'Sign in - Login to OneDrive' }).click()
  ]);

  // Step 3: Interact with login iframe
  const signInFrame = await loginPage.frameLocator('iframe[title="Sign in"]');
  await signInFrame.getByRole('textbox', { name: /email, phone, or skype/i }).fill('srini@cloudslize.com');
  await signInFrame.getByRole('button', { name: 'Next' }).click();

  // Step 4: Fill password on main login page
  await loginPage.waitForLoadState('domcontentloaded');
  await loginPage.getByRole('textbox', { name: /enter the password/i }).fill('Seenu2002@');
  await loginPage.getByRole('button', { name: 'Sign in' }).click();

  // Step 5: Handle "Stay signed in?"
  try {
    await loginPage.getByRole('button', { name: 'Yes' }).click({ timeout: 5000 });
  } catch (e) {
    console.log('No "Stay signed in?" prompt appeared.');
  }

  // Step 6: Navigate to OneDrive storage
  await loginPage.goto('https://cloudslize-my.sharepoint.com/');

  // Step 7: Click on "My files"
  await loginPage.getByRole('link', { name: 'My files', exact: true }).click();

  // Step 8: Locate the file row for demo.txt
  const fileRow = loginPage.getByRole('gridcell', { name: /demo\.txt/i }).first();
  await fileRow.hover();

  // Step 9: Click "More actions" (⋯)
  await fileRow.locator('button[aria-label*="More actions"]').click();

  // Step 10: Click Download and wait for the file to download
  const downloadPromise = loginPage.waitForEvent('download');
  await loginPage.getByRole('menuitem', { name: /Download/i }).click();
  const download = await downloadPromise;

  // Step 11: Save the downloaded file
  await download.saveAs('downloads/demo.txt');
  console.log(`File downloaded to: downloads/demo.txt`);
});
