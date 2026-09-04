import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import useLocalStorage from "../hooks/useLocalStorage";

import {
  dummyProjects,
  dummyTasks,
} from "../data/dummyData";

import {
  formatDate,
  formatDateTime,
  isOverdue,
} from "../utils/helpers";

export default function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] =
    useLocalStorage(
      "pm_tasks",
      dummyTasks
    );

  const [projects] =
    useLocalStorage(
      "pm_projects",
      dummyProjects
    );

  const [comment, setComment] = useState("");

  const task = tasks.find(
    (item) => item.id === taskId
  );

  if (!task) {
    return (
      <div className="empty-state">
        <h2>Task not found</h2>

        <button
          className="primary-button"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  const project = projects.find(
    (item) => item.id === task.projectId
  );

  const addComment = () => {
    if (!comment.trim()) return;

    const newComment = {
      id: crypto.randomUUID(),
      userId: "current-user",
      userName: "You",
      text: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    setTasks((current) =>
      current.map((item) =>
        item.id === task.id
          ? {
              ...item,
              comments: [
                ...(item.comments || []),
                newComment,
              ],
              updatedAt:
                new Date().toISOString(),
            }
          : item
      )
    );

    setComment("");
  };

  const deleteComment = (commentId) => {
    setTasks((current) =>
      current.map((item) =>
        item.id === task.id
          ? {
              ...item,
              comments: (
                item.comments || []
              ).filter(
                (comment) =>
                  comment.id !== commentId
              ),
            }
          : item
      )
    );
  };

  const deleteTask = () => {
    if (!window.confirm("Delete this task?")) {
      return;
    }

    setTasks((current) =>
      current.filter(
        (item) => item.id !== task.id
      )
    );

    navigate(
      project
        ? `/projects/${project.id}`
        : "/projects"
    );
  };

  return (
    <div className="page">
      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="task-details-header">
        <div>
          <p>
            {project?.name || "Project"} / Task
          </p>

          <h2>{task.title}</h2>

          <div className="project-meta">
            <span className="status-badge">
              {task.status}
            </span>

            <span
              className={`priority-badge ${task.priority.toLowerCase()}`}
            >
              {task.priority}
            </span>

            {isOverdue(task.dueDate) &&
              task.status !== "Done" && (
                <span className="overdue-badge">
                  Overdue
                </span>
              )}
          </div>
        </div>

        <button
          className="danger-button"
          onClick={deleteTask}
        >
          Delete Task
        </button>
      </div>

      <div className="task-details-layout">
        <main>
          <section className="details-card">
            <h3>Description</h3>

            <p>{task.description}</p>
          </section>

          <section className="details-card">
            <h3>Tags</h3>

            <div className="task-tags">
              {task.tags?.map((tag) => (
                <span
                  className="tag"
                  key={tag}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </section>

          <section className="details-card">
            <h3>Comments</h3>

            <div className="comment-form">
              <textarea
                value={comment}
                onChange={(event) =>
                  setComment(
                    event.target.value
                  )
                }
                placeholder="Write a comment..."
              />

              <button
                className="primary-button"
                onClick={addComment}
              >
                Add Comment
              </button>
            </div>

            <div className="comments-list">
              {(task.comments || []).length ===
              0 ? (
                <p className="muted">
                  No comments yet.
                </p>
              ) : (
                task.comments.map(
                  (item) => (
                    <div
                      className="comment"
                      key={item.id}
                    >
                      <div className="comment-header">
                        <strong>
                          {item.userName}
                        </strong>

                        <span>
                          {formatDateTime(
                            item.createdAt
                          )}
                        </span>
                      </div>

                      <p>{item.text}</p>

                      <button
                        onClick={() =>
                          deleteComment(
                            item.id
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  )
                )
              )}
            </div>
          </section>
        </main>

        <aside className="details-sidebar">
          <div className="details-card">
            <h3>Task Information</h3>

            <div className="detail-row">
              <span>Project</span>

              <strong>
                {project ? (
                  <Link
                    to={`/projects/${project.id}`}
                  >
                    {project.name}
                  </Link>
                ) : (
                  "Unknown"
                )}
              </strong>
            </div>

            <div className="detail-row">
              <span>Assignee</span>
              <strong>
                {task.assignedTo ||
                  "Unassigned"}
              </strong>
            </div>

            <div className="detail-row">
              <span>Status</span>
              <strong>{task.status}</strong>
            </div>

            <div className="detail-row">
              <span>Priority</span>
              <strong>{task.priority}</strong>
            </div>

            <div className="detail-row">
              <span>Due Date</span>
              <strong>
                {formatDate(task.dueDate)}
              </strong>
            </div>

            <div className="detail-row">
              <span>Created</span>
              <strong>
                {formatDateTime(
                  task.createdAt
                )}
              </strong>
            </div>

            <div className="detail-row">
              <span>Updated</span>
              <strong>
                {formatDateTime(
                  task.updatedAt
                )}
              </strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}