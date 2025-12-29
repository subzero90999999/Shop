const createProduct = async () => {
  const form = document.querySelector("#create-form");

  try {
    const formData = new FormData(form);

    const response = await fetch("http://localhost:8000/products", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to create product", response.status);
    }
    const data = await response.json();
    window.location.href = "../../index.html";
  } catch (err) {
    console.error(err);
  }
};

document.querySelector("#create-form").addEventListener("submit", (event) => {
  event.preventDefault();
  createProduct();
});
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-delete")) {
    const id = e.target.dataset.id;

    const confirmDelete = confirm("Вы уверены, что хотите удалить товар?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8000/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Ошибка при удалении");
      }

       e.target.closest(".col-4").remove();
    } catch (err) {
      console.error(err);
      alert("Не удалось удалить товар");
    }
  }
});
