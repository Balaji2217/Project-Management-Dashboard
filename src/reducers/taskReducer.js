export default function taskReducer(
  state,
  action
) {
  switch (action.type) {
    case "ADD_TASK":
      return [
        ...state,
        action.payload,
      ];

    case "UPDATE_TASK":
      return state.map((task) =>
        task.id === action.payload.id
          ? {
              ...task,
              ...action.payload,
              updatedAt:
                new Date().toISOString(),
            }
          : task
      );

    case "DELETE_TASK":
      return state.filter(
        (task) =>
          task.id !== action.payload
      );

    case "MOVE_TASK":
      return state.map((task) =>
        task.id ===
        action.payload.taskId
          ? {
              ...task,
              status:
                action.payload.status,
              updatedAt:
                new Date().toISOString(),
            }
          : task
      );

    case "ADD_COMMENT":
      return state.map((task) =>
        task.id ===
        action.payload.taskId
          ? {
              ...task,
              comments: [
                ...(task.comments || []),
                action.payload.comment,
              ],
              updatedAt:
                new Date().toISOString(),
            }
          : task
      );

    case "DELETE_COMMENT":
      return state.map((task) =>
        task.id ===
        action.payload.taskId
          ? {
              ...task,
              comments: (
                task.comments || []
              ).filter(
                (comment) =>
                  comment.id !==
                  action.payload.commentId
              ),
            }
          : task
      );

    case "SET_TASKS":
      return action.payload;

    default:
      return state;
  }
}