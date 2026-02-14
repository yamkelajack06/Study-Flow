# Study Flow

The Study Flow is a web application designed to help students organize their weekly study sessions and tasks. Built as a Single-Page Application (SPA) using React, this app aims to provide a clean, responsive, and powerful tool for academic planning.

### Project Purpose

The primary goal of this application is to give students a clear overview of their weekly schedule, allowing them to effectively manage their study time. The app focuses on providing core functionality for creating and managing a study schedule, with a long-term vision of becoming a comprehensive, cloud-synced platform with advanced features.

### Current Features

The application currently includes the core functionality necessary for managing a study timetable. The following features are fully implemented:

* **Weekly Timetable View:** A responsive grid displays the days of the week (Monday to Sunday) and hourly time slots (6 AM to 11 PM). Entries are rendered as blocks that span their specified duration.

* **Add Entries:** Users can add new study sessions or tasks to the timetable. A modal form is used to capture all the necessary details for a new entry.

* **Delete Entries:** Users can remove entries from their timetable.

* **Edit Entries:** The application allows users to modify existing entries, making it easy to adjust their schedule as needed.

* **Local Data Persistence:** All timetable entries are stored locally using the browser's `localStorage` API, ensuring that a user's schedule is saved and available upon their return to the app.

* **AI Assistant:** A conversational chat interface powered by Google Gemini API that processes natural language commands to manage timetable entries. The AI assistant understands casual language, provides a nice conversational way of planning your schedule and can perform bulk operations such as adding multiple entries at once or clearing entire days or time periods. It validates all entries against the current schedule to prevent conflicts and overlaps, asks clarifying questions when information is incomplete or ambiguous, and provides intelligent scheduling advice based on available time slots. The AI can answer questions about the user's schedule, help plan study sessions around existing commitments, and generate complete personalized timetables for students by intelligently distributing their subjects across available time slots—ensuring balanced study sessions and adequate coverage of all topics without automating the entire process, but rather working collaboratively with the user to create an optimal schedule. Currently supports adding and deleting entries (both single and multiple).

### Technology Stack

* **Frontend:** React JS

* **Styling:** Vanilla CSS and CSS Modules

* **Data Persistence:** `localStorage` API
* **AI Integration:** Google Gemini API (@google/genai SDK)

### Future Development

The next phase of development will focus on expanding the application's capabilities, including:

* Implementing a robust cloud-synced data persistence strategy using Firebase.
  
* Adding Google Calendar API integration for seamless synchronization.

Link to live APP: https://study-flow-beta.vercel.app/
