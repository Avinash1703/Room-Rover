(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

const backToTopButton = document.querySelector("#back-to-top");

// Show the button when the user scrolls down a bit
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
});

// Scroll to the top when the button is clicked
backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Add smooth scrolling effect
  });
});

//adding event listener for taxSwitch.
let taxSwitch = document.getElementById("flexSwitchCheckDefault");
        taxSwitch.addEventListener("click", ()=> {
            let taxInfo = document.getElementsByClassName("tax-info");
            for(info of taxInfo){
                if(info.style.display != "inline"){
                    info.style.display = "inline";
                }else{
                    info.style.display = "none";
                }
            }
});

//Adding like functionality.
const likeButtons = document.querySelectorAll(".like-button");

    // Iterate through each like button and add a click event listener
    likeButtons.forEach(likeButton => {
      const heartIcon = likeButton.querySelector(".heart-icon");
      const likesAmountLabel = likeButton.nextElementSibling; // Assumes likes-amount is a sibling element

      // Prevent the default click behavior on the heart icon
      heartIcon.addEventListener("click", (event) => {
        event.preventDefault();
      });

      likeButton.addEventListener("click", () => {
        heartIcon.classList.toggle("liked");
        likesAmountLabel.innerHTML = parseInt(likesAmountLabel.innerHTML) + 1;
      });
    });
    

document.addEventListener("DOMContentLoaded", function () {
// Get all filter elements
const filters = document.querySelectorAll('.filter');

// Add click event listener to each filter
filters.forEach(filter => {
  filter.addEventListener('click', function () {
      // Remove 'selected-filter' class from all filters
      filters.forEach(f => f.classList.remove('selected-filter'));
      // Add 'selected-filter' class to the clicked filter
      this.classList.add('selected-filter');
      });
    });
  });

