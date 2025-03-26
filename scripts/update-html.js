#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const popupHtmlPath = path.join(__dirname, '../dist/popup.html');
let htmlContent = fs.readFileSync(popupHtmlPath, 'utf8');

htmlContent = htmlContent.replace(
  /href="styles\/popup.css"/,
  'href="bundles/popup.css"'
);

htmlContent = htmlContent.replace(
  /src="popup.js" type="module"/,
  'src="bundles/popup.bundle.js"'
);

fs.writeFileSync(popupHtmlPath, htmlContent);

console.log('HTML references updated successfully!'); 