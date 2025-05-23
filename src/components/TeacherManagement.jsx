import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaChalkboardTeacher } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";
import "../styles/TeacherManagement.css";

const TeacherManagement = () => {
  const {
    teachers = [],
    classes = [],
    addTeacher,
    updateTeacher,
    deleteTeacher,
    assignTeacherToClass,
    removeTeacherFromClass,
    getClassesByTeacher,
    getClassById,
  } = useAppContext();
  const [teacherClasses, setTeacherClasses] = useState([]);

  const [teacherState, setTeacherState] = useState({
    newTeacher: {
      name: "",
      employeeId: "",
      subject: "",
      contactInfo: "",
    },
    editingTeacher: null,
    editTeacherData: {},
    selectedTeacher: null,
    showAssignModal: false,
    classToAssign: "",
  });
  // Update teacherClasses when selectedTeacher changes
  useEffect(() => {
    if (teacherState.selectedTeacher) {
      setTeacherClasses(getClassesByTeacher(teacherState.selectedTeacher.id));
    } else {
      setTeacherClasses([]);
    }
  }, [teacherState.selectedTeacher, getClassesByTeacher, classes]);
  

  const handleNewTeacherChange = (e) => {
    const { name, value } = e.target;
    setTeacherState((prev) => ({
      ...prev,
      newTeacher: { ...prev.newTeacher, [name]: value },
    }));
  };

  const handleAddTeacher = (e) => {
    e.preventDefault();
    const { newTeacher } = teacherState;
    if (
      newTeacher.name.trim() &&
      newTeacher.employeeId.trim() &&
      newTeacher.subject.trim() &&
      newTeacher.contactInfo.trim()
    ) {
      addTeacher(newTeacher);
      setTeacherState((prev) => ({
        ...prev,
        newTeacher: {
          name: "",
          employeeId: "",
          subject: "",
          contactInfo: "",
        },
      }));
    }
  };
  
  const handleEditTeacher = (teacher) => {
    setTeacherState((prev) => ({
      ...prev,
      editingTeacher: teacher.id,
      editTeacherData: { ...teacher },
    }));
  };

  const handleEditTeacherChange = (e) => {
    const { name, value } = e.target;
    setTeacherState((prev) => ({
      ...prev,
      editTeacherData: { ...prev.editTeacherData, [name]: value },
    }));
  };

  const handleUpdateTeacher = (e) => {
    e.preventDefault();
    const { editTeacherData, editingTeacher, selectedTeacher } = teacherState;

    if (
      editTeacherData.name.trim() &&
      editTeacherData.employeeId.trim() &&
      editTeacherData.subject.trim()
    ) {
      updateTeacher(editingTeacher, editTeacherData);

      // Update selectedTeacher if it was the one edited
      if (selectedTeacher && selectedTeacher.id === editingTeacher) {
        setTeacherState((prev) => ({
          ...prev,
          selectedTeacher: { ...editTeacherData, id: editingTeacher },
          editingTeacher: null,
        }));
      } else {
        setTeacherState((prev) => ({
          ...prev,
          editingTeacher: null,
        }));
      }
    }
  };
  
  const handleDeleteTeacher = (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      deleteTeacher(id);

      // Clear selectedTeacher if it was deleted
      if (
        teacherState.selectedTeacher &&
        teacherState.selectedTeacher.id === id
      ) {
        setTeacherState((prev) => ({
          ...prev,
          selectedTeacher: null,
        }));
      }
    }
  };

  
  const handleSelectTeacher = (teacher) => {
    setTeacherState((prev) => ({
      ...prev,
      selectedTeacher: prev.selectedTeacher?.id === teacher.id ? null : teacher,
    }));
  };
  
  const openAssignModal = () => {
    setTeacherState((prev) => ({
      ...prev,
      showAssignModal: true,
      classToAssign: "",
    }));
  };

  const handleAssignClass = () => {
    const { selectedTeacher, classToAssign } = teacherState;

    if (selectedTeacher && classToAssign) {
      assignTeacherToClass(selectedTeacher.id, classToAssign);
      setTeacherState((prev) => ({
        ...prev,
        showAssignModal: false,
      }));
      // Update teacherClasses
      setTeacherClasses(getClassesByTeacher(selectedTeacher.id));
    }
  };
  
  const handleRemoveClass = (classId) => {
    if (
      window.confirm("Are you sure you want to remove this class assignment?")
    ) {
      removeTeacherFromClass(classId);
      // Update teacherClasses
      setTeacherClasses(getClassesByTeacher(teacherState.selectedTeacher.id));
    }
  };

  return (
    <div className="teacher-management">
      <h2>Teacher Management</h2>
      <div className="teacher-content">
        <div className="teacher-list-section">         
          <form onSubmit={handleAddTeacher} className="add-form">
            <div className="form-group">
              <label>Teacher Name:</label>
              <input
                type="text"
                name="name"
                placeholder="Enter teacher name"
                value={teacherState.newTeacher.name}
                onChange={handleNewTeacherChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Employee ID:</label>
              <input
                type="text"
                name="employeeId"
                placeholder="Enter employee ID"
                value={teacherState.newTeacher.employeeId}
                onChange={handleNewTeacherChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Subject:</label>
              <input
                type="text"
                name="subject"
                placeholder="Enter teacher's subject"
                value={teacherState.newTeacher.subject}
                onChange={handleNewTeacherChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Contact Info:</label>
              <input
                type="text"
                name="contactInfo"
                placeholder="Enter contact information"
                value={teacherState.newTeacher.contactInfo}
                onChange={handleNewTeacherChange}
              />
            </div>
            <button type="submit">
              <FaPlus /> Add Teacher
            </button>
          </form>
          {/* Teacher list */}
          <div className="teacher-list">
            <h3>Teachers</h3>
            {teachers.length === 0 ? (
              <p>No teachers yet. Add your first teacher!</p>
            ) : (
              <ul>
                {teachers.map((teacher) => (
                  <li
                    key={teacher.id}
                    className={
                      teacherState.selectedTeacher?.id === teacher.id
                        ? "active"
                        : ""
                    }
                  >
                    {teacherState.editingTeacher === teacher.id ? (
                      <form onSubmit={handleUpdateTeacher}>
                        <div className="form-group">
                          <label>Name:</label>{" "}
                          <input
                            type="text"
                            name="name"
                            value={teacherState.editTeacherData.name}
                            onChange={handleEditTeacherChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Employee ID:</label>
                          <input
                            type="text"
                            name="employeeId"
                            value={teacherState.editTeacherData.employeeId}
                            onChange={handleEditTeacherChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Subject:</label>
                          <input
                            type="text"
                            name="subject"
                            value={teacherState.editTeacherData.subject}
                            onChange={handleEditTeacherChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Contact Info:</label>
                          <input
                            type="text"
                            name="contactInfo"
                            value={
                              teacherState.editTeacherData.contactInfo || ""
                            }
                            onChange={handleEditTeacherChange}
                          />
                        </div>
                        <div className="edit-buttons">
                          <button type="submit">Save</button>
                          <button
                            type="button"
                            onClick={() => setEditingTeacher(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="teacher-item">
                        <div
                          className="teacher-info"
                          onClick={() => handleSelectTeacher(teacher)}
                        >
                          <h4>{teacher.name}</h4>
                          <div className="teacher-details">
                            <p>
                              <strong>ID:</strong> {teacher.employeeId}
                            </p>
                            <p>
                              <strong>Subject:</strong> {teacher.subject}
                            </p>
                            {teacher.contactInfo && (
                              <p>
                                <strong>Contact:</strong> {teacher.contactInfo}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="teacher-actions">
                          <button onClick={() => handleEditTeacher(teacher)}>
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteTeacher(teacher.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* Teacher's classes section */}
        <div className="teacher-classes-section">
          <h3>
            {teacherState.selectedTeacher
              ? `Classes Assigned to ${teacherState.selectedTeacher.name}`
              : "Select a teacher to view assigned classes"}
          </h3>

          {teacherState.selectedTeacher && (
            <button className="assign-button" onClick={openAssignModal}>
              <FaChalkboardTeacher /> Assign Class
            </button>
          )}

          {teacherState.selectedTeacher && teacherClasses.length === 0 ? (
            <p>No classes assigned to this teacher yet.</p>
          ) : (
            teacherState.selectedTeacher && (
              <table>
                <thead>
                  <tr>
                    <th>Class Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherClasses.map((cls) => (
                    <tr key={cls.id}>
                      <td>{cls.name}</td>
                      <td>
                        <button onClick={() => handleRemoveClass(cls.id)}>
                          <FaTrash /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>
      {/* Assign Class Modal */}
      {teacherState.showAssignModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Assign Class to {teacherState.selectedTeacher.name}</h3>
            <select
              value={teacherState.classToAssign}
              onChange={(e) =>
                setTeacherState((prev) => ({
                  ...prev,
                  classToAssign: e.target.value,
                }))
              }
              required
            >
              <option value="">-- Select Class --</option>
              {classes
                .filter((c) => !teacherClasses.some((tc) => tc.id === c.id))
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
            <div className="modal-actions">
              <button onClick={handleAssignClass}>Assign</button>
              <button
                onClick={() =>
                  setTeacherState((prev) => ({
                    ...prev,
                    showAssignModal: false,
                  }))
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;
