
const messageInput = document.getElementById("message");
const organizeButton = document.getElementById("organize");
const statusBox = document.getElementById("status");
const taskList = document.getElementById("taskList");
const filterSelect = document.getElementById("taskFilter");

const totalCount = document.getElementById("totalCount");
const highCount = document.getElementById("highCount");
const completedCount = document.getElementById("completedCount");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const progressPercent = document.getElementById("progressPercent");
const resultsSubtitle = document.getElementById("resultsSubtitle");
const clearButton = document.getElementById("clearButton");

let tasks = [];
let completedIds = new Set();

const examples = {
  today: "Finish my assignment today, reply to important emails, and organize my study notes.",
  study: "Revise Excel tonight, finish my Python project by Friday, and prepare for my data science test tomorrow.",
  work: "Prepare a project presentation next week, review my pending work, and send the report by tomorrow."
};

document.querySelectorAll("[data-example]").forEach(button => {
  button.addEventListener("click", () => {
    messageInput.value = examples[button.dataset.example] || "";
    messageInput.focus();
  });
});

function setStatus(message, isError = false) {
  statusBox.textContent = message;
  statusBox.classList.toggle("error", isError);
}

function updateStats() {
  totalCount.textContent = tasks.length;
  highCount.textContent = tasks.filter(t => t.priority === "High").length;
  completedCount.textContent = completedIds.size;

  const percent = tasks.length
    ? Math.round((completedIds.size / tasks.length) * 100)
    : 0;

  progressFill.style.width = `${percent}%`;
  progressText.textContent = `${completedIds.size} of ${tasks.length} tasks completed`;
  progressPercent.textContent = `${percent}%`;
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function renderTasks() {
  taskList.replaceChildren();

  const filter = filterSelect.value;
  const visibleTasks = tasks.filter(task => {
    if (filter === "High" || filter === "Medium" || filter === "Low") {
      return task.priority === filter;
    }
    if (filter === "Completed") return completedIds.has(task.id);
    if (filter === "Pending") return !completedIds.has(task.id);
    return true;
  });

  if (!visibleTasks.length) {
    const empty = makeElement("div", "empty-state");
    empty.append(
      makeElement("div", "empty-icon", "✳"),
      makeElement("h3", "", tasks.length ? "No tasks in this filter" : "Your task space is ready"),
      makeElement(
        "p",
        "",
        tasks.length
          ? "Choose another filter to see your tasks."
          : "Write down your tasks above and let AI organize your day."
      )
    );
    taskList.appendChild(empty);
    return;
  }

  visibleTasks.forEach(task => {
    const isCompleted = completedIds.has(task.id);
    const card = makeElement(
      "article",
      `task-card${isCompleted ? " completed" : ""}`
    );

    const checkbox = makeElement("input", "task-check");
    checkbox.type = "checkbox";
    checkbox.checked = isCompleted;
    checkbox.setAttribute("aria-label", `Complete ${task.title}`);

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) completedIds.add(task.id);
      else completedIds.delete(task.id);

      updateStats();
      renderTasks();
    });

    const content = makeElement("div", "task-content");
    content.appendChild(makeElement("div", "task-title", task.title));

    const meta = makeElement("div", "task-meta");
    meta.append(
      makeElement("span", "", `◷ ${task.deadline || "Not specified"}`),
      makeElement("span", "", `Task ${task.id}`)
    );
    content.appendChild(meta);

    if (task.reason) {
      content.appendChild(makeElement("p", "task-reason", task.reason));
    }

    const priorityClass = {
      High: "pill-high",
      Medium: "pill-medium",
      Low: "pill-low"
    }[task.priority] || "pill-medium";

    const pill = makeElement(
      "span",
      `priority-pill ${priorityClass}`,
      task.priority || "Medium"
    );

    card.append(checkbox, content, pill);
    taskList.appendChild(card);
  });
}

organizeButton.addEventListener("click", async () => {
  const message = messageInput.value.trim();

  if (message.length < 3) {
    setStatus("Please enter a few details about your tasks first.", true);
    messageInput.focus();
    return;
  }

  organizeButton.disabled = true;
  organizeButton.textContent = "✳  Organizing your tasks...";
  setStatus("AI is extracting tasks and assigning priorities. Please wait.");
  taskList.replaceChildren();

  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Unable to organize tasks.");
    }

    tasks = (data.tasks || []).map((task, index) => ({
      ...task,
      id: index + 1
    }));
    completedIds = new Set();

    updateStats();
    renderTasks();

    resultsSubtitle.textContent = tasks.length
      ? "Your tasks are organized by priority."
      : "Try describing specific actions you need to complete.";

    setStatus(
      tasks.length
        ? `✓ Successfully organized ${tasks.length} task${tasks.length === 1 ? "" : "s"}.`
        : "No actionable tasks were found. Try adding more details."
    );

    document.getElementById("resultsSection").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  } catch (error) {
    setStatus(`Error: ${error.message}`, true);
  } finally {
    organizeButton.disabled = false;
    organizeButton.textContent = "✦  Organize My Tasks";
  }
});

filterSelect.addEventListener("change", renderTasks);

clearButton.addEventListener("click", () => {
  messageInput.value = "";
  messageInput.focus();
  setStatus("Input cleared. Add your next set of tasks when ready.");
});

updateStats();
renderTasks();
document.getElementById("highCountSide").textContent =
  tasks.filter(t => t.priority === "High").length;
document.getElementById("mediumCount").textContent =
  tasks.filter(t => t.priority === "Medium").length;
document.getElementById("lowCount").textContent =
  tasks.filter(t => t.priority === "Low").length;