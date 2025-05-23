import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import ClassManagement from "../components/ClassManagement";
import StudentManagement from "../components/StudentManagement";
import TeacherManagement from "../components/TeacherManagement";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { classes, students, teachers } = useAppContext();
  const [activeTab, setActiveTab] = useState("teachers"); 

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>School Management Dashboard</h1>
        <div className="dashboard-summary">
          <div className="summary-item">
            <span className="summary-label">Total Teachers:</span>
            <span className="summary-value">{teachers?.length || 0}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Classes:</span>
            <span className="summary-value">{classes.length}</span>
          </div>{" "}
          <div className="summary-item">
            <span className="summary-label">Total Students:</span>
            <span className="summary-value">{students.length}</span>
          </div>
        </div>
      </header>

      <div className="dashboard-tabs">
        <button
          className={activeTab === "teachers" ? "active" : ""}
          onClick={() => setActiveTab("teachers")}
        >
          Teachers
        </button>
        <button
          className={activeTab === "classes" ? "active" : ""}
          onClick={() => setActiveTab("classes")}
        >
          Classes
        </button>
        <button
          className={activeTab === "students" ? "active" : ""}
          onClick={() => setActiveTab("students")}
        >
          Students
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === "teachers" && (
          <section className="teacher-section">
            <TeacherManagement />
          </section>
        )}
        {activeTab === "classes" && (
          <section className="class-section">
            <ClassManagement />
          </section>
        )}
        {activeTab === "students" && (
          <section className="student-section">
            <StudentManagement />
          </section>
        )}
        
      </div>
    </div>
  );
};

export default Dashboard;
