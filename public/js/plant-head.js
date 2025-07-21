document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("requestsContainer");

  async function fetchRequests() {
    const res = await fetch("/api/requests");
    const requests = await res.json();

    container.innerHTML = "";

    if (requests.length === 0) {
      container.innerHTML = "<p>No pending requests.</p>";
      return;
    }

    requests.forEach((req, index) => {
      const div = document.createElement("div");
      div.classList.add("card");

      let passengerInfo = "";
      if (Array.isArray(req.passengerDetails)) {
        passengerInfo = req.passengerDetails.map((p, i) =>
          `<li>${i + 1}. ${p.name} (Age: ${p.age})</li>`).join("");
      }

      div.innerHTML = `
        <p><strong>From:</strong> ${req.from}</p>
        <p><strong>To:</strong> ${req.to}</p>
        <p><strong>Date:</strong> ${req.date}</p>
        <p><strong>Passengers:</strong> ${req.passengers}</p>
        <p><strong>Email:</strong> ${req.email}</p>
        <p><strong>Passenger Details:</strong></p>
        <ul>${passengerInfo}</ul>
        <button class="approve">Approve</button>
        <button class="dismiss">Dismiss</button>
      `;

      div.querySelector(".approve").addEventListener("click", () => {
        handleAction(index, "approve");
      });

      div.querySelector(".dismiss").addEventListener("click", () => {
        handleAction(index, "dismiss");
      });

      container.appendChild(div);
    });
  }

  async function handleAction(index, action) {
    const res = await fetch("/api/requests/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index, action })
    });

    const result = await res.json();
    alert(result.message);
    fetchRequests();
  }

  fetchRequests();
});
