document.addEventListener("DOMContentLoaded", () => {
  const table = document.querySelector("#RequestsTable tbody");

  fetch("/api/past-requests")
    .then(res => res.json())
    .then(data => {
      table.innerHTML = "";

      data.forEach((req, i) => {
        const passengerInfo = Array.isArray(req.passengerDetails)
          ? req.passengerDetails.map((p, idx) => `${idx + 1}. ${p.name} (Age: ${p.age})`).join("<br>")
          : "N/A";

        const completedAt = req.timestamp && !isNaN(Date.parse(req.timestamp))
          ? new Date(req.timestamp).toLocaleString()
          : "N/A";

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${req.from || "N/A"}</td>
          <td>${req.to || "N/A"}</td>
          <td>${req.date || "N/A"}</td>
          <td>${req.passengers || "N/A"}</td>
          <td>${req.email || "N/A"}</td>
          <td>${req.status || "N/A"}</td>
          <td>${completedAt}</td>
        `;

        // OPTIONAL: if you want to show passenger names in a tooltip:
        row.title = passengerInfo;

        table.appendChild(row);
      });
    })
    .catch(err => {
      console.error("Failed to load past requests:", err);
    });
});
