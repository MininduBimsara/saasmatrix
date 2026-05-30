# Admin Panel Simple English Guide

This website is a SaaS comparison site. People use it to compare software tools, read comparison reviews, and read blog articles about pricing and product choices. The public site has pages for the home page, reviews, blog posts, comparison pages, a calculator, newsletter signup, contact, about, privacy, terms, and disclaimers. The admin panel is where you add the content that fills those pages.

The admin panel is local-first. That means your edits are saved in the browser first, and then you can push them to Supabase if the cloud setup is connected.

## How To Open The Admin Panel

Open `/admin` in the browser. If you see the login screen, sign in first. If Supabase auth is connected, use your Supabase email and password. If the site is using fallback demo access, the login uses `admin` and `password123`.

After login, you will see these tabs:

- Metrics Overview
- Manage Tools Index
- Manage Review Matrices
- Dispatch Post Editor
- Database Sync Setup

The dashboard tab shows counts and status. The other tabs are where you add content.

## What The Website Does

The site has three main content types:

1. Tools. These are the software products people compare.
2. Reviews. These are side-by-side comparison pages between two tools.
3. Blog posts. These are longer articles about software, pricing, and business topics.

If you add a tool, it can appear in the tool list and in reviews. If you add a review, it can appear on the reviews page and the comparison page. If you add a blog post, it can appear in the blog list and on the article page.

## General Rules

Use short, clear text. Use real product names, real prices, and real details when possible. Use lowercase slugs with hyphens. Use the site’s category list, such as accounting, project-management, crm, hr-payroll, communications, developer-tools, marketing, or design. If you need facts, check the product’s official site, pricing page, help center, or docs.

## Add Or Edit A Tool

Open **Manage Tools Index**.

- **Tool Name**: Type the full product name. Example: `Asana Enterprise`.
- **Dynamic URL Slug (Auto)**: This becomes the page URL. Example: `asana-enterprise`. Keep it lowercase and use hyphens.
- **Vertical Category**: Choose the best category for the product. Example: `project-management`.
- **Starting Monthly price**: Enter only the number. Example: type `15` for `$15/mo`.
- **One Line Opinion**: Write one short summary sentence about the tool.
- **Product Brand Icon**: Upload the logo or paste a logo image URL. Use the product’s official brand image when possible.

Where to get the data: product name and price from the pricing page, category from the product’s main use, opinion from your own summary, and logo from the brand page or press kit.

Click **Sync Tool Entry** to save the tool.

## Add Or Edit A Comparison Review

Open **Manage Review Matrices**.

- **Review Headline**: Type the full comparison title. Example: `Asana Enterprise vs ClickUp Workspace: Project Management Audited`.
- **Review Dynamic Slug (Auto)**: This becomes the review URL. Example: `asana-vs-clickup`.
- **Select Tool Name A**: Pick the first tool from the tool list.
- **Select Tool Name B**: Pick the second tool from the tool list.
- **Niche Category Match**: Choose the category that fits the comparison.
- **Editor Award selection**: Pick the final style. `Editor Pick` means your best choice, `Hot Take Winner` means a strong opinion, and `Evaluative Tie` means both tools are close.
- **Winner Pick candidate**: Type the slug of the winning tool, such as `asana` or `clickup`.
- **Date Issued**: Type the display date for the review.
- **Excerpt / Pitch Sentence**: Write one short sentence that explains the review.
- **Editorial Hot-Take**: Write a short sharp opinion line.
- **Best For Tool A** and **Best For Tool B**: Say which kind of user should choose each tool.
- **Final Verdict Statement**: Write the final conclusion in full.

The comparison rows are the detailed table in the review.

- **Feature evaluated**: Name the thing you are comparing, like pricing or automations.
- **Tool A value spec**: Explain how tool A performs on that feature.
- **Tool B value spec**: Explain how tool B performs on that feature.
- **Row Winner Name**: Say which tool wins that row.

Use feature lists, pricing pages, demos, and your own testing notes to fill in the review. Click **Compile Complete Review Matrix** when you are done.

## Add Or Edit A Blog Article

Open **Dispatch Post Editor**.

You can add one article by hand or paste a JSON batch for scheduled publishing.

- **Article Title**: Type the article headline.
- **Url slug (Auto)**: This is the article URL. Keep it simple and lowercase.
- **Issue Count**: Enter the issue number.
- **Growth Category tag**: Type the topic label for the article.
- **Read Time stamp**: Type a label like `5 min read`.
- **Publication Date label**: Type the display date, such as `May 28, 2026`.
- **Excerpt Summary statement**: Write a short summary for the list page.
- **Essay Body Content**: Write the full article. This field supports simple Markdown.

For article data, use your article plan, your editorial notes, and your draft text. The title and excerpt come from the article idea, the issue number is the next number in your series, and the body is the full copy you want people to read.

For bulk upload, each JSON item should include `title`, `excerpt`, `category`, and `contentMarkdown`. You can also add `slug`, `readTime`, and `issueNumber`.

Click **Sync and Publish Dispatch Issue** to save the article.

## Use The Database Sync Tab

Open **Database Sync Setup** when you want to connect browser edits to Supabase.

- **Push Local Storage up to Supabase**: Sends your local changes to the cloud database.
- **Pull Cloud database into Local Storage**: Brings the cloud data back into the browser.

Use push after you finish editing locally. Use pull when the cloud data is newer or when you want to refresh the browser.

## Final Tips

Start with tools first, because reviews need tools to exist. Keep slugs consistent across tools, reviews, and blog posts. Keep text short and easy to read. Check the public pages after each save. If something looks wrong, refresh the admin panel or pull data from Supabase again.

In short, the admin panel is where you enter the source data for the website. Tools are the base items. Reviews connect two tools. Blog posts explain the ideas in more detail. If you enter the fields carefully and use real source data, the public website will stay clear and easy to manage.
