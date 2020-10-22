$(document).ready(function () {

    if (localStorage.getItem('access_token')) {
        fetchTodos()
        showMainPage()
    } else {
        showLogin()
    }

    $("#login").on("submit", function (e) {
        e.preventDefault()
        login()
    })

    $("#register").on("submit", function (e) {
        e.preventDefault()
        register()
    })

    $("#logout").on('click', () => {
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
        showLogin()
        localStorage.clear()
    })

    $("#add-todo").on('click', () => {
        showAddForm()
    })

    $("#form-add").on('click', () => {
        addTodo()
    })

    $("#form-edit").on('click', () => {
        editTodoPost()
    })

    $("#signup").on('click', () => {
        showRegister()
    })

    $("#tologin").on('click', () => {
        showLogin()
    })
})
