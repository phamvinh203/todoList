import { createContext, useState, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// Create the context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

// Provider component
export const AppProvider = ({ children }) => {
  
  const loadFromStorage = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  
  const [classes, setClasses] = useState(loadFromStorage("classes", []));
  const [students, setStudents] = useState(loadFromStorage("students", []));
  const [teachers, setTeachers] = useState(loadFromStorage("teachers", []));
  const [activeClassId, setActiveClassId] = useState(null);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem("classes", JSON.stringify(classes));
  }, [classes]);
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("teachers", JSON.stringify(teachers));
  }, [teachers]);

  // Teacher management functions
  const addTeacher = (teacherData) => {
    const newTeacher = {
      id: uuidv4(),
      ...teacherData,
      createdAt: new Date().toISOString(),
    };
    setTeachers([...teachers, newTeacher]);
    return newTeacher.id;
  };

  const updateTeacher = (id, updatedTeacher) => {
    setTeachers(
      teachers.map((teacher) =>
        teacher.id === id ? { ...teacher, ...updatedTeacher } : teacher
      )
    );
  };

  const deleteTeacher = (id) => {
    
    setClasses(
      classes.map((cls) =>
        cls.teacherId === id ? { ...cls, teacherId: null } : cls
      )
    );

    
    setTeachers(teachers.filter((teacher) => teacher.id !== id));
  };

 
  const assignTeacherToClass = (teacherId, classId) => {
    setClasses(
      classes.map((cls) => (cls.id === classId ? { ...cls, teacherId } : cls))
    );
  };

  
  const removeTeacherFromClass = (classId) => {
    setClasses(
      classes.map((cls) =>
        cls.id === classId ? { ...cls, teacherId: null } : cls
      )
    );
  };

  
  const getClassesByTeacher = (teacherId) => {
    return classes.filter((cls) => cls.teacherId === teacherId);
  };

  
  const getTeacherById = (id) => {
    return teachers.find((teacher) => teacher.id === id);
  };

  
  const getTeacherByClass = (classId) => {
    const cls = getClassById(classId);
    if (cls && cls.teacherId) {
      return getTeacherById(cls.teacherId);
    }
    return null;
  };

  // Class management functions
  const addClass = (className) => {
    const newClass = {
      id: uuidv4(),
      name: className,
      createdAt: new Date().toISOString(),
    };
    setClasses([...classes, newClass]);
    return newClass.id;
  };

  const updateClass = (id, updatedClass) => {
    setClasses(
      classes.map((cls) => (cls.id === id ? { ...cls, ...updatedClass } : cls))
    );
  };

  const deleteClass = (id) => {
    
    setStudents(
      students.map((student) =>
        student.classId === id ? { ...student, classId: null } : student
      )
    );

    
    setClasses(classes.filter((cls) => cls.id !== id));

    
    if (activeClassId === id) {
      setActiveClassId(null);
    }
  };

  // Student management functions
  const addStudent = (studentData) => {
    const newStudent = {
      id: uuidv4(),
      ...studentData,
      createdAt: new Date().toISOString(),
    };
    setStudents([...students, newStudent]);
    return newStudent.id;
  };

  const updateStudent = (id, updatedStudent) => {
    setStudents(
      students.map((student) =>
        student.id === id ? { ...student, ...updatedStudent } : student
      )
    );
  };

  const deleteStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  const transferStudent = (studentId, newClassId) => {
    setStudents(
      students.map((student) =>
        student.id === studentId ? { ...student, classId: newClassId } : student
      )
    );
  };

  
  const getStudentsByClass = (classId) => {
    return students.filter((student) => student.classId === classId);
  };

  
  const getClassById = (id) => {
    return classes.find((cls) => cls.id === id);
  };

  
  const getStudentById = (id) => {
    return students.find((student) => student.id === id);
  };

  
  
  const contextValue = {
    classes,
    students,
    teachers,
    activeClassId,
    setActiveClassId,
    addClass,
    updateClass,
    deleteClass,
    addStudent,
    updateStudent,
    deleteStudent,
    transferStudent,
    getStudentsByClass,
    getClassById,
    getStudentById,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    assignTeacherToClass,
    removeTeacherFromClass,
    getClassesByTeacher,
    getTeacherById,
    getTeacherByClass,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
