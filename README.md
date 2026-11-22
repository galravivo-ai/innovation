# דשבורד דיגיטל – רשות החדשנות

דשבורד סטטי (HTML/CSS/JS) עם נתוני Google Analytics ו־Google Search Console, בעיצוב לפי ספר המותג של הרשות.
כתובת: https://galravivo-ai.github.io/innovation/

## מבנה הקבצים

| קובץ | מה יש בו |
|---|---|
| `index.html` | מבנה הדף: הכותרת, הטאבים והמסכים |
| `style.css` | העיצוב לפי ספר המותג: פלטות הצבע, פונט PingHL (או Heebo כגיבוי), מובייל ומצב כהה |
| `app.js` | טאבים, בחירת תקופה, גרפים, טבלאות וסוכן ה־AI. נתוני Google Analytics (לפי רבעון) נמצאים בראש הקובץ |
| `data.js` | נתוני Search Console. **מתעדכן אוטומטית כל בוקר**, לא עורכים אותו ידנית |
| `iia-logo-white.png`, `rego-logo.png` | הלוגואים |
| `scripts/refresh.mjs` | הסקריפט שמושך את הנתונים מגוגל וכותב את `data.js` |
| `scripts/config.json` | הגדרות: נכס ה־Search Console, תאריך התחלה, טווח הביטויים המובילים |
| `.github/workflows/refresh.yml` | מריץ את הסקריפט כל יום ב־04:00 UTC (בערך 06:00–07:00 בישראל) |

## רענון אוטומטי: הקמה חד־פעמית

הסקריפט מתחבר לגוגל עם **חשבון שירות** (service account): משתמש טכני של גוגל שקיבל הרשאת צפייה בלבד.

### 1. יצירת חשבון שירות ב־Google Cloud
1. נכנסים ל־https://console.cloud.google.com ויוצרים פרויקט חדש (למשל `iia-dashboard`).
2. בתפריט: **APIs & Services ← Library**, מחפשים **Google Search Console API** ולוחצים **Enable**.
   (לקראת שלב Analytics: מפעילים שם גם את **Google Analytics Data API**.)
3. **IAM & Admin ← Service Accounts ← Create service account**. נותנים שם (למשל `dashboard-refresh`) ולוחצים Done. לא צריך לתת לו תפקידים בפרויקט.
4. נכנסים לחשבון השירות שנוצר ← לשונית **Keys ← Add key ← Create new key ← JSON**. יורד קובץ JSON.
   זה המפתח. שומרים אותו במקום בטוח ולא שולחים אותו לאף אחד.
5. מעתיקים את כתובת המייל של חשבון השירות (נראית כמו `dashboard-refresh@iia-dashboard.iam.gserviceaccount.com`).

### 2. הרשאה ב־Search Console
1. ב־https://search.google.com/search-console בוחרים את הנכס של innovationisrael.org.il.
2. **Settings ← Users and permissions ← Add user**: מדביקים את מייל חשבון השירות, הרשאה **Restricted**.
3. אם הנכס אינו נכס דומיין (`sc-domain:innovationisrael.org.il`) אלא נכס URL, מעדכנים את `site` בקובץ `scripts/config.json`, למשל `https://innovationisrael.org.il/`.

### 3. המפתח ב־GitHub
1. ב־repository: **Settings ← Secrets and variables ← Actions ← New repository secret**.
2. Name: `GOOGLE_SA_KEY`. Secret: פותחים את קובץ ה־JSON בעורך טקסט ומדביקים את **כל** התוכן שלו.
3. **Add secret**. המפתח נשמר מוצפן, ולא רואים אותו בקוד ולא באתר.

### 4. הרצה ראשונה
1. **Actions ← Daily data refresh ← Run workflow**.
2. אחרי כדקה הריצה מסתיימת (סימון ירוק), ו־`data.js` מתעדכן. האתר מציג את הנתונים החדשים אחרי דקה־שתיים נוספות.
3. מכאן זה רץ לבד כל בוקר. התאריך "עודכן" בתחתית הדף מראה מתי היה הרענון האחרון.

אם הריצה נכשלת (סימון אדום), לוחצים עליה וקוראים את השגיאה בשלב "Pull fresh data from Google". השגיאות כתובות כך שיהיה ברור מה חסר (למשל, חשבון השירות לא נוסף כמשתמש בנכס).

## Google Analytics
נתוני Analytics עדיין קבועים (רבעון 3 2026, מתוך הדוח הרבעוני) ונמצאים בראש `app.js`. כדי לרענן גם אותם אוטומטית, צריך:
- להוסיף את מייל חשבון השירות כ־**Viewer** בכל נכס GA4 של הרשות (Admin ← Property access management);
- את מספרי הנכסים (Property ID) של האתר העברי, האנגלי, אתר AI ואתר BC, ואיך מופרדים עברית ואנגלית (נכסים נפרדים או נתיב `/en/`).

## הערות
- סוכן ה־AI ("שאלו את הנתונים") פועל רק כשהדף פתוח בתוך Claude. מחוץ לו הכפתור מוסתר.
- ב־repository ציבורי, כל מי שיש לו את הקישור יכול לראות את הנתונים (המפתח עצמו נשמר כסוד ולא נחשף).
- GitHub משהה ריצות מתוזמנות ב־repository שלא היה בו שינוי 60 יום. הרענון היומי עצמו נחשב שינוי, כך שזה לא אמור לקרות.
