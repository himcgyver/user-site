//jshint esversion:6
$(document).ready(function() {

//******************** COLLAPSIBLE VIEW/ADD USER MENU ****************
  var coll = document.getElementsByClassName("collapsible");

  for (var i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  }

//******************* VIEW/UPDATE/DELETE USER *********************
//************************** VIEW USER ****************************

  $("#find-user").on('click', function(e){
    e.preventDefault();
    // e.stopPropagation();
    $.ajax({
      url: '/users',
      type: 'POST',
      data: { firstname: $("#input-first").val(),
              lastname: $("#input-last").val(),
              address: $("#input-address").val(),
              username: $("#input-username").val(),
              password: $("#input-password").val(),
              zipcode: $("#zipcode").val(),
            }
    }).done(function(result) {
      var parag = document.getElementById("list-column");
      parag.innerHTML = result;

      let hidden = false;
      $("a").click(function() {

        let that = $(this);
        let query = "tr[name=" + this.className + "]";
        let anchor = that.attr('name');
        hidden = !hidden;

        //************************* UPDATE USER **************************

        if(anchor === 'update-anchor') {
          that.text("Close");
          if (hidden) {
            $(query).removeClass("hidden");
            $(query + " button").on('click', function() {
              e.preventDefault();
              $.ajax({
                url: '/users',
                type: 'PATCH',
                data: { firstname: $(query + " input")[0].value,
                        lastname: $(query + " input")[1].value,
                        address: $(query + " input")[2].value,
                        username: $(query + " input")[3].value,
                        password: $(query + " input")[4].value,
                        zipcode: $(query + " input")[5].value,
                        id: $(query + " input")[6].value
                      }
              }).done(function(updated) {
                alert("Record successfully updated! Search again to see changes.");
                $(query).addClass("hidden");
                that.text("Update");
                hidden = !hidden;
              });
            });
          } else {
            that.text("Update");
            $(query).addClass("hidden");
          }
        //*************************** DELETE USER **********************

        } else if (anchor === 'delete-anchor') {
            let answer = confirm('Are you sure want to delete user?');
            if (answer) {
              $.ajax({
                url: '/users',
                type: 'DELETE',
                data: { id: $(query + " input")[6].value }
              }).done(function() {
                alert("Successfully deleted User. Search again to see changes.");
              });
            }
        }
      });

      //**************** COLLAPSIBLE TABLE ROWS **********************

      var colls2 = document.getElementsByClassName("editable");
      for (var i = 0; i < colls2.length; i++) {
        colls2[i].addEventListener("click", function() {
          var content = this.nextElementSibling;
          if (content.style.maxHeight) {
            content.style.maxHeight = null;
          } else {
            content.style.maxHeight = content.scrollHeight + "px";
          }
        });
      }
  });
});

//******************* ADD USER ***********************
  $("#add-user").on('click', function(e) {
    e.preventDefault();
    $.ajax({
      url: '/adduser',
      type: 'POST',
      data: { firstname: $("#input-first2").val(),
              lastname: $("#input-last2").val(),
              address: $("#input-address2").val(),
              username: $("#input-username2").val(),
              password: $("#input-password2").val(),
              zipcode: $("#zipcode2").val()
            }
    }).done(function(newUser) {
      alert("New user added: \n" + newUser.firstname);
    });
  });
});
