import { useState } from 'react';
import axios from 'axios';

function CreateStudent() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    picture: null,
  });

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
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('age', age);
      formData.append('picture', picture);

      await axios.post('http://localhost:3000/api/students/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Handle success, e.g., redirect to student list page or show a success message.
    } catch (error) {
      console.error('Error creating student:', error);
      // Handle error, e.g., show an error message.
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create Student</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">First Name</label>
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
          <label htmlFor="lastName" className="form-label">Last Name</label>
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
          <label htmlFor="age" className="form-label">Age</label>
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
          <label htmlFor="picture" className="form-label">Picture</label>
          <input
            type="file"
            className="form-control"
            id="picture"
            name="picture"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="mb-3">
          {formData.picture && (
            <img
              src={URL.createObjectURL(formData.picture)}
              alt="Selected"
              className="img-fluid mt-2 w-25 rounded-circle border border-2 border-success"
            />
          )}
        </div>
        <button type="submit" className="btn btn-primary">Create</button>
      </form>
    </div>
  );
}

export default CreateStudent;
