$(function(){
    $('.login').modal();
    $('.register').modal();
    $('.add-modal').modal();
    $(".forgot-modal").modal();
    $(".settings").modal();

    $("#show-login-btn").click(function(){
        $('.login').modal('open');
    })
    $("#close-settings").click(function(){
        $('.settings').modal('close');
        resetsettings();
    })
    $("#settings-btn").click(function(){
        $('.settings').modal('open');
    })
    $("#add-modal-btn").click(function(){
        $('.add-modal').modal('open');
    })
    $("#show-register-btn").click(function(){
        resetlogin();
        $('.login').modal('close');
        $('.register').modal('open');
    })
    $("#back-login-btn").click(function(){
        resetregister();
        $('.register').modal('close');
        $('.login').modal('open');
    })
    $("#forgot-pass-show").click(function(){
        $('.login').modal('close');
        $('.forgot-modal').modal('open');
    })
    $("#back-forgot-btn").click(function(){
        $('.forgot-modal').modal('close');
        $('.login').modal('open');
    })
    
    $('.sidenav').sidenav();
    
    $("#logout").click(function(){
        $('.sidenav').sidenav('close');
    })
})
function resetregister(){
    document.getElementById("email-register").value = '';
    document.getElementById("password-register").value = '';
    document.getElementById("password2-register").value = '';
}
function resetlogin(){
    document.getElementById("email-login").value = '';
    document.getElementById("password-login").value = '';
}
function resetadd(){
    document.getElementById("text-task").value = '';
}
function resetsettings(){
    document.getElementById("email-new").value = '';
    document.getElementById("password-new").value = '';
    document.getElementById("password2-new").value = '';
    document.getElementById("current-password-new").value = '';
}
// auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
      db.collection('users').doc(firebase.auth().currentUser.uid).onSnapshot(snapshot => {
        resetlogin()
        $('.login').modal('close');
        $("#first").hide();
        $("#container").fadeIn();
        $("#email-menu-show").text(user.email)
        var data = snapshot.data();
        if(snapshot.exists){
            document.getElementById("tasks").innerHTML = data['task'];
        }
        $(document).on("click", ".remove-btn", function() {
            $(this).parents('li').remove();
            save()
        });
        $(".task").click(function(){
            $(this).toggleClass('checked');
            save();
        })
      }, err => console.log(err.message));
    } else {
        $('.login').modal('open');
    }
});
// register
$("#register-btn").click(function(){
    // get user info
    const email = document.getElementById("email-register").value;
    const password = document.getElementById("password-register").value;
    const password2 = document.getElementById("password2-register").value;
    if(password === password2){
        // sign up the user & add firestore data
        auth.createUserWithEmailAndPassword(email, password).catch(function(error) {      
            var errorMessageReg = error.message;
            document.getElementById("register-err").innerHTML = errorMessageReg;  
        }).then(cred => {
            return db.collection('users').doc(cred.user.uid).set({
                task: '<li class="collection-item task"><div>Example Task.<a id="remove-btn" href="#" class="secondary-content remove-btn"><i class="material-icons">delete_forever</i></a></div></li>'
            });
            
        }).then(() => {
            $('.register').modal('close');
            resetregister();
        });
    }
    else{
        document.getElementById("register-err").innerHTML = "Passwords are not identical!";
    }

})
// logout
$("#logout").click(function(){
    auth.signOut();
    $("#container").hide();
    $("#first").fadeIn();
})

//login
$("#login-btn").click(function(){
    // get user info
    const emaillogin = document.getElementById("email-login").value;
    const passwordlogin = document.getElementById("password-login").value;

    // log the user in
    auth.signInWithEmailAndPassword(emaillogin, passwordlogin).catch(function(error) {
        var errorMessage = error.message;
        document.getElementById("login-err").innerHTML = errorMessage;
    });
})
//add
$("#add-btn").click(function(){
    var taskinpt = document.getElementById("text-task").value;
    if(taskinpt.length>0){
        $("#tasks").append('<li class="collection-item task"><div>' + taskinpt + '<a id="remove-btn" href="#" class="secondary-content remove-btn"><i class="material-icons">delete_forever</i></a></div></li>');
        $('.add-modal').modal('close');
        document.getElementById("add-err").innerHTML = "";
        resetadd();
        save() ;
    }
    else{
        document.getElementById("add-err").innerHTML = "Error!";
    }

})
$("#back-add-btn").click(function(){
    resetadd()
})
function save(){
    var elements = $("#tasks").html();
    db.collection('users').doc(firebase.auth().currentUser.uid).update({
        task: elements
    })
}
//forgot
$("#forgot-btn").click(function(){
    var auth = firebase.auth();
    var emailAddress = document.getElementById("email-forgot-pass").value;

    auth.sendPasswordResetEmail(emailAddress).then(function() {
        $("#forgot-btn").fadeOut();
        $("#forgot-inpts").slideUp();
        document.getElementById("forgot-err").innerHTML = "Sent!";
    }).catch(function(error) {
        document.getElementById("forgot-err").innerHTML = "Error!";
    });
})