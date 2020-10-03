const baseURL = `http://localhost:3000`
function deleteTodo(id) {
  $.ajax(`${baseURL}/todos/${id}`, {
    method: 'DELETE',
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  })
    .done(function (response) {
      fetchTodos()
    })
    .fail(function (error) {
      console.log(error)
    })
}

function fetchTodos() {
  $.ajax(`${baseURL}/todos`, {
    method: 'GET',
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  })
    .done(function (response) {
      $('#cardContainer').empty()
      response.todo.forEach(el => {
        $('#cardContainer').append(`<div class="card border-success mb-3 col-lg-4 col-md-6 col-sm-12 mx-4" style="max-width: 18rem;">
      <div class="card-header bg-transparent border-success" id="dueDate">
        ${formatDate(el.due_date)}
      </div>
      <div class="card-body text-success">
        <h5 class="card-title" id="todoTitle">${el.title}</h5>
        <p class="card-text" id="todoDesc">${el.description}</p>
        <p class="card-text" id="todoStatus">${el.status}</p>
      </div>
      <div class="card-footer bg-transparent border-success d-flex justify-content-around">
        <button id="deletetodo" class="btn btn-danger btn-sm" onclick="deleteTodo(${el.id})">Delete</button>
        <button id="editBtn" class="btn btn-outline-info btn-sm" onclick="editTodo(${el.id})">Update</button>
        <button class="btn btn-warning btn-sm" onclick="changeStatus(${el.id})">Status</button>
      </div>
    </div>`)
      })
    })
    .fail(function (error) {
      console.log(error)
    })
    .always(function () {
      showMainPage()
    })
}

function showRegister() {
  $('#register').show()
  $('#login').hide()
  $('#create').hide()
  $('#update').hide()
  $('#show-all').hide()
}

function showLogin() {
  $('#register').hide()
  $('#login').show()
  $('#create').hide()
  $('#update').hide()
  $('#show-all').hide()
}

function showMainPage() {
  $('#register').hide()
  $('#login').hide()
  $('#create').hide()
  $('#update').hide()
  $('#show-all').show()
}

function showCreate() {
  $('#register').hide()
  $('#login').hide()
  $('#create').show()
  $('#update').hide()
  $('#show-all').hide()
}

function showUpdate() {
  $('#register').hide()
  $('#login').hide()
  $('#create').hide()
  $('#update').show()
  $('#show-all').hide()
}

function formatDate(date) {
  let newDate = date.split('T')[0]
  return newDate
}

function editTodo(id) {
  showUpdate()
  $.ajax(`${baseURL}/todos/${id}`, {
    method: 'GET',
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  })
    .done(function (response) {
      localStorage.setItem('todoId', response.todo.id)
      $('#title').val(response.todo.title)
      $('#desc').val(response.todo.description)
      $('#due-date').val(response.todo.due_date)
      $('.changeStatus').val(response.todo.status)
    })
    .fail(function (error) {
      console.log(error)
    })
}

function changeStatus(id) {
  $.ajax(`${baseURL}/todos/${id}`, {
    method: 'PATCH',
    headers: {
      access_token: localStorage.getItem('access_token')
    },
    data: {
      status: true
    }
  })

    .done(function (response) {
      response.todo.status === $("#changeStatus").val() ? $("#changeStatus").val(true) : $("#changeStatus").val(false)
    })
    .fail(function (error) {
      console.log(error)
    })
}

$('#create-todo').on('submit', function (e) {
  e.preventDefault()
  const title = $('#title-create').val()
  const description = $('#desc-create').val()
  const due_date = $('#due-date').val()

  $.ajax(`${baseURL}/todos`, {
    method: 'POST',
    headers: {
      access_token: localStorage.getItem('access_token')
    },
    data: {
      title, description, due_date
    }
  })
    .done(function (response) {
      console.log(response)
      fetchTodos()
      showMainPage()
    })
    .fail(function (error) {
      console.log(error)
    })
    .always(function () {
      $('#create-todo').trigger('reset')
    })
})

$('#update-todo').on('submit', function (e) {
  e.preventDefault()
  showMainPage()
})

$('#editBtn').on('click', function () {
  showUpdate()
})

$(document).ready(function () {

  $('#login-from-form').on('click', function () {
    showLogin()
  })

  $('#reg-from-form').on('click', function () {
    showRegister()
  })

  $('#showAll').on('click', function () {
    showMainPage()
  })

  if (localStorage.getItem('access_token')) {
    fetchTodos()
    showMainPage()
  } else {
    showLogin()
  }

  $('#login-user').on('submit', function (e) {
    e.preventDefault()
    const email = $('#email-log').val()
    const password = $('#password-log').val()
    alert(`${email} ${password}`)
    $.ajax(`${baseURL}/login`, {
      method: 'POST',
      data: {
        email, password
      }
    })
      .done(function (response) {
        localStorage.setItem('access_token', response.access_token)
        fetchTodos()
        showMainPage()
      })
      .fail(function (err) {
        console.log(err)
      })
      .always(() => {
        $('#login-user').trigger('reset')
      })
  })

  $('#register-user').on('submit', function (e) {
    e.preventDefault()
    const email = $('#email-reg').val()
    const password = $('#pass-reg').val()
    $.ajax(`${baseURL}/register`, {
      method: 'POST',
      data: {
        email, password
      }
    })
      .done(function (response) {
        $('#login').show()
      })
      .fail(function (err) {
        console.log(err)
      })
      .always(() => {
        $('#register-user').trigger('reset')
      })
  })

  $('#logout').on('click', function () {
    localStorage.clear()
    showLogin()
  })

  $('#createLink').on('click', function () {
    showCreate()
  })

  $('#update-todo').on('submit', function (e) {
    const id = localStorage.getItem('todoId')
    e.preventDefault()
    $('#update-todo').trigger('reset')
    $.ajax(`${baseURL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        access_token: localStorage.getItem('access_token')
      },
      data: {
        title: $("#title").val(),
        description: $("#desc").val(),
        status: $(".changeStatus").val(),
        due_date: $("#due-date-edit").val()
      }
    })
      .done(function () {
        fetchTodos()
      })
      .fail(function (err) {
        throw err
      })
  })

  $.ajax(`${baseURL}/quote`, {
    method: 'GET',
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  })
    .done(function (response) {
      $('#greeting').append(`<h2>Welcome, <span>${response.email}</span></h2>
      <h5 class="font-italic">"${response.quote}"</h5>
      <p class="font-weight-bold">-${response.author}</p>`)
    })
    .fail(function () {
      $('#greeting').append(`<h2>Welcome</h2>
      <h5>Let's get productive today!</h5>`)
    })
})

function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token
  $.ajax({
    url: "http://localhost:3000/googleSignIn",
    method: "POST",
    headers: {
      id_token
    }
  }).done(response => {
    localStorage.setItem("token", response.token)
    showMainPage()
  }).catch(err => {
    console.log(err)
  })
}