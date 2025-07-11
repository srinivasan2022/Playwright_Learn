import { test, expect } from '@playwright/test';
 
test('Inventory Report - Stock History Filter Test', async ({ page }) => {
  await page.goto('https://dreamspos.dreamstechnologies.com/html/template/index.html');
 
  await page.getByRole('link', { name: ' Inventory Report' }).click();
  await page.getByRole('link', { name: 'Inventory Report', exact: true }).click();
  await page.getByRole('link', { name: 'Stock History' }).nth(1).click();
 
  // Select date range
  await page.getByRole('textbox', { name: 'dd/mm/yyyy - dd/mm/yyyy' }).click();
  await page.getByText('Last 30 Days').click();
 
  // Click the 1st dropdown (likely the staff or person selector)
  await page.locator('.select2-container').first().click();
  await page.getByRole('option', { name: 'Carl Evans' }).click();
 
  // Click the 2nd dropdown (likely payment method)
  await page.locator('.select2-container').nth(1).click();
  await page.getByRole('option', { name: 'Paypal' }).click();
});