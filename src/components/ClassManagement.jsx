import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaUserTie } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";
import "../styles/ClassManagement.css";

const ClassManagement = () => {
  const {
    classes,
    teachers = [],
    addClass,
    updateClass,
    deleteClass,
    setActiveClassId,
    activeClassId,
    getTeacherById,
    assignTeacherToClass,
    removeTeacherFromClass,
  } = useAppContext();
  const [classState, setClassState] = useState({
    newClassName: "",
    editingClass: null,
    editClassName: "",
    showAssignTeacherModal: false,
    classForTeacherAssignment: null,
    teacherToAssign: "",
  });
  const handleAddClass = (e) => {
    e.preventDefault();
    if (classState.newClassName.trim()) {
      addClass(classState.newClassName.trim());
      setClassState((prev) => ({
        ...prev,
        newClassName: "",
      }));
    }
  };

  const handleEditClass = (cls) => {
    setClassState((prev) => ({
      ...prev,
      editingClass: cls.id,
      editClassName: cls.name,
    }));
  };

  const handleUpdateClass = (e, id) => {
    e.preventDefault();
    if (classState.editClassName.trim()) {
      updateClass(id, { name: classState.editClassName.trim() });
      setClassState((prev) => ({
        ...prev,
        editingClass: null,
        editClassName: "",
      }));
    }
  };
  const handleDeleteClass = (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      deleteClass(id);
    }
  };

  const handleSelectClass = (id) => {
    setActiveClassId(id === activeClassId ? null : id);
  };
  // Teacher assignment
  const openAssignTeacherModal = (cls) => {
    setClassState((prev) => ({
      ...prev,
      classForTeacherAssignment: cls,
      showAssignTeacherModal: true,
      teacherToAssign: "",
    }));
  };

  const handleAssignTeacher = () => {
    if (classState.classForTeacherAssignment && classState.teacherToAssign) {
      assignTeacherToClass(
        classState.teacherToAssign,
        classState.classForTeacherAssignment.id
      );
      setClassState((prev) => ({
        ...prev,
        showAssignTeacherModal: false,
        classForTeacherAssignment: null,
      }));
    }
  };

  const handleRemoveTeacher = (classId) => {
    if (
      window.confirm(
        "Are you sure you want to remove the teacher from this class?"
      )
    ) {
      removeTeacherFromClass(classId);
    }
  };

  return (
    <div className="class-management">
      <h2>Class Management</h2> 
      {/* Add new class form */}
      <form onSubmit={handleAddClass} className="add-form">
        <input
          type="text"
          placeholder="Enter class name"
          value={classState.newClassName}
          onChange={(e) =>
            setClassState((prev) => ({ ...prev, newClassName: e.target.value }))
          }
          required
        />
        <button type="submit">
          <FaPlus /> Add Class
        </button>
      </form>
      {/* Class list */}
      <div className="class-list">
        <h3>Classes</h3>
        {classes.length === 0 ? (
          <p>No classes yet. Add your first class!</p>
        ) : (
          <ul>
            {classes.map((cls) => (
              <li
                key={cls.id}
                className={cls.id === activeClassId ? "active" : ""}
              >
                {" "}
                {classState.editingClass === cls.id ? (
                  <form onSubmit={(e) => handleUpdateClass(e, cls.id)}>
                    <input
                      type="text"
                      value={classState.editClassName}
                      onChange={(e) =>
                        setClassState((prev) => ({
                          ...prev,
                          editClassName: e.target.value,
                        }))
                      }
                      autoFocus
                    />
                    <button type="submit">Save</button>
                    <button
                      type="button"
                      onClick={() =>
                        setClassState((prev) => ({
                          ...prev,
                          editingClass: null,
                        }))
                      }
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div className="class-item">
                    <div className="class-info">
                      <span
                        className="class-name"
                        onClick={() => handleSelectClass(cls.id)}
                      >
                        {cls.name}
                      </span>
                      {cls.teacherId && (
                        <div className="class-teacher">
                          <FaUserTie />
                          <span>{getTeacherById(cls.teacherId)?.name}</span>
                          <button
                            className="remove-teacher-btn"
                            onClick={() => handleRemoveTeacher(cls.id)}
                            title="Remove teacher"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="class-actions">
                      <button onClick={() => handleEditClass(cls)}>
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteClass(cls.id)}>
                        <FaTrash />
                      </button>
                      <button onClick={() => openAssignTeacherModal(cls)}>
                        <FaUserTie /> {cls.teacherId ? "Change" : "Assign"}{" "}
                        Teacher
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>{" "}
      {/* Assign Teacher Modal */}
      {classState.showAssignTeacherModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              Assign Teacher to {classState.classForTeacherAssignment.name}
            </h3>
            <select
              value={classState.teacherToAssign}
              onChange={(e) =>
                setClassState((prev) => ({
                  ...prev,
                  teacherToAssign: e.target.value,
                }))
              }
              required
            >
              <option value="">-- Select Teacher --</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} ({teacher.subject})
                </option>
              ))}
            </select>
            <div className="modal-actions">
              <button onClick={handleAssignTeacher}>Assign</button>
              <button
                onClick={() =>
                  setClassState((prev) => ({
                    ...prev,
                    showAssignTeacherModal: false,
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

export default ClassManagement;
