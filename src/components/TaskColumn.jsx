import TaskCard from "./TaskCard";

export default function TaskColumn({
  title,
  status,
  tasks,
  onEdit,
  onDelete,
  onDrop,
  onDragStart,
}) {
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div
      className="kanban-column"
      onDragOver={handleDragOver}
      onDrop={(event) => onDrop(event, status)}
    >
      <div className="kanban-column-header">
        <h4>{title}</h4>
        <span className="task-count">{tasks.length}</span>
      </div>

      <div className="kanban-column-body">
        {tasks.length === 0 ? (
          <div className="kanban-empty">
            No tasks
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
}