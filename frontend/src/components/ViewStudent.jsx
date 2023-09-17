import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import axios from 'axios';

function ViewStudent() {
  const { id } = useParams(); // Use the useParams hook to get the 'id' parameter

  const [student, setStudent] = useState(null);

  useEffect(() => {
    // Fetch the student by ID from the backend when the component mounts
    const fetchStudentById = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/students/byId/${id}`); // Use 'id' from useParams
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentById();
  }, [id]); // Use 'id' as a dependency for useEffect

  return (
    <div className="container mt-5">
      <h2>View Student</h2>
      {student ? (
        <div>
          <div className="mb-3">
            <label>First Name: </label>
            <span>{student.firstName}</span>
          </div>
          <div className="mb-3">
            <label>Last Name: </label>
            <span>{student.lastName}</span>
          </div>
          <div className="mb-3">
            <label>Age: </label>
            <span>{student.age}</span>
          </div>
          <div className="mb-3">
            <label>Picture: </label>
            {student.picture && (
              <img
                src={`http://localhost:3000/uploads/${student.picture}`}
                alt={`${student.firstName}'s picture`}
                className="img-thumbnail"
                style={{ maxWidth: '200px' }}
              />
            )}
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default ViewStudent;
