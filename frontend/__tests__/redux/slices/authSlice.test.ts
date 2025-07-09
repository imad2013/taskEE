import { configureStore } from '@reduxjs/toolkit'
import authReducer, { login, register, logout, clearError } from '../../../redux/slices/authSlice'
import { User } from '../../../types'

// Mock the storage utility
jest.mock('../../../utils/storage', () => ({
  getStorageItem: jest.fn(),
  setStorageItem: jest.fn(),
  removeStorageItem: jest.fn(),
}))

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  })
}

describe('Auth Slice', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
    jest.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = store.getState().auth
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('Login Action', () => {
    it('should handle login.pending', async () => {
      const credentials = { username: 'testuser', password: 'password123' }
      
      // Dispatch the pending action
      store.dispatch({ type: login.pending.type, payload: credentials })
      
      const state = store.getState().auth
      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should handle login.fulfilled', async () => {
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        roles: 'USER',
      }
      const mockResponse = {
        token: 'test-jwt-token',
        username: 'testuser',
        roles: 'USER',
      }

      // Dispatch the fulfilled action
      store.dispatch({ type: login.fulfilled.type, payload: mockResponse })
      
      const state = store.getState().auth
      expect(state.loading).toBe(false)
      expect(state.user).toEqual(mockUser)
      expect(state.token).toBe('test-jwt-token')
      expect(state.isAuthenticated).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should handle login.rejected', async () => {
      const errorMessage = 'Invalid credentials'
      
      // Dispatch the rejected action
      store.dispatch({ 
        type: login.rejected.type, 
        error: { message: errorMessage },
        payload: undefined,
        meta: { requestId: 'test', arg: { username: 'testuser', password: 'wrong' } }
      })
      
      const state = store.getState().auth
      expect(state.loading).toBe(false)
      expect(state.error).toBe(errorMessage)
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe('Register Action', () => {
    it('should handle register.pending', async () => {
      const userData = { username: 'newuser', password: 'password123', role: 'USER' }
      
      // Dispatch the pending action
      store.dispatch({ type: register.pending.type, payload: userData })
      
      const state = store.getState().auth
      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should handle register.fulfilled', async () => {
      // Dispatch the fulfilled action
      store.dispatch({ type: register.fulfilled.type, payload: {} })
      
      const state = store.getState().auth
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })

    it('should handle register.rejected', async () => {
      const errorMessage = 'Username already exists'
      
      // Dispatch the rejected action
      store.dispatch({ 
        type: register.rejected.type, 
        error: { message: errorMessage },
        payload: undefined,
        meta: { requestId: 'test', arg: { username: 'existinguser', password: 'password123' } }
      })
      
      const state = store.getState().auth
      expect(state.loading).toBe(false)
      expect(state.error).toBe(errorMessage)
    })
  })

  describe('Logout Action', () => {
    it('should clear auth state on logout', () => {
      // First set some auth state
      store.dispatch({ 
        type: login.fulfilled.type, 
        payload: { token: 'test-token', username: 'testuser', roles: 'USER' }
      })
      
      // Then logout
      store.dispatch(logout())
      
      const state = store.getState().auth
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('Clear Error Action', () => {
    it('should clear error state', () => {
      // First set an error
      store.dispatch({ 
        type: login.rejected.type, 
        error: { message: 'Test error' },
        payload: undefined,
        meta: { requestId: 'test', arg: {} }
      })
      
      // Then clear error
      store.dispatch(clearError())
      
      const state = store.getState().auth
      expect(state.error).toBeNull()
    })
  })
}) 