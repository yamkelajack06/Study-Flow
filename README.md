# Study Timetable App

The Study Timetable App is a web application designed to help students organize their weekly study sessions and tasks. Built as a Single-Page Application (SPA) using React, this app aims to provide a clean, responsive, and powerful tool for academic planning.

### Project Purpose

The primary goal of this application is to give students a clear overview of their weekly schedule, allowing them to effectively manage their study time. The app focuses on providing core functionality for creating and managing a study schedule, with a long-term vision of becoming a comprehensive, cloud-synced platform with advanced features.

### Current Features

The application currently includes the core functionality necessary for managing a study timetable. The following features are fully implemented:

* **Weekly Timetable View:** A responsive grid displays the days of the week (Monday to Sunday) and hourly time slots (6 AM to 11 PM). Entries are rendered as blocks that span their specified duration.

* **Add Entries:** Users can add new study sessions or tasks to the timetable. A modal form is used to capture all the necessary details for a new entry.

* **Delete Entries:** Users can remove entries from their timetable.

* **Edit Entries:** The application allows users to modify existing entries, making it easy to adjust their schedule as needed.

* **Local Data Persistence:** All timetable entries are stored locally using the browser's `localStorage` API, ensuring that a user's schedule is saved and available upon their return to the app.

### Technology Stack

* **Frontend:** React (Functional Components and Hooks)

* **Styling:** Vanilla CSS (Flexbox/Grid for layout) and CSS Modules

* **Data Persistence:** `localStorage` API

### Future Development

The next phase of development will focus on expanding the application's capabilities, including:

* Implementing a robust cloud-synced data persistence strategy using Firebase.

* Integrating AI-powered features for natural language entry and document parsing.

* Adding Google Calendar API integration for seamless synchronization.
