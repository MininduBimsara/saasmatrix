# 🛰️ Supabase Database & Security Integration Manual
**Project: SaasMatrix Hub**

This guide provides simple, step-by-step instructions to connect your **Supabase PostgreSQL database** with the SaasMatrix administrative panel. Running the SQL snippets below inside your Supabase project will immediately enable cloud synchronization with your offline-first local backups!

---

## 📋 Table of Contents
1. [Core Architecture Highlights](#1-core-architecture-highlights)
2. [Database Schema Initialization (SQL)](#2-database-schema-initialization-sql)
3. [Row-Level Security (RLS) Policies](#3-row-level-security-rls-policies)
4. [Setting Up Admin Auth Login](#4-setting-up-admin-auth-login)
5. [Connecting Env Keys to Your Workspace](#5-connecting-env-keys-to-your-workspace)
6. [Interactive Controls: Push vs. Pull](#6-interactive-controls-push-vs-pull)

---

## 1. Core Architecture Highlights

To ensure **0 Cumulative Layout Shift (CLS)** and maximize Google AdSense crawler compatibility, SaasMatrix is structured around a **Local-First hybrid strategy**:
* **Baseline Data Store:** Reusable assets live as light, compiled structures inside the codebase.
* **On-the-fly Overlays:** Fresh changes or newly added tools, comparative reviews, and blogs are maintained locally in the active browser storage module.
* **Supabase Core Integration:** The *Admin Sync Control center* replicates draft items directly into a secure remote PostgreSQL database on your command. Admins can reload from the database on any other device seamlessly!

---

## 2. Database Schema Initialization (SQL)

You need to create **three precise tables** in your Supabase database:
1. `saas_tools` — Catalog of SaaS programs and their metadata.
2. `saas_reviews` — In-depth comparisons and feature checklists.
3. `saas_blog_posts` — Inside blog issues & editorial updates.

### Copy-Paste SQL Seed Script
Log in to your **[Supabase Dashboard](https://supabase.com)**, navigate to the **SQL Editor** tab in the sidebar, and execute the following queries:

```sql
-- ==========================================
-- 1. DEFINE PRODUCTS / SAAS TOOLS
-- ==========================================
CREATE TABLE saas_tools (
  slug VARCHAR(150) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  starting_price VARCHAR(100),
  numeric_price NUMERIC(10,2) NOT NULL,
  category VARCHAR(150) NOT NULL,
  one_line_opinion TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. DEFINE COMPARISON MATRICES
-- ==========================================
CREATE TABLE saas_reviews (
  slug VARCHAR(150) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  tool_a VARCHAR(150) REFERENCES saas_tools(slug) ON DELETE SET NULL,
  tool_b VARCHAR(150) REFERENCES saas_tools(slug) ON DELETE SET NULL,
  category VARCHAR(150) NOT NULL,
  excerpt TEXT,
  read_time_minutes INT DEFAULT 5,
  publication_date VARCHAR(100) NOT NULL,
  verdict VARCHAR(100),
  winner_slug VARCHAR(150),
  hot_take_quote TEXT,
  final_verdict_paragraph TEXT,
  best_for_a TEXT,
  best_for_b TEXT,
  table_rows JSONB, -- Stores Side-by-Side matrix keys safely
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. DEFINE INSIDER DISPATCH (BLOG ISSUES)
-- ==========================================
CREATE TABLE saas_blog_posts (
  slug VARCHAR(150) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  issue_number INT NOT NULL,
  excerpt TEXT,
  read_time VARCHAR(100),
  publication_date VARCHAR(100) NOT NULL,
  category VARCHAR(255) NOT NULL,
  content_markdown TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Row-Level Security (RLS) Policies

To protect your cloud metadata and avoid malicious changes, we restrict write privileges to authenticated users, while allowing public read accessibility around the world.

Run the following SQL snippet inside the **Supabase SQL Editor** to lock your tables securely:

```sql
-- Enable Row Level Security
ALTER TABLE saas_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_blog_posts ENABLE ROW LEVEL SECURITY;

-- 1. Create PUBLIC READ policies (anyone can query the rows)
CREATE POLICY "Allow public read access for saas_tools"
ON saas_tools FOR SELECT USING (true);

CREATE POLICY "Allow public read access for saas_reviews"
ON saas_reviews FOR SELECT USING (true);

CREATE POLICY "Allow public read access for saas_blog_posts"
ON saas_blog_posts FOR SELECT USING (true);

-- 2. Create AUTHENTICATED WRITE policies (restricted to you)
CREATE POLICY "Allow authorized modifications for saas_tools"
ON saas_tools FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authorized modifications for saas_reviews"
ON saas_reviews FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authorized modifications for saas_blog_posts"
ON saas_blog_posts FOR ALL TO authenticated USING (true);
```

---

## 4. Setting Up Admin Auth Login

Instead of storing passwords in plain text, you can configure your administrator user through **Supabase Auth**:

1. Under the **Authentication** tab inside your Supabase dashboard, click **Users** &rarr; **Add User** &rarr; **Create User**.
2. Set the email address (e.g. `admin@saasmatrix.com`) and choose a strong, secure password.
3. (Optional) Turn off *User Email Confirmation* under **Auth Settings** if you wish to allow your new account to log in instantly without checking an inbox.

---

## 5. Connecting Env Keys to Your Workspace

To link your SaasMatrix site to your new database, we need to supply the platform with the API keys. 

1. Gather these fields from your Supabase panel (**Project Settings &rarr; API**):
   * **Project URL**: Starts with `https://...`
   * **Project API Anon Key**: The primary public string key.

2. In the AI Studio editor interface, declare these variables in your **Settings Tab**, or write them in your local `.env` setup:

```env
# Required for Live Supabase Synchronization
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_project_anon_key_here
```

---

## 6. Interactive Controls: Push vs. Pull

Once your keys are entered, revisit the protected `/admin` route on your live applet.
1. The **Admin Console** will transition dynamically to **Live Supabase Mode**.
2. Navigate to the **Backend Database** tab inside the dashboard.
3. **Push Local to Cloud:** Overwrite/upsert your existing browser edits to your live Postgres backend database.
4. **Pull Cloud Rows:** Fetch all rows from Supabase on another browser to hydrate the local state instantly!

---
*Document prepared by the Principal Frontend Engineer & Deployment Team © 2026.*
