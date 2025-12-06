# IncomeWeb - Google Sheets Transaction Viewer

A modern, production-ready web application that connects to Google Spreadsheet and displays transaction data with advanced filtering, sorting, and pagination features.

## 🎯 Features

- ✅ **Google Apps Script Backend** - Secure data fetching from Google Sheets
- ✅ **Modern UI** - Built with React, Tailwind CSS v4, and Lucide icons
- ✅ **Dark Mode** - Smooth dark/light theme toggle
- ✅ **RTL Support** - Full Arabic language support with proper text rendering
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Advanced Filtering** - Search by payer, description, amount + month/year filters
- ✅ **Column Sorting** - Click headers to sort ascending/descending
- ✅ **Pagination** - Configurable page sizes (10/25/50 rows)
- ✅ **Summary Stats** - Total transactions and amount displayed
- ✅ **PDF Links** - Direct links to PDF documents

## 📋 Prerequisites

- Node.js 16+ and npm
- A Google account with access to Google Sheets
- Basic knowledge of Google Apps Script

---

## 🚀 Part A: Google Apps Script Backend

### Step 1: Prepare Your Google Sheet

1. Create a new Google Sheet or open an existing one
2. Rename the first sheet to **`sheet1`** (or update `SHEET_NAME` in the script)
3. Add these exact headers in row 1:
   ```
   transaction_date | payer | description | amount | mo | yr | pdf
   ```
4. Add your data rows below the headers
   - Date format: `MM/DD/YYYY` (e.g., `10/24/2022`)
   - Amount format: `$XXX.XX` (e.g., `$973.00` or `$17,473.15`)

### Step 2: Deploy the Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code in `Code.gs`
3. Copy the entire contents of `google-apps-script/Code.js` from this project
4. Paste it into `Code.gs`
5. Click **Save** (💾 icon)
6. Click **Deploy > New deployment**
7. Click the gear icon ⚙️ next to "Select type" and choose **Web app**
8. Configure the deployment:
   - **Description**: `v1` (or any version name)
   - **Execute as**: **Me** (your Google account)
   - **Who has access**: **Anyone** ⚠️ (for public read access without OAuth)
9. Click **Deploy**
10. **Authorize** the script when prompted (review permissions and click "Allow")
11. **Copy the Web App URL** - it will look like:
    ```
    https://script.google.com/macros/s/AKfycby.../exec
    ```
12. Keep this URL safe - you'll need it for the frontend!

### Step 3: Test the Backend

Open the Web App URL in your browser. You should see JSON output like:

```json
{
  "headers": ["transaction_date","payer","description","amount","mo","yr","pdf"],
  "rows": [
    {
      "transaction_date": "10/24/2022",
      "transaction_date_raw": "10/24/2022",
      "transaction_date_iso": "2022-10-24",
      "payer": "معاش نقابة المهندسين",
      "description": "...",
      "amount": "$973.00",
      "amount_value": 973.00,
      "mo": "10",
      "yr": "2022",
      "pdf": "inc10.pdf"
    }
  ]
}
```

---

## 🎨 Part B: Frontend Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure the API URL

Create a `.env` file in the project root:

```env
VITE_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Replace `YOUR_DEPLOYMENT_ID` with your actual Apps Script Web App URL from Part A, Step 2.

**Alternative**: If you don't create a `.env` file, the app will use mock data for development.

### Step 3: Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Step 4: Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

---

## 📦 Deployment Options

### Option 1: Netlify (Recommended)

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign in
3. Click "Add new site > Import an existing project"
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your Google Apps Script Web App URL
7. Click "Deploy site"

### Option 2: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Add environment variable in Vercel dashboard:
   - `VITE_API_URL` = Your Apps Script URL

### Option 3: GitHub Pages

1. Install gh-pages: `npm install -D gh-pages`
2. Add to `package.json`:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```
3. Update `vite.config.js`:
   ```js
   export default {
     base: '/your-repo-name/'
   }
   ```
4. Run: `npm run deploy`

### Option 4: Static File Hosting

Upload the contents of the `dist/` folder to any static hosting service:
- AWS S3 + CloudFront
- Firebase Hosting
- Cloudflare Pages
- Azure Static Web Apps

---

## 🔒 Part E: Security & Authentication (Optional)

### Current Setup (Public Read Access)

The current deployment allows **anyone** with the Web App URL to read your sheet data. This is suitable for:
- Public data
- Internal company use (URL kept private)
- Demo/testing purposes

### Adding OAuth Authentication

To restrict access to authenticated Google users:

1. **Update Apps Script Deployment**:
   - Go to your Apps Script project
   - Click **Deploy > Manage deployments**
   - Click ✏️ Edit on your deployment
   - Change **Who has access** to: **Only myself** or **Anyone with Google account**
   - Click **Deploy**

2. **Update Frontend** (requires Google Sign-In):
   - Install: `npm install @react-oauth/google`
   - Wrap your app with `GoogleOAuthProvider`
   - Add login button and pass access token with API requests
   - Update Apps Script to verify the token

### Adding Write Operations (CRUD)

To add create/update/delete functionality:

1. **Update Apps Script**:
   ```javascript
   function doPost(e) {
     const action = e.parameter.action;
     const data = JSON.parse(e.postData.contents);
     
     if (action === 'create') {
       // Add new row
     } else if (action === 'update') {
       // Update existing row
     } else if (action === 'delete') {
       // Delete row
     }
   }
   ```

2. **Update Frontend API**:
   ```javascript
   export async function createRow(rowData) {
     const response = await fetch(API_URL, {
       method: 'POST',
       body: JSON.stringify({ action: 'create', data: rowData })
     });
     return response.json();
   }
   ```

---

## 🌍 Part F: RTL & Arabic Support

The app includes full RTL (Right-to-Left) support:

- **Fonts**: Cairo (Arabic) and Inter (English) from Google Fonts
- **Auto-detection**: Uses `dir="auto"` to automatically detect text direction
- **Styling**: All components support RTL layout

To enable **full Arabic UI** (translate all labels):

1. Create `src/lib/i18n.js`:
   ```javascript
   export const translations = {
     en: {
       search: "Search...",
       clear: "Clear",
       // ... more labels
     },
     ar: {
       search: "بحث...",
       clear: "مسح",
       // ... more labels
     }
   };
   ```

2. Use a library like `react-i18next` for dynamic language switching

---

## 📊 Example JSON Response

```json
{
  "headers": ["transaction_date","payer","description","amount","mo","yr","pdf"],
  "rows": [
    {
      "transaction_date": "10/24/2022",
      "transaction_date_raw": "10/24/2022",
      "transaction_date_iso": "2022-10-24",
      "payer": "معاش نقابة المهندسين",
      "description": "ﻣﺪﻓﻮﻋﺎت ACH ﻣﺮﺗﺒﺎت ﺷﺮﻛﺎت -On Us-Payroll (corporate) Egyptian Engineers Syndicate - pension fund",
      "amount": "$973.00",
      "amount_value": 973.00,
      "mo": "10",
      "yr": "2022",
      "pdf": "inc10.pdf"
    },
    {
      "transaction_date": "10/19/2022",
      "transaction_date_raw": "10/19/2022",
      "transaction_date_iso": "2022-10-19",
      "payer": "ASA",
      "description": "ﻣﺪﻓﻮﻋﺎت ﺣﻜﻮﻣﻴﺔ-FROM-و.ح اﻻوﻟﻰ ﻻدارة ﻣﺮاﻗﺒﺔ اﻟﺤﺴﺎﺑﺎت ﺑﺎﻟﺠﻬﺎز اﻟﻤﺮﻛﺰى",
      "amount": "$17,473.15",
      "amount_value": 17473.15,
      "mo": "10",
      "yr": "2022",
      "pdf": "inc10.pdf"
    }
  ]
}
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Backend**: Google Apps Script
- **Data Source**: Google Sheets

---

## 📝 Project Structure

```
IncomeWeb/
├── google-apps-script/
│   └── Code.js              # Apps Script backend
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx   # Reusable button component
│   │   │   ├── Card.jsx     # Card container
│   │   │   └── Input.jsx    # Input field
│   │   ├── DataTable.jsx    # Main table component
│   │   ├── Filters.jsx      # Search and filter controls
│   │   ├── Header.jsx       # App header with dark mode toggle
│   │   └── Summary.jsx      # Summary statistics
│   ├── lib/
│   │   ├── api.js           # API fetch logic
│   │   ├── mockData.js      # Sample data for development
│   │   └── utils.js         # Utility functions
│   ├── App.jsx              # Main app component
│   ├── index.css            # Global styles
│   └── main.jsx             # App entry point
├── .env                     # Environment variables (create this)
├── package.json
├── postcss.config.js
└── README.md
```

---

## 🎯 Usage

1. **Search**: Type in the search box to filter by payer, description, or amount
2. **Filter by Date**: Enter month (MM) and year (YYYY) to filter transactions
3. **Sort**: Click any column header to sort ascending/descending
4. **Pagination**: Use the controls at the bottom to navigate pages
5. **Dark Mode**: Click the moon/sun icon in the header
6. **View PDF**: Click the PDF icon in each row to open the document

---

## 🐛 Troubleshooting

### "No API URL provided, using mock data"
- Create a `.env` file with `VITE_API_URL=your_apps_script_url`
- Restart the dev server after creating `.env`

### "Failed to fetch data"
- Check that your Apps Script is deployed with "Anyone" access
- Verify the Web App URL is correct
- Check browser console for CORS errors

### Arabic text not displaying correctly
- Ensure Google Fonts are loading (check Network tab)
- Verify `dir="auto"` is present on text elements

### Build fails
- Delete `node_modules` and run `npm install` again
- Clear npm cache: `npm cache clean --force`

---

## 📄 License

MIT License - feel free to use this project for any purpose!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using React, Tailwind CSS, and Google Apps Script**
