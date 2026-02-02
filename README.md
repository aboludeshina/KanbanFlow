# KanbanFlow

KanbanFlow is a modern, intuitive Kanban board application built to help you manage your tasks efficiently. It leverages the power of **React**, **TypeScript**, and **Tailwind CSS** to provide a seamless and responsive user experience. 

## Features

- **Intuitive Kanban Board**: Drag and drop tasks between columns to visualize your workflow.
- **Smart Add**: Quickly add tasks with intelligent parsing (e.g., "Meeting tomorrow at 10am" automatically sets the date and time).
- **Persistent Storage**: Your data is saved locally using browser Local Storage, so you never lose your progress.
- **Customizable Settings**: Configure your preferences directly within the app.
- **Responsive Design**: Works great on distinct screen sizes.
- **AI Integration**: (Optional) Connect with Gemini or Zhipu AI for enhanced task management capabilities.

## Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/aboludeshina/KanbanFlow.git
    cd KanbanFlow
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**

    Create a `.env.local` file in the root directory and add your API keys if you plan to use AI features:

    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    ```

4.  **Run the application:**

    ```bash
    npm run dev
    ```

    Open your browser and navigate to `http://localhost:5173` (or the URL shown in your terminal).

## Building for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
