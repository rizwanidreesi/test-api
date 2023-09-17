// script.js
// document.getElementById('getDataButton').addEventListener('click', async () => {
//   try {
//     const response = await fetch('http://localhost:3000/api/students');
//     const students = await response.json();

//     const studentList = students.map(student => {
//       return `${student.firstName} ${student.lastName}, Age: ${student.age}`;
//     });

//     document.getElementById('apiResponse').innerHTML = studentList.join('<br>');
//   } catch (error) {
//     console.error('Error fetching student data:', error);
//   }
// });

// script.js get using picture ***********************************************************************************
// document.getElementById('getDataButton').addEventListener('click', async () => {
//   try {
//     const response = await fetch('http://localhost:3000/api/students');
//     const students = await response.json();

//     const studentList = students.map(student => {
//       const pictureUrl = student.picture
//         ? `http://localhost:3000/uploads/${student.picture}`
//         : ''; // URL to the uploaded picture

//       return `
//         <div class="student-card">
//           <div class="student-picture">
//             <img src="${pictureUrl}" alt="Student Picture">
//           </div>
//           <div class="student-info">
//             <p>Name: ${student.firstName} ${student.lastName}</p>
//             <p>Age: ${student.age}</p>
//           </div>
//         </div>
//       `;
//     });

//     document.getElementById('apiResponse').innerHTML = studentList.join('');
//   } catch (error) {
//     console.error('Error fetching student data:', error);
//   }
// });

// and update and get ***********************************************************************************************

document.getElementById("getDataButton").addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:3000/api/students/all");
    const students = await response.json();

    const studentList = students.map((student) => {
      const pictureUrl = student.picture
        ? `http://localhost:3000/uploads/${student.picture}`
        : ""; // URL to the uploaded picture

      return `
      <div class="student-card">
          <div class="student-picture">
            <img src="${pictureUrl}" alt="Student Picture" style="height: 50px;width: 50px; border-radius:50%;">
          </div>
          <div class="student-info">
            <p>Name: ${student.firstName} ${student.lastName}</p>
            <p>Age: ${student.age}</p>
            <button type="button" class="edit-button btn btn-outline-primary" data-id="${student._id}"><i class="bi bi-pencil"></i></button>
            <button type="button" class="delete-button btn btn-outline-danger" data-id="${student._id}"><i class="bi bi-trash"></i></button>
          </div>
        </div>
        
      `;
    });

    document.getElementById("apiResponse").innerHTML = studentList.join("");

    // Attach event listeners to the edit buttons
    const editButtons = document.querySelectorAll(".edit-button");
    editButtons.forEach((button) => {
      button.addEventListener("click", () => handleEditButtonClick(button));
    });
    // Attach event listeners to the Delete buttons
    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const studentId = button.getAttribute("data-id");
        const confirmDelete = confirm(
          "Are you sure you want to delete this student?"
        );
        if (confirmDelete) {
          handleDeleteButtonClick(studentId);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching student data:", error);
  }
});
// Edit Record*******************************************************************
function handleEditButtonClick(button) {
  const studentId = button.getAttribute("data-id");

  // Fetch the student details using the studentId
  fetch(`http://localhost:3000/api/students/byId/${studentId}`)
    .then((response) => response.json())
    .then((student) => {
      const studentCard = button.closest(".student-card");
      const studentInfo = studentCard.querySelector(".student-info");
      const nameInfo = studentInfo.querySelector("p:nth-child(1)");
      const ageInfo = studentInfo.querySelector("p:nth-child(2)");

      // Convert student info to editable fields
      nameInfo.innerHTML = `<input type="text" class="edit-input" value="${student.firstName}" />`;
      ageInfo.innerHTML = `<input type="number" class="edit-input" value="${student.age}" />`;

      // Add an input for picture update
      const pictureInput = document.createElement("input");
      pictureInput.setAttribute("type", "file");
      pictureInput.setAttribute("accept", "image/*");
      studentInfo.appendChild(pictureInput);

      // Change the button text and behavior
      button.textContent = "Save";
      button.removeEventListener("click", () => handleEditButtonClick(button));
      button.removeEventListener("click", () =>
        handleDeleteButtonClick(button)
      );
      button.addEventListener("click", () =>
        handleSaveButtonClick(button, studentId)
      );
    })
    .catch((error) => {
      console.error("Error fetching student:", error);
    });
}
// Delete functionality
async function handleDeleteButtonClick(studentId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/students/byId/${studentId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      // Display success message
      const successMessage = document.getElementById("successMessage");
      successMessage.textContent = "Student deleted successfully!";

      // Refresh the page after 2 seconds
      setTimeout(() => {
        location.reload();
      }, 2000); // 2000 milliseconds (2 seconds)
    } else {
      console.error("Error deleting student:", response.status);
    }
  } catch (error) {
    console.error("Error deleting student:", error);
  }
}

// Save Functionality
function handleSaveButtonClick(button, studentId) {
  const studentCard = button.closest(".student-card");
  const studentInfo = studentCard.querySelector(".student-info");
  const nameInput = studentInfo.querySelector('input[type="text"]');
  const ageInput = studentInfo.querySelector('input[type="number"]');
  //  picture update
  const pictureInput = studentInfo.querySelector('input[type="file"]');

  const updatedStudent = {
    firstName: nameInput.value,
    age: parseInt(ageInput.value),
  };

  fetch(`http://localhost:3000/api/students/byId/${studentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedStudent),
  })
    .then((response) => response.json())
    .then((updatedStudent) => {
      // Update the input field values
      nameInput.value = updatedStudent.firstName;
      ageInput.value = updatedStudent.age;

      // Display success message
      const successMessage = document.getElementById("successMessage");
      successMessage.textContent = "Student updated successfully!";

      // Change the button text and behavior
      button.textContent = "Edit";
      button.removeEventListener("click", () =>
        handleSaveButtonClick(button, studentId)
      );
      button.addEventListener("click", () => handleEditButtonClick(button));
    });

  // Refresh page
  setTimeout(() => {
    location.reload();
  }, 2000).catch((error) => {
    console.error("Error updating student:", error);
  });
}

// Add Student form
// const addStudentForm = document.getElementById('addStudentForm');
// const successMessage = document.getElementById('successMessage');
// addStudentForm.addEventListener('submit', async event => {
//   event.preventDefault();

//   const formData = new FormData(addStudentForm);
//   const studentData = {
//     firstName: formData.get('firstName'),
//     lastName: formData.get('lastName'),
//     age: parseInt(formData.get('age')),
//   };

//   try {
//     const response = await fetch('http://localhost:3000/api/students', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(studentData),
//     });

//     const newStudent = await response.json();
//     console.log('New student added:', newStudent);

//     // Display success message
//     successMessage.textContent = 'Student added successfully!';

//     addStudentForm.reset(); // Clear the form
//   } catch (error) {
//     console.error('Error adding student:', error);
//   }
// });

// Add Student *****************************************************************************
addStudentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(addStudentForm);
  const studentData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    age: parseInt(formData.get("age")),
  };

  // Append the uploaded file to the FormData
  const pictureInput = document.getElementById("picture");
  if (pictureInput.files.length > 0) {
    studentData.picture = pictureInput.files[0];
  }

  try {
    const response = await fetch("http://localhost:3000/api/students/create", {
      method: "POST",
      body: createFormData(studentData),
    });

    const newStudent = await response.json();
    console.log("New student added:", newStudent);

    // Display success message
    successMessage.textContent = "Student added successfully!";
    addStudentForm.reset(); // Clear the form
  } catch (error) {
    console.error("Error adding student:", error);
  }
});

// Helper function to create FormData with nested objects
function createFormData(data, form = new FormData(), parentKey = "") {
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      const newKey = parentKey ? `${parentKey}[${key}]` : key;

      if (typeof value === "object" && !(value instanceof File)) {
        createFormData(value, form, newKey);
      } else {
        form.append(newKey, value);
      }
    }
  }
  return form;
}

// Search Students by age ********************************************************************

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
let allStudentsData = []; // Store all student data initially

// Fetch all students data initially (this can be done when the page loads)
fetchAllStudents();

async function fetchAllStudents() {
  try {
    const response = await fetch("http://localhost:3000/api/students/all");
    const students = await response.json();
    allStudentsData = students; // Store the data
    displayStudents(students); // Display all students initially
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}

searchButton.addEventListener("click", () => {
  const searchAge = searchInput.value.trim(); // Get the entered age
  if (searchAge !== "") {
    const filteredStudents = allStudentsData.filter(
      (student) => student.age === parseInt(searchAge)
    );
    displayStudents(filteredStudents);
  } else {
    displayStudents(allStudentsData); // Display all students if search input is empty
  }
});

function displayStudents(students) {
  const studentList = students.map((student) => {
    const pictureUrl = student.picture
      ? `http://localhost:3000/uploads/${student.picture}`
      : "";

    return `
    <div class="table-responsive">
    <table class="table table-striped
    table-hover	table-bordered  
    table-borderless
    table-primary
    align-middle">
      
        <tbody class="table-group-divider">
          <tr class="table-primary" >
            <td><img src="${pictureUrl}" alt="Student Picture" class="tableImg"></td>
            <td>${student.firstName} ${student.lastName}</td>
            <td>${student.age}</td>
            <td class="cellWidth">
            <button type="button" class="edit-button btn btn-outline-primary" data-id="${student._id}"><i class="bi bi-pencil"></i></button>
          <button type="button" class="delete-button btn btn-outline-danger" data-id="${student._id}"><i class="bi bi-trash"></i></button>
            </td>
          </tr>
          
        </tbody>
        <tfoot>
          
        </tfoot>
    </table>
  </div>
    
      
    `;
  });

  document.getElementById("apiResponse").innerHTML = studentList.join("");

  // Attach event listeners to the edit buttons
  const editButtons = document.querySelectorAll(".edit-button");
  editButtons.forEach((button) => {
    button.addEventListener("click", () => handleEditButtonClick(button));
  });
}

// ... (rest of the code)
