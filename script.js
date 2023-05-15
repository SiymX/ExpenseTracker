let expenses = JSON.parse(localStorage.getItem('expenses')) || [];


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

  
  clearForm();

 
  loadExpenses();
}


function loadExpenses() {
  const expenseList = document.getElementById('expenseList');
  expenseList.innerHTML = '';

 
  expenses.forEach((expense, index) => {
    const expenseItem = document.createElement('div');
    expenseItem.classList.add('expense-card');
    expenseItem.innerHTML = `
      <div class="title">${expense.name}</div>
      <div class="amount">$${expense.amount} - ${expense.category} - ${expense.dueDate}</div>
      <div class="buttons">
        <button class="edit-button" onclick="editExpense(${index})"><i class="fas fa-pencil-alt"></i></button>
        <button class="delete-button" onclick="deleteExpense(${index})"><i class="fas fa-trash"></i></button>
      </div>
    `;
    expenseList.appendChild(expenseItem);
  });
  
  
}


function deleteExpense(index) {
  const expenseCard = document.getElementsByClassName('expense-card')[index];
  const deleteButton = expenseCard.getElementsByClassName('delete-button')[0];


  deleteButton.classList.add('deleting');
  expenseCard.classList.add('deleting');

  
  setTimeout(() => {
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    loadExpenses();
  }, 1000);  
}



function editExpense(index) {
  const expense = expenses[index];
  document.getElementById('expenseName').value = expense.name;
  document.getElementById('expenseAmount').value = expense.amount;
  document.getElementById('expenseCategory').value = expense.category;
  document.getElementById('expenseDueDate').value = expense.dueDate;
  document.getElementById('expenseButton').textContent = 'Update Expense';
  document.getElementById('expenseButton').setAttribute('data-edit-index', index);
}


function clearForm() {
  document.getElementById('expenseName').value = '';
  document.getElementById('expenseAmount').value = '';
  document.getElementById('expenseCategory').value = '';
  document.getElementById('expenseDueDate').value = '';
  document.getElementById('expenseButton').textContent = 'Add Expense';
  delete document.getElementById('expenseButton').dataset.editIndex;
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
  const editIndex = this.getAttribute('data-edit-index');
  if (editIndex !== null) {
    const expenseName = document.getElementById('expenseName').value;
    const expenseAmount = document.getElementById('expenseAmount').value;
    const expenseCategory = document.getElementById('expenseCategory').value;
    const expenseDueDate = document.getElementById('expenseDueDate').value;

    expenses[editIndex] = {
      name: expenseName,
      amount: expenseAmount,
      category: expenseCategory,
      dueDate: expenseDueDate
    };

    localStorage.setItem('expenses', JSON.stringify(expenses));
    clearForm();
    loadExpenses();
  } else {
    
    addExpense();
  }
});


window.onload = loadExpenses;

   
