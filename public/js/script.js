// Example starter JavaScript for disabling form submissions if there are invalid fields
console.log("Script loaded");

(function () {
  'use strict';

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation');
  console.log(forms);
  console.log(forms.length);

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {

      form.addEventListener("submit", function (event) {
        console.log("Submit event fired");

        if (!form.checkValidity()) {
          console.log("Form is invalid");
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      }, false);

    });

})();


document.querySelectorAll(".heart-icon").forEach(icon => {

    icon.addEventListener("click", async (e) => {

        e.preventDefault();
        e.stopPropagation();

        const id = icon.dataset.id;

        const res = await fetch(`/listings/${id}/favorite`, {
            method: "POST",
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        });

        // User is not logged in
        if (res.status === 401) {
            window.location.href = "/signup";
            return;
        }

        const data = await res.json();

        if (data.isFavorite) {

            icon.classList.add("active");
            icon.classList.replace("fa-regular", "fa-solid");

        } else {

            icon.classList.remove("active");
            icon.classList.replace("fa-solid", "fa-regular");

            if (window.location.pathname === "/listings/favorites") {
                icon.closest(".col-xl-3").remove();
            }
        }

    });

});


function confirmDelete() {
    return confirm("Are you sure you want to delete this listing?");
}
