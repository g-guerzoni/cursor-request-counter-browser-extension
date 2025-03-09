# Cursor Request Counter Browser Extension

A browser extension to monitor your Cursor API usage, including request counts and token consumption.

![screenshot (1)](https://github.com/user-attachments/assets/b625686a-e21d-4628-8b41-abe95fe737e1)

## Features

- Real-time tracking of API requests made to Cursor.so
- Visual progress bar showing request usage
- Color-coded indicators for usage levels:
  - Green: Normal usage (< 70%)
  - Orange: Warning zone (70-89%)
  - Red: Critical zone (90%+)
- Token usage tracking
- Easy access to Cursor settings
- Automatic refresh functionality

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

## Development

- Run development build with watch mode:
```bash
npm run dev
```

- Build for production:
```bash
npm run build
```

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
