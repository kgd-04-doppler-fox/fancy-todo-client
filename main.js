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
    $('#todo-table').hide()
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
        $("#edit-status").val(result.todo.status)
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
    $('#registration-page').hide()
    $('body').css({"background-image" : "url('./asset/background.jpg')"})
    $('#signup').hide()
    $.ajax(`${baseServer}/todos`, {
        method: `GET`,
        headers: {
            access_token : localStorage.getItem('access_token')
        }
    })
    .done(result => {
        $('#todo-table').empty()
        $('#todo-table').append(`<thead class="thead-dark" style="text-align: center;">
        <tr>
          <th scope="col">No</th>
          <th scope="col">Title</th>
          <th scope="col">Description</th>
          <th scope="col">Due Date</th>
          <th scope="col">Location</th>
          <th scope="col">Status</th>
          <th scope="col">Actions</th>
        </tr>
        </thead>`)
        result.todos.forEach(todo => {
            $('#todo-table').append(`<tr>
                <th scope="row">${todo.id}</th>
                <td>${todo.title}</td>
                <td>${todo.description}</td>
                <td>${getDate(todo.due_date)}</td>
                <td>${todo.location}</td>
                <td>${todo.status}</td>
                <td>
                <div class="btn-group btn-group-toggle" data-toggle="buttons" style="text-align: center;">
                <label class="btn btn-secondary active">
                  <input type="radio" name="options" id="change-status" autocomplete="off" onclick="changeStatus(${todo.id})"> compeleted
                </label>
                <label class="btn btn-secondary">
                  <input type="radio" name="options" id="edit-todo" autocomplete="off" onclick="editTodo(${todo.id})"> Edit
                </label>
                <label class="btn btn-secondary">
                  <input type="radio" name="options" id="delete-todo" autocomplete="off" onclick="fetchDelete(${todo.id})"> Delete
                </label>
                </div>
                </td>
                </tr>`
            )
        })
    })
    .fail(err => {
        console.log(err)
    })
}

function onSignIn(googleUser) {
    const id_token = googleUser.getAuthResponse().id_token
    $.ajax(`${baseServer}/googleSignIn`, {
        method : `POST`,
        data: {
            access_token : id_token
        }
    })
    .done((result) => {
        console.log(result)
        localStorage.setItem('access_token', result.access_token)
        fetchTodo()
        $('#todo-table').show()
        $('#logout-btn').show()
        $('#create-todo').show()
        $('#todo-header').show()
        $('#header-todo-list').show()
        $('#login-page').hide()
        $('#create-page').hide()
        $('#edit-page').hide()
    })
    .fail((err) => {
        console.log(err)
    })
    .always(()=>{
        $('#login-page').trigger('reset')
    })
}

function signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
}

function clearLogin(){
    $("#login-page").empty()
    $("#login-page").append(`
    <h1>Login</h1>
    <form>
        <label class="mt-3">Email</label>
        <input type="text" class="form-control form-control-sm mt" placeholder="email" id="email">
        <label class="mt-3">Password</label>
        <input type="password" class="form-control form-control-sm" placeholder="password" id="password">
        <button class="btn btn-primary mt-3" id="submit-login">Login</button>
        <div class="g-signin2" data-onsuccess="onSignIn"></div>
    </form>
    `)
}

$(document).ready(function () {
    if (localStorage.getItem('access_token')){
        fetchTodo()
        $('#todo-table').show()
        $('#logout-btn').show()
        $('#create-todo').show()
        $('#todo-header').show()
        $('#header-todo-list').show()
        $('#login-page').hide()
        $('#create-page').hide()
        $('#edit-page').hide()
        $('body').css({"background-image" : "url('./asset/background.jpg')"})
        $('#registration-page').hide()

    }
    else{
        $('#login-page').show()
        $('#create-todo').hide()
        $('#todo-table').hide()
        $('#logout-btn').hide()
        $('#create-page').hide()
        $('#header-todo-list').hide()
        $('#todo-header').hide()
        $('#edit-page').hide()
        $('#registration-page').hide()

    }


    $('#signup').on('click', ()=> {
        $('#registration-page').show()
        $('#login-page').hide()
        $('#create-todo').hide()
        $('#todo-table').hide()
        $('#logout-btn').hide()
        $('#create-page').hide()
        $('#header-todo-list').hide()
        $('#todo-header').hide()
        $('#edit-page').hide()        
    })

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
            $('#todo-table').show()
            $('#create-todo').show()
            $('#logout-btn').show()
            $('#header-todo-list').show()
            $('#login-page').hide()
            $('#create-page').hide()
            $('#edit-page').hide()
            $('body').css({"background-image" : "url('./asset/background.jpg')"})
            $('#registration-page').hide()
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
        signOut()
        $('#login-page').trigger('reset')
        $('#registration-page').hide()
        $('#login-page').show()
        $('#todo-table').hide()
        $('#logout-btn').hide()
        $('#create-page').hide()
        $('#create-todo').hide()
        $('#header-todo-list').hide()
        $('#edit-page').hide()
        $('#login').show()
        $('body').css({"background-image" : "url('./asset/login.jpg')"})
        localStorage.clear()
    })

    $('#create-todo').on('click', () => {
        $('#create-page').show()
        $('#create-todo').hide()
        $('#login-page').hide()
        $('#todo-table').hide()
        $('#logout-btn').hide()
        $('#header-todo-list').hide()
        $('#edit-page').hide()
        $('#registration-page').hide()
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
                $('#todo-table').show()
                $('#logout-btn').show()
                $('#create-todo').show()
                $('#todo-header').show()
                $('#header-todo-list').show()
                $('#login-page').hide()
                $('#create-page').hide()
                $('#edit-page').hide()
                $('#registration-page').hide()
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
            $('#registration-page').hide()
        })
        .fail(err => {
            throw err
        })
    })

    $('#cancel-edit').on('click', () => {
        fetchTodo()
        $('#todo-table').show()
        $('#logout-btn').show()
        $('#create-todo').show()
        $('#todo-header').show()
        $('#header-todo-list').show()
        $('#login-page').hide()
        $('#create-page').hide()
        $('#edit-page').hide()
        $('#registration-page').hide()
    })

    $('#submit-register').on('submit', (event)=> {
        event.preventDefault()
        const fullName = $("#reg-name").val()
        const email = $("#reg-email").val()
        const password = $("#reg-password").val()
        $.ajax({
            url: `${baseServer}/register`,
            method : `POST`,
            data : {
                fullName,
                email,
                password
            }
        })
        .done(response => {
            $("registration-page").trigger('reset')
            $('#login-page').show()
            $('#create-todo').hide()
            $('#todo-table').hide()
            $('#logout-btn').hide()
            $('#create-page').hide()
            $('#header-todo-list').hide()
            $('#todo-header').hide()
            $('#edit-page').hide()
            $('#registration-page').hide()
        })
        .fail (err => {
            throw err
        })
    })

    $('#cancel-register').on('click', (event) => {
        event.preventDefault()  
        $("registration-page").trigger('reset')
        $('#login-page').show()
        $('#create-todo').hide()
        $('#todo-table').hide()
        $('#logout-btn').hide()
        $('#create-page').hide()
        $('#header-todo-list').hide()
        $('#todo-header').hide()
        $('#edit-page').hide()
        $('#registration-page').hide()
        
    } )
})