import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Fetch all students from the backend when the component mounts
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/students/all"
        ); // Update the URL as needed
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudents();
  }, []);

  // Function to handle the delete action
  const handleDelete = async (studentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (confirmDelete) {
      try {
        await axios.delete(
          `http://localhost:3000/api/students/byId/${studentId}`
        ); // Update the URL as needed
        // Remove the deleted student from the state
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student._id !== studentId)
        );
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <Link
        to={`/create`} 
        className="btn btn-primary btn-sm m-1"
      >
        Add Student
      </Link>
      <h2>Student List</h2>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Picture</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
              <td>{student.age}</td>
              <td>
                {student.picture && (
                  <img
                    src={`http://localhost:3000/uploads/${student.picture}`}
                    alt={`${student.firstName}'s picture`}
                    className="img-thumbnail rounded-circle border border-2 border-success "
                    style={{ width: "50px", height: "50px" }}
                  />
                )}
              </td>
              <td>                
                <Link
                  to={`/byId/${student._id}`} // Link to the student details page
                  className="btn btn-primary btn-sm m-1"
                >
                  <i className="bi bi-binoculars"></i>
                </Link>
                <Link
                  to={`/update/${student._id}`} // Link to the student details page
                  className="btn btn-primary btn-sm m-1"
                >
                  <i className="bi bi-pen"></i>
                </Link>
                <button
                  className="btn btn-danger btn-sm m-1"
                  onClick={() => handleDelete(student._id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
