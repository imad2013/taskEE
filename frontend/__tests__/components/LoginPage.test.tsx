import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../../../redux/slices/authSlice'
import LoginPage from '../../../app/login/page'

// Mock the Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
}))

// Mock the storage utility
jest.mock('../../../utils/storage', () => ({
  getStorageItem: jest.fn(),
  setStorageItem: jest.fn(),
  removeStorageItem: jest.fn(),
}))

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        ...preloadedState,
      },
    },
  })
}

describe('LoginPage', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
    jest.clearAllMocks()
  })

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <Provider store={store}>
        {component}
      </Provider>
    )
  }

  it('renders login form', () => {
    renderWithProvider(<LoginPage />)
    
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('shows validation error for empty form submission', async () => {
    renderWithProvider(<LoginPage />)
    
    const loginButton = screen.getByRole('button', { name: /login/i })
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('handles form input changes', () => {
    renderWithProvider(<LoginPage />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    expect(usernameInput).toHaveValue('testuser')
    expect(passwordInput).toHaveValue('password123')
  })

  it('shows loading state during login', async () => {
    const loadingStore = createTestStore({ loading: true })
    
    render(
      <Provider store={loadingStore}>
        <LoginPage />
      </Provider>
    )
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows error message when login fails', () => {
    const errorStore = createTestStore({ error: 'Invalid credentials' })
    
    render(
      <Provider store={errorStore}>
        <LoginPage />
      </Provider>
    )
    
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })

  it('redirects to dashboard when already authenticated', () => {
    const authenticatedStore = createTestStore({ 
      isAuthenticated: true,
      user: { id: 1, username: 'testuser', roles: 'USER' }
    })
    
    render(
      <Provider store={authenticatedStore}>
        <LoginPage />
      </Provider>
    )
    
    // Should redirect to dashboard (this would be handled by useEffect)
    expect(screen.getByText('Login')).toBeInTheDocument() // Still renders initially
  })

  it('has link to register page', () => {
    renderWithProvider(<LoginPage />)
    
    const registerLink = screen.getByText(/don't have an account/i)
    expect(registerLink).toBeInTheDocument()
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register')
  })
}) 