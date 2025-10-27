// Funktioner för att kunna hantera menyn
const adminToken = sessionStorage.getItem("token");
const API_URL = "http://localhost:3000/api";

// Kontrollera om användaren är inloggad
if (!adminToken) {
  alert("Du måste vara inloggad för att hantera menyn.");
  window.location.href = "login.html";
}

// Lägg till ny rätt
const form = document.querySelector(".create_form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const price = Number(document.getElementById("price").value);

  // Låt användaren välja kategori
  const category = document.getElementById("category").value;

  try {
    const res = await fetch(`${API_URL}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ name, description, price, category }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Fel vid skapande av rätt");

    alert("Rätt tillagd!");
    form.reset();

    // Ladda om rätt kategori
    loadCategory(category, getListIdFromCategory(category), true);

  } catch (err) {
    alert(err.message);
  }
});

// Ta bort rätt
async function deleteDish(id, category) {
  if (!confirm("Är du säker på att du vill ta bort denna rätt?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Kunde inte ta bort rätten");

    alert("Rätten togs bort!");
    loadCategory(category, getListIdFromCategory(category), true);
  } catch (err) {
    alert(err.message);
  }
}

// Uppdatera rätt
async function editDish(id, category, oldData) {
  const name = prompt("Nytt namn:", oldData.name);
  const description = prompt("Ny beskrivning:", oldData.description);
  const price = prompt("Nytt pris:", oldData.price);

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ name, description, price }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Kunde inte uppdatera rätten");

    alert("Rätten uppdaterades!");
    loadCategory(category, getListIdFromCategory(category), true);
  } catch (err) {
    alert(err.message);
  }
}

// Hjälpfunktion för att koppla kategori till rätt lista
function getListIdFromCategory(category) {
  if (category === "förrätt") return "starters";
  if (category === "huvudrätt") return "mains";
  if (category === "efterrätt") return "desserts";
}