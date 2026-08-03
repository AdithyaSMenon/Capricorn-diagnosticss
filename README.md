# Capricorn Diagnostics Website

A full-stack, responsive website for Capricorn Diagnostics — a leading diagnostic products distributor based in Kerala, India. Built with React + Vite + Supabase.

---

## 🚀 Quick Start

### 1. Clone / Open the Project
Navigate to `capricorn-diagnostics/` in your terminal.

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Create a new project (choose a region closest to India, e.g. Singapore).
3. Once the project is ready, go to **Settings → API**.
4. Copy your **Project URL** and **anon public** key.

### 4. Configure Environment Variables
```bash
# Copy the example file
cp .env.example .env
```
Open `.env` and fill in your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Run the Database Schema
1. In your Supabase project, go to **SQL Editor**.
2. Open `supabase_schema.sql` from this project folder.
3. Paste the entire contents into the SQL Editor and click **Run**.
4. This creates all tables, enables RLS, and seeds default data.

### 6. Create an Admin User
1. In Supabase, go to **Authentication → Users**.
2. Click **Add User** → **Create New User**.
3. Enter an email and password (these are your admin login credentials).

### 7. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

---

## 📄 Pages

| Route | Description |
|---|---|
| `/` | Homepage |
| `/about` | About Us |
| `/products` | Products (with category filter) |
| `/brand-partners` | Brand Partners |
| `/lab-solutions` | Laboratory Solutions |
| `/contact` | Contact Us + Enquiry Form |
| `/admin/login` | Admin Login |
| `/admin` | Admin Dashboard (protected) |
| `/admin/products` | Manage Products |
| `/admin/categories` | Manage Categories |
| `/admin/brands` | Manage Brands |
| `/admin/company` | Edit Company Info & Stats |
| `/admin/enquiries` | View Enquiries |

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── layout/    # Navbar, Footer, Layout
│   └── ui/        # PlaceholderImage, LoadingSpinner
├── context/       # AuthContext (Supabase auth)
├── lib/           # supabase.js client
├── pages/
│   ├── admin/     # All admin pages
│   └── *.jsx      # Public pages
└── styles/        # CSS modules per page
```

---

## 🗄️ Database Tables

| Table | Purpose |
|---|---|
| `categories` | Product categories |
| `brands` | Brand partners |
| `products` | All products (linked to category + brand) |
| `company_info` | Key-value store for editable content |
| `stats` | Homepage statistics |
| `enquiries` | Contact form submissions |

---

## 🔒 Adding Content (Admin)

1. Log in at `/admin/login` with your Supabase admin credentials.
2. First, add your **Categories** and **Brands**.
3. Then add **Products** — assign each to a category and brand, add descriptions, brochure PDF URLs, and image URLs.
4. Edit company info, stats and contact details from **Company Info**.

---

## 📦 Build for Production
```bash
npm run build
```
Deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages, etc.).

> **Important**: Set environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in your hosting platform's dashboard too.

---

## 🛠️ Tech Stack
- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: Vanilla CSS with CSS custom properties
- **Backend**: Supabase (PostgreSQL + Auth)
- **Font**: Inter (Google Fonts)
