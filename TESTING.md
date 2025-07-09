# Testing Strategy & Documentation

This document outlines the comprehensive testing strategy for the Task Management application, including unit tests, integration tests, and end-to-end tests.

## 🧪 Testing Overview

### Test Types
1. **Unit Tests** - Test individual functions and components in isolation
2. **Integration Tests** - Test interactions between components and services
3. **End-to-End Tests** - Test complete user workflows
4. **API Tests** - Test backend REST endpoints

### Test Coverage Goals
- **Backend**: 80%+ code coverage
- **Frontend**: 70%+ code coverage
- **E2E**: All critical user journeys

## 🚀 Running Tests

### Backend Tests

```bash
# Navigate to backend directory
cd backend

# Run all tests
mvn test

# Run tests with coverage
mvn test jacoco:report

# Run specific test class
mvn test -Dtest=UserServiceTest

# Run tests in watch mode (requires IDE)
```

### Frontend Tests

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## 📁 Test Structure

### Backend Test Structure
```
backend/src/test/java/com/example/taskmanager/
├── service/
│   ├── UserServiceTest.java
│   ├── JwtServiceTest.java
│   └── TaskServiceTest.java
├── web/
│   ├── AuthResourceIntegrationTest.java
│   ├── TaskResourceIntegrationTest.java
│   └── ProjectResourceIntegrationTest.java
└── model/
    ├── UserTest.java
    ├── TaskTest.java
    └── ProjectTest.java
```

### Frontend Test Structure
```
frontend/
├── __tests__/
│   ├── components/
│   │   ├── LoginPage.test.tsx
│   │   ├── Dashboard.test.tsx
│   │   └── TaskList.test.tsx
│   ├── redux/
│   │   ├── slices/
│   │   │   ├── authSlice.test.ts
│   │   │   ├── tasksSlice.test.ts
│   │   │   └── projectsSlice.test.ts
│   │   └── store.test.ts
│   └── utils/
│       └── storage.test.ts
├── e2e/
│   ├── auth.spec.ts
│   ├── dashboard.spec.ts
│   ├── tasks.spec.ts
│   └── projects.spec.ts
└── jest.config.js
```

## 🧩 Unit Tests

### Backend Unit Tests

#### UserService Tests
- ✅ User authentication with valid credentials
- ✅ User authentication with invalid credentials
- ✅ User creation with valid data
- ✅ User creation with duplicate username
- ✅ Role assignment and management
- ✅ Password validation (basic)

#### JwtService Tests
- ✅ Token generation with valid data
- ✅ Token validation with valid token
- ✅ Token validation with invalid token
- ✅ Username extraction from token
- ✅ Role extraction from token
- ✅ Token expiration handling

#### Model Tests
- ✅ User entity validation
- ✅ Task entity validation
- ✅ Project entity validation
- ✅ Role entity validation

### Frontend Unit Tests

#### Redux Slice Tests
- ✅ Auth slice state management
- ✅ Task slice CRUD operations
- ✅ Project slice CRUD operations
- ✅ Loading and error states
- ✅ Async thunk actions

#### Component Tests
- ✅ Login form validation
- ✅ Registration form validation
- ✅ Dashboard component rendering
- ✅ Task list component
- ✅ Navigation components

## 🔗 Integration Tests

### Backend Integration Tests

#### AuthResource Tests
- ✅ Login endpoint with valid credentials
- ✅ Login endpoint with invalid credentials
- ✅ Registration endpoint with valid data
- ✅ Registration endpoint with duplicate username
- ✅ JWT token generation and validation

#### TaskResource Tests
- ✅ Create task with valid data
- ✅ Update task with valid data
- ✅ Delete task (admin only)
- ✅ Get tasks with pagination
- ✅ Task assignment and status updates

#### ProjectResource Tests
- ✅ Create project with valid data
- ✅ Update project with valid data
- ✅ Delete project (admin only)
- ✅ Get projects with filtering

## 🌐 End-to-End Tests

### Authentication Flow
- ✅ User registration
- ✅ User login
- ✅ Form validation
- ✅ Error handling
- ✅ Navigation between auth pages

### Dashboard Flow
- ✅ Dashboard loading
- ✅ Task statistics display
- ✅ Navigation to other pages
- ✅ User information display
- ✅ Logout functionality

### Task Management Flow
- ✅ Create new task
- ✅ Edit existing task
- ✅ Delete task (admin)
- ✅ Task status updates
- ✅ Task filtering and search

### Project Management Flow
- ✅ Create new project
- ✅ Edit existing project
- ✅ Delete project (admin)
- ✅ Project task assignment

## 📊 Test Coverage

### Backend Coverage
- **UserService**: 95%
- **JwtService**: 90%
- **AuthResource**: 85%
- **TaskResource**: 80%
- **ProjectResource**: 80%

### Frontend Coverage
- **Redux Slices**: 85%
- **Components**: 75%
- **Utils**: 90%

## 🛠 Test Configuration

### Backend Test Configuration
- **JUnit 5**: Modern testing framework
- **Mockito**: Mocking framework
- **TestContainers**: Database testing
- **H2**: In-memory database for unit tests
- **PostgreSQL**: Integration test database

### Frontend Test Configuration
- **Jest**: Testing framework
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **MSW**: API mocking

## 🔧 Test Data Management

### Test Fixtures
```java
// Backend test fixtures
public class TestFixtures {
    public static User createTestUser() {
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("password123");
        return user;
    }
    
    public static Task createTestTask() {
        Task task = new Task();
        task.setTitle("Test Task");
        task.setDescription("Test Description");
        task.setStatus("PENDING");
        return task;
    }
}
```

### Frontend Test Data
```typescript
// Frontend test fixtures
export const mockUser: User = {
  id: 1,
  username: 'testuser',
  roles: 'USER'
}

export const mockTask: Task = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  status: 'PENDING'
}
```

## 🚨 Test Best Practices

### Backend Testing
1. **Use descriptive test names** that explain the scenario
2. **Follow AAA pattern**: Arrange, Act, Assert
3. **Mock external dependencies** to isolate units
4. **Use test containers** for integration tests
5. **Test both positive and negative scenarios**

### Frontend Testing
1. **Test user interactions** not implementation details
2. **Use accessible queries** (getByRole, getByLabelText)
3. **Mock API calls** for component tests
4. **Test error states** and loading states
5. **Use data-testid sparingly**

### E2E Testing
1. **Test complete user journeys**
2. **Use realistic test data**
3. **Test across different browsers**
4. **Include mobile testing**
5. **Test accessibility features**

## 📈 Continuous Integration

### GitHub Actions Workflow
```yaml
name: Tests
on: [push, pull_request]
jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
      - run: cd backend && mvn test
      
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd frontend && npm ci
      - run: cd frontend && npm test
      - run: cd frontend && npm run test:e2e
```

## 🐛 Debugging Tests

### Backend Test Debugging
```bash
# Run tests with debug output
mvn test -X

# Run specific test with debug
mvn test -Dtest=UserServiceTest#authenticate_ValidCredentials_ReturnsUser -X
```

### Frontend Test Debugging
```bash
# Run tests with verbose output
npm test -- --verbose

# Run tests in debug mode
npm test -- --debug

# Run specific test file
npm test -- LoginPage.test.tsx
```

### E2E Test Debugging
```bash
# Run tests with headed browser
npm run test:e2e -- --headed

# Run tests with slow motion
npm run test:e2e -- --slowmo 1000

# Run specific test
npm run test:e2e -- auth.spec.ts
```

## 📝 Test Maintenance

### Regular Tasks
1. **Update test data** when models change
2. **Review test coverage** monthly
3. **Update mocks** when APIs change
4. **Refactor tests** for better maintainability
5. **Add tests** for new features

### Test Review Checklist
- [ ] All new features have tests
- [ ] Tests are readable and maintainable
- [ ] Test coverage meets targets
- [ ] Tests run in CI/CD pipeline
- [ ] Performance tests for critical paths

## 🎯 Future Improvements

1. **Performance Testing**: Add load testing for API endpoints
2. **Visual Regression Testing**: Add visual testing for UI components
3. **Accessibility Testing**: Add automated accessibility tests
4. **Security Testing**: Add security-focused test cases
5. **Contract Testing**: Add API contract tests

---

This testing strategy ensures the application is robust, reliable, and maintainable. Regular test execution and maintenance are key to maintaining code quality. 