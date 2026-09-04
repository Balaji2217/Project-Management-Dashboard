import { useMemo } from "react";
import { Link } from "react-router-dom";

import useLocalStorage from "../hooks/useLocalStorage";

import {
  dummyProjects,
  dummyTasks,
} from "../data/dummyData";

import {
  getProjectProgress,
  isOverdue,
  formatDate,
} from "../utils/helpers";

export default function Dashboard() {
  const [projects] = useLocalStorage(
    "pm_projects",
    dummyProjects
  );

  const [tasks] = useLocalStorage(
    "pm_tasks",
    dummyTasks
  );

  const stats = useMemo(() => {
    const completed = tasks.filter(
      (task) => task.status === "Done"
    ).length;

    const pending = tasks.length - completed;

    const overdue = tasks.filter(
      (task) =>
        task.status !== "Done" &&
        isOverdue(task.dueDate)
    ).length;

    const highPriority = tasks.filter(
      (task) =>
        task.priority === "High" ||
        task.priority === "Critical"
    ).length;

    return {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      completed,
      pending,
      overdue,
      highPriority,
      completion: tasks.length
        ? Math.round(
            (completed / tasks.length) * 100
          )
        : 0,
    };
  }, [projects, tasks]);

  const recentProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 4);

  const recentTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 5);

  const upcoming = [...tasks]
    .filter(
      (task) =>
        task.status !== "Done" &&
        !isOverdue(task.dueDate)
    )
    .sort(
      (a, b) =>
        new Date(a.dueDate) -
        new Date(b.dueDate)
    )
    .slice(0, 5);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>
            Overview of your projects and tasks.
          </p>
        </div>

        <Link
          to="/projects"
          className="primary-button"
        >
          View Projects
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>▣</span>
          <div>
            <p>Total Projects</p>
            <strong>{stats.totalProjects}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span>✓</span>
          <div>
            <p>Total Tasks</p>
            <strong>{stats.totalTasks}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span>✓</span>
          <div>
            <p>Completed</p>
            <strong>{stats.completed}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span>◷</span>
          <div>
            <p>Pending</p>
            <strong>{stats.pending}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span>!</span>
          <div>
            <p>Overdue</p>
            <strong>{stats.overdue}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span>★</span>
          <div>
            <p>High Priority</p>
            <strong>{stats.highPriority}</strong>
          </div>
        </div>
      </div>

      <section className="dashboard-progress-card">
        <div className="progress-header">
          <div>
            <h3>Overall Completion</h3>
            <p>
              {stats.completed} of {stats.totalTasks}{" "}
              tasks completed
            </p>
          </div>

          <strong>{stats.completion}%</strong>
        </div>

        <div className="large-progress-bar">
          <div
            style={{
              width: `${stats.completion}%`,
            }}
          />
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <div className="section-header">
            <h3>Recent Projects</h3>
            <Link to="/projects">View all</Link>
          </div>

          {recentProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="dashboard-project"
            >
              <div className="project-mini-icon">
                {project.name.charAt(0)}
              </div>

              <div>
                <strong>{project.name}</strong>

                <span>
                  {getProjectProgress(
                    project.id,
                    tasks
                  )}
                  % complete
                </span>
              </div>
            </Link>
          ))}
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h3>Recent Tasks</h3>
          </div>

          {recentTasks.map((task) => (
            <Link
              key={task.id}
              to={`/tasks/${task.id}`}
              className="dashboard-task"
            >
              <div>
                <strong>{task.title}</strong>
                <span>{task.assignedTo}</span>
              </div>

              <span
                className={`priority-badge ${task.priority.toLowerCase()}`}
              >
                {task.priority}
              </span>
            </Link>
          ))}
        </section>
      </div>

      <section className="dashboard-section">
        <div className="section-header">
          <h3>Upcoming Deadlines</h3>
        </div>

        {upcoming.length === 0 ? (
          <div className="empty-state">
            No upcoming deadlines.
          </div>
        ) : (
          upcoming.map((task) => (
            <Link
              key={task.id}
              to={`/tasks/${task.id}`}
              className="deadline-item"
            >
              <div>
                <strong>{task.title}</strong>
                <span>{task.assignedTo}</span>
              </div>

              <time>
                {formatDate(task.dueDate)}
              </time>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}