// Funktion som laddar rätter från en viss kategori och skriver ut dem i en HTML-lista
async function loadCategory(category, elementId) {
    const list = document.getElementById(elementId); // Hämtar elementet där rätterna ska skrivas ut

    // Kontrollera om inloggad
    const userToken = sessionStorage.getItem("token");
    const isAdmin = !!userToken; // true om token finns, false annars
  
    try {
      // Anrop till API:t för att hämta rätter inom en viss kategori
      const response = await fetch(`http://localhost:3000/api/category/${category}`);
      if (!response.ok) throw new Error("Kunde inte hämta rätter");
  
      const dishes = await response.json(); // Omvandla svaret till JSON
      list.innerHTML = "";
  
      // Meddelande om inga rätter finns att visa
      if (dishes.length === 0) {
        list.innerHTML = "<li>Inga rätter i denna kategori ännu.</li>";
        return;
      }
  
      // Skriv ut varje rätt som ett li element
      dishes.forEach(dish => {
        const li = document.createElement("li");
        li.innerHTML = `
          <h3>${dish.name}</h3>
          <p>${dish.description}</p>
          <p><strong>${dish.price} kr</strong></p>
        `;
        li.dataset.id = dish._id;

      // Lägg till admin-knappar
      if (isAdmin) {
        const adminBtns = document.createElement("div");
        adminBtns.classList.add("admin-buttons");
        adminBtns.innerHTML = `
          <button onclick="editDish('${dish._id}', '${category}', ${JSON.stringify(dish).replace(/"/g, '&quot;')})">Uppdatera</button>
          <button onclick="deleteDish('${dish._id}', '${category}')">Ta bort</button>
        `;
        li.appendChild(adminBtns);
      }
        list.appendChild(li);
      });
  
    } catch (error) {
      list.innerHTML = `<li>Fel: ${error.message}</li>`;
    }
  }
  
  // Ladda alla kategorier
  loadCategory("förrätt", "starters"); // Laddar alla förrätter till elementet med id="startsers"
  loadCategory("huvudrätt", "mains"); // Laddar alla huvudrätter till elementet med id="mains"
  loadCategory("efterrätt", "desserts"); // Laddar alla efterrätter till elementet med id="desserts"