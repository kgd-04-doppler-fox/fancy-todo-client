const baseURL = "http://localhost:3000"

function showLogin() {
    $("#navbar").hide()
    $("#register-form").hide()
    $("#login-form").show()
    $("#homepage").hide()
    $("#create-todo-form").hide()
    $("#ShowAllTodo").hide()
    $("#findTodo").hide()                
    $("#update-todo-form").hide()
}

function showRegister() {
    $("#navbar").hide()
    $("#register-form").show()
    $("#login-form").hide()
    $("#homepage").hide()
    $("#create-todo-form").hide()
    $("#ShowAllTodo").hide()
    $("#findTodo").hide()                
    $("#update-todo-form").hide()
}

function showNavbar() {
    $("#navbar").show()
}

function showHomepage() {
    $("#navbar").show()
    $("#register-form").hide()
    $("#login-form").hide()
    $("#homepage").show()
    $("#create-todo-form").hide()
    $("#ShowAllTodo").hide()
    $("#findTodo").hide()                
    $("#update-todo-form").hide()
}

function showCreate() {
    $("#navbar").show()
    $("#create-todo-form").show()
    $("#register-form").hide()
    $("#login-form").hide()
    $("#homepage").hide()
    $("#ShowAllTodo").hide()
    $("#findTodo").hide()                
    $("#update-todo-form").hide()
}

function showAllTodo() {
    $("#navbar").show()
    $("#register-form").hide()
    $("#login-form").hide()
    $("#homepage").hide()
    $("#create-todo-form").hide()
    $("#ShowAllTodo").show()
    $("#findTodo").hide()                
    $("#update-todo-form").hide()
}

function showFindTodo() {
    $("#navbar").show()
    $("#register-form").hide()
    $("#login-form").hide()
    $("#homepage").hide()
    $("#create-todo-form").hide()
    $("#ShowAllTodo").hide()
    $("#findTodo").show()                
    $("#update-todo-form").hide()
}

function login() {
    const email = $("#email").val()
    const password = $("#password").val()
    // request ke server, make ajax

    $.ajax({
        url: `${baseURL}/login`,
        method : "POST",
        data : {
            email,
            password
        }
    })
    .done(response => {
        localStorage.setItem("access_token", response.access_token)
        showHomepage()
    })
    .fail(err => {
        console.log(err);
    })
}

function register() {
    const email = $("#register-email").val()
    const password = $("#register-password").val()
    // request ke server, make ajax

    $.ajax({
        url     : `${baseURL}/register`,
        method  : "POST",
        data    : {
                    email,
                    password
                }
    })
    .done(() => {
        showLogin()
    })
    .fail(err => {
        console.log(err);
    })
}

function logout() {
    localStorage.clear()
    showLogin()
    var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        })
}

function fetchCreate() {
    $.ajax({
        url : `${baseURL}/todos`,
        method : "POST",
        headers : {
            access_token : localStorage.getItem('access_token')
        },
        data : {
            title: $('#title').val(),
            description: $('#description').val(),
            status: $('#status').val(),
            due_date: $('#due_date').val(),
            Snack : $('#snack').val()
        }
    })
    .done(response => {
        console.log(response);
        fetchShowAll()
    })
    .fail(err => {
        console.log(err);
    })
}

function updateStatus (id) {
    $.ajax({
        url : `${baseURL}/todos/${id}`,
        method : "PATCH",
        headers : {
            access_token : localStorage.getItem('access_token')
        },
        data : {
            status: 'completed'
        }
    })
    .done(response => {
        console.log(response);
        fetchShowAll()
    })
    .fail(err => {
        console.log(err);
    })
}

// function updateTodo () {
//     $("#fetchDataForUpdate").empty()
//     $.ajax({
//         url : `${baseURL}/todos`,
//         method : "GET",
//         headers : {
//             access_token : localStorage.getItem('access_token')
//         }
//     })
//     .done(response => {
//         for(let i = 0 ; i < response.length ; i++){
//         $("#fetchDataForUpdate").append(`
//         <div class="col-sm-6">
//             <div class="input-group mb-3">
//                 <div class="input-group-prepend">
//                     <span class="input-group-text" id="basic-addon1">To-do Title</span>
//                 </div>
//                 <input id="title" type="text" class="form-control" placeholder="Title" aria-label="Username" aria-describedby="basic-addon1">
//             </div>
//             <div class="input-group mb-3">
//                 <div class="input-group-prepend">
//                 <span class="input-group-text" id="basic-addon1">Description</span>
//                 </div>
//                 <input id="description" type="text" class="form-control" placeholder="Description" aria-label="Description" aria-describedby="basic-addon1">
//             </div>
//             <div class="input-group mb-3">
//                 <div class="input-group-prepend">
//                     <label class="input-group-text" for="inputGroupSelect01">Status</label>
//                 </div>
//                 <select class="custom-select" id="status">
//                     <option selected value="incomplete">Incomplete</option>
//                 </select>
//             </div>
//             <div class="input-group mb-3">
//                 <div class="input-group-prepend">
//                 <span class="input-group-text" id="basic-addon1">Type of Snack</span>
//                 </div>
//                 <input id="snack" type="text" class="form-control" placeholder="Snack" aria-label="Snack" aria-describedby="basic-addon1">
//                 <br><br>
//                 <small>*) Insert snack/food name, e.g pizza, ayam, sate, etc</small>
//             </div>
//             <div class="input-group mb-3">
//                 <div class="input-group-prepend">
//                 <span class="input-group-text" id="basic-addon1">Due Date</span>
//                 </div>
//                 <input id="due_date" type="date" class="form-control" placeholder="Pick a date" aria-label="date" aria-describedby="basic-addon1" min="new Date()">
//                 <br><br>
//                 <small>*) Minimum date to be inputted is today's date</small>
//             </div>
//             <button class="btn btn-info" type="submit">Create My Todo!</button>
//         </div>
//         <img src="./image/todo.png" style="opacity: 0.7;max-width: 50vh; max-height: 50vh;">
//         `)
//         }
//     })
// }

function fetchShowAll() {
    $("#list-todo").empty()
    $.ajax({
        url : `${baseURL}/todos`,
        method : "GET",
        headers : {
            access_token : localStorage.getItem('access_token')
        }
    })
    .done(response => {
        // console.log(response);
        for(let i = 0 ; i < response.length ; i++){
            let color = ['primary', 'secondary', 'success', 'warning','info', 'dark']
            let randomColor = Math.floor(Math.random() * color.length)
            var formatedDate = response[i].due_date.slice(0,10);
                $("#list-todo").append(`
                <div class="card text-white bg-${color[randomColor]} mb-3" style="max-width: 18rem;">
                    <div class="card-header d-flex justify-content-between">
                        <h3>${response[i].title}</h3>
                        <h3>${response[i].id}</h3>
                    </div>
                    <div class="card-body">
                        <p class="card-title">Snack: ${response[i].Snack}</p>
                        <p class="card-text">Description: ${response[i].description}</p>
                        <p class="card-text">Status: ${response[i].status}</p>
                        <p class="card-text">Due date: ${formatedDate}</p>
                    <div class="d-flex justify-content-between">
                        <button id="delete-data" class="btn btn-${color[randomColor+1]}" onclick="deleteTodo(${response[i].id})"> Delete </button>
                        <button class="btn btn-${color[randomColor+1]}" onclick="updateStatus(${response[i].id})"> Update Status </button>
                    </div>
                </div>
                `)
            }
        // hasil fetch perlu di append ke dalamn sebuah div di html
    })
    .fail(err => {
        console.log(err);
    })
}

function deleteTodo(id) {
    $.ajax({
        url : `${baseURL}/todos/${id}`,
        method : "DELETE",
        headers : {
            access_token : localStorage.getItem('access_token')
        }
    })
    .done(response => {
        console.log(response);
        fetchShowAll()
    })
    .fail(err => {
        console.log(err);
    })
}


function onSignIn(googleUser) {
        // var profile = googleUser.getBasicProfile();
        // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        // console.log('Name: ' + profile.getName());
        // console.log('Image URL: ' + profile.getImageUrl());
        // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    var tokenGoogle = googleUser.getAuthResponse().id_token;
    $.ajax({
        url : baseURL + '/googleSign',
        method : "POST",
        data : {
            tokenGoogle
        }
    })
    .done(res => {
        localStorage.setItem("access_token", res.access_token)
        showHomepage()
    })
    .fail(err => {
        console.log(err);
    })
}


