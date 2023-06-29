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
});

document.addEventListener('DOMContentLoaded', () => {
  const toyForm = document.querySelector('.add-toy-form');
  const toyCollection = document.getElementById('toy-collection');
  
  // Fetch toys from the API and render them in cards
  function fetchToys() {
    fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(toys => toys.forEach(renderToyCard));
  }

  // Render a toy card
  function renderToyCard(toy) {
    const card = document.createElement('div');
    card.classList.add('card');

    const name = document.createElement('h2');
    name.innerText = toy.name;

    const image = document.createElement('img');
    image.src = toy.image;
    image.alt = toy.name;
    image.classList.add('toy-avatar');

    const likes = document.createElement('p');
    likes.innerText = `${toy.likes} Likes`;

    const likeButton = document.createElement('button');
    likeButton.classList.add('like-btn');
    likeButton.innerText = 'Like';
    likeButton.addEventListener('click', () => {
      increaseLikes(toy, likes);
    });

    const removeButton = document.createElement('button');
    removeButton.classList.add('remove-btn');
    removeButton.innerText = 'Remove';
    removeButton.addEventListener('click', () => {
      removeToy(toy, card);
    });

    card.appendChild(name);
    card.appendChild(image);
    card.appendChild(likes);
    card.appendChild(likeButton);
    card.appendChild(removeButton);

    toyCollection.appendChild(card);
  }

  // Increase the number of likes for a toy and update the DOM and database
  function increaseLikes(toy, likesElement) {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(response => response.json())
      .then(updatedToy => {
        toy.likes = updatedToy.likes;
        likesElement.innerText = `${updatedToy.likes} Likes`;
      });
  }

  // Remove a toy from the DOM and the database
  function removeToy(toy, card) {
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'DELETE'
    })
      .then(() => {
        card.remove();
      })
      .catch(error => {
        console.error('Error removing toy:', error);
      });
  }

  // Add event listener to the form for creating new toys
  toyForm.addEventListener('submit', event => {
    event.preventDefault();

    const nameInput = toyForm.querySelector('input[name="name"]');
    const imageInput = toyForm.querySelector('input[name="image"]');

    const newToy = {
      name: nameInput.value,
      image: imageInput.value,
      likes: 0
    };

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(createdToy => {
        renderToyCard(createdToy);
        toyForm.reset();
      });
  });

  // Fetch and render the initial toys
  fetchToys();
});
