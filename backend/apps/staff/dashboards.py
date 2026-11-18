"""Dashboard definitions per role. The frontend draws its navigation from this.
Each section: key (URL), label, items (the features inside it). 'overview' is the home page."""


def S(key, label, *items):
    return {"key": key, "label": label, "items": list(items)}


DASHBOARDS = {
    "super_admin": {
        "title": "Super Admin / Platform Owner",
        "kpis": ["total_users", "signups_today", "signups_week", "signups_month", "active_now",
                 "courses_published", "courses_draft", "total_enrollments", "completion_rate"],
        "sections": [
            S("overview", "Overview", "KPI cards", "Growth chart", "Learners by country", "Device and browser breakdown"),
            S("users", "User management", "All users table with search, filters, bulk actions",
              "Create, suspend, ban, delete, restore accounts", "Impersonate user (logged)", "Pending verifications and blocked accounts"),
            S("roles", "Roles and permissions", "Staff list with role, status, last active", "Permission matrix",
              "Create custom roles", "Invite or deactivate staff"),
            S("courses", "Course oversight", "All courses with status, instructor, enrollments, rating",
              "Force publish, unpublish, archive", "Category and tag manager", "Featured courses"),
            S("settings", "Platform settings", "Branding and homepage content", "Email templates and notification rules",
              "Languages, time zone, terms and privacy pages", "Registration rules"),
            S("integrations", "Integrations", "Video hosting", "Email service", "Analytics", "Payment gateway (Stage 2)",
              "Single sign-on", "API keys and webhooks"),
            S("health", "System health", "Uptime, load, storage, bandwidth, error rate", "Backup status and restore points",
              "Security alerts and failed logins"),
            S("audit", "Audit log", "Searchable record of sensitive actions", "Export as CSV/PDF"),
            S("reports", "Reports", "Custom report builder", "Scheduled reports by email", "Data export"),
            S("compliance", "Data and compliance", "Data deletion requests", "Consent records", "Cookie settings"),
        ],
    },
    "instructor": {
        "title": "Course Creator / Instructor",
        "kpis": ["total_learners", "enrollments_week", "completion_rate", "avg_quiz_score", "avg_rating", "unanswered_questions"],
        "sections": [
            S("overview", "Overview", "KPI cards", "Today panel"),
            S("my-courses", "My courses", "Status list: draft, in review, changes requested, published, archived",
              "Per-course card with enrollments, completion, rating", "Create, duplicate, archive"),
            S("builder", "Course builder", "Course details and learning outcomes", "Drag-and-drop curriculum editor",
              "Lesson types: video, text, PDF, audio, resources, links", "Upload manager", "Captions and transcripts",
              "Preview as learner", "Version history", "Submit for review with checklist"),
            S("assessments", "Quizzes and assessments", "Question bank", "Quiz settings: time, attempts, pass mark, randomization",
              "Assignment creator with rubric", "Grading queue"),
            S("analytics", "Learner analytics", "Enrollment trend", "Lesson drop-off chart", "Video watch time",
              "Quiz analytics", "Learner list with progress"),
            S("engagement", "Engagement", "Q&A inbox", "Discussion threads", "Announcements", "Direct messages", "Ratings and reviews"),
            S("feedback", "Feedback from staff", "Reviewer comments", "Requested changes", "Approval history"),
            S("resources", "Resources", "Instructor guide", "Style guide", "Content guidelines", "Templates"),
        ],
    },
    "reviewer": {
        "title": "Content Reviewer / Editor",
        "kpis": ["pending_reviews", "approved_week", "returned", "avg_review_time", "oldest_waiting"],
        "sections": [
            S("overview", "Overview", "KPI cards", "Today panel"),
            S("queue", "Review queue", "Tabs: pending, in progress, approved, rejected, changes requested, resubmitted",
              "Filters and sorting", "Claim or assign a review"),
            S("workspace", "Review workspace", "Course preview as a learner sees it", "Quality checklist",
              "Inline comments", "Scoring rubric", "Approve, request changes, reject (reason required)"),
            S("comments", "Comment threads", "Conversation per course with open/resolved status"),
            S("monitoring", "Published content monitoring", "Reported outdated or inaccurate courses",
              "Scheduled re-review reminders", "Plagiarism and duplicate alerts"),
            S("standards", "Standards library", "Content guidelines", "Checklist editor", "Rejection reason templates"),
            S("performance", "Performance", "Reviews per week", "Turnaround time", "Resubmission rate"),
        ],
    },
    "moderator": {
        "title": "Community Moderator",
        "kpis": ["open_flags", "reported_users", "new_posts_today", "avg_response_time", "active_discussions", "actions_week"],
        "sections": [
            S("overview", "Overview", "KPI cards", "Today panel"),
            S("flagged", "Flagged content queue", "Flagged posts, comments, reviews", "Approve, edit, remove, hide, warn, escalate", "Bulk spam actions"),
            S("reported-users", "Reported users", "Profile snapshot with history", "Warn, mute, suspend, ban request", "Strike system"),
            S("discussions", "Discussion management", "Live feed", "Pin, lock, move, merge, delete", "Unanswered threads", "Trending topics"),
            S("automod", "Auto-moderation settings", "Banned words", "Link and spam filters", "New-user post limits", "Image rules"),
            S("mod-log", "Moderation log", "Every action with reason, time, moderator"),
            S("guidelines", "Community guidelines", "Editable rules", "Warning and ban templates"),
            S("community-health", "Community health metrics", "Active members", "Posts per day", "Toxicity rate", "Top contributors"),
            S("escalation", "Escalation tools", "Send case to Admin or Support with notes"),
        ],
    },
    "support": {
        "title": "Support Agent",
        "kpis": ["open_tickets", "unassigned_tickets", "first_response_time", "resolution_time", "csat", "resolved_today"],
        "sections": [
            S("overview", "Overview", "KPI cards", "Today panel"),
            S("tickets", "Ticket inbox", "Email, in-app, chat, social in one place", "Statuses and priorities",
              "Filters by category", "Assign, merge, tag, internal notes"),
            S("ticket-view", "Ticket view", "Conversation history and attachments", "Learner profile sidebar", "Canned responses",
              "Quick actions: reset password, resend verification, unlock, re-enroll, extend access", "Escalate"),
            S("live-chat", "Live chat", "Active chats", "Waiting visitors", "Transcripts"),
            S("knowledge-base", "Knowledge base", "Searchable articles", "Insert into replies", "Suggest or flag articles"),
            S("known-issues", "Known issues board", "Current outages and bugs with status updates"),
            S("bug-reports", "Bug reports", "Form with device, browser, steps"),
            S("performance", "Performance", "Tickets handled", "Response and resolution times", "CSAT comments", "Issue trends"),
            S("sla", "Service targets", "SLA timers per ticket", "Breach warnings"),
        ],
    },
}

# Human labels for KPI keys
KPI_LABELS = {
    "total_users": "Total users", "signups_today": "Sign-ups today", "signups_week": "Sign-ups this week",
    "signups_month": "Sign-ups this month", "active_now": "Active learners now",
    "courses_published": "Courses published", "courses_draft": "Courses in draft",
    "total_enrollments": "Total enrollments", "completion_rate": "Completion rate (%)",
    "total_learners": "Total learners", "enrollments_week": "New enrollments this week",
    "avg_quiz_score": "Average quiz score", "avg_rating": "Average rating", "unanswered_questions": "Unanswered questions",
    "pending_reviews": "Pending reviews", "approved_week": "Approved this week", "returned": "Returned",
    "avg_review_time": "Average review time", "oldest_waiting": "Oldest item waiting",
    "open_flags": "Open flags", "reported_users": "Reported users", "new_posts_today": "New posts today",
    "avg_response_time": "Average response time", "active_discussions": "Active discussions", "actions_week": "Actions this week",
    "open_tickets": "Open tickets", "unassigned_tickets": "Unassigned tickets", "first_response_time": "First-response time",
    "resolution_time": "Resolution time", "csat": "Satisfaction (CSAT)", "resolved_today": "Resolved today",
}
