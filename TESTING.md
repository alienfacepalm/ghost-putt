# Testing Guide

This project uses Jest for unit and component tests, and Playwright for end-to-end (e2e) tests.

## Setup

Install dependencies:

```bash
pnpm install
```

## Running Tests

### Unit Tests

Run all unit tests:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test --watch
```

Run tests with UI:
```bash
pnpm test:ui
```

Run tests with coverage:
```bash
pnpm test:coverage
```

### E2E Tests

Run all e2e tests:
```bash
pnpm test:e2e
```

Run e2e tests with UI:
```bash
pnpm test:e2e:ui
```

Run e2e tests in debug mode:
```bash
pnpm test:e2e:debug
```

## Test Structure

### Unit Tests

Unit tests are located alongside the code they test:

```
src/
├── utils/
│   ├── __tests__/
│   │   └── room-code.test.ts
│   └── room-code.ts
├── services/
│   └── __tests__/
│       └── game-logic.test.ts
└── components/
    └── ui/
        └── __tests__/
            └── button.test.tsx
```

### E2E Tests

E2E tests are located in the `e2e/` directory:

```
e2e/
├── app.spec.ts          # Main app flow tests
├── game-flow.spec.ts    # Game-specific tests
├── room-code.spec.ts    # Room code functionality
└── accessibility.spec.ts # Accessibility tests
```

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from '@jest/globals';
import { generateRoomCode } from '../room-code';

describe('generateRoomCode', () => {
  it('should generate a 6-character code', () => {
    const code = generateRoomCode();
    expect(code).toHaveLength(6);
  });
});
```

### Component Test Example

```typescript
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('should render button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('should create a room', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholderText(/enter your name/i).fill('Test Player');
  await page.getByRole('button', { name: /create room/i }).click();
  await expect(page.getByText(/room code/i)).toBeVisible();
});
```

## Why Jest Instead of Vitest?

While this project uses Rspack for building, we chose Jest for testing because:
- **Build-tool agnostic**: Jest works independently of your build tool
- **No Vite dependency**: Avoids mixing Rspack (build) with Vite (testing)
- **Mature ecosystem**: Well-established with excellent React support
- **SWC integration**: Uses @swc/jest for fast TypeScript/JSX transformation (similar to Rspack's SWC usage)

## Best Practices

1. **Test Isolation**: Each test should be independent and not rely on other tests
2. **Clear Test Names**: Use descriptive test names that explain what is being tested
3. **Arrange-Act-Assert**: Structure tests with clear setup, action, and assertion phases
4. **Mock External Dependencies**: Mock WebRTC, localStorage, and other browser APIs when needed
5. **Test User Behavior**: Focus on testing user-facing behavior rather than implementation details
6. **Keep Tests Fast**: Unit tests should run quickly; use mocks for slow operations
7. **Coverage Goals**: Aim for high coverage of critical business logic and utilities

## Coverage

View coverage reports after running `pnpm test:coverage`. The coverage report will be available in the `coverage/` directory.

## Continuous Integration

Tests should pass in CI environments. The e2e tests will automatically start the dev server if not already running.

## Debugging Tests

### Unit Tests

Use `console.log` or breakpoints in your IDE. For watch mode:
```bash
pnpm test:watch
```

### E2E Tests

Use Playwright's debug mode:
```bash
pnpm test:e2e:debug
```

Or use the Playwright Inspector:
```bash
PWDEBUG=1 pnpm test:e2e
```

## Common Issues

### Tests failing due to module resolution

Ensure `tsconfig.json` includes test files and path aliases are configured correctly.

### E2E tests timing out

Increase timeout in `playwright.config.ts` or add explicit waits in tests.

### Mock issues

Ensure mocks are properly reset between tests using `beforeEach` hooks.

