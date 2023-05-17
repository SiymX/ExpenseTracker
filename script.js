let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let monthlyExpenses = {};


const menuButton = document.getElementById('menuButton');
const menuPrompt = document.querySelector('.menu-prompt');

menuButton.addEventListener('click', () => {
  menuPrompt.classList.toggle('show');
});

const searchOption = document.getElementById('searchOption');
const downloadsOption = document.getElementById('downloadsOption');

searchOption.addEventListener('click', () => {
  searchExpenses();
  menuPrompt.classList.remove('show');
});

downloadsOption.addEventListener('click', () => {
  menuPrompt.classList.remove('show');
  
});


function getMonthYear(dueDate) {
  const date = new Date(dueDate + 'T00:00:00');
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

function addExpense() {
  const expenseName = document.getElementById('expenseName').value;
  const expenseAmount = document.getElementById('expenseAmount').value;
  const expenseCategory = document.getElementById('expenseCategory').value;
  const expenseDueDate = document.getElementById('expenseDueDate').value;

  const newExpense = {
    name: expenseName,
    amount: expenseAmount,
    category: expenseCategory,
    dueDate: expenseDueDate
  };

  expenses.push(newExpense);
  localStorage.setItem('expenses', JSON.stringify(expenses));

  const monthYear = getMonthYear(expenseDueDate);
  if (!monthlyExpenses[monthYear]) {
    monthlyExpenses[monthYear] = [];
  }
  monthlyExpenses[monthYear].push(newExpense);

  clearForm();
  loadExpenses();
}

function loadExpenses() {
  const expenseList = document.getElementById('expenseList');
  expenseList.innerHTML = '';

  const sortedMonths = Object.keys(monthlyExpenses).sort((a, b) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const [monthA, yearA] = a.split(' ');
    const [monthB, yearB] = b.split(' ');

    const monthNumberA = monthNames.indexOf(monthA);
    const monthNumberB = monthNames.indexOf(monthB);

    return new Date(yearA, monthNumberA) - new Date(yearB, monthNumberB);
  });

  sortedMonths.forEach((monthYear) => {
    const monthYearItem = document.createElement('div');
    monthYearItem.classList.add('month-year-card');

    let totalExpense = 0;
    monthlyExpenses[monthYear].forEach((expense) => {
      totalExpense += parseFloat(expense.amount);
    });

    const monthYearLabel = document.createElement('div');
    monthYearLabel.classList.add('month-year-label');
    monthYearLabel.textContent = monthYear;
    monthYearItem.appendChild(monthYearLabel);

    const totalExpenseLabel = document.createElement('div');
    totalExpenseLabel.classList.add('total-expense');
    totalExpenseLabel.textContent = `Total Expense: $${totalExpense.toFixed(2)}`;
    monthYearItem.appendChild(totalExpenseLabel);

    const arrow = document.createElement('div');
    arrow.classList.add('arrow');
    arrow.innerHTML = '<i class="fas fa-chevron-down"></i>';
    monthYearItem.appendChild(arrow);

    const expenseContainer = document.createElement('div');
    expenseContainer.classList.add('expense-container');

    monthlyExpenses[monthYear].forEach((expense, index) => {
      const expenseItem = document.createElement('div');
      expenseItem.classList.add('expense-card');
      expenseItem.innerHTML = `
        <div class="title">${expense.name}</div>
        <div class="amount">$${expense.amount} - ${expense.category} - ${expense.dueDate}</div>
        <div class="buttons">
          <button class="edit-button" onclick="editExpense(${index}, '${monthYear}')"><i class="fas fa-pencil-alt"></i></button>
          <button class="delete-button" onclick="deleteExpense(${index}, '${monthYear}')"><i class="fas fa-trash"></i></button>
        </div>
      `;
      expenseContainer.appendChild(expenseItem);
    });
    
    monthYearItem.appendChild(expenseContainer);

    monthYearItem.addEventListener('click', function () {
      this.classList.toggle('expanded');
    });

    expenseList.appendChild(monthYearItem);
  });
}

window.onload = () => {
  expenses.forEach((expense) => {
    const monthYear = getMonthYear(expense.dueDate);
    if (!monthlyExpenses[monthYear]) {
      monthlyExpenses[monthYear] = [];
    }
    monthlyExpenses[monthYear].push(expense);
  });

  loadExpenses();
};

function deleteExpense(index, monthYear) {
  const monthExpenses = monthlyExpenses[monthYear];
  const expenseItem = monthExpenses[index];

  const expenseCards = document.getElementsByClassName('expense-card');
  const expenseCard = Array.from(expenseCards).find((card) => {
    const cardTitle = card.querySelector('.title').textContent;
    const cardAmount = card.querySelector('.amount').textContent;
    const cardInfo = `${cardTitle} - ${cardAmount}`;
    const expenseInfo = `${expenseItem.name} - $${expenseItem.amount} - ${expenseItem.category} - ${expenseItem.dueDate}`;
    return cardInfo === expenseInfo;
  });

  if (expenseCard) {
    const deleteButton = expenseCard.querySelector('.delete-button');
    deleteButton.classList.add('deleting');
    expenseCard.classList.add('deleting');

    setTimeout(() => {
      const globalExpenseIndex = expenses.findIndex((expense) => (
        expense.name === monthlyExpenses[monthYear][index].name &&
        expense.amount === monthlyExpenses[monthYear][index].amount &&
        expense.category === monthlyExpenses[monthYear][index].category &&
        expense.dueDate === monthlyExpenses[monthYear][index].dueDate
      ));
  
      if (globalExpenseIndex !== -1) {
        expenses.splice(globalExpenseIndex, 1);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        monthlyExpenses[monthYear].splice(index, 1);
  
        if (monthlyExpenses[monthYear].length === 0) {
          delete monthlyExpenses[monthYear];
        }
  
        loadExpenses();
      }
    }, 1000);
  }
}




function editExpense(index, monthYear) {
  const expense = monthlyExpenses[monthYear][index];
  document.getElementById('expenseName').value = expense.name;
  document.getElementById('expenseAmount').value = expense.amount;
  document.getElementById('expenseCategory').value = expense.category;
  document.getElementById('expenseDueDate').value = expense.dueDate;
  document.getElementById('expenseButton').textContent = 'Update Expense';

  document.getElementById('expenseButton').dataset.editIndex = index;
  document.getElementById('expenseButton').dataset.monthYear = monthYear;
}

function updateExpense(index, monthYear) {
  const expenseName = document.getElementById('expenseName').value;
  const expenseAmount = document.getElementById('expenseAmount').value;
  const expenseCategory = document.getElementById('expenseCategory').value;
  const expenseDueDate = document.getElementById('expenseDueDate').value;

  const updatedExpense = {
    name: expenseName,
    amount: expenseAmount,
    category: expenseCategory,
    dueDate: expenseDueDate
  };

  const globalExpenseIndex = parseInt(document.getElementById('expenseButton').dataset.editIndex);
  expenses[globalExpenseIndex] = updatedExpense;
  monthlyExpenses[monthYear][index] = updatedExpense;

  localStorage.setItem('expenses', JSON.stringify(expenses));
  clearForm();
  loadExpenses();
}

function clearForm() {
  document.getElementById('expenseName').value = '';
  document.getElementById('expenseAmount').value = '';
  document.getElementById('expenseCategory').value = '';
  document.getElementById('expenseDueDate').value = '';
  document.getElementById('expenseButton').textContent = 'Add Expense';
  delete document.getElementById('expenseButton').dataset.editIndex;
  delete document.getElementById('expenseButton').dataset.monthYear;
}

document.getElementById('expenseAmount').addEventListener('keypress', function(e) {
  const char = String.fromCharCode(e.which);
  const value = this.value + char;
  const regex = /^\d*\.?\d{0,2}$/;
  if (!regex.test(value)) {
      e.preventDefault();
  }
});

document.getElementById('expenseButton').addEventListener('click', function(e) {
  e.preventDefault();
  const editIndex = parseInt(this.getAttribute('data-edit-index'));
  const monthYear = this.getAttribute('data-month-year');
  if (!isNaN(editIndex)) {
    const expenseName = document.getElementById('expenseName').value;
    const expenseAmount = document.getElementById('expenseAmount').value;
    const expenseCategory = document.getElementById('expenseCategory').value;
    const expenseDueDate = document.getElementById('expenseDueDate').value;

    const updatedExpense = {
      name: expenseName,
      amount: expenseAmount,
      category: expenseCategory,
      dueDate: expenseDueDate
    };

    const oldMonthYear = getMonthYear(monthlyExpenses[monthYear][editIndex].dueDate);
    const newMonthYear = getMonthYear(expenseDueDate);

    if (oldMonthYear !== newMonthYear) {
      const oldMonthExpenses = monthlyExpenses[oldMonthYear];
      oldMonthExpenses.splice(editIndex, 1);
      if (oldMonthExpenses.length === 0) {
        delete monthlyExpenses[oldMonthYear];
      }

      if (!monthlyExpenses[newMonthYear]) {
        monthlyExpenses[newMonthYear] = [];
      }
      monthlyExpenses[newMonthYear].push(updatedExpense);
    } else {
      monthlyExpenses[monthYear][editIndex] = updatedExpense;
    }

    expenses[editIndex] = updatedExpense;
    localStorage.setItem('expenses', JSON.stringify(expenses));
    clearForm();
    loadExpenses();
  } else {
    addExpense();
  }
});


document.getElementById('helpButton').addEventListener('click', function() {
  const prompt = document.createElement('div');
  prompt.classList.add('prompt');
  prompt.innerHTML = `
    <h3>Expense Tracker Help</h3>
    <p>Welcome to Expense Tracker! This application helps you track your expenses.</p>
    <p>To add an expense, fill in the expense details and click the "Add Expense" button.</p>
    <p>You can edit or delete an expense by clicking the buttons on each expense card.</p>
    <p>The expenses lists are organized by month and year.</p>
    <p>You can also download your expenses as a TXT or a CSV (Excel Sheet) file.</p>
    <p>Thanks for using Expense Tracker!</p>
    <button onclick="document.body.removeChild(this.parentNode); removeBlur()">Close</button>
  `;
  document.body.appendChild(prompt);
  addBlur();

  this.classList.add('clicked'); 
});

function addBlur() {
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  document.body.appendChild(overlay);
}


function removeBlur() {
  const overlay = document.querySelector('.overlay');
  document.body.removeChild(overlay);

  document.getElementById('helpButton').classList.remove('clicked'); 
}

function searchExpenses() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const searchCriteria = document.getElementById('searchCriteria').value;

  const expenseCards = document.getElementsByClassName('expense-card');
  Array.from(expenseCards).forEach((card) => {
    const cardTitle = card.querySelector('.title').textContent.toLowerCase();
    const cardAmount = card.querySelector('.amount').textContent.toLowerCase();
    const monthYearCard = card.closest('.month-year-card');

    if (
      cardTitle.includes(searchInput) ||
      cardAmount.includes(searchInput) ||
      monthYearCard.querySelector('.month-year-label').textContent.toLowerCase().includes(searchInput)
    ) {
      card.style.display = 'block';
      monthYearCard.style.display = 'block';
    } else {
      card.style.display = 'none';
      const expandedCards = monthYearCard.getElementsByClassName('expense-card');
      const visibleCards = Array.from(expandedCards).some((c) => c.style.display !== 'none');
      monthYearCard.style.display = visibleCards ? 'block' : 'none';
    }
  });
}



function loadFilteredExpenses(filteredExpenses) {
  const expenseList = document.getElementById('expenseList');
  expenseList.innerHTML = '';

  const groupedExpenses = groupExpensesByMonthYear(filteredExpenses);

  for (const monthYear in groupedExpenses) {
    const monthYearItem = document.createElement('div');
    monthYearItem.classList.add('month-year-card');

    let totalExpense = 0;
    groupedExpenses[monthYear].forEach((expense) => {
      totalExpense += parseFloat(expense.amount);
    });

    monthYearItem.innerHTML = `<div class="month-year-label">${monthYear}</div>
                               <div class="total-expense">Total Expense: $${totalExpense.toFixed(2)}</div>`;

    const expenseContainer = document.createElement('div');
    expenseContainer.classList.add('expense-container');

    groupedExpenses[monthYear].forEach((expense, index) => {
      const expenseItem = document.createElement('div');
      expenseItem.classList.add('expense-card');
      expenseItem.innerHTML = `
        <div class="title">${expense.name}</div>
        <div class="amount">$${expense.amount} - ${expense.category} - ${expense.dueDate}</div>
        <div class="buttons">
          <button class="edit-button" onclick="editExpense(${index}, '${monthYear}')"><i class="fas fa-pencil-alt"></i></button>
          <button class="delete-button" onclick="deleteExpense(${index}, '${monthYear}')"><i class="fas fa-trash"></i></button>
        </div>
      `;
      expenseContainer.appendChild(expenseItem);
    });

    monthYearItem.appendChild(expenseContainer);

    monthYearItem.addEventListener('click', function () {
      this.classList.toggle('expanded');
    });

    expenseList.appendChild(monthYearItem);
  }
}



function groupExpensesByMonthYear(expenses) {
  let groupedExpenses = {};

  expenses.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); 

  expenses.forEach(expense => {
    let date = new Date(expense.dueDate);
    let monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

    if (!groupedExpenses[monthYear]) {
      groupedExpenses[monthYear] = [];
    }
    groupedExpenses[monthYear].push(expense);
  });

  return Object.entries(groupedExpenses).map(([monthYear, expenses]) => ({ monthYear, expenses }));
}



function resetSearch() {
  document.getElementById('searchInput').value = '';
  loadExpenses();
}

document.getElementById("downloadTxt").addEventListener("click", function() {
  downloadTxt(expenses);
});

document.getElementById("downloadCsv").addEventListener("click", function() {
  downloadCsv(expenses);
});

function downloadTxt(data) {
  
  let groupedExpenses = groupExpensesByMonthYear(data);

  
  let txtData = groupedExpenses.map(group => {
    let monthYear = group.monthYear;
    let expenses = group.expenses.map(expense => `Name: ${expense.name}, Amount: ${expense.amount}, Category: ${expense.category}, Date: ${expense.dueDate}`).join('\n');
    return `----------------------------------------------------------------------------------------------------------------------\nMONTH ${monthYear}\n${expenses}\n----------------------------------------------------------------------------------------------------------------------\n\n`;
  }).join('\n');

  let blob = new Blob([txtData], { type: 'text/plain' });
  let url = window.URL.createObjectURL(blob);

  let link = document.createElement('a');
  link.download = 'expenses.txt';
  link.href = url;
  link.click();
}

function downloadCsv(data) {
  
  let groupedExpenses = groupExpensesByMonthYear(data);

  
  let csvData = groupedExpenses.map(group => {
    let monthYear = group.monthYear;
    let expenses = group.expenses.map(expense => {
      let formattedDate = new Date(expense.dueDate).toISOString().split('T')[0]; 
      return `${expense.name},${expense.amount},${expense.category},${formattedDate}`;
    }).join('\n');
    return `MONTH ${monthYear}\nName,Amount,Category,Date\n${expenses}\n\n`;
  }).join('\n');

  let blob = new Blob([csvData], { type: 'text/csv' });
  let url = window.URL.createObjectURL(blob);

  let link = document.createElement('a');
  link.download = 'expenses.csv';
  link.href = url;
  link.click();
}


function groupExpensesByMonthYear(expenses) {
  let groupedExpenses = {};

  expenses.forEach(expense => {
    let date = new Date(expense.dueDate);
    let monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

    if (!groupedExpenses[monthYear]) {
      groupedExpenses[monthYear] = [];
    }
    groupedExpenses[monthYear].push(expense);
  });

  return Object.entries(groupedExpenses).map(([monthYear, expenses]) => ({ monthYear, expenses }));
}







