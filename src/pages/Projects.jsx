import { useMemo, useState } from "react";

import ProjectCard from "../components/ProjectCard";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";

import useLocalStorage from "../hooks/useLocalStorage";

import {
  dummyProjects,
  dummyTasks,
} from "../data/dummyData";

import {
  validateProjectForm,
} from "../utils/validation";

import {
  getProjectProgress,
} from "../utils/helpers";

const emptyProject = {
  name: "",
  description: "",
  startDate: "",
  deadline: "",
  status: "Planning",
  priority: "Medium",
  members: [],
};

export default function Projects() {
  const [projects, setProjects] =
    useLocalStorage(
      "pm_projects",
      dummyProjects
    );

  const [tasks] =
    useLocalStorage("pm_tasks", dummyTasks);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [deleteId, setDeleteId] =
    useState(null);

  const [editing, setEditing] =
    useState(null);

  const [form, setForm] =
    useState(emptyProject);

  const [errors, setErrors] = useState({});

  const perPage = 6;

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    const query = search.toLowerCase().trim();

    if (query) {
      result = result.filter((project) =>
        `${project.name} ${project.description}`
          .toLowerCase()
          .includes(query)
      );
    }

    if (status) {
      result = result.filter(
        (project) => project.status === status
      );
    }

    if (priority) {
      result = result.filter(
        (project) =>
          project.priority === priority
      );
    }

    if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );
    }

    if (sort === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt) -
          new Date(b.createdAt)
      );
    }

    if (sort === "alphabetical") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sort === "deadline") {
      result.sort(
        (a, b) =>
          new Date(a.deadline) -
          new Date(b.deadline)
      );
    }

    return result;
  }, [
    projects,
    search,
    status,
    priority,
    sort,
  ]);

  const totalPages = Math.ceil(
    filteredProjects.length / perPage
  );

  const visibleProjects =
    filteredProjects.slice(
      (page - 1) * perPage,
      page * perPage
    );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProject);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setForm({
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      deadline: project.deadline,
      status: project.status,
      priority: project.priority,
      members: project.members || [],
    });
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

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors =
      validateProjectForm(form);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    if (editing) {
      setProjects((current) =>
        current.map((project) =>
          project.id === editing.id
            ? {
                ...project,
                ...form,
                updatedAt:
                  new Date().toISOString(),
              }
            : project
        )
      );
    } else {
      setProjects((current) => [
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

  const deleteProject = () => {
    setProjects((current) =>
      current.filter(
        (project) => project.id !== deleteId
      )
    );

    setDeleteId(null);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Projects</h2>
          <p>
            Manage all your projects from here.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openCreate}
        >
          + New Project
        </button>
      </div>

      <div className="projects-toolbar">
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search projects..."
        />

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
        >
          <option value="">All Statuses</option>
          <option>Planning</option>
          <option>Active</option>
          <option>On Hold</option>
          <option>Completed</option>
        </select>

        <select
          value={priority}
          onChange={(event) =>
            setPriority(event.target.value)
          }
        >
          <option value="">All Priorities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>

        <select
          value={sort}
          onChange={(event) =>
            setSort(event.target.value)
          }
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="deadline">Deadline</option>
          <option value="alphabetical">
            Alphabetical
          </option>
        </select>
      </div>

      {visibleProjects.length === 0 ? (
        <div className="empty-state">
          No projects found.
        </div>
      ) : (
        <div className="projects-grid">
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              progress={getProjectProgress(
                project.id,
                tasks
              )}
              onEdit={openEdit}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editing
            ? "Edit Project"
            : "Create Project"
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Name *</label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
            />

            {errors.name && (
              <span className="field-error">
                {errors.name}
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
              <label>Start Date *</label>

              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />

              {errors.startDate && (
                <span className="field-error">
                  {errors.startDate}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Deadline *</label>

              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
              />

              {errors.deadline && (
                <span className="field-error">
                  {errors.deadline}
                </span>
              )}
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
                <option>Planning</option>
                <option>Active</option>
                <option>On Hold</option>
                <option>Completed</option>
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

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>

            <button className="primary-button">
              {editing
                ? "Save Changes"
                : "Create Project"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Delete Project"
        size="small"
      >
        <div className="confirmation">
          <h3>Delete this project?</h3>

          <p>
            This action cannot be undone.
          </p>

          <div className="modal-actions">
            <button
              className="secondary-button"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </button>

            <button
              className="danger-button"
              onClick={deleteProject}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}