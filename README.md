# Cursor Request Counter Browser Extension

A browser extension to monitor your Cursor API usage, including request counts, token consumption and usage.

[![Try out the extension in the Google Chrome Store.](images/chrome-store.png)](https://chromewebstore.google.com/detail/cursor-request-counter/dafeoklakifgkoehabbdfljakipohaii)

![Screenshot 1](https://github.com/user-attachments/assets/a18dab00-9855-4a7e-9a1f-f6252cfb7c8f)

## Features

- Real-time tracking of API requests made to Cursor.com
  - Premium requests
  - Usage based counter ($)
- Visual progress bar showing request usage
- Token usage tracking
- Color-coded indicators for usage levels:
  - Green: Normal usage (< 75%)
  - Orange: Warning zone (75-94%)
  - Red: Critical zone (95%+)

## Installation

1. Clone this repository:
```bash
git clone https://github.com/g-guerzoni/cursor-request-counter-browser-extension.git
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load the extension in your browser:
   - Open Chrome/Edge and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder from this project

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This is not an official product of Cursor. It is a personal project created to help users monitor their API usage. 

## Keywords

cursor, cursor ai, cursor.com, api monitor, usage tracker, request counter, token counter, api limit monitor, real-time monitoring, productivity tool, ai tool, premium usage, gpt, chat gpt, claude, claude max
---

## Changelog

### v2.0.0
- Refactoring the entire codebase by organizing the folder structures and splitting files.
- Feat: Creating bundles while building with webpack.

### v1.1.0
- Feat: Introducing usage based limits and pricing 

### v1.0.2
- Feat: Change the progress bar color based on the usage percentage.
- Fix: Replacing `numRequestsTotal` by `numRequests`.
- Doc: Adding extension screenshots

### v1.0.1
- Fix: Open Github repo link in a new tab.

### v1.0.0
- Initial codebase.
