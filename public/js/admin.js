//console.log(`CompletedAt [${i}]:`, req.completedAt, "Parsed:", new Date(req.completedAt));

document.addEventListener("DOMContentLoaded", () => {
  const table = document.querySelector("#RequestsTable tbody");

  fetch("/api/past-requests")
  .then(res => res.json())
  .then(data => {
    const table = document.getElementById("RequestsTable").querySelector("tbody");
    table.innerHTML = "";

    data.forEach((req, i) => {
      console.log(`Request #${i}:`, req);
      console.log("Completed at:", req?.completedAt);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${req.from || "N/A"}</td>
        <td>${req.to || "N/A"}</td>
        <td>${req.date || "N/A"}</td>
        <td>${req.passengers || "N/A"}</td>
        <td>${req.email || "N/A"}</td>
        <td>${req.status || "N/A"}</td>
        <td>${
    req.completedAt && !isNaN(Date.parse(req.completedAt))
      ? new Date(req.completedAt).toLocaleString()
      : "N/A"
  }</td>
>
      `;
      table.appendChild(row);
    });
  })
  .catch(err => {
    console.error("Failed to load past requests:", err);
  });
});
