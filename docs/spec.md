MASTER PROMPT
=============

School Sports Day Management Website
====================================

You are a senior full-stack engineer, software architect, UI/UX designer, and product designer.

Your task is to design and build a complete production-ready **School Sports Day Management Website** for an internal school sports festival.

The website must be modern, minimal, fast, responsive, maintainable, and practical for real-world use during the school's sports festival.

Do not over-engineer the project.

Do not invent or add unnecessary features.

Follow every requirement in this specification carefully.

1\. PROJECT OVERVIEW
====================

This website is the central information hub for a school's annual sports festival.

The main users are:

*   Students
    
*   Teachers
    
*   Event staff
    
*   Administrators
    

Students and teachers should be able to:

*   View the current overall team standings
    
*   View today's latest competition results
    
*   Browse the competition schedule
    
*   Browse historical competition results
    
*   View information about each team/color
    
*   Read announcements
    
*   Access the event photo gallery through Google Drive
    

Administrators should be able to manage the competition data through a protected admin dashboard.

The website is NOT intended to be:

*   a social network
    
*   an athlete management system
    
*   a live sports broadcasting system
    
*   a student account system
    
*   a complicated analytics platform
    

Keep the product focused on the sports festival.

2\. CORE PRODUCT PRINCIPLE
==========================

The website should answer these questions immediately:

1.  Which team is currently leading?
    
2.  What happened today?
    
3.  What competitions are happening today?
    
4.  What were the previous results?
    
5.  What information is available for each team?
    
6.  Where can I see event photos?
    
7.  Are there any important announcements?
    

The homepage should prioritize these questions.

3\. TEAM STRUCTURE
==================

There are exactly four teams/colors.

Team 1
------

🔴 RED — สีแดง

Primary color:

#EF4444

Slug:

red

Team 2
------

🟢 GREEN — สีเขียว

Primary color:

#22C55E

Slug:

green

Team 3
------

🔵 SKY BLUE — สีฟ้า

Primary color:

#38BDF8

Slug:

sky-blue

Team 4
------

🟣 PURPLE — สีม่วง

Primary color:

#A855F7

Slug:

purple

Do NOT use:

*   Yellow
    
*   Dark Blue
    
*   Orange
    
*   Pink
    
*   Additional team colors
    

The four team colors must remain consistent throughout the entire application.

Team colors should be used as contextual accents, not as full-page backgrounds.

4\. TECH STACK
==============

Use this technology stack.

Frontend
--------

*   Next.js
    
*   React
    
*   TypeScript
    
*   Tailwind CSS
    
*   shadcn/ui
    
*   Lucide Icons
    
*   Framer Motion
    

Use the latest stable versions compatible with each other.

Backend
-------

Use Next.js server-side functionality.

Prefer:

*   Server Components
    
*   Server Actions
    
*   Route Handlers where necessary
    

Do NOT create a separate Express.js or NestJS backend unless there is a strong technical reason.

Database
--------

Use:

*   Supabase PostgreSQL
    

Authentication
--------------

Use:

*   Supabase Authentication
    

Only administrators need authentication.

Students and teachers should be able to browse the public website without creating an account.

Security
--------

Use:

*   Supabase Row Level Security
    
*   Server-side authorization checks
    
*   Environment variables for secrets
    

Never expose Supabase service-role credentials to the browser.

Deployment
----------

The application should be ready for:

*   Vercel
    
*   Supabase
    
*   GitHub
    

5\. DESIGN DIRECTION
====================

The design should feel like:

**Modern Sports × Editorial × Premium School Website**

Think:

*   modern sports information platform
    
*   university website
    
*   editorial website
    
*   premium competition dashboard
    

Do NOT make it look like a typical school activity website.

Avoid:

*   childish graphics
    
*   excessive gradients
    
*   excessive glassmorphism
    
*   excessive rounded cards
    
*   excessive shadows
    
*   excessive colors
    
*   overly decorative backgrounds
    
*   giant illustrations
    
*   unnecessary animations
    

The interface should feel:

*   modern
    
*   confident
    
*   clean
    
*   premium
    
*   athletic
    
*   organized
    
*   easy to scan
    

6\. VISUAL SYSTEM
=================

Use a neutral interface.

Recommended base:

Background:

#F5F5F5

Surface:

#FFFFFF

Primary text:

#111111

Secondary text:

#6B7280

Border:

#E5E7EB

The team colors are used only where team context is needed.

7\. TYPOGRAPHY
==============

The website must support Thai beautifully.

Preferred fonts:

*   Noto Sans Thai
    
*   Inter
    

Use strong typography hierarchy.

Large:

*   Hero heading
    
*   Scores
    
*   Ranking numbers
    

Medium:

*   Section headings
    
*   Competition titles
    

Small:

*   Metadata
    
*   Date
    
*   Time
    
*   Status
    

Do not use too many font sizes.

8\. RESPONSIVE DESIGN
=====================

The website must be fully responsive.

Support:

*   Desktop
    
*   Laptop
    
*   Tablet
    
*   Mobile
    

Mobile is extremely important.

Most students will access the site from smartphones.

Do NOT simply shrink the desktop design.

Create proper mobile layouts.

9\. PUBLIC WEBSITE STRUCTURE
============================

The public website must contain exactly these main sections:

1.  Home
    
2.  Schedule
    
3.  Results
    
4.  Teams
    
5.  Gallery
    

Navigation:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Home  Schedule  Results  Teams  Gallery   `

Admin should be accessed separately.

10\. HOME PAGE
==============

The Home page is the most important page.

Recommended structure:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Navbar  Hero  Overall Standings  Today's Overview  Latest Results Slider  Today's Schedule  Highlight of the Day  Announcements  Gallery CTA  Footer   `

The homepage should not feel overloaded.

Use generous spacing and strong visual hierarchy.

11\. HERO SECTION
=================

Display:

SPORTS DAY 2026

And a configurable slogan:

ONE SCHOOL • ONE SPIRIT

The year and slogan must come from the database/site configuration rather than being hard-coded.

Include a primary CTA:

ดูตารางการแข่งขัน

This should navigate to the Schedule page.

The hero should be visually strong but not occupy the entire screen.

12\. OVERALL STANDINGS
======================

The homepage must contain:

🏆 ตารางคะแนนรวม

The standings section must be collapsible.

IMPORTANT:

The standings should be CLOSED by default.

Collapsed:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ┌──────────────────────────────────┐  │ 🏆 ตารางคะแนนรวม             ＋ │  └──────────────────────────────────┘   `

Expanded:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ┌──────────────────────────────────┐  │ 🏆 ตารางคะแนนรวม             − │  ├──────────────────────────────────┤  │ 1   🔴 สีแดง          325       │  │ 2   🟢 สีเขียว        298       │  │ 3   🔵 สีฟ้า          276       │  │ 4   🟣 สีม่วง         251       │  └──────────────────────────────────┘   `

The ranking must be dynamically generated from the database.

Do NOT hard-code rankings.

Do NOT allow administrators to directly edit the total score.

The total score must be calculated from competition score records.

13\. TODAY'S OVERVIEW
=====================

Add a compact section:

TODAY

Show:

*   current date
    
*   number of competitions today
    
*   completed competitions
    
*   upcoming competitions
    

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   TODAY  5 OCTOBER 2026  4 competitions  2 completed  2 upcoming   `

This should be visually compact.

Do not make it the largest section on the page.

14\. LATEST RESULTS SLIDER
==========================

IMPORTANT:

There must be NO Live Score system.

Do NOT implement:

*   live score
    
*   live timer
    
*   minute-by-minute updates
    
*   live match events
    
*   real-time match tracking
    

Instead, create:

🥇 ผลการแข่งขันล่าสุด

This displays the latest completed results of the selected day.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ⚽ FOOTBALL  รอบชิงชนะเลิศ  🔴 สีแดง      2 — 1      🔵 สีฟ้า  FINAL   `

Another:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   🏐 VOLLEYBALL  รอบรองชนะเลิศ  🟢 สีเขียว    2 — 0      🟣 สีม่วง  FINAL   `

Requirements:

*   horizontal carousel
    
*   previous button
    
*   next button
    
*   pagination dots
    
*   auto-slide
    
*   smooth animation
    
*   responsive layout
    

Only completed matches should appear.

The slider should prioritize the latest completed results.

Do not show upcoming matches inside this slider.

15\. TODAY'S SCHEDULE
=====================

Show today's competition schedule on the homepage.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   📅 การแข่งขันวันนี้  09:00  ⚽ ฟุตบอล  🔴 สีแดง vs 🔵 สีฟ้า  11:00  🏐 วอลเลย์บอล  🟢 สีเขียว vs 🟣 สีม่วง  13:00  🏀 บาสเกตบอล  🔴 สีแดง vs 🟢 สีเขียว   `

Each event should show:

*   time
    
*   sport
    
*   participating teams
    
*   status
    

Statuses:

*   ยังไม่เริ่ม
    
*   เสร็จสิ้น
    
*   เลื่อนการแข่งขัน
    
*   ยกเลิก
    

Include:

ดูทั้งหมด →

which links to Schedule.

16\. HIGHLIGHT OF THE DAY
=========================

Add:

⭐ HIGHLIGHT OF THE DAY

This is an editorial highlight manually selected by an administrator.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ⭐ HIGHLIGHT OF THE DAY  ศึกชิงอันดับหนึ่ง  ฟุตบอลชาย รอบชิงชนะเลิศ  🔴 สีแดง 2 — 1 🔵 สีฟ้า   `

Another possible example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ⭐ HIGHLIGHT OF THE DAY  การแข่งขัน 100 เมตรชาย  สีเขียวคว้าเหรียญทอง   `

The administrator manually chooses the highlight.

Do NOT create a complicated automatic highlight algorithm.

The highlight can optionally reference a match.

Only one highlight should be active per date.

17\. ANNOUNCEMENTS
==================

Create a simple:

📢 ข่าวสาร

section.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ประกาศเปลี่ยนแปลงตารางการแข่งขัน  5 ตุลาคม 2026  ประกาศกำหนดการแข่งขันรอบชิงชนะเลิศ  4 ตุลาคม 2026   `

Keep this simple.

Do NOT implement:

*   push notifications
    
*   notification center
    
*   user notification preferences
    
*   announcement categories
    
*   comments
    

18\. GALLERY
============

Do NOT build a full image gallery system.

Instead create a Gallery page that links to Google Drive.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   📸 GALLERY  ดูภาพบรรยากาศและภาพการแข่งขันทั้งหมด  [ เปิด Google Drive → ]   `

The Google Drive URL must be configurable by the administrator.

The website should not need to host the event photos itself.

19\. SCHEDULE PAGE
==================

Create:

/schedule

The Schedule page should display all upcoming and scheduled competitions.

Each competition includes:

*   date
    
*   time
    
*   sport
    
*   round
    
*   team A
    
*   team B
    
*   status
    

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   5 OCTOBER  09:00  ⚽ ฟุตบอล  รอบรองชนะเลิศ  🔴 สีแดง  vs  🔵 สีฟ้า  เสร็จสิ้น   `

The page should support browsing different dates.

Keep filtering simple and intuitive.

20\. RESULTS PAGE
=================

Create:

/results

Display historical competition results.

Group by date.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   5 OCTOBER  ⚽ ฟุตบอล  🔴 สีแดง 2 — 1 🔵 สีฟ้า  🏐 วอลเลย์บอล  🟢 สีเขียว 2 — 0 🟣 สีม่วง  4 OCTOBER  ⚽ ฟุตบอล  🔵 สีฟ้า 3 — 2 🟣 สีม่วง   `

Allow users to filter by sport if useful.

Do not create complicated analytics.

21\. TEAMS PAGE
===============

Create:

/teams

Display four teams:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   🔴 สีแดง  325 PTS  🟢 สีเขียว  298 PTS  🔵 สีฟ้า  276 PTS  🟣 สีม่วง  251 PTS   `

Each team should have a dedicated page.

URL example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   /teams/red  /teams/green  /teams/sky-blue  /teams/purple   `

The team page should show:

*   team name
    
*   team color
    
*   logo
    
*   slogan/description
    
*   current total score
    
*   competition results involving the team
    

Do NOT create player profiles.

Do NOT create athlete databases.

22\. ADMIN DASHBOARD
====================

Create a protected admin dashboard.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   /admin   `

Admin navigation:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Dashboard  Matches  Results  Teams  Sports  Highlights  Announcements  Settings   `

23\. ADMIN DASHBOARD — OVERVIEW
===============================

Display:

*   today's matches
    
*   completed matches
    
*   upcoming matches
    
*   current standings
    
*   recent results
    

Use a clean dashboard.

Do not overload it with unnecessary charts.

24\. ADMIN — MATCHES
====================

Admin can:

*   create match
    
*   edit match
    
*   delete match
    
*   change date
    
*   change time
    
*   select sport
    
*   select team A
    
*   select team B
    
*   select round
    
*   change status
    

Validation:

*   Team A and Team B cannot be identical
    
*   required fields cannot be empty
    
*   date must be valid
    
*   time must be valid
    

25\. ADMIN — RESULTS
====================

Admin can enter completed results.

Fields may include:

*   match
    
*   team
    
*   score
    
*   position
    
*   points awarded
    

Once the result is submitted:

1.  Match becomes completed
    
2.  Result is saved
    
3.  Score points are saved
    
4.  Team standings update automatically
    
5.  Result appears on Results page
    
6.  Result can appear in the homepage Latest Results slider
    

Avoid duplicate result submission.

26\. ADMIN — TEAMS
==================

Admin can:

*   create team
    
*   edit team
    
*   upload/change logo
    
*   edit description
    
*   edit slogan
    

However, because the sports festival has exactly four teams, the system should not casually create arbitrary additional teams.

The four default teams are:

*   Red
    
*   Green
    
*   Sky Blue
    
*   Purple
    

27\. ADMIN — SPORTS
===================

Admin can:

*   create sport
    
*   edit sport
    
*   enable/disable sport
    

Example:

*   Football
    
*   Volleyball
    
*   Basketball
    
*   Athletics
    
*   Traditional sports
    
*   etc.
    

Do not hard-code sports directly into the UI.

28\. ADMIN — HIGHLIGHTS
=======================

Admin can:

*   create highlight
    
*   select date
    
*   select related match
    
*   write title
    
*   write description
    
*   optionally upload an image
    
*   activate/deactivate
    

Only one highlight should be active for each date.

29\. ADMIN — ANNOUNCEMENTS
==========================

Admin can:

*   create announcement
    
*   edit announcement
    
*   delete announcement
    
*   publish/unpublish
    

Announcements should support:

*   title
    
*   content
    
*   publication date
    

30\. ADMIN — SETTINGS
=====================

Admin can configure:

*   event name
    
*   event year
    
*   slogan
    
*   school logo
    
*   Google Drive gallery URL
    

These values must be stored in the database.

Do not hard-code them into components.

31\. DATABASE ARCHITECTURE
==========================

Use normalized PostgreSQL tables.

teams
-----

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   id  name  slug  color  logo_url  description  slogan  created_at  updated_at   `

Default teams:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Red  Green  Sky Blue  Purple   `

sports
------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   id  name  icon  is_active  created_at  updated_at   `

matches
-------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   id  sport_id  date  start_time  round  team_a_id  team_b_id  status  created_at  updated_at   `

Status values:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   scheduled  completed  postponed  cancelled   `

results
-------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   id  match_id  team_id  score  position  created_at  updated_at   `

score\_points
-------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   id  match_id  team_id  points  reason  created_at   `

highlights
----------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   id  date  title  description  image_url  match_id  is_active  created_at  updated_at   `

announcements
-------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   id  title  content  published_at  is_published  created_at  updated_at   `

site\_config
------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   id  event_name  event_year  slogan  school_logo_url  gallery_drive_url  created_at  updated_at   `

If another database table is necessary, explain its purpose before creating it.

Do not create unnecessary tables.

32\. SCORE CALCULATION
======================

The total team score must be derived from score\_points.

For example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   RED  Football       +50  Volleyball     +30  Athletics      +40  TOTAL          120   `

The frontend displays:

120 PTS

But the database source of truth is the individual score point records.

Do NOT create a manually editable:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   team.total_score   `

as the primary source of truth.

The ranking should be calculated from:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   SUM(score_points.points)  GROUP BY team_id   `

33\. DATABASE RELATIONSHIPS
===========================

Use proper foreign keys.

Recommended relationships:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   teams    │    ├── matches.team_a_id    ├── matches.team_b_id    ├── results.team_id    └── score_points.team_id  sports    │    └── matches.sport_id  matches    │    ├── results.match_id    ├── score_points.match_id    └── highlights.match_id   `

Use proper indexes for frequently queried fields such as:

*   match date
    
*   match status
    
*   result match\_id
    
*   score\_points team\_id
    
*   highlight date
    
*   announcement published\_at
    

34\. AUTHENTICATION
===================

Only admins require authentication.

Public visitors do NOT need accounts.

Admin login should use Supabase Auth.

Recommended flow:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   /admin/login        ↓  Supabase Auth        ↓  Authenticated        ↓  Admin Dashboard   `

Protect every admin route.

Do not rely only on hiding UI elements.

Perform authorization checks server-side.

35\. ROW LEVEL SECURITY
=======================

Enable RLS.

Public:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   SELECT published/public data   `

Admin:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   SELECT  INSERT  UPDATE  DELETE   `

Only authorized admins should be able to modify:

*   matches
    
*   results
    
*   teams
    
*   sports
    
*   highlights
    
*   announcements
    
*   settings
    

36\. SECURITY RULES
===================

Never expose:

*   Supabase service-role key
    
*   private credentials
    
*   admin secrets
    

Use:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   .env.local   `

for local secrets.

Use Vercel environment variables for production.

Validate all server-side input.

Do not trust client-side values.

37\. UI COMPONENT ARCHITECTURE
==============================

Create reusable components.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   components/  ui/    Button    Card    Badge    Dialog    Input    Select    Table  home/    Hero    Standings    TodayOverview    LatestResults    TodaySchedule    Highlight    Announcements    GalleryCTA  schedule/    ScheduleList    MatchCard    DateSelector  results/    ResultList    ResultCard  teams/    TeamCard    TeamHeader    TeamResults  admin/    AdminSidebar    AdminHeader    MatchForm    ResultForm    TeamForm    SportForm    HighlightForm    AnnouncementForm   `

Do not duplicate similar components.

38\. DATA ACCESS
================

Do not scatter raw Supabase queries throughout UI components.

Create organized data-access/query functions.

For example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   lib/    supabase/    queries/      teams.ts      sports.ts      matches.ts      results.ts      standings.ts      highlights.ts      announcements.ts   `

Keep database access separate from presentation components.

39\. SERVER VS CLIENT COMPONENTS
================================

Prefer Server Components by default.

Use Client Components only when interaction requires them.

Client Components will be appropriate for:

*   standings expand/collapse
    
*   results carousel
    
*   date selectors
    
*   admin forms
    
*   dialogs
    
*   interactive controls
    

Do not make the entire application a Client Component.

40\. ANIMATIONS
===============

Use Framer Motion sparingly.

Good uses:

*   hero entrance
    
*   carousel transitions
    
*   standings expand/collapse
    
*   subtle hover states
    
*   page transitions where appropriate
    

Avoid:

*   constant floating elements
    
*   excessive bouncing
    
*   long animations
    
*   distracting effects
    

Animation duration should generally be short.

41\. ACCESSIBILITY
==================

Use:

*   semantic HTML
    
*   keyboard navigation
    
*   visible focus states
    
*   proper labels
    
*   accessible buttons
    
*   proper heading hierarchy
    
*   alt text
    
*   sufficient color contrast
    

Do not communicate information only through color.

For example, do not use only:

🔴 = completed

Instead show:

เสร็จสิ้น

as text.

42\. LOADING STATES
===================

Use skeleton loading states where appropriate.

Examples:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Loading standings...  Loading matches...  Loading results...   `

Do not display a completely blank page while data loads.

43\. EMPTY STATES
=================

Provide useful empty states.

Examples:

No matches:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ยังไม่มีการแข่งขันในวันนี้   `

No results:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ยังไม่มีผลการแข่งขัน   `

No announcements:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ยังไม่มีประกาศ   `

No highlight:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ยังไม่มี Highlight ประจำวันนี้   `

44\. ERROR HANDLING
===================

Do not expose raw database errors to users.

Display friendly messages.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ไม่สามารถโหลดข้อมูลได้  กรุณาลองใหม่อีกครั้ง   `

Admin forms should clearly show validation errors.

45\. FORM VALIDATION
====================

Use Zod or an equivalent validation system.

Validate:

*   required fields
    
*   dates
    
*   times
    
*   scores
    
*   teams
    
*   duplicate results
    
*   invalid relationships
    

Prevent:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Red vs Red   `

Prevent duplicate result submissions.

46\. PERFORMANCE
================

The website may receive many simultaneous visitors during the sports festival.

Optimize for performance.

Use:

*   Server Components
    
*   server-side data fetching
    
*   caching where appropriate
    
*   database indexes
    
*   optimized images
    
*   lazy loading
    
*   minimal client-side JavaScript
    

Do not fetch the entire database to the browser.

Only fetch the data needed for each page.

47\. SEO / METADATA
===================

Configure proper metadata.

Example:

Title:

Sports Day 2026

Description:

เว็บไซต์กีฬาสีภายในโรงเรียน ตารางการแข่งขัน ผลการแข่งขัน และคะแนนรวม

Use dynamic event name/year from configuration where appropriate.

Add appropriate Open Graph metadata.

48\. HOMEPAGE DATA PRIORITY
===========================

The homepage should prioritize:

1.  Overall standings
    
2.  Today's overview
    
3.  Latest completed results
    
4.  Today's schedule
    
5.  Highlight of the Day
    
6.  Announcements
    
7.  Gallery link
    

Do not make every section equally visually dominant.

The most important information should be visually strongest.

49\. ADMIN WORKFLOW
===================

The complete workflow must work like this:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Admin creates sports          ↓  Admin creates/configures teams          ↓  Admin creates competition          ↓  Competition appears on Schedule          ↓  Competition takes place          ↓  Admin enters final result          ↓  Result is stored          ↓  Score points are stored          ↓  Team standings update          ↓  Result appears on Results page          ↓  Result appears in Latest Results          ↓  Admin may select it as Highlight of the Day   `

This workflow must be tested end-to-end.

50\. DEFAULT TEAM DATA
======================

Seed the database with exactly four teams:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Red  Green  Sky Blue  Purple   `

Use:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Red      #EF4444  Green    #22C55E  Sky Blue #38BDF8  Purple   #A855F7   `

Do not seed fake competition results unless explicitly needed for development/demo purposes.

If demo data is required, clearly separate it from production data.

51\. PROJECT STRUCTURE
======================

Use a clean Next.js App Router structure.

Recommended:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   app/  ├── page.tsx  │  ├── schedule/  │   └── page.tsx  │  ├── results/  │   └── page.tsx  │  ├── teams/  │   ├── page.tsx  │   └── [slug]/  │       └── page.tsx  │  ├── gallery/  │   └── page.tsx  │  ├── admin/  │   ├── login/  │   │   └── page.tsx  │   │  │   ├── page.tsx  │   ├── matches/  │   ├── results/  │   ├── teams/  │   ├── sports/  │   ├── highlights/  │   ├── announcements/  │   └── settings/  │  ├── api/  │   └── ...  │  components/  ├── ui/  ├── home/  ├── schedule/  ├── results/  ├── teams/  └── admin/  lib/  ├── supabase/  ├── queries/  ├── validations/  └── utils/  types/  └── database.ts  public/  ├── logo/  └── images/   `

Adjust the structure if the framework version requires it, but maintain the same architectural separation.

52\. ENVIRONMENT VARIABLES
==========================

Create an .env.example.

Expected variables should include the appropriate Supabase configuration.

Never include real credentials.

Example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   NEXT_PUBLIC_SUPABASE_URL=  NEXT_PUBLIC_SUPABASE_ANON_KEY=   `

If a server-only secret is required, clearly distinguish it from public environment variables.

53\. CODE QUALITY REQUIREMENTS
==============================

Use:

*   TypeScript strict mode
    
*   ESLint
    
*   clear naming
    
*   reusable components
    
*   modular architecture
    
*   proper error handling
    
*   no unnecessary duplication
    
*   no hard-coded competition data
    
*   no unnecessary dependencies
    

Keep the code understandable for another developer.

54\. DO NOT OVER-ENGINEER
=========================

This is important.

Do NOT introduce:

*   microservices
    
*   Redis
    
*   WebSockets
    
*   Kafka
    
*   Docker orchestration
    
*   separate backend servers
    
*   complex state management libraries unless genuinely necessary
    
*   unnecessary third-party APIs
    

The system is a school sports festival website.

Use the simplest architecture that reliably solves the problem.

55\. FEATURES THAT MUST NOT EXIST
=================================

Do NOT implement:

*   player profiles
    
*   athlete database
    
*   live score
    
*   live timer
    
*   live event tracking
    
*   real-time commentary
    
*   venue management
    
*   stadium maps
    
*   Hall of Fame
    
*   trophy history
    
*   push notifications
    
*   notification center
    
*   PWA
    
*   search
    
*   social feed
    
*   comments
    
*   likes
    
*   student accounts
    
*   student registration
    
*   chat
    
*   complex analytics
    
*   unnecessary gamification
    

Do not add these even if they seem useful.

56\. DEVELOPMENT PROCESS
========================

Build the project in the following order.

Phase 1 — Foundation
--------------------

Create:

*   Next.js project
    
*   TypeScript
    
*   Tailwind
    
*   shadcn/ui
    
*   project structure
    
*   environment configuration
    

Phase 2 — Database
------------------

Create:

*   Supabase project configuration
    
*   database schema
    
*   relationships
    
*   indexes
    
*   RLS policies
    
*   seed teams
    
*   seed sports if appropriate
    

Phase 3 — Design System
-----------------------

Create:

*   typography
    
*   spacing
    
*   colors
    
*   buttons
    
*   cards
    
*   badges
    
*   tables
    
*   dialogs
    
*   forms
    

Phase 4 — Public Website
------------------------

Build:

*   Home
    
*   Schedule
    
*   Results
    
*   Teams
    
*   Team detail
    
*   Gallery
    

Phase 5 — Admin
---------------

Build:

*   Admin Login
    
*   Dashboard
    
*   Matches
    
*   Results
    
*   Teams
    
*   Sports
    
*   Highlights
    
*   Announcements
    
*   Settings
    

Phase 6 — Integration
---------------------

Connect every page to Supabase.

No fake hard-coded production data.

Phase 7 — Validation & Security
-------------------------------

Implement:

*   authentication
    
*   authorization
    
*   RLS
    
*   input validation
    
*   error handling
    

Phase 8 — Responsive Design
---------------------------

Test:

*   desktop
    
*   tablet
    
*   mobile
    

Pay special attention to:

*   navigation
    
*   standings
    
*   results carousel
    
*   match cards
    
*   admin forms
    

Phase 9 — Final Testing
-----------------------

Test the complete workflow:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   Create match  ↓  Display schedule  ↓  Enter result  ↓  Update score  ↓  Update standings  ↓  Display latest result  ↓  Set highlight  ↓  Display highlight   `

Also test:

*   invalid forms
    
*   duplicate results
    
*   unauthorized access
    
*   empty database
    
*   mobile layouts
    
*   database errors
    

57\. FINAL ACCEPTANCE CRITERIA
==============================

The project is considered complete only when:

### Public Website

*   Home works
    
*   Schedule works
    
*   Results works
    
*   Teams works
    
*   Gallery works
    
*   standings work
    
*   standings are collapsible
    
*   latest results slider works
    
*   today's overview works
    
*   highlight works
    
*   announcements work
    
*   responsive design works
    

### Admin

*   login works
    
*   dashboard works
    
*   match CRUD works
    
*   result entry works
    
*   score calculation works
    
*   team management works
    
*   sport management works
    
*   highlight management works
    
*   announcement management works
    
*   settings work
    

### Database

*   relational structure works
    
*   foreign keys work
    
*   score calculation works
    
*   RLS works
    
*   public read access works
    
*   admin write access works
    

### Security

*   unauthorized users cannot access admin functions
    
*   secrets are not exposed
    
*   service-role keys are never sent to the browser
    

### UX

*   no broken links
    
*   no empty blank screens
    
*   proper loading states
    
*   proper error states
    
*   proper empty states
    
*   accessible controls
    
*   mobile responsive
    

58\. IMPORTANT IMPLEMENTATION INSTRUCTION
=========================================

Do not stop after generating the UI.

This is a full-stack application.

The final result must include:

1.  working frontend
    
2.  working database
    
3.  working authentication
    
4.  working admin dashboard
    
5.  working CRUD
    
6.  working score calculation
    
7.  working public data flow
    
8.  security policies
    
9.  validation
    
10.  responsive UI
    

Do not replace backend functionality with mock data.

Do not leave major features as TODOs.

If a configuration value such as Supabase credentials is required, create the appropriate configuration and clearly identify what the developer/user must provide.

59\. FINAL DESIGN GOAL
======================

The finished website should feel like a real official sports festival platform.

It should communicate:

**Competition****School Spirit****Clarity****Modern Technology****Professionalism**

The design should be visually impressive without sacrificing usability.

The four team identities should be immediately recognizable:

🔴 RED🟢 GREEN🔵 SKY BLUE🟣 PURPLE

But the overall interface should remain neutral and premium.

Build the application carefully, systematically, and production-ready.