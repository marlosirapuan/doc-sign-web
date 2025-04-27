# doc-sign-web

Small web project to sign document with attachment

### Stack

- React 19 (with React Compiler)
- React Router
- Context API
- MantineUI
- Vite & Vitest

### Getting started

Install PNPM (better than npm, yarn etc):

[https://pnpm.io/installation](https://pnpm.io/installation)

or use Docker (orientations below)

### How to run the application

1) Install libs

  ```bash
  pnpm install
  ```

2) Start application

  ```bash
  pnpm dev
  ```

  Access url: https://localhost:5176

3) User test:

  ```
  user1@example.com
  password123
  ```

### How to run tests

Run tests:

  ```bash
  pnpm test
  ```

### Using Docker

Run the app with:

  ```bash
  docker compose up web
  ```

And access the URL:

  ```
  https://localhost:5176
  ```

  Access url: https://localhost:5176

---

Backend for this application:

[https://github.com/marlosirapuan/doc-sign-api](https://github.com/marlosirapuan/doc-sign-api)
