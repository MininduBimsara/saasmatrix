# 6. Blog Scheduling Workflow

This page documents the admin blog queue feature that lets an admin prepare a week of articles in one session and publish them on a fixed cadence.

## What It Does

The blog system is now treated as a publish queue rather than a one-off editor.

1. An admin logs in and opens the **Dispatch Post Editor** section in `/admin`.
2. The admin can either create a single article or paste a JSON array of many article drafts into the **Weekly Bulk Scheduler**.
3. Each draft is converted into a full blog post object and assigned a publish timestamp.
4. The queue spaces posts using the configured interval, which defaults to **10 hours**.
5. The public blog list and blog detail pages only show entries whose publish time has already arrived.

## Core Data Rule

The implementation uses `publicationDate` as the source of truth for scheduling.

- If `publicationDate` is in the past or present, the post is visible.
- If `publicationDate` is in the future, the post stays hidden from the public blog pages.
- This keeps the storage model simple and avoids adding a second scheduling column.

## Admin Workflow

The admin page supports two ways to publish content:

### 1. Single Post Editor

Use the normal blog form when you want to publish one article immediately.

The form writes a single `BlogPost` object to the local blog store and, if Supabase sync is enabled, that record is also pushed to the `saas_blog_posts` table.

### 2. Weekly Bulk Scheduler

Use the bulk scheduler when you want to load a full week of content in one action.

The bulk payload is a JSON array. Each entry should include:

- `title`
- `excerpt`
- `category`
- `contentMarkdown`

Optional fields:

- `slug`
- `readTime`
- `issueNumber`

Example payload:

```json
[
  {
    "title": "Why seat-based pricing is collapsing",
    "excerpt": "The weekly procurement memo on usage-based billing.",
    "category": "Procurement Strategy",
    "readTime": "5 min read",
    "contentMarkdown": "### What changed\n\nAdd your article copy here."
  },
  {
    "title": "The next wave of SaaS monetization",
    "excerpt": "How pricing models are shifting over the next quarter.",
    "category": "Procurement Strategy",
    "readTime": "6 min read",
    "contentMarkdown": "### Overview\n\nAdd your article copy here."
  }
]
```

The scheduler will:

- Parse the JSON array
- Validate required fields
- Generate missing slugs from titles
- Assign issue numbers when not provided
- Space each post `10` hours apart by default
- Save the whole batch into the blog store in one operation

## Public Display Rules

The public blog index at `/blog` reads the merged blog list and filters it down to posts that have already reached their publish time.

The blog detail page at `/blog/[slug]` applies the same rule, so a future-scheduled article cannot be opened early from a direct link.

This means the site behaves like a content queue:

- the admin can preload future content
- the public pages only surface content when the scheduled publish time arrives

## How The Publish Time Is Formed

The bulk scheduler builds each article’s publish time from three inputs:

- a chosen start timestamp
- the interval in hours between posts
- the draft order in the JSON array

The first article uses the chosen start time, the second article is offset by the interval, the third article by twice the interval, and so on.

## Storage Model

The blog queue is stored in the same local-first data layer used by the rest of the app.

- Local state is persisted in browser storage.
- If Supabase is configured, the same blog entries can be synchronized to `saas_blog_posts`.
- The site does not require a separate scheduling table for the current implementation.

## Important Limitation

This is a publish-time visibility system, not a background cron worker.

That means:

- the posts become visible automatically as soon as the app reads the schedule and the publish time has passed
- if you need true server-side auto-publishing independent of page loads, you should add a scheduled job or Supabase Edge Function later

## Related Files

- [Admin page](../app/admin/page.tsx)
- [Shared scheduling helpers](../lib/blogSchedule.ts)
- [Blog index page](../app/blog/page.tsx)
- [Blog detail renderer](../components/BlogDetailsClient.tsx)
