const fs = require('fs');
const path = require('path');

class ResultManager {
    /**
     * Handles saving scraping results to CSV and JSON files.
     */
    constructor(csvPath = 'job_results.csv', jsonPath = null) {
        this.csvPath = csvPath;
        this.jsonPath = jsonPath || path.join(path.dirname(csvPath), path.basename(csvPath, path.extname(csvPath)) + '.json');
        fs.mkdirSync(path.dirname(this.csvPath), { recursive: true });
    }

    saveToCSV(results, headers = null) {
        /**
         * Save results to a CSV file.
         */
        headers = headers || [
            "Job Title", "Company", "Location", "Footer",
            "Easy Apply", "Job Type", "Description",
            "Experience Required", "Salary Mentioned", "Apply Link"
        ];
        const rows = [headers, ...results];
        const csvContent = rows.map(row => row.map(item => `"${String(item).replace(/"/g, '""')}"`).join(',')).join('\n');
        fs.writeFileSync(this.csvPath, csvContent, { encoding: 'utf-8' });
        console.log(`✅ Saved results to CSV: ${this.csvPath}`);
    }

    saveToJSON(results) {
        /**
         * Save results to a JSON file.
         */
        fs.writeFileSync(this.jsonPath, JSON.stringify(results, null, 2), { encoding: 'utf-8' });
        console.log(`✅ Saved results to JSON: ${this.jsonPath}`);
    }
}

module.exports = ResultManager;