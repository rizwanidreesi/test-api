import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [searchAge, setSearchAge] = useState(""); // State for age search input
  const [searchFirstName, setSearchFirstName] = useState(""); // State for first name search input
  const [searchKeyword, setSearchKeyword] = useState(""); // State for keyword search input

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

  // Filter students based on age, first name, and keyword search inputs
  const filteredStudents = students.filter(
    (student) =>
      student.age.toString().includes(searchAge) &&
      student.firstName.toLowerCase().includes(searchFirstName.toLowerCase()) && // Check if the keyword matches any student information
      (student.firstName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        student.age.toString().includes(searchKeyword))
  );

  return (
    <div className="container mt-5">
      <Link to={`/create`} className="btn btn-primary btn-sm m-1">
        Add Student
      </Link>
      <h2>Student List</h2>
      <div className="d-flex justify-content-around bg-body-secondary p-3 border border-5 rounded-2">
        {/* Age search input field */}
        <div className="mb-3">
          <label htmlFor="ageSearch" className="form-label">
            <i className="bi bi-search text-primary"></i> Age:
          </label>
          <input
            type="text"
            className="form-control w-75"
            id="ageSearch"
            value={searchAge}
            onChange={(e) => setSearchAge(e.target.value)}
            placeholder="Enter age"
          />
        </div>

        {/* First name search input field */}
        <div className="mb-3">
          <label htmlFor="firstNameSearch" className="form-label">
            <i className="bi bi-search text-primary"></i> First Name:
          </label>
          <input
            type="text"
            className="form-control w-75"
            id="firstNameSearch"
            value={searchFirstName}
            onChange={(e) => setSearchFirstName(e.target.value)}
            placeholder="Enter first name"
          />
        </div>

        {/* Keyword search input field */}
        <div className="mb-3">
          <label htmlFor="keywordSearch" className="form-label">
            <i className="bi bi-search text-primary"></i> Keyword:
          </label>
          <input
            type="text"
            className="form-control w-75"
            id="keywordSearch"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Enter keyword"
          />
        </div>
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>S.No</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Picture</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student, index) => (
            <tr key={student._id}>
              <th scope='row'>{index+1}</th>
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
              <td>{student.age}</td>
              <td>
                {student.picture && (
                  <img
                    src={`http://localhost:3000/uploads/${student.picture}`}
                    alt={`${student.firstName}'s picture`}
                    className="img-thumbnail rounded-circle border border-2 border-success"
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
                  className="btn btn-success btn-sm m-1"
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
