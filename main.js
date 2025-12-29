const row = document.querySelector(".row");


const getData = async () => {
  try {
    const res = await fetch("http://localhost:8000/products");
    const data = await res.json();

    row.innerHTML = "";

    data.forEach((product) => {
      const div = document.createElement("div");
      div.className = "col-4";

      div.innerHTML = `
        <div class="card">
          <img src="${product.image}" alt="${product.title}" />

          <h4 class="card-title" title="${product.title}">
            ${
              product.title.length > 40
                ? product.title.slice(0, 40) + "..."
                : product.title
            }
          </h4>

          <p>
            ${
              product.description.length > 30
                ? product.description.slice(0, 30) + "..."
                : product.description
            }
          </p>

          <b>${product.price} KGS</b>

          <div class="card-buttons">
            <a href="#" class="btn-more">Подробнее</a>
            <button
              type="button"
              class="btn-delete"
              data-id="${product.id}"
            >
              Удалить
            </button>
          </div>
        </div>
      `;

      row.appendChild(div);
    });
  } catch (err) {
    console.error("Ошибка загрузки:", err);
  }
};

getData();

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-delete")) {
    const id = e.target.dataset.id;

    if (!confirm("Удалить товар?")) return;

    try {
      await fetch(`http://localhost:8000/products/${id}`, {
        method: "DELETE",
      });

      e.target.closest(".col-4").remove();
    } catch (err) {
      console.error(err);
      alert("Ошибка при удалении");
    }
  }
});
