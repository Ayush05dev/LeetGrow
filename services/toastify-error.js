function showErrorToast(message) {
  if (typeof Toastify === "undefined") {
    console.warn("Toastify not loaded.");
    return;
  }

  Toastify({
    text: message,
    duration: 4000,
    gravity: "top",
    position: "center",
    style:{
    background: "#e74c3c"
    }
  }).showToast();
}

