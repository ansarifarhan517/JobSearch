const axios = require('axios');
const cheerio = require('cheerio');

class IndeedScraper {
    constructor(baseURL) {
        this.baseURL = baseURL || 'https://www.indeed.com';
    }

    async searchJobs(query, location) {
        const url = `${this.baseURL}/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`;
        try {
            const response = await axios.get(url);
            return this.parseJobListings(response.data);
        } catch (error) {
            console.error('Error fetching job listings:', error);
            throw error;
        }
    }

    parseJobListings(html) {
        const $ = cheerio.load(html);
        const jobListings = [];

        $('.jobsearch-SerpJobCard').each((index, element) => {
            const title = $(element).find('.jobtitle').text().trim();
            const company = $(element).find('.company').text().trim();
            const location = $(element).find('.location').text().trim();
            const summary = $(element).find('.summary').text().trim();
            const link = this.baseURL + $(element).find('.jobtitle').attr('href');

            jobListings.push({ title, company, location, summary, link });
        });

        return jobListings;
    }
}

module.exports = IndeedScraper;