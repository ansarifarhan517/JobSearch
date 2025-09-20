
# DOCKER RUN COMMAND
docker run --rm -it \
  --env-file .env \
  -v "$(pwd)/resume:/app/resume" \
  -v "$(pwd)/config.json:/app/config.json" \
  -v "$(pwd)/filtered_jobs.csv:/app/filtered_jobs.csv" \
  -v "$(pwd)/job_results.csv:/app/job_results.csv" \
  -v "$(pwd)/jobs_without_easyapply.csv:/app/jobs_without_easyapply.csv" \
  linkedin-autoapply:latest
# Job-Search-Automation
# Job-Search-Automation
