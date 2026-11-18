# QALA Coffee - Final Project

Team: Survae. Members: Yelsultan Tashkaraev and Nurzhan Zholaman.
Actual work division must be completed by the members in the PDF report.

Based on the supplied QALA-Coffee-Assignment-6.zip. Original brand design, base styles,
page content and all photos are retained. Three account pages and final-project behavior
were added. The supplied footer identifies group SE-2515; confirm this before submission.

## Run

No build, installation or API key is required. Serve this folder through a static web
server (for example VS Code Live Server), or publish it to GitHub Pages / Netlify.
Open index.html. Opening files directly is enough for a visual preview, but HTTP/HTTPS
hosting is recommended for consistent storage, API and clipboard behavior.

## Pages

index.html: original home, featured coffee, gallery and newsletter demo.
menu.html: original menu, category filters and drink selection links.
about.html: original story, values and FAQ. Actual contributions are declared only in the fillable report.
contact.html: JavaScript-validated contact preview, phone and demo consent.
lab.html: brew wizard, tasting list, rating, gallery and sound.
discover.html: persistent search, autocomplete, favorites, weather API, feedback and copy.
signup.html: local registration with name, email, phone, password and confirmation.
login.html: credential validation, login and redirect.
profile.html: user details, per-account favorites, logout and guest state.

## Implementation

css/style.css, css/assignment5.css, css/assignment6.css retain the original design.
css/final.css adds only final-project and responsive fixes.
js/theme-init.js applies saved theme before rendering.
js/storage.js provides guarded localStorage reads and writes.
js/auth.js handles signup/login/profile and contact validation.
js/api.js handles Open-Meteo loading, success, malformed data, network error and retry.
js/app.js and assignment4/5/6.js retain and extend original interactions.
vendor/ includes local Bootstrap and jQuery; images/ and audio/ are original assets.

All forms use novalidate. No required, pattern, minlength, maxlength, min, max or
type=email is used as native validation. Password: 8-64 characters with uppercase,
lowercase, number and symbol, without whitespace. Phone: 7-15 digits, optional +,
spaces, hyphens and parentheses accepted. Email is normalized for duplicate detection.

Authentication is an educational localStorage simulation, as requested in the rubric.
It is not secure production authentication. Use fictional data and a disposable password.
No credentials, messages or orders are sent to a server. Favorites are per account;
guest favorites are separate. Storage keys: qalaUsers, qalaSession, qalaTheme,
qalaSearch, qalaFavorites:<email or guest>.

## External API

https://open-meteo.com/en/docs
Endpoint: https://api.open-meteo.com/v1/forecast?latitude=51.1694&longitude=71.4491&current=temperature_2m,apparent_temperature,precipitation,weather_code&timezone=Asia%2FAlmaty
Current Astana weather informs a QALA coffee-break suggestion. The suggestion is our
own logic, not text supplied by the API. Data attribution appears on the page.
Timeout is 12 seconds; failure never shows fictional live weather. Retry is available.

## Validation performed

Chromium: all 9 pages at 320, 375, 768, 992, 1024 and 1440 pixels in both themes; signup, duplicate email, login,
profile, logout, guest guard, theme persistence, search/reset, favorites persistence,
contact/subscribe validation, menu filter, brew wizard, tasting list and mobile menu.
No page JavaScript errors in the tested run. All local references and images checked.
API success and failure paths tested with controlled responses. A separate browser
request returned live Open-Meteo JSON on 15 November 2026. End-to-end live API loading
from a hosted copy remains to be verified: this environment blocked network access
from the local test process. See docs/test-results.json and docs/static-results.json.

## Publish and submit

1. Create or use your team's code repository. Upload this folder's CONTENTS to its root;
   index.html must be at the chosen hosting root. Retain all folders.
2. GitHub Pages: Settings > Pages > Deploy from a branch > main > /(root) > Save.
   Or import the repository into Netlify, leave the build command blank and publish '.'.
3. Wait for the host to supply the actual live URL. Test it in a private browser window,
   including direct page links, registration, theme, mobile menu and live weather.
4. Fill in both real URLs in QALACoffee_SE2515_Links.txt. They must be different:
   code repository URL and live website URL. No live URL is claimed in this package.
5. Fill the PDF's team and actual work-division fields; save and reopen to check them.
   Do not claim work you did not do. Confirm your group and rename the three files if needed.
6. Every member uploads ZIP + PDF + TXT individually to Moodle FINAL EXAM FOLDER.
   Requirement deadline: 18 November 2026, 23:59 (confirm the course timezone).

## Defense: 4 minutes 50 seconds

0:00-0:35 Introduce every member, group, coffee concept and target users.
0:35-1:15 Original design, linked pages and mobile layout.
1:15-2:25 Invalid signup, valid signup, login, profile and logout.
2:25-3:10 Search, filter, favorites and persistent light/dark theme.
3:10-3:55 Live weather; explain loading/error/retry without claiming mock data is live.
3:55-4:25 Coffee Lab, animations and contact validation.
4:25-4:50 Strengths, future real backend authentication, thanks.
Assign speakers yourselves; everyone participates. Rehearse, do not edit code live.
Use the report screenshots as backup. The guideline penalizes overruns and requires
the three files from every student.

## Credits and limitations

Original photos, audio, branding and Bootstrap files are retained from the supplied ZIP.
Their original licensing/attribution should be confirmed by the team before public use.
jQuery and Bootstrap retain their bundled license notices. Weather: Open-Meteo,
CC BY 4.0. Student concept; not a real ordering or messaging service.
No unverified participant roles were added. PDF fields are explicitly for the team to fill.
