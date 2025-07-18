document.addEventListener("DOMContentLoaded", () => {
  // === 1. Set today's date as minimum for the calendar ===
  const dateInput = document.getElementById("date");
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;

  // === 2. Airport list for suggestions ===
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

  // === 3. Show suggestions for airport inputs ===
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

  // === 4. Hide suggestions when clicking outside ===
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

  // === 5. Handle form submission and redirect with parameters ===
document.getElementById("bookingForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const from = fromInput.value.trim();
  const to = toInput.value.trim();
  const date = dateInput.value;
  const passengers = document.getElementById("passengers").value;

  try {
    const res = await fetch("/api/send-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, date, passengers })
    });

    if (res.ok) {
      const query = new URLSearchParams({ from, to, date, passengers }).toString();
      window.location.href = `result.html?${query}`;
    } else {
      alert("Failed to send request. Please try again.");
    }
  } catch (err) {
    alert("Server error occurred.");
    console.error(err);
  }
});
});
 