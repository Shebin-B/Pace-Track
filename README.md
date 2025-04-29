# PaceTrack

PaceTrack is a construction site log management system built using the MERN stack. It provides a centralized platform to manage and monitor construction projects efficiently, offering role-based access and real-time tracking of site activities.

## Tech Stack

- MongoDB
- Express.js
- React.js
- Node.js

## Implemented Features

### User Roles and Access

**Admin**
- Registers and manages all users
- Approves or deletes Clients
- Verifies Site Supervisors and Project Managers using ID proof
- Assigns sites to Clients after contract approval

**Site Supervisor**
- Marks employee attendance (Present, Absent, Leave)
- Logs daily site activities
- Assigns tasks to employees and tracks progress

**Project Manager**
- Monitors project progress
- Reviews site reports and logs
- Manages issues at construction sites

**Client**
- Views project reports and site progress
- Account access granted only after Admin verification with valid government ID

### Employee and Site Management

- Admin can register employees along with their image and ID proof
- Employees are grouped by work category and assigned to specific sites
- Admin assigns Project Managers and Site Supervisors to sites

### Attendance Management

- Site Supervisors can mark daily attendance per site
- Attendance types: Present, Absent, Leave
- Attendance reports viewable by Admin, Project Manager, and Client

### Salary Calculation

- Monthly salary is calculated automatically based on the number of days marked as Present

### Daily Work Logs

- Site Supervisors can submit daily logs for site activity and progress

### Reporting and Analytics

- Attendance reports are available by day, week, and month
- Reports are accessible to Admin, Project Manager, and Client

### Media Uploads (Admin Panel)

- Admin can upload progress photos, completed work images, and bill documents
- Uploaded media is displayed using a carousel interface with hover-based preview

### Homepage and Design

- A modern homepage is designed using current UI/UX principles and CSS styling
- Admin dashboard uses a sidebar layout with integrated navigation

## System Design Details

- Time data is stored in UTC format
- File upload (image and ID proof) is implemented for Client, Employee, Project Manager, and Site Supervisor
- Role-based dashboards with user-specific functionalities
