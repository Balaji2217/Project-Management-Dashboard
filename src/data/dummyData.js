const today = new Date();

function dateFromNow(days) {
  const date = new Date(today);

  date.setDate(
    date.getDate() + days
  );

  return date
    .toISOString()
    .split("T")[0];
}

function timestampFromNow(days) {
  const date = new Date(today);

  date.setDate(
    date.getDate() + days
  );

  return date.toISOString();
}

export const dummyUsers = [
  {
    id: "user-1",
    name: "Balaji",
    email: "balaji@example.com",
    role: "Project Manager",
  },
  {
    id: "user-2",
    name: "Arun Kumar",
    email: "arun@example.com",
    role: "Frontend Developer",
  },
  {
    id: "user-3",
    name: "Priya Sharma",
    email: "priya@example.com",
    role: "UI/UX Designer",
  },
  {
    id: "user-4",
    name: "Rahul Singh",
    email: "rahul@example.com",
    role: "Backend Developer",
  },
  {
    id: "user-5",
    name: "Kavin Raj",
    email: "kavin@example.com",
    role: "QA Engineer",
  },
];

export const dummyProjects = [
  {
    id: "project-1",
    name: "Website Redesign",
    description:
      "Redesign the company website with a modern responsive interface.",
    startDate: dateFromNow(-20),
    deadline: dateFromNow(15),
    status: "Active",
    priority: "High",
    members: [
      "user-1",
      "user-2",
      "user-3",
    ],
    createdAt: timestampFromNow(-20),
    updatedAt: timestampFromNow(-1),
  },

  {
    id: "project-2",
    name: "Mobile Application",
    description:
      "Build a cross-platform mobile application.",
    startDate: dateFromNow(-10),
    deadline: dateFromNow(30),
    status: "Planning",
    priority: "Critical",
    members: [
      "user-1",
      "user-4",
      "user-5",
    ],
    createdAt: timestampFromNow(-10),
    updatedAt: timestampFromNow(-2),
  },

  {
    id: "project-3",
    name: "Marketing Dashboard",
    description:
      "Analytics dashboard for marketing performance.",
    startDate: dateFromNow(-40),
    deadline: dateFromNow(5),
    status: "Active",
    priority: "Medium",
    members: [
      "user-2",
      "user-3",
    ],
    createdAt: timestampFromNow(-40),
    updatedAt: timestampFromNow(-3),
  },

  {
    id: "project-4",
    name: "Internal HR Portal",
    description:
      "Internal employee management portal.",
    startDate: dateFromNow(-60),
    deadline: dateFromNow(-5),
    status: "Completed",
    priority: "Low",
    members: [
      "user-1",
      "user-4",
    ],
    createdAt: timestampFromNow(-60),
    updatedAt: timestampFromNow(-5),
  },
];

export const dummyTasks = [
  {
    id: "task-1",
    title: "Create wireframes",
    description:
      "Prepare wireframes for the redesigned website.",
    projectId: "project-1",
    assignedTo: "Priya Sharma",
    priority: "High",
    status: "Done",
    dueDate: dateFromNow(-5),
    tags: ["design", "ui"],
    comments: [],
    createdAt: timestampFromNow(-15),
    updatedAt: timestampFromNow(-5),
  },

  {
    id: "task-2",
    title: "Build navigation",
    description:
      "Implement responsive website navigation.",
    projectId: "project-1",
    assignedTo: "Arun Kumar",
    priority: "Medium",
    status: "In Progress",
    dueDate: dateFromNow(4),
    tags: ["frontend", "navigation"],
    comments: [],
    createdAt: timestampFromNow(-8),
    updatedAt: timestampFromNow(-1),
  },

  {
    id: "task-3",
    title: "Design landing page",
    description:
      "Create the new landing page design.",
    projectId: "project-1",
    assignedTo: "Priya Sharma",
    priority: "Critical",
    status: "Review",
    dueDate: dateFromNow(2),
    tags: ["design", "landing"],
    comments: [],
    createdAt: timestampFromNow(-7),
    updatedAt: timestampFromNow(-1),
  },

  {
    id: "task-4",
    title: "Setup repository",
    description:
      "Create repository and configure development environment.",
    projectId: "project-2",
    assignedTo: "Rahul Singh",
    priority: "High",
    status: "Todo",
    dueDate: dateFromNow(7),
    tags: ["backend", "setup"],
    comments: [],
    createdAt: timestampFromNow(-3),
    updatedAt: timestampFromNow(-3),
  },

  {
    id: "task-5",
    title: "Create authentication API",
    description:
      "Build authentication endpoints.",
    projectId: "project-2",
    assignedTo: "Rahul Singh",
    priority: "Critical",
    status: "In Progress",
    dueDate: dateFromNow(10),
    tags: ["api", "authentication"],
    comments: [],
    createdAt: timestampFromNow(-4),
    updatedAt: timestampFromNow(-1),
  },

  {
    id: "task-6",
    title: "Prepare analytics cards",
    description:
      "Build cards for displaying marketing statistics.",
    projectId: "project-3",
    assignedTo: "Arun Kumar",
    priority: "Medium",
    status: "Todo",
    dueDate: dateFromNow(3),
    tags: ["analytics", "frontend"],
    comments: [],
    createdAt: timestampFromNow(-6),
    updatedAt: timestampFromNow(-2),
  },

  {
    id: "task-7",
    title: "Test dashboard",
    description:
      "Perform functional testing on the dashboard.",
    projectId: "project-3",
    assignedTo: "Kavin Raj",
    priority: "High",
    status: "Review",
    dueDate: dateFromNow(1),
    tags: ["testing", "qa"],
    comments: [],
    createdAt: timestampFromNow(-4),
    updatedAt: timestampFromNow(-1),
  },

  {
    id: "task-8",
    title: "Employee import",
    description:
      "Implement employee data import functionality.",
    projectId: "project-4",
    assignedTo: "Rahul Singh",
    priority: "Low",
    status: "Done",
    dueDate: dateFromNow(-15),
    tags: ["hr", "backend"],
    comments: [],
    createdAt: timestampFromNow(-30),
    updatedAt: timestampFromNow(-15),
  },
];

export const dummyComments = [
  {
    id: "comment-1",
    taskId: "task-1",
    userId: "user-1",
    userName: "Balaji",
    text: "Looks good. Let's proceed.",
    createdAt: timestampFromNow(-6),
  },
];