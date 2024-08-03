// Load the track list at the starting if data is available
window.addEventListener("load", DisplayData);

//! ADD DATA
async function handleFormSubmit(event, id = null) {
  event.preventDefault();

  let amount = event.target.amount.value;
  let description = event.target.description.value;
  let category = event.target.category.value;

  //! If amount is not submitted then do nothing.
  if (!amount && !description && !category) {
    alert("Please enter all inputs before submitting!");
    return;
  }

  try {
    const data = {
      amount: amount,
      description: description || "No description",
      category: category
    };
    console.log(data)
    if (!id) {
      const response = await axios.post("http://localhost:4000/api/expense", data);
      console.log(response.data)
    } else {
      await axios.put(`http://localhost:4000/api/expense/${id}`, data);

      const modal = document.getElementById("modal");
      modal.close();
    }
  } catch (err) {
    console.log(err);
  }

  // Reseat the form
  document.getElementById("amount").value = "";
  document.getElementById("description").value = "";
  document.getElementById("category").value = "Movie";

  DisplayData();
}

//! Displays the track data

async function DisplayData() {
  const TrackList = document.getElementById("TrackList");
  const response = await axios.get("http://localhost:4000/api/expenses");
  const existingTracks = response.data;

  let htmlCode = "";

  existingTracks.forEach((track, index) => {
    htmlCode += `
    <tr>
    <th scope="row">${index + 1}</th>
    <td>${track.amount}</td>
    <td>${track.description}</td>
    <td>${track.category}</td>
    <td class="d-flex justify-content-evenly">
    <button onclick="editTrack('${
      track.id
    }')" class="btn btn-success">Edit</button>
    <button onclick="deleteTrack('${
      track.id
    }')" class="btn btn-danger">Delete</button> 
    </td>
    </tr>
    `;
  });
  TrackList.innerHTML = htmlCode;

  // If track is empty then show empty on Display
  if (existingTracks.length == 0) {
    const TrackList = document.getElementById("TrackList");
    TrackList.innerHTML = `<tr><td colspan="5"><center>Empty</center></td></tr>`;
  }
}

//! DELETE TRACK

async function deleteTrack(id) {

  await axios.delete(`http://localhost:4000/api/expense/${id}`)

  DisplayData();

  // If track is empty then show empty on Display
  if (existingTracks.length == 0) {
    const TrackList = document.getElementById("TrackList");
    TrackList.innerHTML = `<tr><td colspan="5"><center>Empty</center></td></tr>`;
  }
}

//! UPDATE TRACK FORM Modal
async function editTrack(id) {
  const modal = document.getElementById("modal");
  try{

    // ! fetch by id
    const response = await axios.get(`http://localhost:4000/api/expense/${id}`)
    const foundTrack = response.data
  
    modal.innerHTML = `
      <button class="btn btn-secondary rounded float-end" onclick='modalClose()'>X</button>
      
      <form class="p-4" onsubmit="handleFormSubmit(event, '${foundTrack.id}')">
      <legend>Expense tracker Update</legend>
      <div class="mb-3">
      <label for="expenseAmount" class="form-label">Expense amount</label>
      <input type="number" min="0" id="amount" class="form-control" placeholder="Amount" value="${
        foundTrack.amount
      }">
      </div>
      <div class="mb-3">
      <label for="description" class="form-label">Description</label>
      <input type="text" min="0" id="description" class="form-control" placeholder="Description" value="${
        foundTrack.description
      }">
      </div>
      <div class="mb-3">
      <label for="category" class="form-label">Category</label>
      <select id="category" class="form-select" >
      <option ${
        foundTrack.category == "Movie" ? "selected" : ""
      } value="Movie">Movie</option>
      <option ${
        foundTrack.category == "Car" ? "selected" : ""
      } value="Car">Car</option>
      <option ${
        foundTrack.category == "Food" ? "selected" : ""
      } value="Food">Food</option>
      <option ${
        foundTrack.category == "Games" ? "selected" : ""
      } value="Games">Games</option>
      </select>
      </div>
      
      <button class="btn btn-success w-100">Update</button>
      
      </form>
      `;
    modal.showModal(); // TODO: Open modal
  } catch (err) {
    console.log(err)
  }
}
