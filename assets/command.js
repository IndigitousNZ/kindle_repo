$(document).ready(function(e) {
  alert("k");
    $( ".loginbtn" ).click(function() {
       var emailAddress = $('#emailAdd').val();
       var password = $('#password').val();
       if(emailAddress === '' || password === ''){
        return false;
    }
    // make a message Div to put errors
    if(!emailAddress.includes('@') && !emailAddress.includes('.')){
        return false;
    }

    if(password.length<7){
        return false;
    }

    $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/login',
        data: JSON.stringify({
           email: emailAddress,
           password: password
       }),
        contentType: "application/json",
        dataType:"json"
    });
    $('#emailAdd').val('');
    $('#password').val('');
   });


     $( "#signup" ).click(function(e) {
      alert("get here");
      location.href = "http://localhost:8080/";
       var emailAddress = $('#emailAdd').val();
       var password = $('#password').val();
       var firstname = $('#firstname').val();
       var lastname = $('#lastname').val();
       var username = $('#username').val();

       if(firstname=='' ){
      alert("no first name");

       }

       this.submit();
    
    $.ajax({
        method: 'POST',
        url: 'http://localhost:8080/signup',
        data: JSON.stringify({
           username:username,
           firstname:firstname,
           lastname:lastname,
           email: emailAddress,
           password: password
       }),
        contentType: "application/json",
        dataType:"json"
    });
  

   
    });
});
