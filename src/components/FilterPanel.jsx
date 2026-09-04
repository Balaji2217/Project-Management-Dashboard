export default function FilterPanel({
  filters,
  onChange,
  projects = [],
  users = [],
}) {
  const update = (key, value) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="filter-panel">
      <div className="filter-field">
        <label>Project</label>

        <select
          value={filters.project}
          onChange={(event) =>
            update("project", event.target.value)
          }
        >
          <option value="">All Projects</option>

          {projects.map((project) => (
            <option
              key={project.id}
              value={project.id}
            >
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-field">
        <label>Status</label>

        <select
          value={filters.status}
          onChange={(event) =>
            update("status", event.target.value)
          }
        >
          <option value="">All Statuses</option>
          <option value="Todo">Todo</option>
          <option value="In Progress">
            In Progress
          </option>
          <option value="Review">Review</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div className="filter-field">
        <label>Priority</label>

        <select
          value={filters.priority}
          onChange={(event) =>
            update("priority", event.target.value)
          }
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      <div className="filter-field">
        <label>Assignee</label>

        <select
          value={filters.assignee}
          onChange={(event) =>
            update("assignee", event.target.value)
          }
        >
          <option value="">Everyone</option>

          {users.map((user) => (
            <option key={user.id} value={user.name}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-field">
        <label>Due Date</label>

        <select
          value={filters.dueDate}
          onChange={(event) =>
            update("dueDate", event.target.value)
          }
        >
          <option value="">Any Date</option>
          <option value="overdue">Overdue</option>
          <option value="today">Today</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>

      <div className="filter-field">
        <label>Sort</label>

        <select
          value={filters.sort}
          onChange={(event) =>
            update("sort", event.target.value)
          }
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="alphabetical">
            Alphabetical
          </option>
        </select>
      </div>
    </div>
  );
}