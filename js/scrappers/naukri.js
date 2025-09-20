const axios = require('axios');
const cheerio = require('cheerio');

class NaukriScraper {
    constructor() {
        this.baseUrl = 'https://www.naukri.com/';
    }

    async searchJobs(keyword, location) {
        const url = `${this.baseUrl}job-search/${keyword}-jobs-in-${location}`;
        const response = await axios.get(url);
        return this.parseJobListings(response.data);
    }

    parseJobListings(html) {
        const $ = cheerio.load(html);
        const jobListings = [];

        $('.jobTuple').each((index, element) => {
            const title = $(element).find('.jobTitle').text().trim();
            const company = $(element).find('.companyName').text().trim();
            const location = $(element).find('.location').text().trim();
            const link = $(element).find('.title a').attr('href');

            jobListings.push({
                title,
                company,
                location,
                link
            });
        });

        return jobListings;
    }
}

module.exports = NaukriScraper;