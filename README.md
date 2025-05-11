# Jimmy VSCode Extension

Jimmy is a modular Visual Studio Code extension designed to enhance your development workflow.
It allows users to enable or disable individual modules at runtime, providing a customizable experience tailored to your needs.

## Modules

### 1. Redux-Saga Module

This module offers a full suite of features for using custom redux-saga architectire:

- Commands
  - Create new module
  - Add an action to the existing module (with or without saga)
  - Add a reducer and selectors to the module without them

### 2. React-Native Module

Currently includes:

- Commands
  - Create new component with directory pick and useStyles hook
- Snippets
  - Test snippet that do nothing :)

_Note: Additional features are under development._

### 3. React Module

A placeholder module set up for future enhancements. Contributions are welcome!

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ODMyk/jimmy-vscode.git
   ```

2. Navigate to the project directory:

   ```bash
   cd jimmy-vscode
   ```

3. Install dependencies:

   ```bash
   yarn install
   ```

4. Compile the extension:

   ```bash
   npx vsce package
   ```

5. Install extension using VSCode (from VSIX)

### Usage

Access the extension's features through the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS) and search for "Jimmy". From there, you can:

- Enable/Disable specific modules
- Run enabled commands

## Contributing

We welcome contributions to enhance Jimmy's functionality:

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature/YourFeature
   ```

3. Commit your changes:

   ```bash
   git commit -m 'Add YourFeature'
   ```

4. Push to the branch:

   ```bash
   git push origin feature/YourFeature
   ```

5. Open a pull request.

Please ensure your code adheres to the project's coding standards.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.MD) file for details.

## Acknowledgments

Special thanks to all contributors and users who support the development of Jimmy.
