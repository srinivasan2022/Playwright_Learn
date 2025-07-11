import { test, expect } from '@playwright/test';
 
test('Sales Report Filter Test', async ({ page }) => {
  await page.goto('https://dreamspos.dreamstechnologies.com/html/template/index.html');
 
  await page.getByRole('link', { name: ' Sales Report' }).click();
  await page.getByRole('link', { name: 'Sales Report', exact: true }).click();
 
  await page.getByRole('textbox', { name: 'dd/mm/yyyy - dd/mm/yyyy' }).click();
  await page.getByText('Last 30 Days').click();
 
  // Click supplier dropdown
  await page.locator('.select2-container').first().click();
  await page.getByRole('option', { name: 'Quantum Gadgets' }).click();
 
  // Click product dropdown
  await page.locator('.select2-container').nth(1).click();
  await page.getByRole('option', { name: 'Amazon Echo Dot' }).click();
});
 