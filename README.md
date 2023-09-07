# Lit Components + Tailwind + Vite

## Description

This monorepo serves as learning project for studying Web Components and Lit Components. It consists of two main workspaces:

1. **Simple Timestamp**

2. **Autocomplete / Combobox component** [Not Yet Implemented]

3. **Demo**

## Workspaces

- [`simple-timestamp`](./packages/simple-timestamp): The timestamp component library workspace.
- [`demo`](./packages/demo): A demo app demonstrating the usage of the custom Web Component.
- [`autocomplete-combobox`](./packages/autocomplete-combobox): *empty*

## Installation and Usage

1. Clone the repository:

   ```sh
   git clone https://github.com/RomanenkoStud/study-web-components.git
   ```

2. Navigate to the project directory:

    ```sh
    cd study-web-components
    ```

3. Install dependencies:

    ```sh
    npm install
    ```

4. To start the demo server:
    
    ```sh
    npm run dev -w demo
    ```

5. Open your web browser and navigate to http://localhost:5173 to access the page.

## Optional

To install simple-timestamp library as seperate package run:

```sh
npm i @romanenko.pavlo/simple-timestamp
```
