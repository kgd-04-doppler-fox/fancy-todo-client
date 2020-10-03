const baseURL = 'http://localhost:3000'

function showLogin () {
    $("#login-form").show()
    $("#register-form").hide()
    $("#main-page").hide()
    $("#add-form").hide()
    $("#edit-form").hide()
}

function showRegister () {
    $("#register-form").show()
    $("#login-form").hide()
    $("#main-page").hide()
    $("#add-form").hide()
    $("#edit-form").hide()
}

function showMainPage () {
    $("#main-page").show()
    $("#register-form").hide()
    $("#login-form").hide()
    $("#add-form").hide()
    $("#edit-form").hide()
}

function showAddForm () {
    $("#add-form").show()
    $("#main-page").hide()
    $("#register-form").hide()
    $("#login-form").hide()
    $("#edit-form").hide()
}

function showEditForm () {
    $("#edit-form").show()
    $("#add-form").hide()
    $("#main-page").hide()
    $("#register-form").hide()
    $("#login-form").hide()
}

function login () {
    const email = $("#email").val()
    const password = $("#password").val()
    // request server
    $.ajax(`${baseURL}/login`, {
        method: 'POST',
        data: {
            email,
            password
        }
    })
    .done((respone) => {
        localStorage.setItem("access_token", respone.access_token)
        showMainPage()
        fetchTodos()
    })
    .fail((err) => {
        console.log(err)
    })
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;

    $.ajax({
        url: `${baseURL}/googlesign`,
        method: 'POST',
        data: {
            id_token
        }
    })
    .done(respone => {
        localStorage.setItem("access_token", respone.access_token)
        showMainPage()
        fetchTodos()
    })
    .fail(err => {
        console.log(err)
    })
}

function addTodo () {
    const title = $("#title").val()
    const description = $("#description").val()
    const status = $("#status").val()
    const due_date = $("#due_date").val()

    $.ajax({
        method: 'POST',
        url: `${baseURL}/todos`,
        headers: {
            access_token: localStorage.getItem('access_token')
        },
        data: {
            title,
            description,
            status,
            due_date
        }
    })
    .done(respone => {
        fetchTodos()
        showMainPage()
    })
    .fail(err => {
        console.log(err)
    })
}

function deleteTodo (id) {
    $.ajax({
        url: `${baseURL}/todos/${id}`,
        method: 'DELETE',
        headers: {
            access_token: localStorage.getItem('access_token')
        }
    })
    .done(respone => {
        fetchTodos()
    })
    .fail(err => {
        console.log(err)
    })
}

function editTodo (id) {
    showEditForm()
    $.ajax({
        url: `${baseURL}/todos/${id}`,
        method: 'GET',
        headers: {
            access_token: localStorage.getItem('access_token')
        }
    })
    .done(data => {
        localStorage.setItem("current_id", data.todo.id)
        $("#edit-title").val(data.todo.title)
        $("#edit-description").val(data.todo.description)
        $("#edit-status").val(data.todo.status)
        $("#edit-due_date").val(data.todo.due_date);  
        
    })
    .fail(err => {
        console.log(err)
    })
}

function editTodoPost () {
    const id = localStorage.getItem("current_id")
    const title = $("#edit-title").val()
    const description = $("#edit-description").val()
    const status = $("#edit-status").val()
    const due_date = $("#edit-due_date").val()

    $.ajax({
        method: 'PUT',
        url: `${baseURL}/todos/${id}`,
        headers: {
            access_token: localStorage.getItem('access_token')
        },
        data: {
            title,
            description,
            status,
            due_date
        }
    })
    .done(respone => {
        fetchTodos()
        showMainPage()
    })
    .fail(err => {
        console.log(err)
    })
}

function fetchTodos () {
    $.ajax(`${baseURL}/todos`, {
        method: 'GET',
        headers: {
            access_token: localStorage.getItem('access_token')
        }
    })
    .done(respone => {
        $("#list-todo").empty()
        for (let i = 0; i < respone.length; i ++) {
            $("#list-todo").append(
                `<div class="card col-4">
                    <div class="card-body">
                    <h5 class="card-title">${respone[i].title}</h5>
                        <p class="card-text">${respone[i].description}</p>
                        <p class="card-text">${respone[i].status}</p>
                        <p class="card-text">${respone[i].due_date}</p>
                        <button class="btn-warning" onclick="deleteTodo(${respone[i].id})">Delete</button>
                        <button class="btn-warning" onclick="editTodo(${respone[i].id})">Edit</button>
                    </div>
                </div>`)
        }
    })
    .fail(err => {
        console.log(err)
    })
}
