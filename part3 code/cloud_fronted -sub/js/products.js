function fetchAllProducts() {
    var request = new XMLHttpRequest();
    request.open("GET", "https://5vr9nr9ku5.execute-api.us-east-1.amazonaws.com/product", true);
    request.onload = function() {
        if (request.status === 200) {
            console.log("API response:", request.responseText);
            var products = JSON.parse(request.responseText);
            var productContainer = document.getElementById("productContainer");
            productContainer.innerHTML = "";
            products.forEach(function(product) {
                console.log("Product:", product);
                var productDiv = document.createElement("div");
                productDiv.className = "col-md-4";
                productDiv.innerHTML = `
                    <div class="card mb-4">
                        <img src="${product.image_url}" class="card-img-top" alt="${product.product_name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.product_name}</h5>
                            <p class="card-text">${product.product_description}</p>
                            <p class="card-text">Price: $${product.product_price}</p>
                            <p class="card-text">Quantity: ${product.product_quantity}</p>
                            <button class="btn btn-primary" onclick="buyProduct('${product.product_name}', ${product.product_price})">Buy</button>
                        </div>
                    </div>
                `;
                productContainer.appendChild(productDiv);
            });
        } else {
            console.error('Failed to fetch products:', request.statusText);
        }
    };
    request.onerror = function() {
        console.error('Network error occurred while fetching products.');
    };
    request.send();
}

function buyProduct(productName, productPrice) {
    window.location.href = `payment.html?name=${encodeURIComponent(productName)}&price=${productPrice}`;
}

function fetchUserProducts() {
    var username = sessionStorage.getItem("username");
    var request = new XMLHttpRequest();
    request.open("GET", `https://5vr9nr9ku5.execute-api.us-east-1.amazonaws.com/user-products/${username}`, true);
    request.onload = function() {
        if (request.status === 200) {
            console.log("API response:", request.responseText);
            var products = JSON.parse(request.responseText);
            var productContainer = document.getElementById("userProductContainer");
            productContainer.innerHTML = "";
            products.forEach(function(product) {
                console.log("Product:", product);
                var productDiv = document.createElement("div");
                productDiv.className = "col-md-4";
                productDiv.innerHTML = `
                    <div class="card mb-4">
                        <img src="${product.image_url}" class="card-img-top" alt="${product.product_name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.product_name}</h5>
                            <p class="card-text">${product.product_description}</p>
                            <p class="card-text">Price: $${product.product_price}</p>
                            <p class="card-text">Quantity: ${product.product_quantity}</p>
                            <button class="btn btn-warning" onclick="editProduct(${product.product_id})">Edit</button>
                            <button class="btn btn-danger" onclick="deleteProduct(${product.product_id})">Delete</button>
                        </div>
                    </div>
                `;
                productContainer.appendChild(productDiv);
            });
        } else {
            console.error('Failed to fetch user products:', request.statusText);
        }
    };
    request.onerror = function() {
        console.error('Network error occurred while fetching user products.');
    };
    request.send();
}

function addProduct(event) {
    event.preventDefault();
    var username = sessionStorage.getItem("username");
    var product = {
        product_name: document.getElementById("product_name").value,
        product_description: document.getElementById("product_description").value,
        product_price: document.getElementById("product_price").value,
        image_url: document.getElementById("image_url").value,
        product_quantity: document.getElementById("product_quantity").value,
        added_by: username
    };
    console.log("Adding product:", product);
    var request = new XMLHttpRequest();
    request.open("POST", "https://5vr9nr9ku5.execute-api.us-east-1.amazonaws.com/product", true);
    request.onload = function() {
        console.log("Request status:", request.status);
        console.log("Response text:", request.responseText);
        if (request.status === 200 || request.status === 201) {
            alert("Product added successfully");
            fetchUserProducts();
        } else {
            console.error('Failed to add product:', request.statusText);
        }
    };
    request.onerror = function() {
        console.error('Network error occurred while adding product.');
    };
    request.send(JSON.stringify(product));
}

function deleteProduct(productId) {
    var request = new XMLHttpRequest();
    request.open("DELETE", `https://5vr9nr9ku5.execute-api.us-east-1.amazonaws.com/product/${productId}`, true);
    request.onload = function() {
        if (request.status === 200) {
            alert("Product deleted successfully");
            fetchUserProducts();
        } else {
            console.error('Failed to delete product:', request.statusText);
        }
    };
    request.onerror = function() {
        console.error('Network error occurred while deleting product.');
    };
    request.send();
}

function editProduct(productId) {
    window.location.href = `editProduct.html?productId=${productId}`;
}

function logOut() {
    sessionStorage.clear();
    window.location.href = "login.html";
}

function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');
    if (!productId) {
        alert("Product ID not found");
        window.location.href = 'myProducts.html';
        return;
    }
    var request = new XMLHttpRequest();
    request.open("GET", `https://5vr9nr9ku5.execute-api.us-east-1.amazonaws.com/product/${productId}`, true);
    request.onload = function() {
        if (request.status === 200) {
            var product = JSON.parse(request.responseText)[0];
            document.getElementById("product_id").value = product.product_id;
            document.getElementById("product_name").value = product.product_name;
            document.getElementById("product_description").value = product.product_description;
            document.getElementById("product_price").value = product.product_price;
            document.getElementById("image_url").value = product.image_url;
            document.getElementById("product_quantity").value = product.product_quantity;
        } else {
            console.error('Failed to fetch product details:', request.statusText);
        }
    };
    request.onerror = function() {
        console.error('Network error occurred while fetching product details.');
    };
    request.send();
}

function updateProduct(event) {
    event.preventDefault();
    var productId = document.getElementById("product_id").value;
    var product = {
        product_name: document.getElementById("product_name").value,
        product_description: document.getElementById("product_description").value,
        product_price: document.getElementById("product_price").value,
        image_url: document.getElementById("image_url").value,
        product_quantity: document.getElementById("product_quantity").value,
        added_by: sessionStorage.getItem("username")
    };
    var request = new XMLHttpRequest();
    request.open("PUT", `https://5vr9nr9ku5.execute-api.us-east-1.amazonaws.com/product/${productId}`, true);
    request.onload = function() {
        if (request.status === 200) {
            alert("Product updated successfully");
            window.location.href = 'myProducts.html';
        } else {
            console.error('Failed to update product:', request.statusText);
        }
    };
    request.onerror = function() {
        console.error('Network error occurred while updating product.');
    };
    request.send(JSON.stringify(product));
}
