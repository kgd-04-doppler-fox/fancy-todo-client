const baseURL = `http://localhost:3000`

check()

function fetchTodos() { 

    $.ajax(`${baseURL}/todos`, {
        method: 'GET',
        headers: {
            access_token: localStorage.getItem("access_token")
        }
    })
        .done(response => {
            $("#todoList").empty()
            response.todo.forEach(e => {
                $("#todoList").append(`
                <div class="card-header"><h4>${e.title}</h4></div>
                <div class="card-body text-center">
                <button type="button" class="btn btn-primary" onclick="setDetail('${e.id}', '${e.title}', '${e.description}', '${e.status}', '${e.due_date}')">Detail</button>
                </div>
                `)
            });
        })
        .fail(err => {
            console.log(err)
        })
}

function setDetail(id, title, description, status, due_date) {
    if (JSON.parse(status)) {
        status = 'Done'
    } else {
        status = 'Undone'
    }
    due_date = moment(due_date).format("YYYY-MM-DD")
    $('#detailTodo').html(`
    <div class="card-body">
        <p class="card-text">Title: ${title}</p>
        <p class="card-text">Description: ${description}</p>
        <p class="card-text">Status: ${status}</p>
        <p class="card-text">Due Date: ${due_date}</p>
        <button type="button" class="btn btn-primary" onclick="deleteTodo('${id}')">Delete</button>
        <button type="button" class="btn btn-primary" onclick="updateActivity('${id}')">Complete Status</button>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#updateModal">Update</button>
    </div>
    <div class="modal fade" id="updateModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
        <div class="modal-header">
        <h5 class="modal-title text-body" id="exampleModalLabel">Update</h5>
        <button type="button" class="close" id="closeUpdate" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body">
    <div class="container">
      <form id="updateForm">
          <div class="form-group">
            <label class="text-body">Title:</label>
            <input type="text" class="form-control" id="titleUpdate" placeholder="Title" value="${title}">
          </div>
          <div class="form-group">
            <label class="text-body">Description:</label>
            <input type="text" class="form-control" id="descriptionUpdate" placeholder="Description" value="${description}">
          </div>
          <div class="form-group">
            <label class="text-body">Status:</label>
            <select class="custom-select" id="statusUpdate">
              <option value="true">Done</option>
              <option value="false">Undone</option>
            </select>
          </div>
          <div class="form-group">
            <label class="text-body">Due Date:</label>
            <input type="date" class="form-control" id="dueDateUpdate" placeholder="Due_Date" value="${due_date}">
          </div>
          <div class="text-center">
            <button type="button" id="submitButton" class="btn btn-primary" onclick="updateTodo('${id}')">Submit</button>
          </div>
        </form>
      </div>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    </div>
    </div>
    </div>
    </div>
    `)
}

function deleteTodo(id) {
    $.ajax(`${baseURL}/todos/${id}`, {
        method: 'DELETE',
        headers: {
            access_token: localStorage.getItem("access_token")
        }
    })
        .done(response => {
            fetchTodos()
            setTimeout(function(){ $("#detailTodo").empty() }, 500);
        })
        .fail(err => {
            console.log(err)
        })
}

function updateActivity(id){ // better than nothing
    
    $.ajax(`${baseURL}/todos/${id}`, {
        method: 'PATCH',
        data : {
            status: true 
        },
        headers: {
            access_token: localStorage.getItem("access_token")
        }
    })
        .done(response => {
            fetchTodos()
            setTimeout(function(){ $("#detailTodo").empty() }, 500);
        })
        .fail(err => {
            console.log(err)
        })

}

function updateTodo (id){
    let title = $("#titleUpdate").val()
    let description = $("#descriptionUpdate").val()
    let status = $("#statusUpdate").val()
    let due_date = $("#dueDateUpdate").val()
 
    $.ajax(`${baseURL}/todos/${id}`, {
        method: 'PUT',
        data : {
            title,
            description,
            status,
            due_date
        },
        headers: {
            access_token: localStorage.getItem("access_token")
        }
    })
        .done(response => {
            $("#closeUpdate").trigger("click")
            setTimeout(()=>{
                setDetail(response.id, response.title, response.description, response.status, response.due_date) 
            }, 500)
            fetchTodos()
        })
        .fail(err => {
            console.log(err)
        })
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token
    $.ajax({
        url: `${baseURL}/users/googleSignIn`,
        method: "POST",
        headers: {
            id_token: id_token
        }
    })
        .done(response => {
            localStorage.setItem("access_token", response.token)
            $('.outside').hide()
            $('.inside').show()
            $('#closeSignin').trigger('click')
        })

        .catch(err => {
            console.log(err, "error")
        })
}

function check (){
    if (localStorage.getItem(`access_token`)) {
        $('.outside').hide()
        $('.inside').show()
        fetchTodos()
    } else {
        $('.outside').show()
        $('.inside').hide()
    }
}

function feature(){
    $.ajax(`${baseURL}/features`, {
        method: 'GET'
    })
    .done(response => {
        $(".boredResult").append(`
        <div class="card-header"><h4>${response}</h4></div>`)
    })
    .fail(err => {
        console.log(err)
    })
    .always(_=>{
        setTimeout(function(){ $(".boredResult").empty() }, 1500);
    })
}

$(document).ready(function () {
    check() 

    $("#signinForm").on("submit", function (e) {
        e.preventDefault()
        const email = $("#emailSignin").val()
        const password = $("#passwordSignin").val()
        //disini request server
        $.ajax(`${baseURL}/users`, {
            method: 'POST',
            data: {
                email,
                password
            }
        })
            .done(response => {
                localStorage.setItem("access_token", response.access_token)
                check ()
                fetchTodos()
                $("#signinForm").trigger("reset")
                $('#closeSignin').trigger('click')
            })
            .fail(err => {
                console.log(err)
            })
    })

    $("#logout").on("click", function () {
        $(".inside").hide()
        $(".outside").show()
        localStorage.clear()
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
        // localStorage.removeItem("access_token")
    })

    $("#signupForm").on("submit", (e)=>{
        e.preventDefault()
        let email = $("#emailSignup").val()
        let password = $("#passwordSignup").val()
        //request server
        $.ajax(`${baseURL}/users/register`, {
            method: 'POST',
            data: {
                email,
                password
            }
        })
            .done(response => {
                $("#signupForm").trigger("reset")
                $("#closeSignup").trigger("click")
            })
            .fail(err => {
                $("#alertEmailSignUp").append(`<p>${JSON.stringify(err.responseJSON.msg)}</p>`)
            })
    })

    $("#createForm").on("submit", (e)=>{
        e.preventDefault()
        let title = $("#titleCreate").val().trim()
        let description = $("#descriptionCreate").val().trim()
        let status = $("#statusCreate").val().trim()
        let due_date = $("#dateCreate").val().trim() 

        //request server
        $.ajax(`${baseURL}/todos`, {
            method: 'POST',
            data: {
                title,
                description,
                status,
                due_date
            },
            headers : {
                access_token : localStorage.getItem("access_token")
            }
        })
            .done(response => {
                fetchTodos()
                $("#closeCreate").trigger("click")
            })
            .fail(err => {
                $("#alertDate").append(`<p>${JSON.stringify(err.responseJSON.msg)}</p>`)
            })
            .always(_=>{
                $("#createForm").trigger("reset")
            })
    })


})
