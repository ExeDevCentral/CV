const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    // Detect executable path across platforms
    let executablePath = '';
    if (process.platform === 'win32') {
      const winPaths = [
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
      ];
      executablePath = winPaths.find((p) => fs.existsSync(p)) || winPaths[0];
    } else {
      const linuxPaths = [
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable'
      ];
      executablePath = linuxPaths.find((p) => fs.existsSync(p)) || '/usr/bin/chromium';
    }

    console.log(`Using browser binary: ${executablePath}`);

    const browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    const filePath = `file://${path.resolve(__dirname, 'index.html').replace(/\\/g, '/')}`;

    console.log('Loading CV page from:', filePath);
    await page.goto(filePath, { waitUntil: 'networkidle0' });

    // 1. Generate Spanish PDF (Default)
    await page.evaluate(() => setLanguage('es'));
    await page.pdf({
      path: path.join(__dirname, 'Exequiel_Echevarria_CV_ES.pdf'),
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });
    // Also save as default Exequiel_Echevarria_CV.pdf
    await page.pdf({
      path: path.join(__dirname, 'Exequiel_Echevarria_CV.pdf'),
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });
    console.log('✔ Exequiel_Echevarria_CV_ES.pdf generated!');

    // 2. Generate English PDF
    await page.evaluate(() => setLanguage('en'));
    await page.pdf({
      path: path.join(__dirname, 'Exequiel_Echevarria_CV_EN.pdf'),
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });
    console.log('✔ Exequiel_Echevarria_CV_EN.pdf generated!');

    await browser.close();
    console.log('All PDF versions generated successfully!');
  } catch (err) {
    console.error('Error generating PDF:', err);
    process.exit(1);
  }
})();
