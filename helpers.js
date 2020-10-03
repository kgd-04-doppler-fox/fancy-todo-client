const baseURL = 'http://localhost:3000'

function showRegister() {
  $("#register").show()
  $("#login").hide()
  $("#formTodo").hide()
  $("#main-page").hide()
}

function showLogin() {
  $("#login").show()
  $("#register").hide()
  $("#formTodo").hide()
  $("#main-page").hide()
}

function showForm() {
  $("#formTodo").show()
  $("#login").hide()
  $("#register").hide()
  $("#main-page").hide()
}

function showMainPage() {
  $("#login-google").hide()
  $("#main-page").show()
  $("#formTodo").hide()
  $("#login").hide()
  $("#register").hide()
}

function login() {
  const email = $("#email").val()
  const password = $("#password").val()
  // request server
  $.ajax({
    method: 'POST',
    url: `${baseURL}/login`,
    data: {
      email,
      password
    }
  })
    .done(respone => {
      localStorage.setItem("access_token", respone.access_token)
      showMainPage()
      fetchTodo()
    })
    .fail(err => {
      console.log(err)
    })
}

function register() {
  const email = $("#inputEmail").val()
  const password = $("#inputPassword").val()
  // request server
  $.ajax({
    method: 'POST',
    url: `${baseURL}/register`,
    data: {
      email,
      password
    }
  })
    .done(() => {
      showLogin()
    })
    .fail(err => {
      console.log(err)
    })
}

function logout() {
  localStorage.clear()
  showLogin()
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}

function fetchTodo() {
  $.ajax(`${baseURL}/todos`, {
    method: 'GET',
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  })
    .done(response => {
      console.log(response)

      $("#listTodo").empty()
      response.forEach(data => {
        if (!data.status) {
          let status = `<td>Not Done</td>`
        }
        $("#listTodo").append(`<tr>
            <td>${data.status}</td>
            <td>${data.title}</td>
            <td>${data.description}</td>
            <td>${data.due_date}</td>
            <td>
              <button type="button" class="btn btn-info" onclick="deleteTodo(${data.id})">Delete</button>
              <button type="button" class="btn btn-info" onclick="editTodo(${data.id}">Done</button>
            </td>
              
          </tr>`)
      })
    })
    .fail(err => {
      console.log(err)
    })
}

function deleteTodo(id) {
  $.ajax({
    url: `http://localhost:3000/todos/${id}`,
    method: "DELETE",
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  })
    .done(response => {
      console.log(response)
      fetchTodo()
    })
    .catch(err => {
      console.log(err, "error")
    })
}

function createTodo() {
  const title = $("#title").val()
  const description = $("#description").val()
  const due_date = $("#due_date").val()

  $.ajax({
    url: `http://localhost:3000/todos`,
    method: "POST",
    headers: {
      access_token: localStorage.getItem('access_token')
    },
    data: {
      title,
      description,
      due_date,
      status: false
    }
  })
    .done(response => {
      console.log(response)
      console.log(title, description, due_date, status)
      fetchTodo()
    })
    .catch(err => {
      console.log(err, "error")
    })
}

function randomCreate() {
  $.ajax({
    url: `http://localhost:3000/randomtodo`,
    method: "POST",
    headers: {
      access_token: localStorage.getItem('access_token')
    },
  })
    .done(response => {
      console.log(response)
      console.log(title, description, due_date, status)
      fetchTodo()
    })
    .catch(err => {
      console.log(err, "error")
    })
}

function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  console.log(id_token);
  $.ajax({
    url: "http://localhost:3000/googleSignIn",
    method: "POST",
    headers: {
      id_token: id_token
    }
  }).done(response => {
    localStorage.setItem("token", response.token)
    console.log(response.token);
    showMainPage()
  }).catch(err => {
    console.log(err, "error");
  })
}

function editTodo(id) {
  $.ajax({
    url: `http://localhost:3000/todos/${id}`,
    method: "PATCH",
    headers: {
      access_token: localStorage.getItem('access_token')
    },
    data:{
      status:true
    }
  })
    .done(response => {
      console.log(response)
      fetchTodo()
    })
    .catch(err => {
      console.log(err, "error")
    })
}
