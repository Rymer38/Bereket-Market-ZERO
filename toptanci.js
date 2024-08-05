// Toptancı Borcunu Ekleme veya Azaltma Fonksiyonu
function adjustWholesalerDebt(action) {
    const name = document.getElementById('wholesaler-name').value;
    const amount = parseFloat(document.getElementById('wholesaler-debt').value);

    if (name && !isNaN(amount) && amount > 0) {
        updateWholesalerDebt(name, amount, action);
        displayDebts();
    } else {
        alert('Lütfen geçerli bir toptancı adı ve borç miktarı girin!');
    }
}

// Toptancı Borçlarını Görüntüleme Fonksiyonu
function displayDebts() {
    const debts = JSON.parse(localStorage.getItem('debts')) || [];
    const debtListElement = document.getElementById('debt-list');
    
    debtListElement.innerHTML = '';
    
    debts.forEach(debt => {
        const listItem = document.createElement('li');
        listItem.textContent = `${debt.name} - Borç: ${debt.amount.toFixed(2)} TL`;
        debtListElement.appendChild(listItem);
    });
}

// Toptancı Borçları Fonksiyonu
function updateWholesalerDebt(name, amount, action) {
    const debts = JSON.parse(localStorage.getItem('debts')) || [];
    const debt = debts.find(d => d.name === name);

    if (debt) {
        if (action === 'add') {
            debt.amount += amount;
        } else if (action === 'subtract') {
            debt.amount = Math.max(0, debt.amount - amount);
        }
    } else if (action === 'add') {
        debts.push({
            name,
            amount
        });
    }

    localStorage.setItem('debts', JSON.stringify(debts));
}
