function register() {
    var response = "";

    var jsonData = new Object();
    jsonData.address = document.getElementById("address").value;
    jsonData.createdate = new Date().toISOString().split('T')[0]; 
    jsonData.email = document.getElementById("email").value;
    jsonData.name = document.getElementById("fullname").value;
    jsonData.password = document.getElementById("password").value;
    jsonData.phonenumber = document.getElementById("contactno").value;
    jsonData.username = document.getElementById("username").value;

    if (jsonData.address == "" || jsonData.createdate == "" || jsonData.email == "" || jsonData.name == "" || jsonData.password == "" || jsonData.phonenumber == "" || jsonData.username == "") {
        alert('All fields are required!'); return;
    } 
    
    var request = new XMLHttpRequest();
    
    request.open("POST", "https://20rpak1f3a.execute-api.us-east-1.amazonaws.com/add-user", true);
    
    request.onload = function() {
        response = JSON.parse(request.responseText);
        if (response.message == "User added successfully") {
            alert('User registered successfully. Redirecting to login page...');
            window.location.href = 'login.html';
        } else {
            alert('Error. Unable to register user.');
        }
    };
    
    request.send(JSON.stringify(jsonData));
}

function user_login() {
    var response = "";
    
    var jsonData = new Object();
    jsonData.username = document.getElementById("loginUsername").value;
    jsonData.password = document.getElementById("loginPassword").value;
    
    if (jsonData.username == "" || jsonData.password == "") {
        alert('All fields are required!'); return;
    } 
    
    var request = new XMLHttpRequest();
    
    request.open("POST", "https://20rpak1f3a.execute-api.us-east-1.amazonaws.com/user-login", true);
    
    request.onload = function() {
        response = JSON.parse(request.responseText);
        if (response.length > 0) {
            sessionStorage.setItem("userid", response[0].userid);  
            sessionStorage.setItem("username", response[0].username);
            sessionStorage.setItem("fullname", response[0].name);
            sessionStorage.setItem("email", response[0].email);
            sessionStorage.setItem("contactno", response[0].phonenumber);
            sessionStorage.setItem("address", response[0].address);
            sessionStorage.setItem("password", response[0].password);
            window.location.href = 'home.html';
        } else {
            alert('Error. Unable to login.');
        }
    };
    
    request.send(JSON.stringify(jsonData));
}

function logOut() {
    sessionStorage.clear();
    window.location.href = "login.html";
}

function loadUserProfile() {
    document.getElementById("username").value = sessionStorage.getItem("username");
    document.getElementById("fullname").value = sessionStorage.getItem("fullname");
    document.getElementById("email").value = sessionStorage.getItem("email");
    document.getElementById("contactno").value = sessionStorage.getItem("contactno");
    document.getElementById("address").value = sessionStorage.getItem("address");
    document.getElementById("password").value = sessionStorage.getItem("password");
}

function updateUserProfile() {
    var response = "";

    var jsonData = new Object();
    jsonData.address = document.getElementById("address").value;
    jsonData.createdate = new Date().toISOString().split('T')[0]; 
    jsonData.email = document.getElementById("email").value;
    jsonData.name = document.getElementById("fullname").value;
    jsonData.password = document.getElementById("password").value;
    jsonData.phonenumber = document.getElementById("contactno").value;
    jsonData.username = document.getElementById("username").value;

    var request = new XMLHttpRequest();
    
    request.open("PUT", `https://20rpak1f3a.execute-api.us-east-1.amazonaws.com/user-profile/${sessionStorage.getItem("userid")}`, true);
    
    request.onload = function() {
        response = JSON.parse(request.responseText);
        if (response.message == "User profile updated successfully") {
            alert('Profile updated successfully.');
            sessionStorage.setItem("fullname", jsonData.name);
            sessionStorage.setItem("email", jsonData.email);
            sessionStorage.setItem("contactno", jsonData.phonenumber);
            sessionStorage.setItem("address", jsonData.address);
            sessionStorage.setItem("password", jsonData.password);
            window.location.href = "home.html";
        } else {
            alert('Error. Unable to update profile.');
        }
    };
    
    request.send(JSON.stringify(jsonData));
}

function deleteUser() {
    var request = new XMLHttpRequest();
    
    request.open("DELETE", `https://20rpak1f3a.execute-api.us-east-1.amazonaws.com/user-profile/${sessionStorage.getItem("userid")}`, true);
    
    request.onload = function() {
        var response = JSON.parse(request.responseText);
        if (response.message == "User profile deleted successfully") {
            alert('Account deleted successfully.');
            logOut();
        } else {
            alert('Error. Unable to delete account.');
        }
    };
    
    request.send();
}
