"""Demo content for local development. Edit freely: `seed_demo` never overwrites a course that already exists
(unless you pass --reset), so your changes in the admin or the future course builder are safe."""

DEMO_PASSWORD = "NextGen-Demo-2026"

# One login per staff role. Emails use the reserved .test domain, so they can never be real addresses.
STAFF = [
    ("super_admin", "admin@nextgen.test", "Alice Admin"),
    ("instructor", "instructor@nextgen.test", "Ian Instructor"),
    ("reviewer", "reviewer@nextgen.test", "Rita Reviewer"),
    ("moderator", "moderator@nextgen.test", "Moses Moderator"),
    ("support", "support@nextgen.test", "Sandra Support"),
]

# (full name, email, country, email verified?)
LEARNERS = [
    ("Aline Uwase", "aline@nextgen.test", "Rwanda", True),
    ("Eric Mugisha", "eric@nextgen.test", "Rwanda", True),
    ("Grace Achieng", "grace@nextgen.test", "Kenya", True),
    ("David Okello", "david@nextgen.test", "Uganda", True),
    ("Chantal Ingabire", "chantal@nextgen.test", "Rwanda", True),
    ("Joseph Habimana", "joseph@nextgen.test", "Rwanda", False),
    ("Mary Wanjiru", "mary@nextgen.test", "Kenya", True),
    ("Patrick Niyonzima", "patrick@nextgen.test", "Rwanda", False),
]

DEPARTMENTS = ["Computing", "Business and Life Skills"]

# Enrollment plan: learner email -> [(course slug, "active" | "completed")]
ENROLLMENTS = {
    "aline@nextgen.test": [("web-development-basics", "completed"), ("python-for-beginners", "active")],
    "eric@nextgen.test": [("web-development-basics", "active"), ("entrepreneurship-basics", "active")],
    "grace@nextgen.test": [("python-for-beginners", "completed"), ("digital-skills-for-work", "completed")],
    "david@nextgen.test": [("digital-skills-for-work", "active")],
    "chantal@nextgen.test": [("entrepreneurship-basics", "completed"), ("web-development-basics", "active")],
    "mary@nextgen.test": [("python-for-beginners", "active")],
}

# Each course: modules -> lessons as (title, markdown content).
COURSES = [
    {
        "slug": "web-development-basics",
        "title": "Web Development Basics",
        "department": "Computing",
        "level": "beginner",
        "hours": 12,
        "status": "published",
        "description": (
            "Learn how websites work and build your first page from scratch. "
            "You will write HTML for structure, CSS for style and a little JavaScript for behaviour."
        ),
        "modules": [
            ("How the web works", [
                ("What happens when you open a website",
                 "When you type an address, your browser asks a **server** for the page. The server sends back "
                 "**HTML** (the content), **CSS** (the look) and **JavaScript** (the behaviour). "
                 "Your browser puts them together and shows the page."),
                ("HTML: the structure of a page",
                 "HTML uses **tags** to describe content: headings, paragraphs, links and images.\n\n"
                 "```html\n<h1>My first page</h1>\n<p>Hello from Kigali.</p>\n<a href=\"/about\">About me</a>\n```"),
            ]),
            ("Styling and interaction", [
                ("CSS: making it look right",
                 "CSS chooses elements and changes how they look.\n\n"
                 "```css\nh1 { color: #1e5bd0; font-size: 2rem; }\n```\n\n"
                 "Practice: change the colour and size of the heading on your page."),
                ("JavaScript: making it do things",
                 "JavaScript reacts to what the visitor does. A button click can change text on the page.\n\n"
                 "```js\ndocument.querySelector('button').onclick = () => alert('Hello!');\n```"),
            ]),
        ],
    },
    {
        "slug": "python-for-beginners",
        "title": "Python for Beginners",
        "department": "Computing",
        "level": "beginner",
        "hours": 15,
        "status": "published",
        "description": (
            "Start programming with Python, one of the most beginner-friendly languages. "
            "You will store data, make decisions and repeat work with loops."
        ),
        "modules": [
            ("First steps", [
                ("Installing Python and running code",
                 "Download Python from python.org, then open a terminal and type `python`. "
                 "You can now run code one line at a time.\n\n```python\nprint('Hello, world')\n```"),
                ("Variables and data types",
                 "A **variable** is a name for a value. Python has text (`str`), whole numbers (`int`), "
                 "decimals (`float`) and true/false values (`bool`).\n\n"
                 "```python\nname = 'Aline'\nage = 21\n```"),
            ]),
            ("Making decisions", [
                ("Conditions with if and else",
                 "Use `if` to run code only when something is true.\n\n"
                 "```python\nif age >= 18:\n    print('Adult')\nelse:\n    print('Minor')\n```"),
                ("Repeating work with loops",
                 "A `for` loop repeats code for each item in a list.\n\n"
                 "```python\nfor n in [1, 2, 3]:\n    print(n * 2)\n```"),
            ]),
        ],
    },
    {
        "slug": "digital-skills-for-work",
        "title": "Digital Skills for Work",
        "department": "Business and Life Skills",
        "level": "beginner",
        "hours": 8,
        "status": "published",
        "description": (
            "The everyday computer skills every workplace expects: staying safe online, "
            "writing clear emails and keeping files organised."
        ),
        "modules": [
            ("Working online safely", [
                ("Strong passwords and two-step sign-in",
                 "Use a long password you do not use anywhere else, such as four random words. "
                 "Turn on **two-step sign-in** so a stolen password alone is not enough."),
                ("Spotting phishing messages",
                 "Phishing messages pretend to be a bank or a boss and push you to click quickly. "
                 "Check the sender address, hover over links before clicking, and never share a code sent to your phone."),
            ]),
            ("Working with others", [
                ("Writing clear emails",
                 "Put the request in the first line, keep paragraphs short, and use a subject that says what you need. "
                 "Read it once before sending."),
                ("Sharing and organising files",
                 "Name files so anyone can find them, for example `2026-03-budget-v2`. "
                 "Share a link instead of attaching copies, so everyone sees the latest version."),
            ]),
        ],
    },
    {
        "slug": "entrepreneurship-basics",
        "title": "Entrepreneurship Basics",
        "department": "Business and Life Skills",
        "level": "intermediate",
        "hours": 10,
        "status": "published",
        "description": (
            "Turn an idea into something customers want. Learn to find a real problem, "
            "talk to customers, understand your costs and pitch in two minutes."
        ),
        "modules": [
            ("From idea to customer", [
                ("Finding a problem worth solving",
                 "Good businesses solve a problem people already have and will pay to fix. "
                 "List five problems you or people near you face, then pick the one that is most frequent and most painful."),
                ("Talking to customers before you build",
                 "Ask ten people about how they deal with the problem today. Listen for what they already pay for or work around. "
                 "Do not pitch your idea yet. You are collecting facts."),
            ]),
            ("Money basics", [
                ("Costs, prices and profit",
                 "**Profit = income - costs.** Add up fixed costs (rent) and variable costs (materials per item), "
                 "then set a price that covers both and leaves something for you."),
                ("Pitching your idea in two minutes",
                 "Cover four things: the problem, your solution, who it is for, and how you make money. "
                 "Practise out loud with a timer."),
            ]),
        ],
    },
    {
        "slug": "data-analysis-with-spreadsheets",
        "title": "Data Analysis with Spreadsheets",
        "department": "Computing",
        "level": "intermediate",
        "hours": 14,
        "status": "draft",
        "description": "Clean, summarise and chart data using formulas and pivot tables. Draft: waiting for review.",
        "modules": [
            ("Spreadsheet foundations", [
                ("Cells, rows and formulas",
                 "A formula starts with `=`. For example `=SUM(B2:B10)` adds the numbers in those cells."),
            ]),
        ],
    },
    {
        "slug": "introduction-to-cybersecurity",
        "title": "Introduction to Cybersecurity",
        "department": "Computing",
        "level": "intermediate",
        "hours": 16,
        "status": "draft",
        "description": "How attackers get in and how to stop them. Draft: still being written.",
        "modules": [
            ("Threats and defences", [
                ("Common attacks explained",
                 "Most attacks are simple: guessed passwords, tricked users and unpatched software. "
                 "Defence starts with updates, unique passwords and two-step sign-in."),
            ]),
        ],
    },
]
