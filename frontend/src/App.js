import React, { createContext, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Empregistration from "./components/emp_reg";
import Adminpage from "./components/adminpage";
import ClientRegistration from "./components/client_reg";
import ClientsPage from "./components/client_page";
import ManagerRegistration from "./components/pm_reg";
import Login from "./components/login";
import SiteRegistration from "./components/site_reg";
import "./App.css";
import Viewclient from "./components/view_clients";
import ViewEmployee from "./components/view_emp";
import Managerpage from "./components/pm_page";
import DailyLogs from "./components/logs";
import Viewsite from "./components/view_site";
import ViewManager from "./components/view_manager";
import Viewclientsite from "./components/viewclientsite";
import CampOfficerDashboard from "./components/example";
import AttendanceDashboard from "./components/sitesupervisor/attendence _dash";
import ReviewAttendance from "./components/reviewattendence";
import ClientDashboard from "./components/client/clientdashboard";
import ClientSites from "./components/client/viewclientsite";
import ProjectManagerDashboard from "./components/project_manager/pm_dash";
import Managerassignedsites from "./components/project_manager/viewmyassignedsites";
import SupervisorRegistration from "./components/supervisor_reg";
import SupervisorPage from "./components/supervisor_viewpage";
import SiteSupervisorDashboard from "./components/sitesupervisor/ss_dash";
import ViewSupervisor from "./components/view_supervisor";
import SupervisorAssignedSites from "./components/sitesupervisor/vewss_assignedsites";
import Pm_attandace from "./components/project_manager/pm_attendance";
import ClientAttendance from "./components/client/client_attendance";

import EmployeeReport from "./components/report_page";
import ReportPage from "./components/sitevisereport";


import Homepage from "./components/hompage/homepage"
import ContactUs from "./components/hompage/contactus";
import AboutUs from "./components/hompage/about";
import ClientCommunication from "./components/client/clientcommunication";

import ManagerCommunication from "./components/project_manager/pm_communication";


const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="container mt-4">
      <h1>Welcome</h1>
      <button className="btn btn-warning m-2" onClick={() => navigate('/adminpage')}>Go to Admin Page</button>
      <button className="btn btn-warning m-2" onClick={() => navigate('/client_reg')}>Go to Client Registration Page</button>
      <button className="btn btn-warning m-2" onClick={() => navigate('/pm_reg')}>Go to Project Manager Registration Page</button>
      <button className="btn btn-warning m-2" onClick={() => navigate('/login')}>Go to Login Page</button>
      <button className="btn btn-warning m-2" onClick={() => navigate('/attendence_dash')}>Go to attendence Page</button>
      <button className="btn btn-warning m-2" onClick={() => navigate('/clientdash')}>Go to Client Dashboard</button>

      <button className="btn btn-warning m-2" onClick={() => navigate('/supervisor_reg')}>Go to supervisor Registration Page</button>

      <button className="btn btn-warning m-2" onClick={() => navigate('/homepage')}>home Page</button>


    </div>
  );
};

function App() {
  return (
  
      <BrowserRouter>
        <Routes>
          <Route path="/rrr" element={<Home />} />
          <Route path="/emp_register" element={<Empregistration />} />
          <Route path="/adminpage" element={<Adminpage />} />
          <Route path="/client_reg" element={<ClientRegistration />} />
          <Route path="/client_page" element={<ClientsPage />} />
          <Route path="/pm_reg" element={<ManagerRegistration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/site_reg/:id" element={<SiteRegistration />} />
          <Route path="/view_emp" element={<ViewEmployee />} />
          <Route path="/view_clients" element={<Viewclient />} />
          <Route path="/pm_page" element={<Managerpage />} />
          <Route path="/logs" element={<DailyLogs />} />
          <Route path="/viewsite" element={<Viewsite />} />
          <Route path="/viewmanager" element={<ViewManager />} />
          <Route path="/viewsupervisor" element={<ViewSupervisor />} />
          <Route path="/viewclientsite/:clientId" element={<Viewclientsite />} />
          <Route path="/campofficer" element={<CampOfficerDashboard />} />
          <Route path="/attendence_dash/:supervisorId" element={<AttendanceDashboard />} />
          <Route path="/pm_attendance/:managerId" element={<Pm_attandace />} />
          <Route path="/client_attendance/:clientId" element={<ClientAttendance />} />

          <Route path="/attendancereview/:employeeId/:siteId" element={<ReviewAttendance />} />
          <Route path="/camp" element={<CampOfficerDashboard />} />

          <Route path="/clientdash/:userId" element={<ClientDashboard />} />
          <Route path="/viewmysites/:clientId" element={<ClientSites />} />
          <Route path="/managerdash/:userId" element={<ProjectManagerDashboard />} />
          <Route path="/ss_dash/:userId" element={<SiteSupervisorDashboard />} />
          <Route path="/viewmanagerassignedsites/:managerId" element={<Managerassignedsites />} />


          <Route path="/supervisor_reg" element={<SupervisorRegistration />} />
          <Route path="/supervisor_viewpage" element={<SupervisorPage />} />
          <Route path="/ss_assignedsites/:supervisorId" element={<SupervisorAssignedSites />} />


          <Route path="/" element={<Homepage />} />



          <Route path="/report/:employeeId" element={<EmployeeReport />} />
          <Route path="/sitewisereport/:employeeId/:siteId" element={<ReportPage />} />

          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/aboutus" element={<AboutUs />} />

          <Route path="/ccommunication/:siteId/:userId" element={<ClientCommunication />} />
          <Route path="/pm_communicate/:siteId/:userId" element={<ManagerCommunication />} />


        
         

        </Routes>
      </BrowserRouter>
    
  );
}

export default App;