import { useMemo, useState } from "react";

import useLocalStorage from "./useLocalStorage";
import { dummyTasks } from "../data/dummyData";

export default function useTasks() {
  const [tasks, setTasks] =
    useLocalStorage(
      "pm_tasks",
      dummyTasks
    );

  const [filters, setFilters] = useState({
    search: "",
    project: "",
    status: "",
    priority: "",
    assignee: "",
    dueDate: "",
    sort: "newest",
  });

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks((current) => [
      ...current,
      newTask,
    ]);

    return newTask;
  };

  const updateTask = (id, updates) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updates,
              updatedAt:
                new Date().toISOString(),
            }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((current) =>
      current.filter(
        (task) => task.id !== id
      )
    );
  };

  const moveTask = (id, status) => {
    updateTask(id, { status });
  };

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    const search =
      filters.search.toLowerCase().trim();

    if (search) {
      result = result.filter((task) => {
        const text = [
          task.title,
          task.description,
          task.assignedTo,
          ...(task.tags || []),
        ]
          .join(" ")
          .toLowerCase();

        return text.includes(search);
      });
    }

    if (filters.project) {
      result = result.filter(
        (task) =>
          task.projectId === filters.project
      );
    }

    if (filters.status) {
      result = result.filter(
        (task) =>
          task.status === filters.status
      );
    }

    if (filters.priority) {
      result = result.filter(
        (task) =>
          task.priority === filters.priority
      );
    }

    if (filters.assignee) {
      result = result.filter(
        (task) =>
          task.assignedTo === filters.assignee
      );
    }

    if (filters.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      result = result.filter((task) => {
        if (!task.dueDate) return false;

        const due = new Date(
          `${task.dueDate}T00:00:00`
        );

        if (filters.dueDate === "overdue") {
          return due < today;
        }

        if (filters.dueDate === "today") {
          return (
            due.getTime() ===
            today.getTime()
          );
        }

        if (filters.dueDate === "upcoming") {
          return due > today;
        }

        return true;
      });
    }

    const priorityOrder = {
      Low: 1,
      Medium: 2,
      High: 3,
      Critical: 4,
    };

    switch (filters.sort) {
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt) -
            new Date(b.createdAt)
        );
        break;

      case "dueDate":
        result.sort(
          (a, b) =>
            new Date(
              a.dueDate || "9999-12-31"
            ) -
            new Date(
              b.dueDate || "9999-12-31"
            )
        );
        break;

      case "priority":
        result.sort(
          (a, b) =>
            priorityOrder[b.priority] -
            priorityOrder[a.priority]
        );
        break;

      case "alphabetical":
        result.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;

      case "newest":
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );
    }

    return result;
  }, [tasks, filters]);

  return {
    tasks,
    setTasks,
    filteredTasks,
    filters,
    setFilters,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
  };
}