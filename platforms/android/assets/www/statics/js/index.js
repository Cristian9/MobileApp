document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

    window.ga.startTrackerWithId('UA-88008644-1', 10);
    window.ga.trackView('menu');
    
    app.getTokenCsrf();
    
    database = window.sqlitePlugin.openDatabase({name: 'preguntados.db', location: 'default'});

    if (database != null) {
        database.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS userlogued (usuario_id, firstname, lastname, username, nikname, email, image_avatar)');
        }, function (error) {
            alert('Transaction ERROR: ' + error.message);
        }, function () {
            checkExistsUser();
        });
    } else {
        navigator.notification.alert('Hubo un problema con el usuario', null, 'DesafíoUTP');
    }

    //app.viewLogin();

    $('#txtuser').focus(function () {
        document.getElementById('errorDiv').classList.remove('error_active');
    });

    document.getElementById('btn-login').addEventListener("touchstart", function () {
        app.login();
    });

    $('#txtpassword').key("enter", function () {
        app.login();
    })

    document.addEventListener("backbutton", app.closeApp, false);
}

function checkExistsUser() {
    var exists = false;
    database.transaction(function (tx) {
        tx.executeSql("SELECT * FROM userlogued", [], function (tx, result) {
            if (result.rows.length > 0) {
                for (session in result.rows.item(0)) {
                    sessionStorage.setItem(session, result.rows.item(0)[session]);
                }
                exists = true;
            }
        });
    }, function (error) {
        console.log(error);
    }, function () {
        (exists) ? app.gotoMainmenu() : app.viewLogin();
    });
}
