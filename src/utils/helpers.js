export function formatDate(date) {
  if (!date) return "N/A";

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(new Date(date));
}

export function formatDateTime(date) {
  if (!date) return "N/A";

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(new Date(date));
}

export function isOverdue(date) {
  if (!date) return false;

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(
    `${date}T00:00:00`
  );

  return dueDate < today;
}

export function getProjectProgress(
  projectId,
  tasks
) {
  const projectTasks = tasks.filter(
    (task) =>
      task.projectId === projectId
  );

  if (projectTasks.length === 0) {
    return 0;
  }

  const completed =
    projectTasks.filter(
      (task) =>
        task.status === "Done"
    ).length;

  return Math.round(
    (completed /
      projectTasks.length) *
      100
  );
}

export function getPriorityWeight(
  priority
) {
  const weights = {
    Low: 1,
    Medium: 2,
    High: 3,
    Critical: 4,
  };

  return weights[priority] || 0;
}

export function getInitials(name = "") {
  return name
    .split(" ")
    .map((part) =>
      part.charAt(0)
    )
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function generateActivity(
  projects,
  tasks
) {
  const projectActivity =
    projects.map((project) => ({
      id: `project-${project.id}`,
      type: "project",
      title: `Project "${project.name}" created`,
      date: project.createdAt,
    }));

  const taskActivity =
    tasks.map((task) => ({
      id: `task-${task.id}`,
      type: "task",
      title: `Task "${task.title}" created`,
      date: task.createdAt,
    }));

  return [
    ...projectActivity,
    ...taskActivity,
  ].sort(
    (a, b) =>
      new Date(b.date) -
      new Date(a.date)
  );
}