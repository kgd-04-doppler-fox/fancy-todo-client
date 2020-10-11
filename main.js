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
   
    let confirmation = confirm('Are you sure to delete this data?')

    if(confirmation){
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
    else {
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
        for(let i = 0; i < result.length; i++){
            
        }
        result.forEach(todo => {
            $('#todo-table').append(`<tr>
                <th scope="row">${todo.Todo.id}</th>
                <td>${todo.Todo.title}</td>
                <td>${todo.Todo.description}</td>
                <td>${getDate(todo.Todo.due_date)}</td>
                <td>${todo.Todo.location}</td>
                <td>${todo.Todo.status}</td>
                <td>
                <div class="btn-group btn-group-toggle" data-toggle="buttons" style="text-align: center;">
                <label class="btn btn-success">
                  <input type="radio" name="options" id="change-status" autocomplete="off" onclick="changeStatus(${todo.Todo.id})"> compeleted
                </label>
                <label class="btn btn-secondary">
                  <input type="radio" name="options" id="edit-todo" autocomplete="off" onclick="editTodo(${todo.Todo.id})"> Edit
                </label>
                <label class="btn btn-secondary">
                  <input type="radio" name="options" id="addmember" autocomplete="off" onclick="getUsers(${todo.Todo.id})"> invite
                </label>
                <label class="btn btn-danger">
                  <input type="radio" name="options" id="delete-todo" autocomplete="off" onclick="fetchDelete(${todo.Todo.id})"> Delete
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

function addMember(id){
    $.ajax(`${baseServer}/todos/addMembers`,{
        method: `POST`,
        headers: {
            access_token : localStorage.getItem(`access_token`)
        },
        data: {
            userId: id,
            todoId: localStorage.getItem('currentTodoId')
        }
    })
    .done(response => {
        $('#add-member').hide()
        $('#todo-table').show()
        $('#logout-btn').show()
        $('#create-todo').hide()
        $('#todo-header').show()
        $('#header-todo-list').show()
        $('#login-page').hide()
        $('#create-page').hide()
        $('#edit-page').hide()
        $('body').css({"background-image" : "url('./asset/background.jpg')"})
        $('#registration-page').hide()

    })
    .fail(err => {
        console.log(err)
    })
    
}

function getUsers (id){
    localStorage.setItem('currentTodoId', id)
    $('#add-member').show()
    $('#todo-table').hide()
    $('#logout-btn').show()
    $('#create-todo').hide()
    $('#todo-header').hide()
    $('#header-todo-list').hide()
    $('#login-page').hide()
    $('#create-page').hide()
    $('#edit-page').hide()
    $('body').css({"background-image" : "url('./asset/background.jpg')"})
    $('#registration-page').hide()
    $.ajax({
        url : `${baseServer}/users?todo=${id}`,
        method: 'GET',
        headers : {
            access_token : localStorage.getItem('access_token')
        }
    })
    .done(response => {
        const members = []

        response[response.length-1].forEach(user => {
            console.log(user.User.fullName)
            members.push(user.User.fullName)
        })

        $("#project").prepend(`
        <tr>
        <td>${response[response.length-1][0].Todo.title}</td>
        <td>${response[response.length-1][0].Todo.description}</td>
        <td>${formatDate(response[response.length-1][0].Todo.due_date)}</td>
        <td> ${members.join(', ')} </p>
        </tr>
        `)

        for(let i = 0; i < response.length-2; i++){
            $("#members").append(`
            <tr>
            <td>${response[i].fullName}</td>
            <td>${response[i].email}</td>
            <td><button class="btn btn-primary btn-sm" onclick="addMember(${response[i].id})" >Add</button></td>
            </tr>`)
        }
        
    })
    .fail(err => {
        throw err
    })
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
        $('#add-member').hide()

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
        $('#add-member').hide()
    }


    $('#signup').on('click', ()=> {
        $('#signup').hide()
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
            $('#add-member').hide()
            fetchTodo()
        })
        .fail((err) => {
            $('#fail-login').css({"color" : "red"})
            $('#form-login').trigger('reset')
        })
        .always(()=>{
            $('#form-page').trigger('reset')
        })
    })

    $('#logout-btn').on('click', () => {
        signOut()
        $('#form-login').trigger('reset')
        $('#registration-page').hide()
        $('#login-page').show()
        $('#todo-table').hide()
        $('#logout-btn').hide()
        $('#create-page').hide()
        $('#create-todo').hide()
        $('#header-todo-list').hide()
        $('#edit-page').hide()
        $('#signup').show()
        $('body').css({"background-image" : "url('./asset/login.jpg')"})
        $('#fail-login').css({"color" : "transparent"})

        localStorage.clear()
    })

    $('#create-todo').on('click', (event) => {
        event.preventDefault()
        $('#create-page').show()
        $('#create-todo').hide()
        $('#login-page').hide()
        $('#todo-table').hide()
        $('#logout-btn').hide()
        $('#header-todo-list').hide()
        $('#edit-page').hide()
        $('#registration-page').hide()
        $('body').css({"background-image" : "url('./asset/create.jpg')"})

    })

    $('#submit_todo').on('click', (event) => {
            event.preventDefault()
            $('#create-page').trigger('reset')
            $.ajax(`${baseServer}/todos`, {
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
                $("#success-create").css({"color":"greeen"})
            })
            .fail(err => {
                console.log(err)
            })
    })
    
    $('#cancel_todo').on('click', (event) => {
        event.preventDefault()
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

    $('#cancel-edit').on('click', (event) => {
        event.preventDefault()
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

    $('#submit-register').on('click', (event)=> {
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
            $('#register-form').trigger('reset')
            $("#error-register").css({"color" : "red"})
        })
    })

    $('#cancel-register').on('click', (event) => {
        event.preventDefault()  
        $('#signup').show()
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