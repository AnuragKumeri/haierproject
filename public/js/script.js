document.addEventListener("DOMContentLoaded", () => {

  const dateInput = document.getElementById("date");
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;


  const airports = [
    "DEL – Indira Gandhi Intl (DEL)",
    "BOM – Chhatrapati Shivaji Intl (BOM)",
    "BLR – Kempegowda Intl (BLR)",
    "HYD – Rajiv Gandhi Intl (HYD)",
    "MAA – Chennai Intl (MAA)",
    "LHR – London Heathrow (LHR)",
    "DXB – Dubai Intl (DXB)",
    "JFK – New York JFK (JFK)"
  ];

  const fromInput = document.querySelector("input[name='from']");
  const toInput = document.querySelector("input[name='to']");
  const fromSuggestions = document.getElementById("fromSuggestions");
  const toSuggestions = document.getElementById("toSuggestions");
  const passengerCountInput = document.getElementById("passengers");
  const passengerDetailsContainer = document.getElementById("passengerDetailsContainer");


  function showSuggestions(input, suggestionBox, list) {
    const value = input.value.toLowerCase().trim();
    suggestionBox.innerHTML = "";
    suggestionBox.style.display = "none";

    if (!value) return;

    const matches = list.filter(item => item.toLowerCase().includes(value));
    if (matches.length === 0) return;

    suggestionBox.style.display = "block";

    matches.forEach(match => {
      const li = document.createElement("li");
      li.textContent = match;
      li.style.cursor = "pointer";
      li.addEventListener("click", () => {
        input.value = match;
        suggestionBox.innerHTML = "";
        suggestionBox.style.display = "none";
      });
      suggestionBox.appendChild(li);
    });
  }

  fromInput.addEventListener("input", () =>
    showSuggestions(fromInput, fromSuggestions, airports)
  );
  toInput.addEventListener("input", () =>
    showSuggestions(toInput, toSuggestions, airports)
  );


  document.addEventListener("click", (e) => {
    if (!fromSuggestions.contains(e.target) && e.target !== fromInput) {
      fromSuggestions.innerHTML = "";
      fromSuggestions.style.display = "none";
    }
    if (!toSuggestions.contains(e.target) && e.target !== toInput) {
      toSuggestions.innerHTML = "";
      toSuggestions.style.display = "none";
    }
  });

 
  function updatePassengerFields() {
    const count = parseInt(passengerCountInput.value) || 1;
    passengerDetailsContainer.innerHTML = "";

    for (let i = 0; i < count; i++) {
      const div = document.createElement("div");
      div.classList.add("field");
      div.innerHTML = `
        <label>Passenger ${i + 1} Name</label>
        <input type="text" id="passengerName${i}" required>
        <label>Age</label>
        <input type="number" id="passengerAge${i}" min="1" required>
      `;
      passengerDetailsContainer.appendChild(div);
    }
  }

  updatePassengerFields();
  passengerCountInput.addEventListener("input", updatePassengerFields);


  document.getElementById("bookingForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const from = fromInput.value.trim();
    const to = toInput.value.trim();
    const date = dateInput.value;
    const passengers = parseInt(passengerCountInput.value);
    const email = document.getElementById("email").value.trim();

    const passengerDetails = [];
    for (let i = 0; i < passengers; i++) {
      const name = document.getElementById(`passengerName${i}`).value.trim();
      const age = document.getElementById(`passengerAge${i}`).value.trim();
      passengerDetails.push({ name, age });
    }

    try {
      const res = await fetch("/api/send-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, date, passengers, email, passengerDetails })
      });

      if (res.ok) {
        window.location.href = `result.html`;
      } else {
        alert("Failed to send request. Please try again.");
      }
    } catch (err) {
      alert("Server error occurred.");
      console.error(err);
    }
  });
});
