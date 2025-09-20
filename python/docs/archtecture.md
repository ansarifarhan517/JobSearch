Architecture Overview
1️⃣ DriverManager

Responsibility: Start or attach Chrome, manage profiles.

Output: driver object + wait (WebDriverWait).

2️⃣ SessionManager

Responsibility: Load/save cookies, check login, maintain session.

Depends on: driver.

Used by: Each scraper.

3️⃣ ConfigManager

Responsibility: Read/update config.json (titles, locations, filters).

Shared by all scrapers.

4️⃣ ResultManager

Responsibility: Save results in CSV/JSON/DB.

Shared by all scrapers.

5️⃣ JobScraperBase (abstract)

Defines interface:

login()

search_jobs()

save_results()

Uses: driver, session_manager, config_manager, result_manager.

6️⃣ Platform-specific Scrapers

LinkedInScraper, NaukriScraper, IndeedScraper

Inherit JobScraperBase

Implement platform-specific:

Login flow

Job search & parsing

Interaction Flow

DriverManager → provides driver

SessionManager → checks login / loads cookies

ConfigManager → provides job titles & filters

Scraper → performs login() and search_jobs()

ResultManager → saves results

ConfigManager → updates config if new titles found

Class Interaction Diagram
+------------------+
|   DriverManager  |
|------------------|
| start_driver()   |
| attach_driver()  |
+--------+---------+
         |
         v
+------------------+       +------------------+
|  SessionManager  |<----->|  ConfigManager   |
|------------------|       |-----------------|
| load_cookies()   |       | get_titles()    |
| save_cookies()   |       | update_titles() |
| is_logged_in()   |       +-----------------+
+--------+---------+
         |
         v
+---------------------+
|  JobScraperBase     |<--------------------------+
|---------------------|                           |
| login()             |                           |
| search_jobs()       |                           |
| save_results()      |                           |
+--------+------------+                           |
         |                                        |
         v                                        |
+---------------------+                           |
| LinkedInScraper     |                           |
+---------------------+                           |
| login()             |                           |
| search_jobs()       |                           |
+---------------------+                           |
                                                  |
+---------------------+                           |
| NaukriScraper       |                           |
+---------------------+                           |
| login()             |                           |
| search_jobs()       |                           |
+---------------------+                           |
                                                  |
+---------------------+                           |
| IndeedScraper       |                           |
+---------------------+                           |
| login()             |                           |
| search_jobs()       |                           |
+---------------------+                           |
                                                  |
                                                  v
                                        +-----------------+
                                        | ResultManager   |
                                        |----------------|
                                        | save_csv()     |
                                        | save_json()    |
                                        +----------------+


✅ Highlights of this Design:

Each component has a single responsibility.

Components are loosely coupled:

Scrapers depend on driver and session_manager abstraction, not their concrete implementation.

Easy to add new platforms (just inherit JobScraperBase).

Shared ConfigManager and ResultManager ensure consistency.