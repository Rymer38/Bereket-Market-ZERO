// Ürünleri Yükleme ve Kategorilere Ekleme
function loadAllProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Kategorileri sıfırla
    document.getElementById('cash-list').innerHTML = '';
    document.getElementById('card-list').innerHTML = '';
    document.getElementById('credit-list').innerHTML = '';
    
    // Ürünleri kategorilere ekle
    products.forEach(product => {
        product.sales.forEach(sale => {
            const category = sale.category;
            const listElement = document.getElementById(`${category}-list`);
            const item = document.createElement('li');
            item.textContent = `${product.name} - Fiyat: ${product.price} TL - Kar: ${product.profit} TL - Miktar: ${sale.quantity}`;
            listElement.appendChild(item);
        });
    });

    updateCategoryTotals();
}

// Kategorilerin Toplamlarını Güncelleme
function updateCategoryTotals() {
    const categories = ['cash', 'card', 'credit'];

    categories.forEach(category => {
        const listElement = document.getElementById(`${category}-list`);
        const totalPriceElement = document.getElementById(`${category}-total-price`);
        const totalProfitElement = document.getElementById(`${category}-total-profit`);
        
        let totalPrice = 0;
        let totalProfit = 0;

        listElement.querySelectorAll('li').forEach(item => {
            const text = item.textContent;
            const priceMatch = text.match(/Fiyat: (\d+(\.\d+)?) TL/);
            const profitMatch = text.match(/Kar: (\d+(\.\d+)?) TL/);
            
            if (priceMatch && profitMatch) {
                const price = parseFloat(priceMatch[1]);
                const profit = parseFloat(profitMatch[1]);
                totalPrice += price;
                totalProfit += profit;
            }
        });

        totalPriceElement.textContent = `Toplam Fiyat: ${totalPrice} TL`;
        totalProfitElement.textContent = `Toplam Kar: ${totalProfit} TL`;
    });
}

// Günü Kaydet Fonksiyonu
function saveDay() {
    const categories = ['cash', 'card', 'credit'];

    categories.forEach(category => {
        const listElement = document.getElementById(`${category}-list`);
        listElement.innerHTML = ''; // Listeyi sıfırla
        document.getElementById(`${category}-total-price`).textContent = 'Toplam Fiyat: 0 TL';
        document.getElementById(`${category}-total-profit`).textContent = 'Toplam Kar: 0 TL';
    });

    // LocalStorage'daki günlük verileri sıfırla
    localStorage.setItem('dailyData', JSON.stringify({
        cash: { price: 0, profit: 0 },
        card: { price: 0, profit: 0 },
        credit: { price: 0, profit: 0 }
    }));
    
    alert('Gün başarıyla kaydedildi ve veriler sıfırlandı!');
}

// Sayfa yüklendiğinde ürünleri yükle
window.onload = function() {
    loadAllProducts();
};



