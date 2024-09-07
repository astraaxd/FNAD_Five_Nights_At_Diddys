const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const app = express();

app.use(express.static('public'));

app.use('/proxy', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send('Error: Please provide a URL.');
    }

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.setRequestInterception(true);
        page.on('request', (request) => {
            request.continue();
        });

        await page.goto(targetUrl, { waitUntil: 'networkidle2' });
        const content = await page.content();
        await browser.close();

        res.send(content);
    } catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
});

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Proxy Viewer</title>
            <style>
                * {
                    box-sizing: border-box;
                }
                body {
                    font-family: monospace;
                    background-color: black;
                    color: white;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                .container {
                    width: 90%;
                    max-width: 1200px;
                    text-align: center;
                }
                h1 {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    text-decoration: underline;
                }
                input {
                    font-family: monospace;
                    padding: 8px;
                    font-size: 1rem;
                    margin-right: 0.5rem;
                    border: none;
                    border-radius: 4px;
                    color: black;
                }
                button {
                    background-color: #84fab0;
                    padding: 8px 16px;
                    border: none;
                    border-radius: 4px;
                    color: black;
                    font-size: 1rem;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #8fd3f4;
                }
                .patcher-iframe-container {
                    margin-top: 20px;
                    width: 80%; /* Reduced width */
                    height: 40vh; /* Reduced height */
                    overflow: hidden;
                    border: 2px solid #ccc;
                    border-radius: 8px;
                    background: #fff;
                    margin-left: auto;
                    margin-right: auto;
                }
                .patcher-iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                }
                footer {
                    margin-top: 20px;
                    font-size: 0.99em;
                }
                footer a {
                    color: #ccc;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Astraa's Web Patcher</h1>
                <div class="start-screen">
                    <div class="input-container">
                        <label for="urlInput">Site To Patch:</label>
                        <input type="text" id="urlInput" placeholder="Search Or Enter URL">
                    </div>
                    <button onclick="loadUrl()">Patch!</button>
                </div>
                <div class="patcher-wrapper">
                    <div class="patcher-content">
                        <div class="patcher-iframe-container">
                            <iframe id="patcher-area" class="patcher-iframe"></iframe>
                        </div>
                    </div>
                </div>
                <div id="results-container"></div>
                <div id="log-container"></div>
                <footer>
                    <p>&copy; 2024 Astraa Dev. All rights reserved.</p>
                    <p>This website and its content, including but not limited to text, images, and code, are the intellectual property of me (Astraa) and are protected by copyright law. Unauthorized use, reproduction, or distribution of any content from this site without express written permission is strictly prohibited.</p>
                    <p>For more information or permission requests, please contact us at <a href="mailto:AstraaDev.Production@gmail.com">AstraaDev.Production@gmail.com</a>.</p>
                    <p>All trademarks, service marks, and trade names are the property of their respective owners.</p>
                    <p>Disclaimer: The content provided on this site is for informational purposes only. I, Astraa, makes no representations or warranties of any kind regarding the accuracy or completeness of the content and shall not be liable for any damages arising from the use of or reliance on such content.</p>
                    <p style="color: red;">Please be aware that using this site to bypass network restrictions, such as those implemented by educational institutions, is done at your own risk. I, Astraa, assume no responsibility for any trouble, disciplinary actions, or legal consequences resulting from such use. Use this site responsibly and at your own discretion.</p>
                    <a>For school administrators: If you want me (Astraa) to take this exploit down, please contact me at the Email above. Although, I probably won't do anything about it nor take it down, since it's insanely funny to play fortnite on school computers and it's also fairly simple for one of your students to reupload the offline file to the cloud, and access it there.</a>
                </footer>
            </div>
            <script>
                function loadUrl() {
                    const url = document.getElementById('urlInput').value;
                    if (url) {
                        document.getElementById('patcher-area').src = '/proxy?url=' + encodeURIComponent(url);
                    } else {
                        alert('Please enter a URL');
                    }
                }
            </script>
        </body>
        </html>
    `);
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
