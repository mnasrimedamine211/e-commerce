﻿# E-Commerce Products Frontend

This project is a frontend application for managing and displaying e-commerce products. It is built using **Angular (v18.2.0)**, **Ng-Zorro (v18.2.1)**, and **Tailwind CSS (v3.4.17)** for a responsive and user-friendly design.

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 14 or above)
- **npm** (Node Package Manager)
- **Angular CLI** (v18.2.3)

---

## Features

- **Product Management:** View, add, remove, and update products.
- **Dynamic Styling:** Built with **Ng-Zorro** for UI components and **Tailwind CSS** for responsive layouts.
- **Server-Side Rendering (Optional):** Pre-rendering capabilities for improved SEO and performance.
- **Custom Themes:** Uses a `.less` theme file for easy customization of styles.

---

## Project Structure

```plaintext
frontend/
├── src/
│   ├── app/                 # Application modules and components
│   ├── assets/              # Static assets
│   ├── theme.less           # Custom theme styles
│   ├── styles.css           # Global styles
│   └── main.ts              # Application entry point
├── angular.json             # Angular project configuration
├── package.json             # Project dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Navigate to the frontend folder:**

   ```bash
   cd frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

---

## Running the Project

1. **Development Mode:**
   Start the development server with hot reloading:

   ```bash
   ng serve
   ```

   The application will be available at: [http://localhost:4200](http://localhost:4200).

2. **Production Build:**
   Build the project for production:

   ```bash
   npm run build
   ```

   The output will be in the `dist/frontend` directory.

3. **Server-Side Rendering (SSR):**
   Build and serve the application with SSR:
   ```bash
   npm run serve:ssr:frontend
   ```

---

## Styling

- **Ng-Zorro (v18.2.1):** UI components are styled using **ng-zorro-antd**.
  - CSS is included from `node_modules/ng-zorro-antd/ng-zorro-antd.min.css`.
- **Tailwind CSS (v3.4.17):** For utility-first CSS styling.
- **Custom Themes:** Modify `src/theme.less` to change the theme.

---

## Scripts

- **Start Development Server:**
  ```bash
  ng serve or npm start
  ```
- **Run Tests:**
  ```bash
  npm test
  ```
- **Build for Production:**
  ```bash
  npm run build
  ```
- **Serve with SSR:**
  ```bash
  npm run serve:ssr:frontend
  ```

---

## Dependencies

### Main Dependencies

- **Angular:** v18.2.0
- **Ng-Zorro:** v18.2.1
- **Tailwind CSS:** v3.4.17

### Development Dependencies

- **Typescript:** v5.5.2
- **Autoprefixer:** v10.4.20
- **PostCSS:** v8.4.49

Refer to `package.json` for the full list of dependencies.

---

## Environment-Specific Configurations

1. **Development:**

   - Non-optimized builds with source maps for easier debugging.

2. **Production:**
   - Optimized builds with hashed filenames and minified output.

Configuration settings can be found in `angular.json`.

---

## License

This project is licensed under the MIT License.

---

## Contributing

Feel free to fork the repository and submit pull requests. For major changes, please open an issue to discuss your ideas.

---

## Issues

If you encounter any issues, please open an issue on the repository or contact the maintainers.
