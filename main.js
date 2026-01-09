const row = document.querySelector(".row");
const loader = document.getElementById("loader");
const empty = document.getElementById("empty");
const toggleFavBtn = document.getElementById("toggle-fav");
const statusFilter = document.getElementById("status-filter");

let showOnlyFav = false;
let selectedStatus = "";

// ---------- FAVORITES ----------
const getFavorites = () =>
  JSON.parse(localStorage.getItem("favoriteIds")) || [];

const setFavorites = (ids) =>
  localStorage.setItem("favoriteIds", JSON.stringify(ids));

// ---------- FETCH ----------
const getData = async () => {
  loader.classList.remove("hidden");
  empty.classList.add("hidden");
  row.innerHTML = "";

  try {
    const res = await fetch("http://localhost:8000/products");
    const data = await res.json();

    loader.classList.add("hidden");

    if (!data.length) {
      empty.classList.remove("hidden");
      return;
    }

    renderProducts(data);
  } catch (err) {
    loader.textContent = "Ошибка загрузки";
    console.error(err);
  }
};

// ---------- RENDER ----------
const renderProducts = (products) => {
  const favoriteIds = getFavorites();

  let filtered = products;

  // избранное
  if (showOnlyFav) {
    filtered = filtered.filter((p) => favoriteIds.includes(p.id));
  }

  // статус
  if (selectedStatus) {
    filtered = filtered.filter((p) => p.status === selectedStatus);
  }

  if (!filtered.length) {
    empty.classList.remove("hidden");
    return;
  }

  filtered.forEach((product) => {
    const isFav = favoriteIds.includes(product.id);

    const div = document.createElement("div");
    div.className = "col-4";

    div.innerHTML = `
      <div class="card ${isFav ? "favorite" : ""}">
        
        <div class="status-badge status-${product.status}">
          ${getStatusText(product.status)}
        </div>

        <img src="${product.image}" />

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
          <a href="./pages/create/detal/detail.html?id=${product.id}" class="btn-more">
            Подробнее
          </a>

          <button class="btn-fav" data-id="${product.id}">
            ${isFav ? "❤️" : "🤍"}
          </button>

          <button class="btn-delete" data-id="${product.id}">
            Удалить
          </button>
        </div>
      </div>
    `;

    row.appendChild(div);
  });
};

// ---------- EVENTS ----------
document.addEventListener("click", async (e) => {
  // DELETE
  if (e.target.classList.contains("btn-delete")) {
    const id = e.target.dataset.id;

    if (!confirm("Удалить товар?")) return;

    await fetch(`http://localhost:8000/products/${id}`, {
      method: "DELETE",
    });

    getData();
  }

  // FAVORITE
  if (e.target.classList.contains("btn-fav")) {
    const id = Number(e.target.dataset.id);
    let favs = getFavorites();

    favs = favs.includes(id)
      ? favs.filter((i) => i !== id)
      : [...favs, id];

    setFavorites(favs);
    getData();
  }
});

 toggleFavBtn.addEventListener("click", () => {
  showOnlyFav = !showOnlyFav;
  toggleFavBtn.textContent = showOnlyFav
    ? "Показать все"
    : "Показать избранное";
  getData();
});

statusFilter.addEventListener("change", (e) => {
  selectedStatus = e.target.value;
  getData();
});

 const getStatusText = (status) => {
  switch (status) {
    case "new":
      return "🆕 Новый";
    case "defective":
      return "❌ Брак";
    case "frequently_sold":
      return "🔥 Хит";
    default:
      return "";
  }
};

getData();
