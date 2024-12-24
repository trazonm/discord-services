const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');  // Playwright for browser automation

const htmlToImageFunction = async (req, res) => {
    const { file } = req;  // Expecting the file uploaded via multer

    if (!file) {
        return res.status(400).send({ error: 'HTML file is required' });
    }

    const filePath = path.join(__dirname, '..', file.path);

    // Read the file contents
    fs.readFile(filePath, 'utf-8', async (err, html) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: 'Error reading HTML file' });
        }

        try {
            // Launch a browser using Playwright
            const browser = await chromium.launch();  // You can also use firefox or webkit
            const page = await browser.newPage();
            
            // Set the HTML content in the page
            await page.setContent(html);
            
            // Wait for the content to load (useful for dynamic content)
            await page.waitForTimeout(1000);  // Adjust if needed

            // Take a screenshot of the page
            const imageBuffer = await page.screenshot({ fullPage: true });  // Capture the full page

            // Close the browser
            await browser.close();

            // Send the image buffer as the response
            res.set('Content-Type', 'image/png');
            res.send(imageBuffer);
        } catch (error) {
            console.error('Error generating image:', error);
            res.status(500).send({ error: 'Failed to generate image' });
        } finally {
            // Clean up the uploaded file
            fs.unlinkSync(filePath);
        }
    });
};

module.exports = { htmlToImageFunction };
