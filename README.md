# AI Task Manager using Gemini & LangGraph

An AI-powered task management application that converts natural-language instructions into an organized to-do list using Google Gemini and LangGraph.

## Project Overview

AI Task Manager helps users organize their daily activities without manually creating individual tasks. Users enter a paragraph describing their work, study, or personal responsibilities, and the AI workflow extracts tasks, identifies deadlines, assigns priorities, and presents an organized task list.

## Key Features

- **Natural Language Task Input:** Describe multiple tasks in a single paragraph.
- **AI Task Extraction:** Extracts individual actionable tasks and their deadlines using Google Gemini.
- **Smart Prioritization:** Assigns High, Medium, or Low priority to each task.
- **Priority Explanation:** Provides a reason for each assigned priority.
- **Organized Task List:** Sorts tasks by priority.
- **Interactive UI:** View tasks, filter by priority, and mark tasks as completed.
- **Progress Tracking:** Displays task counts and completion progress.
- **FastAPI Backend:** Provides an API endpoint for task processing.

## Technology Stack

- Python
- FastAPI
- Google Gemini API
- LangChain Google GenAI
- LangGraph
- HTML
- CSS
- JavaScript
- Pydantic
- Python-dotenv

## LangGraph Workflow

The application uses a three-node LangGraph workflow:

1. **Extract Tasks:** Gemini extracts individual tasks and their deadlines from the user's input.
2. **Prioritize Tasks:** Gemini assigns a priority and explains the reasoning.
3. **Format Results:** Tasks are sorted by priority and formatted for the frontend.

Workflow:

`START → Extract Tasks → Prioritize Tasks → Format Results → END`

## Project Structure

```text
AI_TASK_MANAGER/
├── main.py
├── .env
├── .gitignore
├── README.md
└── static/
    ├── style.css
    └── script.js
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd AI_TASK_MANAGER
```

### 2. Create a virtual environment

```bash
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
pip install fastapi uvicorn python-dotenv langgraph langchain-google-genai
```

### 4. Configure the API key

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Replace the placeholder with your own Gemini API key. Never upload your API key to GitHub.

### 5. Run the application

```bash
uvicorn main:app --reload
```

Open the application in your browser:

`http://127.0.0.1:8000`

API documentation is available at:

`http://127.0.0.1:8000/docs`

## API Endpoint

### POST `/api/tasks`

Accepts a natural-language description of tasks.

Example request:

```json
{
  "message": "Finish my assignment tomorrow, buy groceries today, and prepare for next week's meeting."
}
```

The response contains the extracted tasks, deadlines, priorities, and explanations.

### GET `/health`

Checks whether the application is running.

## Security

- Store API credentials in `.env`.
- Add `.env` and virtual environment folders to `.gitignore`.
- Do not commit API keys or other secrets to version control.

## Future Improvements

- Persistent database storage for tasks.
- User accounts and authentication.
- Editing and deleting tasks.
- Calendar integration and deadline reminders.
- Persistent completion status.
- More advanced task scheduling.

## Learning Outcomes

This project demonstrates how to build an AI-powered application using Large Language Models, structured JSON outputs, FastAPI, and a multi-step LangGraph workflow.

It combines backend development, prompt engineering, workflow orchestration, and frontend integration in one practical project.

---

**Project:** AI Task Manager  
**AI Model:** Google Gemini  
**Workflow Framework:** LangGraph  
**Backend:** FastAPI