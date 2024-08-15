function initializePayment() {
    const paymentForm = document.getElementById('paymentForm');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const paymentQuantityInput = document.getElementById('quantity');
    const productNameDisplay = document.getElementById('productName');
    const productPriceDisplay = document.getElementById('productPrice');

    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('name');
    const productPrice = urlParams.get('price');

    productNameDisplay.innerText = productName;
    productPriceDisplay.innerText = `$${productPrice}`;

    paymentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        submitPayment(productName, productPrice);
    });
}

function submitPayment(productName, productPrice) {
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const paymentQuantityInput = document.getElementById('quantity');

    const paymentData = {
        createdate: new Date().toISOString().split('T')[0],
        payment_method: paymentMethodSelect.value,
        payment_status: 'completed',
        price: productPrice,
        quantity: paymentQuantityInput.value,
        userid: sessionStorage.getItem('userid')
    };

    const request = new XMLHttpRequest();
    request.open('POST', 'https://1rc2jlxukd.execute-api.us-east-1.amazonaws.com/payment', true);
    //request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function() {
        if (request.status >= 200 && request.status < 300) {
            alert('Payment successful!');
            window.location.href = 'home.html';
        } else {
            alert('Payment failed!');
        }
    };

    request.onerror = function() {
        console.error('Error submitting payment:', request.statusText);
    };

    request.send(JSON.stringify(paymentData));
}

initializePayment();
