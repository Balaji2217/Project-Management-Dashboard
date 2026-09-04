import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import TaskColumn from "../components/TaskColumn";
import Modal from "../components/Modal";

import useLocalStorage from "../hooks/useLocalStorage";

import {
  dummyProjects,
  dummyTasks,
  dummyUsers,
} from "../data/dummyData";

import {
  validateTaskForm,
} from "../utils/validation";

import {
  getProjectProgress,
  formatDate,
} from "../utils/helpers";

const statuses = [
  "Todo",
  "In Progress",
  "Review",
  "Done",
];

const emptyTask = {
  title: "",
  description: "",
  projectId: "",
  assignedTo: "",
  priority: "Medium",
  status: "Todo",
  dueDate: "",
  tags: [],
  comments: [],
};

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [projects] =
    useLocalStorage(
      "pm_projects",
      dummyProjects
    );

  const [tasks, setTasks] =
    useLocalStorage(
      "pm_tasks",
      dummyTasks
    );

  const [users] =
    useLocalStorage(
      "pm_users_data",
      dummyUsers
    );

  const project = projects.find(
    (item) => item.id === projectId
  );

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState(null);

  const [form, setForm] = useState({
    ...emptyTask,
    projectId,
  });

  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});

  if (!project) {
    return (
      <div className="empty-state">
        <h2>Project not found</h2>

        <Link
          to="/projects"
          className="primary-button"
        >
          Back to Projects
        </Link>
      </div>
    );
  }

  const projectTasks = tasks.filter(
    (task) => task.projectId === projectId
  );

  const members = users.filter((user) =>
    project.members?.includes(user.id)
  );

  const openCreateTask = () => {
    setEditingTask(null);

    setForm({
      ...emptyTask,
      projectId,
    });

    setTagInput("");
    setErrors({});
    setModalOpen(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);

    setForm({
      ...task,
      tags: task.tags || [],
      comments: task.comments || [],
    });

    setTagInput("");
    setErrors({});
    setModalOpen(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const addTag = () => {
    const tag = tagInput.trim();

    if (!tag) return;

    if (
      !form.tags.some(
        (item) =>
          item.toLowerCase() === tag.toLowerCase()
      )
    ) {
      setForm({
        ...form,
        tags: [...form.tags, tag],
      });
    }

    setTagInput("");
  };

  const removeTag = (tag) => {
    setForm({
      ...form,
      tags: form.tags.filter(
        (item) => item !== tag
      ),
    });
  };

  const saveTask = (event) => {
    event.preventDefault();

    const validationErrors =
      validateTaskForm(form);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    if (editingTask) {
      setTasks((current) =>
        current.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                ...form,
                updatedAt:
                  new Date().toISOString(),
              }
            : task
        )
      );
    } else {
      setTasks((current) => [
        ...current,
        {
          ...form,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    }

    setModalOpen(false);
  };

  const deleteTask = (taskId) => {
    if (
      !window.confirm(
        "Delete this task?"
      )
    ) {
      return;
    }

    setTasks((current) =>
      current.filter(
        (task) => task.id !== taskId
      )
    );
  };

  const dragStart = (event, task) => {
    event.dataTransfer.setData(
      "taskId",
      task.id
    );
  };

  const dropTask = (event, status) => {
    event.preventDefault();

    const taskId =
      event.dataTransfer.getData("taskId");

    if (!taskId) return;

    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
              updatedAt:
                new Date().toISOString(),
            }
          : task
      )
    );
  };

  return (
    <div className="page">
      <button
        className="back-button"
        onClick={() => navigate("/projects")}
      >
        ← Back to Projects
      </button>

      <div className="project-details-header">
        <div>
          <p>Projects / {project.name}</p>

          <h2>{project.name}</h2>

          <p>{project.description}</p>

          <div className="project-meta">
            <span className="status-badge">
              {project.status}
            </span>

            <span
              className={`priority-badge ${project.priority.toLowerCase()}`}
            >
              {project.priority}
            </span>
          </div>
        </div>

        <button
          className="primary-button"
          onClick={openCreateTask}
        >
          + New Task
        </button>
      </div>

      <div className="project-overview-grid">
        <div className="overview-card">
          <span>Start Date</span>
          <strong>
            {formatDate(project.startDate)}
          </strong>
        </div>

        <div className="overview-card">
          <span>Deadline</span>
          <strong>
            {formatDate(project.deadline)}
          </strong>
        </div>

        <div className="overview-card">
          <span>Total Tasks</span>
          <strong>{projectTasks.length}</strong>
        </div>

        <div className="overview-card">
          <span>Members</span>
          <strong>{members.length}</strong>
        </div>
      </div>

      <div className="project-progress-card">
        <div className="progress-label">
          <strong>Project Progress</strong>
          <span>
            {getProjectProgress(
              project.id,
              tasks
            )}
            %
          </span>
        </div>

        <div className="large-progress-bar">
          <div
            style={{
              width: `${getProjectProgress(
                project.id,
                tasks
              )}%`,
            }}
          />
        </div>
      </div>

      <section className="members-section">
        <h3>Team Members</h3>

        <div className="members-list">
          {members.map((member) => (
            <div
              className="member-card"
              key={member.id}
            >
              <div className="avatar">
                {member.name.charAt(0)}
              </div>

              <div>
                <strong>{member.name}</strong>
                <span>{member.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="kanban-header">
        <div>
          <h3>Kanban Board</h3>
          <p>
            Drag tasks between columns to change
            their status.
          </p>
        </div>
      </div>

      <div className="kanban-board">
        {statuses.map((status) => (
          <TaskColumn
            key={status}
            title={status}
            status={status}
            tasks={projectTasks.filter(
              (task) =>
                task.status === status
            )}
            onEdit={openEditTask}
            onDelete={deleteTask}
            onDrop={dropTask}
            onDragStart={dragStart}
          />
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editingTask
            ? "Edit Task"
            : "Create Task"
        }
        size="large"
      >
        <form onSubmit={saveTask}>
          <div className="form-group">
            <label>Title *</label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
            />

            {errors.title && (
              <span className="field-error">
                {errors.title}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Description *</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
            />

            {errors.description && (
              <span className="field-error">
                {errors.description}
              </span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Assignee</label>

              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
              >
                <option value="">
                  Unassigned
                </option>

                {members.map((member) => (
                  <option
                    key={member.id}
                    value={member.name}
                  >
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                {statuses.map((status) => (
                  <option key={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Due Date *</label>

              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
              />

              {errors.dueDate && (
                <span className="field-error">
                  {errors.dueDate}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Tags *</label>

            <div className="tag-input">
              <input
                value={tagInput}
                onChange={(event) =>
                  setTagInput(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag"
              />

              <button
                type="button"
                className="secondary-button"
                onClick={addTag}
              >
                Add
              </button>
            </div>

            <div className="form-tags">
              {form.tags.map((tag) => (
                <span
                  className="tag removable"
                  key={tag}
                >
                  #{tag}

                  <button
                    type="button"
                    onClick={() =>
                      removeTag(tag)
                    }
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {errors.tags && (
              <span className="field-error">
                {errors.tags}
              </span>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                setModalOpen(false)
              }
            >
              Cancel
            </button>

            <button className="primary-button">
              {editingTask
                ? "Save Changes"
                : "Create Task"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}