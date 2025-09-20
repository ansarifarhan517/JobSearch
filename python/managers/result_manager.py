import csv
import os
import json

class ResultManager:
    """
    Handles saving scraping results to CSV and JSON files.
    """

    def __init__(self, csv_path="job_results.csv", json_path=None):
        self.csv_path = csv_path
        self.json_path = json_path or os.path.splitext(csv_path)[0] + ".json"
        os.makedirs(os.path.dirname(self.csv_path) or ".", exist_ok=True)

    def save_to_csv(self, results, headers=None):
        """
        Save results to a CSV file.
        """
        headers = headers or [
            "Job Title", "Company", "Location", "Footer",
            "Easy Apply", "Job Type", "Description",
            "Experience Required", "Salary Mentioned", "Apply Link",
            "Job ID", "Job URL", "Company-Title Hash"
        ]
        with open(self.csv_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(headers)
            writer.writerows(results)
        print(f"✅ Saved results to CSV: {self.csv_path}")

    def save_to_json(self, results):
        """
        Save results to a JSON file.
        """
        with open(self.json_path, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"✅ Saved results to JSON: {self.json_path}")
