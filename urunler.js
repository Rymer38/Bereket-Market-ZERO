// Ürünleri Yükleme ve Arama
function loadAllProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productListElement = document.getElementById('all-products');
    const searchQuery = document.getElementById('search-products').value.toLowerCase();

    productListElement.innerHTML = '';

    products
        .filter(product => product.name.toLowerCase().includes(searchQuery))
        .forEach(product => {
            const listItem = document.createElement('li');
            const img = document.createElement('img');
            img.src = product.image || '';
            img.alt = product.name;
            img.style.width = '50px';
            img.style.height = '50px';
            listItem.appendChild(img);

            const text = document.createTextNode(`${product.name} - Fiyat: ${product.price} TL - Kar: ${product.profit} TL - Miktar: ${product.quantity}`);
            listItem.appendChild(text);

            const increaseButton = document.createElement('button');
            increaseButton.textContent = '+';
            increaseButton.onclick = () => updateProductQuantity(product.name, 1);

            const decreaseButton = document.createElement('button');
            decreaseButton.textContent = '-';
            decreaseButton.onclick = () => updateProductQuantity(product.name, -1);

            listItem.appendChild(increaseButton);
            listItem.appendChild(decreaseButton);

            const cashButton = document.createElement('button');
            cashButton.textContent = 'Nakit Satış';
            cashButton.onclick = () => addToCategory(product.name, 'cash');

            const cardButton = document.createElement('button');
            cardButton.textContent = 'Kart Satış';
            cardButton.onclick = () => addToCategory(product.name, 'card');

            const creditButton = document.createElement('button');
            creditButton.textContent = 'Veresiye Satış';
            creditButton.onclick = () => addToCategory(product.name, 'credit');

            listItem.appendChild(cashButton);
            listItem.appendChild(cardButton);
            listItem.appendChild(creditButton);

            // Fiyat ve Kar Güncelleme Butonu
            const editButton = document.createElement('button');
            editButton.textContent = 'Güncelle';
            editButton.onclick = () => editProductDetails(product);

            listItem.appendChild(editButton);

            productListElement.appendChild(listItem);
        });
}

// Ürün Arama Fonksiyonu
function searchProducts() {
    loadAllProducts(); // Arama yapıldığında ürünleri yeniden yükle
}

// Ürün Ekleme Fonksiyonu
function addProduct() {
    const productName = document.getElementById('new-product-name').value;
    const productPrice = parseFloat(document.getElementById('new-product-price').value);
    const productProfit = parseFloat(document.getElementById('new-product-profit').value);
    const productQuantity = parseInt(document.getElementById('new-product-quantity').value);
    const productImage = document.getElementById('new-product-image').files[0];
    const reader = new FileReader();

    if (productName && productPrice && productProfit && productQuantity && productImage) {
        reader.onload = function(e) {
            const products = JSON.parse(localStorage.getItem('products')) || [];
            const existingProduct = products.find(product => product.name === productName);

            if (existingProduct) {
                existingProduct.quantity += productQuantity;
            } else {
                const product = {
                    name: productName,
                    price: productPrice,
                    profit: productProfit,
                    quantity: productQuantity,
                    image: e.target.result,
                    sales: [] // Empty sales array to track sales in different categories
                };
                products.push(product);
            }

            localStorage.setItem('products', JSON.stringify(products));
            loadAllProducts();
            alert('Ürün başarıyla eklendi!');
        };
        reader.readAsDataURL(productImage);
    } else {
        alert('Lütfen tüm alanları doldurun!');
    }
}

// Ürün Miktarını Güncelleme Fonksiyonu
function updateProductQuantity(name, amount) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(product => product.name === name);

    if (product) {
        product.quantity += amount;
        if (product.quantity <= 0) {
            products.splice(products.indexOf(product), 1);
        }
        localStorage.setItem('products', JSON.stringify(products));
        loadAllProducts();
    }
}

// Ürün Kategorisine Ekleme Fonksiyonu
function addToCategory(name, category) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(product => product.name === name);

    if (product) {
        // Kategorideki satış verilerini güncelle
        const existingSale = product.sales.find(sale => sale.category === category);

        if (existingSale) {
            existingSale.quantity += 1;
        } else {
            const saleEntry = {
                category: category,
                quantity: 1
            };
            product.sales.push(saleEntry);
        }

        product.quantity -= 1;
        if (product.quantity <= 0) {
            products.splice(products.indexOf(product), 1);
        }

        localStorage.setItem('products', JSON.stringify(products));
        loadAllProducts();
        updateIncomeExpenseTable(); // Gelir/Gider tablosunu güncelle
    }
}

// Ürün Detaylarını Güncelleme Fonksiyonu
function editProductDetails(product) {
    const newPrice = parseFloat(prompt('Yeni Fiyat:', product.price));
    const newProfit = parseFloat(prompt('Yeni Kar:', product.profit));

    if (!isNaN(newPrice) && !isNaN(newProfit)) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const existingProduct = products.find(p => p.name === product.name);

        if (existingProduct) {
            existingProduct.price = newPrice;
            existingProduct.profit = newProfit;
            localStorage.setItem('products', JSON.stringify(products));
            loadAllProducts();
            alert('Ürün detayları güncellendi!');
        }
    } else {
        alert('Geçersiz giriş, lütfen sayısal değerler girin.');
    }
}

// Gelir-Gider Tablosunu Güncelleme Fonksiyonu
function updateIncomeExpenseTable() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const income = { cash: 0, card: 0, credit: 0 };

    products.forEach(product => {
        product.sales.forEach(sale => {
            switch (sale.category) {
                case 'cash':
                    income.cash += product.price * sale.quantity;
                    break;
                case 'card':
                    income.card += product.price * sale.quantity;
                    break;
                case 'credit':
                    income.credit += product.price * sale.quantity;
                    break;
            }
        });
    });

    document.getElementById('cash-income').textContent = `Nakit Gelir: ${income.cash} TL`;
    document.getElementById('card-income').textContent = `Kart Gelir: ${income.card} TL`;
    document.getElementById('credit-income').textContent = `Veresiye Gelir: ${income.credit} TL`;
}

// Sayfa yüklendiğinde ürünleri yükleme ve gelir-gider tablosunu güncelleme
window.onload = function() {
    loadAllProducts();
};

