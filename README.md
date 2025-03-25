# Cursor Request Counter

A Chrome extension to track your Cursor AI requests and usage in real-time.

## Features

- Track the number of requests made
- Monitor your remaining requests
- View total tokens used
- Track usage-based premium requests
- Real-time progress bar
- Automatic refresh on settings page
- Dark mode interface

## Installation

1. Clone this repository
```bash
git clone https://github.com/g-guerzoni/cursor-request-counter-browser-extension.git
```

2. Install dependencies
```bash
npm install
```

3. Build the extension
```bash
npm run build
```

4. Load the extension in Chrome
- Open Chrome and navigate to `chrome://extensions`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the `dist` folder from the project directory

## Development

1. Install dependencies
```bash
npm install
```

2. Start development server
```bash
npm run dev
```

3. Make your changes
- The extension will automatically rebuild when files change
- Reload the extension in Chrome to see your changes

## Project Structure

```
src/
  types/           # TypeScript interfaces
    cursor.ts
  constants/       # Constants and configuration
    index.ts
  services/        # API services
    api.ts
  utils/          # Utility functions
    dom.ts
  styles/         # CSS styles
    popup.css
  assets/         # Icons and images
    icons/
  background.ts   # Chrome extension background script
  popup.ts        # Popup UI logic
  popup.html      # Popup UI structure
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- This is not an official product of Cursor
- Icon made by [Freepik](https://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com)

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

## Changelog

### v2.0.0
- Refactoring the entire codebase by organizing the folder structures and splitting files.
- Feat: Creating a bundle while building with webpack. 

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