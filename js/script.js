document.querySelectorAll("[data-card-filter]").forEach((toolbar) => {
  const section = toolbar.closest("section");
  const searchInput = toolbar.querySelector("[data-filter-search]");
  const filterButtons = Array.from(
    toolbar.querySelectorAll("[data-filter-value]"),
  );
  const items = section
    ? Array.from(section.querySelectorAll("[data-filter-item]"))
    : [];
  const count = section?.querySelector("[data-filter-count]");
  const emptyState = section?.querySelector("[data-filter-empty]");
  const itemName = toolbar.closest(".packages-content")
    ? "packages"
    : "destinations";
  let activeCategory = "all";

  if (!(searchInput instanceof HTMLInputElement) || !count || !emptyState) {
    return;
  }

  const updateResults = () => {
    const searchTerm = searchInput.value.trim().toLocaleLowerCase();
    let visibleItems = 0;

    items.forEach((item) => {
      const matchesCategory =
        activeCategory === "all" ||
        item.dataset.filterCategory === activeCategory;
      const matchesSearch = item.textContent
        .toLocaleLowerCase()
        .includes(searchTerm);
      const isVisible = matchesCategory && matchesSearch;

      item.hidden = !isVisible;
      visibleItems += Number(isVisible);
    });

    const itemLabel =
      visibleItems === 1 ? itemName.slice(0, -1) : itemName;
    count.textContent = `Showing ${visibleItems} ${itemLabel}`;
    emptyState.hidden = visibleItems !== 0;
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.filterValue ?? "all";
      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });
      updateResults();
    });
  });

  searchInput.addEventListener("input", updateResults);

  toolbar.querySelector("[data-filter-clear]")?.addEventListener("click", () => {
    searchInput.value = "";
    activeCategory = "all";
    filterButtons.forEach((button) => {
      const isActive = button.dataset.filterValue === "all";
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    updateResults();
    searchInput.focus();
  });
});

const bookingModal = document.getElementById("bookingModal");
const bookingForm = document.getElementById("bookingForm");
const bookingDestination = document.getElementById("bookingDestination");
const bookingDate = document.getElementById("bookingDate");
const bookingStatus = document.getElementById("bookingStatus");

if (bookingModal && bookingForm && bookingDestination && bookingDate && bookingStatus) {
  const today = new Date();
  const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60_000,
  )
    .toISOString()
    .slice(0, 10);
  bookingDate.min = localToday;

  bookingModal.addEventListener("show.bs.modal", (event) => {
    if (event.relatedTarget instanceof HTMLElement) {
      const selectedDestination = event.relatedTarget.dataset.bookingDestination;
      if (selectedDestination) {
        bookingDestination.value = selectedDestination;
      }
    }

    bookingStatus.textContent = "";
    bookingStatus.className = "mb-0";
  });

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(bookingForm);
    const name = formData.get("name");
    const destination = formData.get("destination");

    bookingStatus.textContent = `Thanks, ${name}. Your trip to ${destination} is ready to request. This demo does not send your details to a server.`;
    bookingStatus.className = "alert alert-info mt-3 mb-0";
  });
}

const bookingPageForm = document.getElementById("bookingPageForm");
const pageBookingDate = document.getElementById("pageBookingDate");
const bookingPageStatus = document.getElementById("bookingPageStatus");

if (bookingPageForm && pageBookingDate && bookingPageStatus) {
  const today = new Date();
  pageBookingDate.min = new Date(
    today.getTime() - today.getTimezoneOffset() * 60_000,
  )
    .toISOString()
    .slice(0, 10);

  const requestedDestination = new URLSearchParams(window.location.search).get(
    "destination",
  );
  const destinationSelect = document.getElementById("pageBookingDestination");
  if (
    requestedDestination &&
    destinationSelect instanceof HTMLSelectElement &&
    Array.from(destinationSelect.options).some(
      (option) => option.value === requestedDestination,
    )
  ) {
    destinationSelect.value = requestedDestination;
  }

  bookingPageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(bookingPageForm);
    const name = formData.get("name");
    const destination = formData.get("destination");

    bookingPageStatus.textContent = `Thanks, ${name}. Your trip to ${destination} is ready to request. This demo does not send your details to a server.`;
    bookingPageStatus.className = "alert alert-info mb-3";
  });
}

const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

if (contactForm && contactStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = new FormData(contactForm).get("name");

    contactStatus.textContent = `Thanks, ${name}. Your message is ready. This demo does not send your details to a server.`;
    contactStatus.className = "alert alert-info mb-3";
  });
}

const loginForm = document.getElementById("loginForm");
const loginStatus = document.getElementById("loginStatus");

if (loginForm && loginStatus) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const password = document.getElementById("loginPassword");
    if (password instanceof HTMLInputElement) {
      password.value = "";
    }

    loginStatus.textContent =
      "The form is valid, but sign-in is unavailable because authentication is not connected.";
    loginStatus.className = "alert alert-info mb-3";
  });
}

const signupForm = document.getElementById("signupForm");
const signupStatus = document.getElementById("signupStatus");
const signupPassword = document.getElementById("signupPassword");
const signupConfirmPassword = document.getElementById("signupConfirmPassword");

if (
  signupForm &&
  signupStatus &&
  signupPassword instanceof HTMLInputElement &&
  signupConfirmPassword instanceof HTMLInputElement
) {
  const validatePasswordMatch = () => {
    signupConfirmPassword.setCustomValidity(
      signupPassword.value === signupConfirmPassword.value
        ? ""
        : "Passwords do not match.",
    );
  };

  signupPassword.addEventListener("input", validatePasswordMatch);
  signupConfirmPassword.addEventListener("input", validatePasswordMatch);

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    validatePasswordMatch();
    if (!signupForm.reportValidity()) {
      return;
    }

    signupStatus.textContent =
      "Your details look good, but no account was created because account registration is not connected.";
    signupStatus.className = "alert alert-info mb-3";
    signupPassword.value = "";
    signupConfirmPassword.value = "";
  });
}