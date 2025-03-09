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

---

# Chrome Extensions Privacy Policy

_Effective Date: March 09, 2025_

I respect and value your privacy. This Privacy Policy describes how I handle and protect your personal information in relation to your use of my Google Chrome extension(s).

## Information Collection

My Google Chrome Extensions do not collect any personal information from users. I do not gather, store, or transmit any data that can be used to personally identify you, such as your name, email address, or location. Since no data is collected, none of your data is sold to third parties.

## Links to Other Websites

My Google Chrome Extensions may contain links to other websites not operated by me. This Privacy Policy does not cover how that website processes personal information. I encourage you to review the Privacy Policy of every website that you visit.

## Changes to this Privacy Policy

I reserve the right to amend this Privacy Policy at any time. Any changes will be effective immediately upon posting the revised Privacy Policy, and the "Effective Date" above will be updated. You are advised to review this Privacy Policy periodically for any changes.

By using my Google Chrome Extensions, you signify your consent and agreement to the terms of this Privacy Policy. If you do not agree with this Privacy Policy, please refrain from using my Google Chrome Extensions.

## Feedback

If you have questions or concerns about this Privacy Policy, you can contact me by [email](mailto:guerzoni.guilherme@gmail.com).
