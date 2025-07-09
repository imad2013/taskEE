import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should navigate to login page', async ({ page }) => {
    await page.click('text=Login')
    await expect(page).toHaveURL('/login')
    await expect(page.locator('h1')).toContainText('Login')
  })

  test('should navigate to register page', async ({ page }) => {
    await page.click('text=Register')
    await expect(page).toHaveURL('/register')
    await expect(page.locator('h1')).toContainText('Register')
  })

  test('should show validation errors for empty login form', async ({ page }) => {
    await page.goto('/login')
    await page.click('button[type="submit"]')
    
    // Wait for validation errors
    await expect(page.locator('text=Username is required')).toBeVisible()
    await expect(page.locator('text=Password is required')).toBeVisible()
  })

  test('should show validation errors for empty register form', async ({ page }) => {
    await page.goto('/register')
    await page.click('button[type="submit"]')
    
    // Wait for validation errors
    await expect(page.locator('text=Username is required')).toBeVisible()
    await expect(page.locator('text=Password is required')).toBeVisible()
  })

  test('should fill and submit login form', async ({ page }) => {
    await page.goto('/login')
    
    // Fill the form
    await page.fill('input[name="username"]', 'testuser')
    await page.fill('input[name="password"]', 'password123')
    
    // Submit the form
    await page.click('button[type="submit"]')
    
    // Check that form values are filled
    await expect(page.locator('input[name="username"]')).toHaveValue('testuser')
    await expect(page.locator('input[name="password"]')).toHaveValue('password123')
  })

  test('should fill and submit register form', async ({ page }) => {
    await page.goto('/register')
    
    // Fill the form
    await page.fill('input[name="username"]', 'newuser')
    await page.fill('input[name="password"]', 'newpassword123')
    await page.selectOption('select[name="role"]', 'USER')
    
    // Submit the form
    await page.click('button[type="submit"]')
    
    // Check that form values are filled
    await expect(page.locator('input[name="username"]')).toHaveValue('newuser')
    await expect(page.locator('input[name="password"]')).toHaveValue('newpassword123')
    await expect(page.locator('select[name="role"]')).toHaveValue('USER')
  })

  test('should navigate between login and register pages', async ({ page }) => {
    await page.goto('/login')
    
    // Click link to register
    await page.click('text=Don\'t have an account?')
    await expect(page).toHaveURL('/register')
    
    // Click link back to login
    await page.click('text=Already have an account?')
    await expect(page).toHaveURL('/login')
  })

  test('should show loading state during form submission', async ({ page }) => {
    await page.goto('/login')
    
    // Fill the form
    await page.fill('input[name="username"]', 'testuser')
    await page.fill('input[name="password"]', 'password123')
    
    // Submit and check for loading state
    await page.click('button[type="submit"]')
    
    // The button should be disabled or show loading text
    await expect(page.locator('button[type="submit"]')).toBeDisabled()
  })
}) 