import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaExchangeAlt } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";
import "../styles/StudentManagement.css";

const StudentManagement = () => {
  const {
    classes,
    activeClassId,
    setActiveClassId,
    addStudent,
    updateStudent,
    deleteStudent,
    transferStudent,
    getStudentsByClass,
    getClassById,
  } = useAppContext();
  const [students, setStudents] = useState([]);

  const [studentState, setStudentState] = useState({
    newStudent: {
      name: "",
      studentId: "",
      classId: activeClassId,
    },
    editingStudent: null,
    editStudentData: {},
    showTransferModal: false,
    studentToTransfer: null,
    targetClassId: "",
  });
  // Update students list when activeClassId changes
  useEffect(() => {
    if (activeClassId) {
      setStudents(getStudentsByClass(activeClassId));
      setStudentState((prev) => ({
        ...prev,
        newStudent: { ...prev.newStudent, classId: activeClassId },
      }));
    } else {
      setStudents([]);
    }
  }, [activeClassId, getStudentsByClass]);
  // Handle add student form
  const handleNewStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentState((prev) => ({
      ...prev,
      newStudent: { ...prev.newStudent, [name]: value },
    }));
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    const { newStudent } = studentState;
    if (
      newStudent.name.trim() &&
      newStudent.studentId.trim() &&
      activeClassId
    ) {
      addStudent({ ...newStudent, classId: activeClassId });
      setStudentState((prev) => ({
        ...prev,
        newStudent: {
          name: "",
          studentId: "",
          classId: activeClassId,
        },
      }));
      // Update the displayed students
      setStudents(getStudentsByClass(activeClassId));
    }
  };
  // Handle edit student form
  const handleEditStudent = (student) => {
    setStudentState((prev) => ({
      ...prev,
      editingStudent: student.id,
      editStudentData: { ...student },
    }));
  };

  const handleEditStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentState((prev) => ({
      ...prev,
      editStudentData: { ...prev.editStudentData, [name]: value },
    }));
  };

  const handleUpdateStudent = (e) => {
    e.preventDefault();
    const { editStudentData, editingStudent } = studentState;

    if (editStudentData.name.trim() && editStudentData.studentId.trim()) {
      updateStudent(editingStudent, editStudentData);
      setStudentState((prev) => ({
        ...prev,
        editingStudent: null,
      }));
      // Update the displayed students
      setStudents(getStudentsByClass(activeClassId));
    }
  };
  // Handle delete student
  const handleDeleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      deleteStudent(id);
      // Update the displayed students
      setStudents(getStudentsByClass(activeClassId));
    }
  };

  // Handle transfer student
  const openTransferModal = (student) => {
    setStudentState((prev) => ({
      ...prev,
      studentToTransfer: student,
      showTransferModal: true,
      targetClassId: "",
    }));
  };

  const handleTransferStudent = () => {
    const { studentToTransfer, targetClassId } = studentState;

    if (studentToTransfer && targetClassId) {
      transferStudent(studentToTransfer.id, targetClassId);
      setStudentState((prev) => ({
        ...prev,
        showTransferModal: false,
        studentToTransfer: null,
      }));
      // Update the displayed students
      setStudents(getStudentsByClass(activeClassId));
    }
  };
  // If no class is selected, show only the class selection dropdown
  if (!activeClassId) {
    return (
      <div className="student-management">
        <h2>Student Management</h2>

        {/* Class selection dropdown */}
        <div className="class-selection">
          <label>Select Class:</label>
          <select
            value={activeClassId || ""}
            onChange={(e) => setActiveClassId(e.target.value)}
          >
            <option value="">-- Select a class --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <p>Please select a class to manage students.</p>
      </div>
    );
  }

  const currentClass = getClassById(activeClassId);
  return (
    <div className="student-management">
      <h2>Student Management</h2>
      {/* Class selection dropdown */}
      <div className="class-selection">
        <label>Select Class:</label>
        <select
          value={activeClassId || ""}
          onChange={(e) => setActiveClassId(e.target.value)}
        >
          <option value="">-- Select a class --</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>
      {activeClassId && <h3>Managing students for: {currentClass?.name}</h3>}{" "}
      {/* Add new student form */}
      <form onSubmit={handleAddStudent} className="add-form">
        <div className="form-group">
          <label>Student Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Enter student name"
            value={studentState.newStudent.name}
            onChange={handleNewStudentChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Student ID:</label>
          <input
            type="text"
            name="studentId"
            placeholder="Enter student ID"
            value={studentState.newStudent.studentId}
            onChange={handleNewStudentChange}
            required
          />
        </div>
        <button type="submit">
          <FaPlus /> Add Student
        </button>
      </form>
      {/* Student list */}
      <div className="student-list">
        <h3>Students</h3>
        {students.length === 0 ? (
          <p>No students in this class yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  {" "}
                  {studentState.editingStudent === student.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={studentState.editStudentData.name}
                          onChange={handleEditStudentChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="studentId"
                          value={studentState.editStudentData.studentId}
                          onChange={handleEditStudentChange}
                        />
                      </td>
                      <td>
                        <button onClick={handleUpdateStudent}>Save</button>
                        <button
                          onClick={() =>
                            setStudentState((prev) => ({
                              ...prev,
                              editingStudent: null,
                            }))
                          }
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{student.name}</td>
                      <td>{student.studentId}</td>
                      <td>
                        <button onClick={() => handleEditStudent(student)}>
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDeleteStudent(student.id)}>
                          <FaTrash />
                        </button>
                        <button onClick={() => openTransferModal(student)}>
                          <FaExchangeAlt /> Transfer
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>{" "}
      {/* Transfer Modal */}
      {studentState.showTransferModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Transfer Student</h3>
            <p>
              Transfer {studentState.studentToTransfer?.name} from{" "}
              {getClassById(studentState.studentToTransfer?.classId)?.name} to:
            </p>
            <select
              value={studentState.targetClassId}
              onChange={(e) =>
                setStudentState((prev) => ({
                  ...prev,
                  targetClassId: e.target.value,
                }))
              }
              required
            >
              <option value="">-- Select Class --</option>
              {classes
                .filter((c) => c.id !== studentState.studentToTransfer?.classId)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
            <div className="modal-actions">
              <button onClick={handleTransferStudent}>Confirm Transfer</button>
              <button
                onClick={() =>
                  setStudentState((prev) => ({
                    ...prev,
                    showTransferModal: false,
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

export default StudentManagement;
