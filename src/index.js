let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch all toys and display them
  fetchToys();

  // Add event listener for the form submission
  const newToyForm = document.querySelector("form.add-toy-form");
  newToyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const image = event.target.image.value;

    // Create new toy object
    const newToy = {
      name: name,
      image: image,
      likes: 0,
    };

    // Send POST request to add a new toy
    addNewToy(newToy);

    // Reset form and hide it
    newToyForm.reset();
    toyFormContainer.style.display = "none";
  });
});

// Fetch all toys and display them in the DOM
function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((toys) => {
      toys.forEach((toy) => {
        renderToyCard(toy);
      });
    })
    .catch((error) => console.error("Error fetching toys:", error));
}

// Render toy card in the DOM
function renderToyCard(toy) {
  const toyCard = document.createElement("div");
  toyCard.classList.add("card");

  toyCard.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  // Add the toy card to the collection
  document.getElementById("toy-collection").appendChild(toyCard);

  // Add event listener to the "Like" button
  const likeButton = toyCard.querySelector(".like-btn");
  likeButton.addEventListener("click", () => {
    increaseLikes(toy.id, toyCard);
  });
}

// Function to send POST request to add a new toy
function addNewToy(toy) {
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(toy),
  })
    .then((response) => response.json())
    .then((addedToy) => {
      // After adding, render the new toy card
      renderToyCard(addedToy);
    })
    .catch((error) => console.error("Error adding toy:", error));
}

// Function to increase likes for a toy
function increaseLikes(toyId, toyCard) {
  const likesParagraph = toyCard.querySelector("p");
  let currentLikes = parseInt(likesParagraph.innerText.split(" ")[0]);

  // Increment likes
  currentLikes++;

  // Send PATCH request to update likes
  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ likes: currentLikes }),
  })
    .then((response) => response.json())
    .then((updatedToy) => {
      // Update the likes count in the DOM
      likesParagraph.innerText = `${updatedToy.likes} Likes`;
    })
    .catch((error) => console.error("Error updating likes:", error));
  }