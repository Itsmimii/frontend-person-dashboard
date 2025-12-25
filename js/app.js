const API_URL = "http://localhost:8080/tp_hibernate/api/users";

// Bootstrap modal instance
let personModal;

document.addEventListener("DOMContentLoaded", () => {
  console.log("JS chargé !");
  loadPersons();
  updateStats();

  // Initialiser modal
  const modalEl = document.getElementById("personModal");
  personModal = new bootstrap.Modal(modalEl);

  // Formulaire
  const form = document.getElementById("personForm");
  form.addEventListener("submit", handleFormSubmit);

  // Boutons
  document.getElementById("searchBtn").addEventListener("click", searchPerson);
  document.getElementById("refreshBtn").addEventListener("click", () => {
    loadPersons();
    updateStats();
    showToast("Données actualisées !");
  });

  // Recherche en temps réel
  document
    .getElementById("searchInput")
    .addEventListener("input", searchPerson);
});

// --- Afficher notifications toast ---
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  const toastEl = document.createElement("div");
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;
  toastEl.setAttribute("role", "alert");
  toastEl.setAttribute("aria-live", "assertive");
  toastEl.setAttribute("aria-atomic", "true");

  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  container.appendChild(toastEl);
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
  toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
}

// --- Statistiques ---
function updateStats() {
  fetch(`${API_URL}/affiche`)
    .then((res) => res.json())
    .then((data) => {
      const statsDiv = document.getElementById("statsCards");
      statsDiv.innerHTML = "";

      const total = data.length;
      const majeures = data.filter((p) => p.age >= 18).length;
      const mineures = total - majeures;
      const lastAdded = data.slice(-3).reverse(); // 3 derniers

      const cards = [
        {
          title: "Total personnes",
          value: total,
          color: "primary",
          icon: "people-fill",
        },
        {
          title: "Majeures",
          value: majeures,
          color: "success",
          icon: "person-check-fill",
        },
        {
          title: "Mineures",
          value: mineures,
          color: "warning",
          icon: "person-x-fill",
        },
      ];

      cards.forEach((card) => {
        const div = document.createElement("div");
        div.className = "col-md-4 mb-3";
        div.innerHTML = `
          <div class="card card-stat text-white bg-${card.color} shadow-sm p-3">
            <div class="d-flex align-items-center">
              <i class="bi bi-${card.icon} fs-1 me-3"></i>
              <div>
                <h5>${card.title}</h5>
                <h3>${card.value}</h3>
              </div>
            </div>
          </div>
        `;
        statsDiv.appendChild(div);
      });
    })
    .catch((err) => console.error("Erreur updateStats:", err));
}

// --- Charger toutes les personnes ---
function loadPersons() {
  fetch(`${API_URL}/affiche`)
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.querySelector("#personTable tbody");
      tbody.innerHTML = "";
      data.forEach((person) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="text-center">${person.id}</td>
          <td>${person.name}</td>
          <td class="text-center">${person.age}</td>
          <td class="text-center">
            <button class="btn btn-sm btn-warning me-2" onclick="openEditModal(${person.id})">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="deletePerson(${person.id})">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch((err) => console.error("Erreur loadPersons:", err));
}

// --- Ouvrir modal pour modification ---
function openEditModal(id) {
  fetch(`${API_URL}/getid/${id}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.state === "ok") {
        document.getElementById("personId").value = data.data.id;
        document.getElementById("name").value = data.data.name;
        document.getElementById("age").value = data.data.age;
        document.getElementById("modalTitle").innerText =
          "Modifier une personne";
        personModal.show();
      } else {
        showToast("Personne non trouvée !", "danger");
      }
    })
    .catch((err) => console.error("Erreur openEditModal:", err));
}

// --- Ajouter ou modifier ---
function handleFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById("personId").value;
  const name = document.getElementById("name").value.trim();
  const age = parseInt(document.getElementById("age").value.trim());

  if (!name || isNaN(age)) {
    showToast("Veuillez remplir correctement tous les champs !", "danger");
    return;
  }

  const person = { name, age };
  let method = "POST";
  let url = `${API_URL}/add`;

  if (id) {
    method = "PUT";
    url = `${API_URL}/update/${id}`;
  }

  fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(person),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.state === "ok") {
        personModal.hide();
        resetForm();
        loadPersons();
        updateStats();
        showToast(id ? "Personne modifiée !" : "Personne ajoutée !");
      } else {
        showToast("Erreur lors de l'opération !", "danger");
      }
    })
    .catch((err) => console.error("Erreur handleFormSubmit:", err));
}

// --- Supprimer personne ---
function deletePerson(id) {
  if (!confirm("Voulez-vous vraiment supprimer cette personne ?")) return;

  fetch(`${API_URL}/remove/${id}`, { method: "DELETE" })
    .then((res) => res.json())
    .then((data) => {
      if (data.state === "ok") {
        loadPersons();
        updateStats();
        showToast("Personne supprimée !", "warning");
      } else {
        showToast("Erreur lors de la suppression !", "danger");
      }
    })
    .catch((err) => console.error("Erreur deletePerson:", err));
}

// --- Réinitialiser formulaire ---
function resetForm() {
  document.getElementById("personId").value = "";
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
  document.getElementById("modalTitle").innerText = "Ajouter une personne";
}

// --- Recherche ---
function searchPerson() {
  const input = document.getElementById("searchInput").value.trim();
  if (!input) return loadPersons();

  const url = !isNaN(input)
    ? `${API_URL}/getid/${input}`
    : `${API_URL}/getname/${input}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.querySelector("#personTable tbody");
      tbody.innerHTML = "";
      if (data.state === "ok") {
        let persons = Array.isArray(data.data) ? data.data : [data.data];
        persons.forEach((p) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td class="text-center">${p.id}</td>
            <td>${p.name}</td>
            <td class="text-center">${p.age}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-warning me-2" onclick="openEditModal(${p.id})">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button class="btn btn-sm btn-danger" onclick="deletePerson(${p.id})">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center">Aucun résultat trouvé</td></tr>`;
      }
    })
    .catch((err) => console.error("Erreur searchPerson:", err));
}
