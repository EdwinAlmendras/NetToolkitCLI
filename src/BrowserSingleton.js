// BrowserSingleton.js
import puppeteer from 'puppeteer-core';

class BrowserSingleton {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({ 
        headless: false,
        executablePath: './chromium/chrome.exe' // Asegúrate de que esta ruta sea accesible
      });
      this.page = await this.browser.newPage();
    }
  }

  getPage() {
    return this.page;
  }
  getBrowser() {
    return this.browser;
  }
}

export default new BrowserSingleton();