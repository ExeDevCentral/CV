const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: true
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
