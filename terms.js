document.addEventListener("DOMContentLoaded", function() {
    // If the user has already accepted with "Don't show again", do nothing.
    if (localStorage.getItem("termsAccepted") === "yes") return;
  
    // Load the popup markup from terms.html
    fetch("terms.html")
      .then(response => response.text())
      .then(html => {
        // Inject the popup HTML into the designated container
        const container = document.getElementById("terms-container");
        container.innerHTML = html;
  
        // Now attach event listeners
        const overlay = document.getElementById("terms-overlay");
        const acceptBtn = document.getElementById("accept-btn");
        const declineBtn = document.getElementById("decline-btn");
        const dontShowCheckbox = document.getElementById("dont-show-checkbox");
        const acceptTermsCheckbox = document.getElementById("accept-terms-checkbox");
  
        // Initially disable the Accept button until the mandatory checkbox is checked
        acceptBtn.disabled = true;
  
        // Toggle the Accept button based on the mandatory checkbox
        acceptTermsCheckbox.addEventListener("change", function() {
          acceptBtn.disabled = !this.checked;
        });
  
        acceptBtn.addEventListener("click", function() {
          if (acceptTermsCheckbox.checked) {
            if (dontShowCheckbox.checked) {
              localStorage.setItem("termsAccepted", "yes");
            }
            overlay.style.display = "none";
          } else {
            // This should not occur since the button remains disabled unless checked
            alert("You must accept the above terms to continue.");
          }
        });
  
        declineBtn.addEventListener("click", function() {
          window.location.href = "http://www.google.com";
        });
      })
      .catch(error => {
        console.error("Failed to load the terms popup:", error);
      });
  });
  