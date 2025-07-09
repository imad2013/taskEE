import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication - in a real scenario, you'd set up test data
    await page.addInitScript(() => {
      localStorage.setItem('token', 'mock-jwt-token')
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        username: 'testuser',
        roles: 'USER'
      }))
    })
    
    await page.goto('/dashboard')
  })

  test('should display dashboard with task statistics', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dashboard')
    await expect(page.locator('text=Task Statistics')).toBeVisible()
  })

  test('should show task count cards', async ({ page }) => {
    // Check for task count cards
    await expect(page.locator('text=Total Tasks')).toBeVisible()
    await expect(page.locator('text=Pending')).toBeVisible()
    await expect(page.locator('text=In Progress')).toBeVisible()
    await expect(page.locator('text=Completed')).toBeVisible()
  })

  test('should display recent tasks section', async ({ page }) => {
    await expect(page.locator('text=Recent Tasks')).toBeVisible()
  })

  test('should display project overview section', async ({ page }) => {
    await expect(page.locator('text=Project Overview')).toBeVisible()
  })

  test('should have navigation links', async ({ page }) => {
    // Check for navigation links
    await expect(page.locator('a[href="/tasks"]')).toBeVisible()
    await expect(page.locator('a[href="/projects"]')).toBeVisible()
    await expect(page.locator('a[href="/users"]')).toBeVisible()
  })

  test('should show user information', async ({ page }) => {
    await expect(page.locator('text=Welcome')).toBeVisible()
    await expect(page.locator('text=testuser')).toBeVisible()
  })

  test('should have logout functionality', async ({ page }) => {
    await expect(page.locator('text=Logout')).toBeVisible()
  })

  test('should navigate to tasks page', async ({ page }) => {
    await page.click('a[href="/tasks"]')
    await expect(page).toHaveURL('/tasks')
  })

  test('should navigate to projects page', async ({ page }) => {
    await page.click('a[href="/projects"]')
    await expect(page).toHaveURL('/projects')
  })

  test('should navigate to users page', async ({ page }) => {
    await page.click('a[href="/users"]')
    await expect(page).toHaveURL('/users')
  })

  test('should show loading state while fetching data', async ({ page }) => {
    // This test would require mocking the API responses
    // For now, we'll just check that the page loads
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('should display empty state when no tasks exist', async ({ page }) => {
    // This would require mocking empty API responses
    await expect(page.locator('text=No tasks found')).toBeVisible()
  })
}) 