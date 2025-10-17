// Skapa ny användare
const registerForm = document.querySelector(".registerForm"); // Hämta registreringsformuläret

// Kontrollera att formulär finns, innan eventlyssnare
if(registerForm){
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        // Hämta värdena från användarnamn och lösenordsfälten
        const username = document.getElementById("regUsername").value;
        const password = document.getElementById("regPassword").value;

    try {
        // Skicka POST-anrop till backend för att registrera ny användare
        const res = await fetch("http://localhost:3000/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json(); // Tolka svaret från servern som JSON
        alert(data.message || data.error); // Meddelande till användaren

        registerForm.reset(); // Återställ formuläret
    } catch(error) {
        // Felmeddelande
        alert("Något gick fel: " + error.message);
    }
    });
}

// Logga in 
const loginForm = document.querySelector(".loginForm"); // Hämta login-formuläret

// Kontrollera att formulär finns, innan eventlyssnare
if(loginForm){ 
    loginForm.addEventListener("submit", async (e) => { 
        e.preventDefault(); 
        // Hämta värdena från användarnamn och lösenordsfälten
        const username = document.getElementById("username").value; 
        const password = document.getElementById("password").value; 

    try {
        // Skicka POST-anrop till backend för inloggning
        const res = await fetch("http://localhost:3000/api/login", { 
            method: "POST", 
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({ username, password }) 
        }); 
        const data = await res.json(); // Tolka svaret från servern som JSON
        
        // Om inloggningen lyckades
        if(res.ok){ 
            // Spara JWT-token i sessionStorage 
            sessionStorage.setItem("token", data.response.token); 

            // Omredigera användaren till en skyddad sida
            window.location.href = "admin-dashboard.html"; 
        } else { 
            // Visa felmeddelande från servern om inloggningen misslyckades
            alert(data.error); 
        } 
    } catch (error) {
        // Felmeddelande
        alert("Något gick fel: " + error.message);
    }
    }); 
} 

// Kontrollera att användaren är inloggad 
const token = sessionStorage.getItem("token"); // Hämta JWT-token från sessionStorage

const logoutBtn = document.querySelector(".logout_btn"); // Hämta logga ut-knappen

    // Kontrollera om logga ut-knappen finns 
    if(logoutBtn){ 

        // Om token inte finns - användaren är inte inloggad
        if(!token){ 
            alert("Du måste logga in!"); // Visa meddelande för användare att hen måste vara inloggad
            window.location.href = "index.html"; // Omredigera till startsidan

    } else { 
        // Om token finns, hämta skyddad data från servern
        fetch("http://localhost:3000/api/protected", { 
            headers: { "Authorization": "Bearer " + token } // Skicka token i Authorization-headern
        }) 
        .then(res => res.json()) // Tolka svaret från servern som JSON
        .then(data => { 
            // Skapa ett nytt <p>-element för att visa meddelandet från servern
            const msg = document.createElement("p"); 
            msg.textContent = data.message || "Ingen data"; // Visa meddelande eller fallback-text
            document.body.appendChild(msg); // Lägg till meddelande på sidan
        }) 
        .catch(err => console.error(err)); // Felmeddelande
    } 

// Logga ut 
logoutBtn.addEventListener("click", () => { 
    // Ta bort token från sessionStorage och logga ut användare
    sessionStorage.removeItem("token"); 
    // Omredigera tillbaka till startsidan
    window.location.href = "index.html"; 
}); 
} 