const baseURL = 'http://localhost:3000'
function deleteTodo (id) {
    $.ajax(`${baseURL}/todos/${id}`, {
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
            $("#list-todo").append(`<div class="card col-4">
                <div class="card-body">
                    <h5 class="card-title">${respone[i].title}</h5>
                    <p class="card-text">${respone[i].description}</p>
                    <p class="card-text">${respone[i].status}</p>
                    <p class="card-text">${respone[i].due_date}</p>
                    <button class="btn-warning" onclick="deleteTodo(${respone[i].id})">Delete</button>
                </div>
            </div>`)
        }
    })
    .fail(err => {
        console.log(err)
    })
}

$(document).ready(function () {
    const baseURL = 'http://localhost:3000'

    if (localStorage.getItem('access_token')) {
        fetchTodos()
        $("#main-page").show()
        $("#login-form").hide()
    } else {
        $("#main-page").hide()
        $("#login-form").show()
    }

    $("#login").on("submit", function (e) {
        e.preventDefault()
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
            $("#main-page").show()
            $("#login-form").hide()
            fetchTodos()
        })
        .fail((err) => {
            console.log(err)
        })
    })
})

$("#logout").on('click', () => {
    $("#main-page").hide()
    $("#login-form").show()
    localStorage.clear()
})