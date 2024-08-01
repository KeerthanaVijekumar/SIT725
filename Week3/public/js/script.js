const clickMe = () => {
    $.ajax({url: "http://localhost:3040/addTwoNumber?n1=5&n2=7", success: function(result){
        console.log(result);
        alert("The result is " + result.data)
      }});
    //alert("Thanks for clicking me. Hope you have a nice day!")
}
$(document).ready(function () {
    // $('.materialboxed').materialbox();
    //$ interface to access jquery and # refers to an id
    $('#clickMeButton').click(() => {
        clickMe();
    })
});