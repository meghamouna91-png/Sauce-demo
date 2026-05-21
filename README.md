# Sauce Labs E-commerce Checkout Test Suite

## Project Overview

This is an automated test suite for the Sauce Labs demo e-commerce platform (`https://www.saucedemo.com`), focusing on comprehensive testing of the checkout workflow. The suite validates the complete purchase flow: cart review, checkout information entry, order overview, and order completion across multiple browsers.

**Target Application**: Sauce Labs Demo Store  
**Primary Use Case**: Automated QA testing for e-commerce checkout functionality  
**Test Scope**: Happy path flows, validation scenarios, error handling, and edge cases  
**Target Users**: QA engineers, automation engineers, CI/CD pipelines

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|----------|
| **Playwright** | `^1.59.1` | Browser automation framework for cross-browser testing |
| **Node.js** | (requires `@types/node ^25.6.0`) | JavaScript runtime environment |
| **TypeScript** | (via `@types/node`) | Type safety for test scripts |
| **HTML Reporter** | (built-in Playwright) | Test report generation |

**Build System**: CommonJS  
**Package Manager**: npm (or yarn)

---

## Prerequisites

Before running tests locally, ensure you have installed:

- **Node.js** (LTS version recommended, minimum v16.x)
- **npm** (v8.x or higher) or **yarn** (v3.x or higher)
- **Git** (for cloning the repository)

### Verify Installation

```bash
node --version    # Should output v16.x or higher
npm --version     # Should output v8.x or higher
```