<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/e874fb11-b468-4e98-b2b1-42e076a96ecd

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

   ## Security Scans with OWASP ZAP

   Quick local scan using OWASP ZAP (Docker):

   PowerShell (Windows):

   ```
   mkdir reports
   npm run build
   npm run start &
   docker run --rm -v ${PWD}/reports:/zap/wrk -t owasp/zap2docker-stable \
      zap-baseline.py -t http://host.docker.internal:3000 -r zap-report.html
   ```

   Notes:
   - The report will be written to `./reports/zap-report.html`.
   - For local development use `npm run dev` instead of `npm run start`, but ensure the app is reachable at the target URL.
   - A GitHub Actions workflow runs a baseline ZAP scan for PRs and pushes to `main`: `.github/workflows/owasp-zap-baseline.yml`.

   Interpreting the report:
   - High/Medium/Low indicates severity; prioritize High alerts first.
   - The HTML report contains descriptions, evidence, and remediation suggestions for each alert.
   - Not all findings are exploitable in your environment; triage and validate before treating as bugs.
