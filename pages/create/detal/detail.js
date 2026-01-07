const detail = document.querySelector("#detail");
const deleteProduct = async (id) => {
  try {
    const ok = confirm("Вы уверены, что хотите удалить товар?");
    if (!ok) return;
    const res = await fetch(`http://localhost:8000/products/${id}`, {
      method: "DELETE",
    }); 
    if (!res.ok) throw new Error("Ошибка при удалении", res.status);
    //  alert("Товар успешно удален");
    window.location.href = "../../index.html";
   } catch (err) {
    console.error("Ошибка при удалении товара:", err);
    alert("Не удалось удалить товар");
  }
    }



const getDetail = async () => {
  try {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
      detail.innerHTML = "<p>Товар не найден</p>";
      return;
    }
    const res = await fetch(`http://localhost:8000/products/${id}`);
    const data = await res.json();
    detail.innerHTML = `

    <div class="card">
      <img src="${data.image}" alt="${data.title}" />
      <h4>${data.title}</h4>
      <p>${data.description}</p>
      <b>${data.price} KGS</b>
    <button
      class="btn-delete"
      id="delete-btn" >
      Удалить
    </button>
    </div>  
    `;
    document.querySelector("#delete-btn").addEventListener("click", (e) => {
      e.preventDefault();
      deleteProduct(id);
    });
    
  } catch (err) {
    console.error(err);
  }
};

getDetail();
