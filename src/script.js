// Initialize entries array from local storage or empty array
let entries = JSON.parse(localStorage.getItem('entries')) || [];

// DOM Elements
const entryForm = document.getElementById('entry-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const entriesList = document.getElementById('entries-list');
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');
const netBalance = document.getElementById('net-balance');
const resetBtn = document.getElementById('reset-btn');
const filterRadios = document.querySelectorAll('input[name="filter"]');

// Render entries
function renderEntries(filter = 'all') {
  entriesList.innerHTML = '';
  const filteredEntries = filter === 'all' ? entries : entries.filter(entry => entry.type === filter);

  filteredEntries.forEach((entry, index) => {
    const entryElement = document.createElement('div');
    entryElement.className = 'bg-gray-50 p-4 rounded-lg flex justify-between items-center';
    entryElement.innerHTML = `
      <div>
        <p class="font-bold">${entry.description}</p>
        <p class="text-sm ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}">${entry.type === 'income' ? '+' : '-'}$${entry.amount.toFixed(2)}</p>
      </div>
      <div>
        <button onclick="editEntry(${index})" class="bg-yellow-500 text-white text-md text-center px-2 py-1 border border-lime rounded-lg mr-2">Edit</button>
        <button onclick="deleteEntry(${index})" class="bg-red-500 text-white text-center text-md px-2 py-1 border border-orange rounded-lg">Delete</button>
      </div>
    `;
    entriesList.appendChild(entryElement);
  });

  updateSummary();
}

// Update summary
function updateSummary() {
  const totalIncomeAmount = entries
    .filter(entry => entry.type === 'income')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalExpenseAmount = entries
    .filter(entry => entry.type === 'expense')
    .reduce((sum, entry) => sum + entry.amount, 0);

  totalIncome.textContent = `$${totalIncomeAmount.toFixed(2)}`;
  totalExpense.textContent = `$${totalExpenseAmount.toFixed(2)}`;
  netBalance.textContent = `$${(totalIncomeAmount - totalExpenseAmount).toFixed(2)}`;
}

// Add or update entry
entryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const description = descriptionInput.value;
  const amount = parseFloat(amountInput.value);
  const type = document.querySelector('input[name="type"]:checked').value;

  if (description && amount) {
    entries.push({ description, amount, type });
    localStorage.setItem('entries', JSON.stringify(entries));
    renderEntries();
    entryForm.reset();
  }
});

// Reset form
resetBtn.addEventListener('click', () => {
  entryForm.reset();
});

// Edit entry
function editEntry(index) {
  const entry = entries[index];
  descriptionInput.value = entry.description;
  amountInput.value = entry.amount;
  document.querySelector(`input[name="type"][value="${entry.type}"]`).checked = true;

  entries.splice(index, 1);
  localStorage.setItem('entries', JSON.stringify(entries));
  renderEntries();
}

// Delete entry
function deleteEntry(index) {
  entries.splice(index, 1);
  localStorage.setItem('entries', JSON.stringify(entries));
  renderEntries();
}

// Filter entries
filterRadios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    renderEntries(e.target.value);
  });
});

// Initial render
renderEntries();