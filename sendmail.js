document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookingForm");
  const modal = document.getElementById("successModal");
  const modalText = modal ? modal.querySelector("p") : null;
  const closeBtn = document.getElementById("closeModal");

  if (!form || !modal || !modalText) return; // якщо чогось немає — не виконуємо скрипт

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
      const response = await fetch("api/sendmail.php", {
        method: "POST",
        body: formData,
      });

      let result = {};
      try {
        result = await response.json();
      } catch {
        result = { message: "Помилка надсилання запиту!" };
      }

      modalText.textContent = result.message || `Статус: ${response.status}`;
      modalText.style.color = response.ok ? "green" : "red";
      modal.style.display = "flex";

      if (response.ok) {
        form.reset();
        // автозакриття модалки через 5 секунд
        setTimeout(() => {
          modal.style.display = "none";
        }, 5000);
      }
    } catch (err) {
      console.error(err);
      modalText.textContent = "Помилка надсилання запиту!";
      modalText.style.color = "red";
      modal.style.display = "flex";
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
});
