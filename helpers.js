const baseURL = "http://localhost:3000"

function showLogin() {
    $("#register-form").hide()
    $("#login-form").show()
    $("#homepage").hide()
    $("#create-todo-form").hide()
    $("#ShowAllTodo").hide()
    $("#findTodo").hide()                
    $("#update-todo-form").hide()
}

function showRegister() {
    $("#register-form").show()
    $("#login-form").hide()
    $("#homepage").hide()
    $("#create-todo-form").hide()
    $("#ShowAllTodo").hide()
    $("#findTodo").hide()                
    $("#update-todo-form").hide()
}

function showHomepage() {
    $("#register-form").hide()
    $("#login-form").hide()
    $("#homepage").show()
    $("#create-todo-form").hide()
    $("#ShowAllTodo").hide()
    $("#findTodo").hide()                
    $("#update-todo-form").hide()
}

function showCreate() {
    fetchCreate()
    $("#create-todo-form").show()
    $("#register-form").hide()
    $("#login-form").hide()
    $("#homepage").hide()
    $("#ShowAllTodo").hide()
    $("#findTodo").hide()                
    $("#update-todo-form").hide()
}

function showAllTodo() {
    $("#register-form").hide()
    $("#login-form").hide()
    $("#homepage").hide()
    $("#create-todo-form").hide()
    $("#ShowAllTodo").show()
    $("#findTodo").hide()                
    $("#update-todo-form").hide()
}

function showFindTodo() {
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
            $("#list-todo").append(`
                    <tbody>
                        <tr>
                        <td>${response[i].id}</td>
                        <td>${response[i].title}</td>
                        <td>${response[i].description}</td>
                        <td>${response[i].status}</td>
                        <td>${response[i].Snack}</td>
                        <td>${response[i].due_date}</td>
                        <td><button onclick="deleteTodo(${response[i].id})"> Delete </button></td>
                        <td><button onclick="updateStatus(${response[i].id})"> Update Status </button></td>
                        </tr>

                        </tbody>
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
    var tokenGoogle = googleUser.getAuthResponse().id_token;
    console.log(tokenGoogle);
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


