const baseServer = 'http://localhost:3000'

function formatDate(date) {
    var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function changeStatus(id) {
    $.ajax(`${baseServer}/todos/${id}`, {
        method : `PATCH`,
        headers : {
            access_token : localStorage.getItem('access_token')
        },
        data: {
            status : `completed`
        }
        
    })
    .done(result => {
        fetchTodo()
    })
    .fail(err => {
        throw err
    })
}

function fetchDelete (id) {
    $.ajax(`${baseServer}/todos/${id}`, {
        method: `DELETE`,
        headers: {
            access_token : localStorage.getItem('access_token')
        }
    })
    .done(result => {
        fetchTodo()
    })
    .fail(err => {
        console.log(err)
    })
}

function editTodo (id) {
    $('.todo-container').hide()
    $('#logout-btn').hide()
    $('#create-todo').hide()
    $('#todo-header').hide()
    $('#header-todo-list').hide()
    $('#login-page').hide()
    $('#create-page').hide()
    $('#edit-page').show()

    $.ajax(`${baseServer}/todos/${id}`, {
        method : 'GET',
        headers : {
            access_token : localStorage.getItem('access_token')
        }
    })
    .done(result => {
        localStorage.setItem('current_id', result.todo.id)
        $("#edit-title").val(result.todo.title)
        $("#edit-description").val(result.todo.description)
        $("#edit-due_date").val(formatDate(result.todo.due_date))
        $("#edit-location").val(result.todo.location)
        result.todo.status === $("#edit-status").val() ? "selected" : ""
    })
    .fail(err => {
        throw err
    })

}

function getDate (date) {
    let editDate = new Date (date)
    return new Intl.DateTimeFormat('en-GB').format(editDate)
}

function fetchTodo() {
    $.ajax(`${baseServer}/todos`, {
        method: `GET`,
        headers: {
            access_token : localStorage.getItem('access_token')
        }
    })
    .done(result => {
        $('.todo-container').empty()
        $('.todo-container').append(`<tr>
        <th>No</th>
        <th>Todo</th>
        <th>Description</th>
        <th>Due Date</th>
        <th>Location</th>
        <th>Status</th>
        <th>Actions</th>
        </tr>`)
        result.todos.forEach(todo => {
            $('.todo-container').append(`<tr>
                <td>${todo.id}</td>
                <td>${todo.title}</td>
                <td>${todo.description}</td>
                <td>${getDate(todo.due_date)}</td>
                <td>${todo.location}</td>
                <td>${todo.status}</td>
                <td>
                    <button id="change-status" onclick="changeStatus(${todo.id})"> Mark as Completed </button>
                    <button id="edit-todo" onclick="editTodo(${todo.id})"> edit </button>
                    <button id="delete-todo" onclick="fetchDelete(${todo.id})"> delete </button>
                </td>
                </tr>`
            )
        })
    })
    .fail(err => {
        console.log(err)
    })
}

$(document).ready(function () {
    if (localStorage.getItem('access_token')){
        fetchTodo()
        $('.todo-container').show()
        $('#logout-btn').show()
        $('#create-todo').show()
        $('#todo-header').show()
        $('#header-todo-list').show()
        $('#login-page').hide()
        $('#create-page').hide()
        $('#edit-page').hide()

    }
    else{
        $('#login-page').show()
        $('#create-todo').hide()
        $('.todo-container').hide()
        $('#logout-btn').hide()
        $('#create-page').hide()
        $('#header-todo-list').hide()
        $('#todo-header').hide()
        $('#edit-page').hide()

    }

    $('#login-page').on('submit', (event) => {
        event.preventDefault()
        const email = $('#email').val()
        const password = $('#password').val()
        $('#login-page').trigger('reset')
        $.ajax(`${baseServer}/login`, {
            method: `POST`,
            data: {
                email,
                password
            }
        })
        .done((result) => {
            localStorage.setItem('access_token', result.accessToken)
            $('.todo-container').show()
            $('#create-todo').show()
            $('#logout-btn').show()
            $('#header-todo-list').show()
            $('#login-page').hide()
            $('#create-page').hide()
            $('#edit-page').hide()

            fetchTodo()
        })
        .fail((err) => {
            console.log(err)
        })
        .always(()=>{
            $('#login-page').trigger('reset')
        })
    })

    $('#logout-btn').on('click', () => {
        $('#login-page').show()
        $('.todo-container').hide()
        $('#logout-btn').hide()
        $('#create-page').hide()
        $('#create-todo').hide()
        $('#header-todo-list').hide()
        $('#edit-page').hide()
        localStorage.clear()
    })

    $('#create-todo').on('click', () => {
        $('#create-page').show()
        $('#create-todo').hide()
        $('#login-page').hide()
        $('.todo-container').hide()
        $('#logout-btn').hide()
        $('#header-todo-list').hide()
        $('#edit-page').hide()

    })

    $('#submit_todo').on('click', (event) => {
            event.preventDefault
            $('#create-page').trigger('reset')
            $.ajax(`${baseServer}/todos?lat=6.32275&lng=107.3376`, {
                method : 'POST',
                headers : {
                    access_token : localStorage.getItem('access_token')
                },
                data : {
                    title: $('#title').val(),
                    description: $('#description').val(),
                    status: $('#status').val(),
                    due_date: $('#due_date').val(),
                    location: $('#location').val()
                }
            })
            .done(result => {
                fetchTodo()
            })
            .fail(err => {
                console.log(err)
            })
    })
    
    $('#edit-submit').on('click', (event) => {
        console.log(localStorage.getItem)
        const id = localStorage.getItem('current_id')
        event.preventDefault
        $('#edit-page').trigger('reset')
        $.ajax(`${baseServer}/todos/${id}`, {
            method : 'PUT',
            headers : {
                access_token : localStorage.getItem('access_token')
            },
            data :{
                title : $("#edit-title").val(),
                description : $("#edit-description").val(),
                status : $("#edit-status").val(),
                due_date : $("#edit-due_date").val(),
                location : $("#edit-location").val()
            }
        })
        .done(result => {
            fetchTodo()
        })
        .fail(err => {
            throw err
        })
    })
})