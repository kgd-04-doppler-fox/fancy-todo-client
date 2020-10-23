$(document).ready(function() {

    if(localStorage.getItem('access_token')) {
        showHomepage()
    } else {
        showLogin()
    }

    $("#login").on("submit", function(e){
        e.preventDefault()
        login()
    })

    $("#gotohompage").on("click", function(e) {
        e.preventDefault()
        showHomepage()
    })

    $("#register").on("submit", function(e) {
        e.preventDefault()
        register()
    })
    
    $("#login-button-from-register").on("click", function(e) {
        e.preventDefault()
        showLogin()
    })

    $("#register-login").on("click", (e) => {
        e.preventDefault()
        showRegister()
    })

    $("#create-todo").on("click", (e) => {
        e.preventDefault()
        showCreate()
    })

    $("#submit-new-todo").on("submit", (e) => {
        e.preventDefault()
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
            showAllTodo()
            fetchShowAll()
        })
        .fail(err => {
            console.log(err);
        })
    })

    $("#showAll-todo").on("click", (e) => {
        e.preventDefault()
        fetchShowAll()
        showAllTodo()
    })

    $("#find-todo").on("click", (e) => {
        e.preventDefault()
        showFindTodo()
    })

    $("#update-todo").on("click", (e) => {
        e.preventDefault()
        $("#update-todo-form").show()
        $("#login-form").hide()
        $("#homepage").hide()
    })

    $("#delete-data").on("click", (e) => {
        e.preventDefault()
        showAllTodo()
        $("#login-form").hide()
        $("#homepage").hide()
    })

    $("#logout").on("click", (e) => {
        logout()
    })
})
