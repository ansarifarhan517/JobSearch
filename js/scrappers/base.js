class BaseScraper {
    constructor() {
        if (this.constructor === BaseScraper) {
            throw new Error("Cannot instantiate abstract class BaseScraper");
        }
    }

    async initialize() {
        throw new Error("Method 'initialize()' must be implemented.");
    }

    async scrape() {
        throw new Error("Method 'scrape()' must be implemented.");
    }

    async close() {
        throw new Error("Method 'close()' must be implemented.");
    }
}

export default BaseScraper;