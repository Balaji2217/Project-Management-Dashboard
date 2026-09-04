import { useNavigate } from "react-router-dom";

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onDragStart,
}) {
  const navigate = useNavigate();

  return (
    <article
      className="task-card"
      draggable
      onDragStart={(event) =>
        onDragStart(event, task)
      }
    >
      <div className="task-card-top">
        <span
          className={`priority-badge ${task.priority.toLowerCase()}`}
        >
          {task.priority}
        </span>

        <div className="task-actions">
          <button onClick={() => onEdit(task)}>
            ✎
          </button>

          <button onClick={() => onDelete(task.id)}>
            ×
          </button>
        </div>
      </div>

      <button
        className="task-title-button"
        onClick={() => navigate(`/tasks/${task.id}`)}
      >
        {task.title}
      </button>

      <p className="task-description">
        {task.description}
      </p>

      <div className="task-tags">
        {task.tags?.map((tag) => (
          <span className="tag" key={tag}>
            #{tag}
          </span>
        ))}
      </div>

      <div className="task-card-footer">
        <span>
          👤 {task.assignedTo || "Unassigned"}
        </span>

        <span>
          📅 {task.dueDate || "No date"}
        </span>
      </div>
    </article>
  );
}