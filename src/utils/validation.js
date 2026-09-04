export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
}

export function validateLoginForm(values) {
  const errors = {};

  if (!values.email?.trim()) {
    errors.email = "Email is required.";
  } else if (!validateEmail(values.email)) {
    errors.email =
      "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password =
      "Password is required.";
  }

  return errors;
}

export function validateRegisterForm(
  values
) {
  const errors = {};

  if (!values.name?.trim()) {
    errors.name =
      "Full name is required.";
  }

  if (!values.email?.trim()) {
    errors.email =
      "Email is required.";
  } else if (!validateEmail(values.email)) {
    errors.email =
      "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password =
      "Password is required.";
  } else if (
    values.password.length < 6
  ) {
    errors.password =
      "Password must contain at least 6 characters.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword =
      "Please confirm your password.";
  } else if (
    values.password !==
    values.confirmPassword
  ) {
    errors.confirmPassword =
      "Passwords do not match.";
  }

  return errors;
}

export function validateProjectForm(
  values
) {
  const errors = {};

  if (!values.name?.trim()) {
    errors.name =
      "Project name is required.";
  }

  if (!values.description?.trim()) {
    errors.description =
      "Description is required.";
  }

  if (!values.startDate) {
    errors.startDate =
      "Start date is required.";
  }

  if (!values.deadline) {
    errors.deadline =
      "Deadline is required.";
  }

  if (
    values.startDate &&
    values.deadline &&
    values.deadline <
      values.startDate
  ) {
    errors.deadline =
      "Deadline cannot be before start date.";
  }

  if (!values.status) {
    errors.status =
      "Status is required.";
  }

  if (!values.priority) {
    errors.priority =
      "Priority is required.";
  }

  return errors;
}

export function validateTaskForm(values) {
  const errors = {};

  if (!values.title?.trim()) {
    errors.title =
      "Task title is required.";
  }

  if (!values.description?.trim()) {
    errors.description =
      "Description is required.";
  }

  if (!values.projectId) {
    errors.projectId =
      "Project is required.";
  }

  if (!values.status) {
    errors.status =
      "Status is required.";
  }

  if (!values.priority) {
    errors.priority =
      "Priority is required.";
  }

  if (!values.dueDate) {
    errors.dueDate =
      "Due date is required.";
  }

  if (
    !values.tags ||
    values.tags.length === 0
  ) {
    errors.tags =
      "At least one tag is required.";
  }

  return errors;
}