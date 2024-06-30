# Code Editor

This project is a code editor built using `React, Tailwind CSS, and PrismJS`. It leverages the `textarea` element for text input and provides a rich set of features to enhance the coding experience, including syntax highlighting, undo/redo functionality, custom indentation management, and more.

## Features

- **Syntax Highlighting**: Implemented using PrismJS.
- **Undo/Redo**: Supports undo `(ctrl + z)` and redo `(ctrl + y)` operations to navigate through the editing history.
- **Tab Indentation**: Inserts white spaces when the Tab key is pressed, maintaining code structure.
- **Copy Line Down**: Duplicates the current line when `shift + alt + ↓` is pressed.
- **Auto Closing Brackets/Quotes**: Automatically inserts closing brackets and quotes.
- **Maintain Indentation**: Preserves the current line's indentation level when Enter is pressed.

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js
- npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/code-editor.git
   cd code-editor
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Start the development server
   ```sh
   npm run dev
   ```

### Key Bindings

- Undo: `ctrl + z`
- Redo: `ctrl + y`
- Insert Tab: `tab`
- Copy Line Down: `shift + alt + ↓`
- Auto Closing Brackets/Quotes: Automatically handles closing pairs when typing (, [, {, ", ', `
- Maintain Indentation: Ensures the new line matches the indentation of the previous line when `enter` is pressed.
