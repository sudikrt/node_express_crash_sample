$(document).ready (function () {
    $('.deleteUser').on ('click', deleteUser);
});

function deleteUser () {
    let confirmation = confirm ('Are you sure wnna to delete ?');
    
    if (confirmation) {
        $.ajax ({
            type : 'DELETE',
            url : '/users/delete/' + $(this).data('id'),
            success: function( response ) {
                console.log ('Response'  + response );
            }
        }).done (function (response) {
            window.location = '/';
        });
    } else {
        return false;
    }
}