import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import axios from "axios";

function UpdateStudent() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    picture: null,
  });
  const [student, setStudent] = useState(null);
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    // Fetch student data by ID and populate the form fields
    const fetchStudentById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/students/byId/${id}`
        ); // Replace with your backend endpoint
        const studentData = response.data;
        setStudentId(studentData._id); // Set the studentId based on the fetched student data
        setFormData({
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          age: studentData.age,
          picture: null, // Set to null initially, as we don't want to display the old picture
        });
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentById();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      picture: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, age, picture } = formData;

    try {
      const studentData = new FormData();
      studentData.append("firstName", firstName);
      studentData.append("lastName", lastName);
      studentData.append("age", age);
      studentData.append("picture", picture);

      await axios.put(
        `http://localhost:3000/api/students/update/${studentId}`,
        studentData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle success, e.g., redirect to the student list page or show a success message.
    } catch (error) {
      console.error("Error updating student:", error);
      // Handle error, e.g., show an error message.
    }
  };

  return (
    <div className="container mt-5">
      <h2>Update Student</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="age" className="form-label">
            Age
          </label>
          <input
            type="number"
            className="form-control"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="picture" className="form-label">
            Picture
          </label>
          <input
            type="file"
            className="form-control"
            id="picture"
            name="picture"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        {formData.picture && (
          <div className="mb-3">
            <img
              src={URL.createObjectURL(formData.picture)}
              alt="Selected"
              className="img-fluid mt-2 w-25 rounded-circle border border-2 border-success"
            />
          </div>
        )}
        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdateStudent;
