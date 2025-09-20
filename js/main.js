const path = require('path');
const fs = require('fs');
// const { filterJobsUsingResume } = require('./ai_agents/filter_job_agent/filterJobAgent');
const LinkedInScraper = require('./scrappers/linkedIn');
const pdfParse = require('pdf-parse');


(async () => {
    try {
        const scraper = new LinkedInScraper();
        await scraper.run();

        // const csvInputPath = path.join(__dirname, '../', 'job_results.csv');
        // const csvOutputPath = path.join(__dirname, '../', 'linkedin_jobs_filtered.csv');
        // const resumePath = path.join(__dirname, '../' ,'Farhan_Resume_May_2025.pdf');



        // async function loadResume(resumePath) {
        //     const ext = path.extname(resumePath).toLowerCase();

        //     if (ext === '.pdf') {
        //         console.log('📄 Reading resume from PDF...');
        //         const pdfBuffer = fs.readFileSync(resumePath);
        //         const pdfData = await pdfParse(pdfBuffer);
        //         return pdfData.text.trim();
        //     }

        //     if (ext === '.txt') {
        //         console.log('📄 Reading resume from TXT...');
        //         return fs.readFileSync(resumePath, 'utf8').trim();
        //     }

        //     throw new Error(`Unsupported resume format: ${ext}. Use .txt or .pdf`);
        // }

        // console.log('🔁 Loading resume...');
        // const resumeText = await loadResume(resumePath);

        // await filterJobsUsingResume(csvInputPath, csvOutputPath, resumeText);






    } catch (err) {
        console.error("❌ Error running LinkedIn scraper:", err);
        process.exit(1);
    }
})();