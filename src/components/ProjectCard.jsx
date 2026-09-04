import { useNavigate } from "react-router-dom";

export default function ProjectCard({
  project,
  progress,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  return (
    <article className="project-card">
      <div className="project-card-header">
        <div className="project-icon">
          {project.name.charAt(0).toUpperCase()}
        </div>

        <div className="project-actions">
          <button onClick={() => onEdit(project)}>
            ✎
          </button>

          <button onClick={() => onDelete(project.id)}>
            ×
          </button>
        </div>
      </div>

      <button
        className="project-name"
        onClick={() =>
          navigate(`/projects/${project.id}`)
        }
      >
        {project.name}
      </button>

      <p className="project-description">
        {project.description}
      </p>

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

      <div className="progress-section">
        <div className="progress-label">
          <span>Progress</span>
          <strong>{progress}%</strong>
        </div>

        <div className="progress-bar">
          <div style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="project-footer">
        <span>📅 {project.deadline}</span>
        <span>👥 {project.members?.length || 0}</span>
      </div>
    </article>
  );
}