// Initialize your app
var myApp = new Framework7({
    cache: false,
    modalTitle: "Desafío UTP",
    animateNavBackIcon: true,
    // Enable templates auto precompilation
    precompileTemplates: true,
    // Enabled pages rendering using Template7
    swipeBackPage: false,
    swipeBackPageThreshold: 1,
    swipePanel: "left",
    swipePanelCloseOpposite: true,
    swipePanelActiveArea: 3,
    pushState: true,
    pushStateRoot: undefined,
    pushStateNoAnimation: false,
    pushStateSeparator: '#!/',
    template7Pages: true
});

var $$ = Dom7;

var database = null;
var loading = false;
//var phpApiMgr = "http://desafioutp.dsakiya.com";
var phpApiMgr = "http://10.30.15.218/CodeApiMobile/public";

var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: false
});

var app = (function () {
    new FastClick(document.body);

    var numberPage = 1,
        timerInicial = 30,
        dataQuestion = "",
        pageDinamic,
        totalQuestions,
        initNumberQuestion = 0,
        initPuntajeQuestion = 0,
        myScroll,
        Handle_Mi_Timer = null,
        serve_gone_away = "Se ha perdido conexión con el servidor, verifica tu conexión a Internet o intentalo más tarde.",
        wrong_user = "El código no existe, intenta con un usuario válido.",
        Contador = 30,
        TmpLastRecord = "",
        mediaAnswer,
        myScroll,
        mediaTimer,
        handlerReto = false;

    String.prototype.ucfirst = function () {
        return this.charAt(0).toUpperCase() + this.substr(1);
    }

    function StyleApp() {
        var heightCuerpo = window.innerHeight - 246;//92/*46*/;
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.auxCSS {' +
                'position:absolute; ' +
                'border-top: solid 1px #9c9c9d;' +
                ' z-index:2; left:0; top:60px; ' +
                'width:100%; height: ' + heightCuerpo + 'px; overflow:auto;}';

        $('.pages_maincontent').css({
            'height': heightCuerpo
        });

        document.getElementsByTagName('head')[0].appendChild(style);
    }

    function InitmenuSlide() {
        StyleApp();
        $('#history-wrapper').addClass('auxCSS');

        // Creamos los 2 scroll mediante el plugin iscroll, uno para el menœ principal y otro para el cuerpo
        myScroll = new iScroll('history-wrapper', {hideScrollbar: true});
    }

    function viewLogin() {
        myApp.loginScreen();
    }

    function renderDefaultList(data) {
        var lista = '';

        for (var i = 0; i < data.length; i++) {
            lista += '<li><a href="#" class="item item-icon-left icon-book" alt="' + data[i].id + '">&nbsp;&nbsp;';
            lista += data[i].description.toLowerCase().ucfirst();
            lista += '</a></li>';
        }

        return lista;
    }

    function renderListRetosEnviados(data) {
        var html = "";
        if (data == "")
            return false;

        html = data.map(function (e) {
            return ('<li class="item-content">' +
                    '<div class="item-media"><img src="statics/img/avatar/' + e.avatar + '.png" width="40" /></div>' +
                    '<div class="item-inner" alt="' + e.id_reto + '">' +
                    '<div class="item-title">' + e.nikname + '<div class="item-after-down">Pendiente</div></div>' +
                    '<div class="item-title">' + e.para_ganar + '<div class="item-after-down">Para ganar</div></div>' +
                    '</div>' +
                    '</li>');
        }).join(" ");

        return html;
    }

    function renderListRetosRecibidos(data) {
        var html = "";
        if (data == "")
            return false;

        html = data.map(function (e) {
            var params_alt = e.id_reto + '|' + e.unidad_id + '|' + e.curso_id + '|' + e.id_temageneral + '|' + e.nikname + '|' + e.avatar;
            return ('<li class="item-content">' +
                    '<div class="item-media"><img src="statics/img/avatar/' + e.avatar + '.png" width="40" /></div>' +
                    '<div class="item-inner"  alt="' + params_alt + '">' +
                    '<div class="item-title">' + e.nikname + '<div class="item-after-down">Pendiente</div></div>' +
                    '<div class="item-title">' + e.para_perder + '<div class="item-after-down">Para jugar</div></div>' +
                    '</div>' +
                    '</li>');
        }).join(" ");

        return html;
    }

    function renderListRetosHistorial(data) {
        var html = "";
        if (data == "")
            return false;

        html = data.map(function (e) {

            var color = (e.resultado == "Has perdido") ? "red" : "green";

            return ('<li class="item-content">' +
                    '<div class="item-media"><img src="statics/img/avatar/' + e.image_avatar + '.png" width="40" /></div>' +
                    '<div class="item-inner">' +
                    '<div class="item-title">' + e.nikname +
                    '<div class="item-after-down" style="color:' + color + '">' + e.resultado + ' (' + e.origen + ')</div>' +
                    '</div>' +
                    '<div class="item-title">' +
                    '<button class="button button-fill btnHistorial" alt="' + e.id_reto + '">Ver detalle</button>' +
                    '</div>' +
                    '</div>' +
                    '</li>');
        }).join(" ");

        return html;
    }

    function renderListRetosDetalle(data) {
        var html = "";
        if (data == "")
            return false;

        html = data.map(function (e) {
            return ('<li class="item-content">' +
                    '<div class="item-media"><img src="statics/img/avatar/' + e.myAvatar + '.png" width="40" /></div>' +
                    '<div class="item-inner">' +
                    '<div class="item-title mb-b">' + e.myNik +
                    '</div>' +
                    '<div class="item-title" style="text-align: center;">' +
                    '<div class="item-after-point mb-b">' + e.mis_correctas + '</div>' +
                    '<div class="item-after-down">' + e.miTiempo + '</div>' +
                    '</div>' +
                    '</div>' +
                    '</li>' +
                    '<li class="item-content">' +
                    '<div class="item-media"><img src="statics/img/avatar/' + e.image_avatar + '.png" width="40" /></div>' +
                    '<div class="item-inner">' +
                    '<div class="item-title mb-b">' + e.nikname +
                    '</div>' +
                    '<div class="item-title" style="text-align: center;">' +
                    '<div class="item-after-point mb-b">' + e.correctas_rival + '</div>' +
                    '<div class="item-after-down">' + e.tiempoRival + '</div>' +
                    '</div>' +
                    '</div>' +
                    '</li>');
        }).join(" ");

        return html;
    }


    function renderListUsuarios(data) {
        var html = "";

        html = data.map(function (item) {
            return ('<li class="item-content">' +
                    '<div class="item-media"><img src="statics/img/avatar/' + item.image_avatar + '.png" width="40" /></div>' +
                    '<div class="item-inner">' +
                    '<div class="item-title">' + item.uname +
                    '<div class="item-after-down">' + item.usuario + '</div></div>' +
                    '<div class="item-after">' +
                    '<button class="button button-fill btn-retar" alt="' + item.username + '">Retar</button>' +
                    '</div>' +
                    '</div>' +
                    '</li>');
        }).join(" ");

        return html;
    }

    function renderUsuariosRanking(data) {
        var html = "";

        html = data.map(function (item) {
            return ('<li class="item-content">' +
                    '<div class="item-media"><img src="statics/img/avatar/' + item.image_avatar + '.png" width="40" /></div>' +
                    '<div class="item-inner">' +
                    '<div class="item-title">' + item.nikname +
                    '<div class="item-after-down">' + item.tiempo_jugado + '</div></div>' +
                    '<div class="item-after">' + item.puntaje + ' pts</div>' +
                    '</div>' +
                    '</li>');
        }).join(" ");

        return html;
    }

    function renderResumenReto(data) {
        var html = data.Resumen.map(function (item) {
            return('<div class="wrapper-resumen">' +
                    '<h2>' + item.para_ganar + '</h2>' +
                    '<div class="row">' +
                    '<div class="col-33">' +
                    '<div class="item-media"><img src="statics/img/avatar/' + item.myAvatar + '.png" width="40" /></div>' +
                    '<div class="item-title">' + item.nikRetador + "</div>" +
                    '</div>' +
                    '<div class="col-33" style="font-size: 2em; padding-top: 3%;">' + item.correctas_retador + '</div>' +
                    '<div class="col-33" style="font-size: 1.3em; padding-top: 3%;">' + item.tiempo_juego_retador + '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="wrapper-resumen">' +
                    '<div class="row">' +
                    '<div class="col-33">' +
                    '<div class="item-media"><img src="statics/img/avatar/' + item.avatarRetado + '.png" width="40" /></div>' +
                    '<div class="item-title">' + item.nikRetado + "</div>" +
                    '</div>' +
                    '<div class="col-33" style="font-size: 2em; padding-top: 3%;">' + item.correctas_retado + '</div>' +
                    '<div class="col-33" style="font-size: 1.3em; padding-top: 3%;">' + item.tiempo_juego_retado + '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="wrapper-resumen">' +
                    '<a href="views/mainMenu/menu.html" class="button button-round active">Continuar</a>' +
                    '</div>');
        }).join(" ");

        return html;
    }

    function renderImageAvatar() {
        var html = "<ul>";
        for (var i = 1; i <= 16; i++) {
            html += '<li style="width:50%; float:left; padding:0px;">' +
                    '<label class="label-radio item-content">' +
                    '<input type="radio" name="my-avatar" value="Avatar' + i + '" class="avatarImage">' +
                    '<div class="item-inner">' +
                    '<div class="item-title"><img src="statics/img/avatar/Avatar' + i + '.png" class="img_avatar"></div>' +
                    '</div>' +
                    '<label>' +
                    '<li>'
        }
        html += '</ul>';

        return html;
    }

    function getDataApiJSON(option) {

        var href = option.href,
            func = option.func,
            elem = option.elem,
            args = option.args || "";


        StyleApp();

        $('#wrapper, #wrapper-unidad').addClass('auxCSS');

        myApp.showPreloader('Espere, por favor...');

        $.ajax({
            url : phpApiMgr + "/" + href + "/",
            type : 'GET',
            dataType : 'json',
            data : args
        })
        .done(function (data) {

            myApp.hidePreloader();

            if (data[0] == null) {
                $(elem).html($("<center style='padding:11%; color:#B33831; font-size:15px; font-weight:bold;'></center>")
                        .append('No hay registros para mostrar'));

                return false;
            }

            var list = eval(func + "(data)");

            $(elem).html(list);
        });

        new FastClick(document.body);
    }

    function getDeviceIdentifier() {
        var push = PushNotification.init({
            "android": {
                "senderID": "374982523203"
            },
            "ios": {
                "alert": "true",
                "badge": "true",
                "sound": "true"
            },
            "windows": {}
        });

        push.on("registration", function (data) {
            sessionStorage.setItem('identifier', data.registrationId);
            $.ajax({
                url : phpApiMgr + "/registerDevice/",
                type : 'POST',
                data : {
                    identifier : data.registrationId,
                    userid : sessionStorage.getItem('usuario_id'),
                    'csrf_name' : sessionStorage.getItem('csrf_name'),
                    'csrf_value' : sessionStorage.getItem('csrf_value')
                }
            })
            .done(function (data) {
                console.log(data);
            });
        });

        push.on("error", function (e) {
            console.log(e.message);
        });
    }

    function registerUserAndPassword() {
        var uid = sessionStorage.getItem('usuario_id');
        var name = sessionStorage.getItem('firstname');
        var last = sessionStorage.getItem('lastname');
        var uname = sessionStorage.getItem('username');
        var nik = sessionStorage.getItem('nikname');
        var email = sessionStorage.getItem('email');
        var img = sessionStorage.getItem('image_avatar');

        database.transaction(function (tx) {
            tx.executeSql('INSERT INTO userlogued VALUES (?,?,?,?,?,?,?)', [uid, name, last, uname, nik, email, img]);
        }, function (error) {
            console.log(error)
        }, function () {
            console.log('ok');
        });
    }

    function login() {

        myApp.showIndicator();

        $.post(phpApiMgr + '/login/', {
            user: $.trim($('#txtuser').val()),
            pass: $.trim($('#txtpassword').val()),
            'csrf_name' : sessionStorage.getItem('csrf_name'),
            'csrf_value' : sessionStorage.getItem('csrf_value')
        })
        .done(function (data) {

            myApp.hideIndicator();
            var data = eval(data);
            if (!data) {
                $('.error_message span').html(wrong_user);
                document.getElementById('errorDiv').classList.add('error_active');

                $('#txtuser, #txtpassword').val("");
            } else {

                for (session in data[0]) {
                    sessionStorage.setItem(session, data[0][session]);
                }

                getDeviceIdentifier();


                registerUserAndPassword();

                myApp.closeModal('.login-screen');
                gotoMainmenu();
            }
        })
        .fail(function (e) {
            console.log(e);
            if (e.status == 0) {
                myApp.hideIndicator();
                $('.error_message span').html(serve_gone_away);
                document.getElementById('errorDiv').classList.add('error_active');

                $('#txtuser, #txtpassword').val("");
            }
        });
    }

    function getPhoneGapPath() {

        var path = window.location.pathname;
        path = path.substr(path, path.length - 10);
        return 'file://' + path;

    }

    function fillButton(obj, n, pts, idrpta, idprta) {
        if (sessionStorage.getItem('handled') != 'triggered') {
            clearInterval(Handle_Mi_Timer);

            var correct = $(obj).attr('alt');

            mediaTimer.stop();

            $('.contenedor_question').addClass('disablediv');

            if (correct == '1') {

                mediaAnswer = new Media(getPhoneGapPath() + 'sounds/acertar.mp3');

                $(obj).removeClass('active active-state').addClass('button-fill color-green');

            } else {
                mediaAnswer = new Media(getPhoneGapPath() + 'sounds/desacierto.mp3');


                $(obj).removeClass('active active-state').addClass('button-fill color-red');

                $('.button').each(function () {
                    if ($(this).attr('alt') == 1) {
                        $(this).removeClass('active active-state').addClass('button-fill color-green');
                    }
                });
            }

            sessionStorage.setItem('handled', 'triggered');

            mediaAnswer.play();

            nextQuestion(n, 1200, pts, idrpta, idprta);
        }

    }

    function nextQuestion(n, delay, pts, idrspta, idprta) {
        $('.siguiente_' + (n - 1)).delay(delay).animate({'left': '-100%'}, function () {

            initPuntajeQuestion += pts;

            $.ajax({
                url : phpApiMgr + "/save_selected_rpta/",
                type : 'POST',
                data : {
                    reto_id: sessionStorage.getItem('lastID'),
                    username: sessionStorage.getItem('username'),
                    courseid: sessionStorage.getItem('courseId') || "",
                    unidadid: sessionStorage.getItem('unidadId') || "",
                    generalt: sessionStorage.getItem('idtemageneral') || "",
                    pregunta: idprta,
                    respuest: idrspta,
                    'csrf_name' : sessionStorage.getItem('csrf_name'),
                    'csrf_value' : sessionStorage.getItem('csrf_value')
                }
            })
            .done(function(data){
                console.log(data);
            })
            .fail(function(error){
                alert(error['responseText']);
            })

            $('.questions-content').empty().append(app.listQuestions(n));
            $('.siguiente_' + n).removeClass('innactive').animate({'right': '0'});
        });
    }

    function PreloadQuestions() {
        initNumberQuestion = 0;
        initPuntajeQuestion = 0;

        myApp.showPreloader('Cargando preguntas, un momento...');

        $.ajax({
            url : phpApiMgr + '/getQuestions/',
            type : 'GET',
            dataType : 'json',
            data : {
                course: sessionStorage.getItem("courseId"),
                unidad: sessionStorage.getItem("unidadId")
            }
        })
        .done(function (data) {
            
            dataQuestion = data;
            totalQuestions = dataQuestion.length;

            myApp.hidePreloader();

            $('.questions-content').append(listQuestions(0));
        });
    }

    function reset_timer() {
        Contador = 30;
        $('.timer').html(Contador);
        mediaTimer = new Media(getPhoneGapPath() + 'sounds/time.mp3');

        Handle_Mi_Timer = window.setInterval(function () {
            Contador--;

            if (Contador == 10) {
                mediaTimer.play();
            }

            if (Contador == 0) {
                nextQuestion(initNumberQuestion, 100, 0, 0, 0);
                clearInterval(Handle_Mi_Timer);
                mediaTimer.stop();
            }

            $('#timer').html("00:" + Contador);

        }, 1000);
    }

    function listQuestions(index) {

        sessionStorage.setItem('handled', null);

        var correct,
            respuesta,
            puntaje,
            Quiz = "";

        initNumberQuestion += 1;

        if (index == '0') {
            var visible = 'active';
            var rightS = '0';
        } else {
            var visible = 'innactive';
            var rightS = '-200%';
        }

        if (typeof totalQuestions == "undefined" || totalQuestions < 1) {
            sessionStorage.setItem('error', 1);

            mainView.router.loadPage("views/mainMenu/menu.html");
        } else {

            getTokenCsrf();

            if (index < totalQuestions) {

                if(!handlerReto) {
                    saveRetos();

                    handlerReto = true;
                }

                reset_timer();

                idPregunta = dataQuestion[index].id_preguntas;
                $('#stage').html((index + 1) + " / " + totalQuestions);
                Quiz = "<div class='siguiente_" + index + " contenedor_question " + visible + "' style='right:" + rightS + "'>" +
                        "<div class='wrapper-questions'>" +
                        "<div class='scroller'>" +
                        "<div class='content-block questions' style='font-size: 20px; font-weight:bolder;'>" +
                        +(index + 1) + '.- ' + dataQuestion[index].preguntas +
                        "</div>" +
                        "<div class='content-block answer'>";

                for (var j = 0; j < dataQuestion[index].Respuesta.length; j++) {
                    correct = dataQuestion[index].Respuesta[j].is_correct;
                    respuesta = dataQuestion[index].Respuesta[j].respuesta;
                    puntaje = dataQuestion[index].Respuesta[j].puntaje;
                    idrspta = dataQuestion[index].Respuesta[j].id_respuesta;

                    Quiz += "<p>" +
                            "<a onclick='app.fillButton(this, " + initNumberQuestion + ", " + puntaje + ", " + idrspta + ", " + idPregunta + ")'" +
                            " class='button button-round button-fill' alt='" + correct + "'>" + respuesta + "</a>" +
                            "</p>";
                }

                Quiz += "</div></div></div></div>";
            } else {
                clearInterval(Handle_Mi_Timer);
                Quiz = "<h2 style='color:#74569d; text-align:center;'>Evaluando puntaje...</h2>";
                updRetos();
            }
        }

        return Quiz;
    }

    function saveRetos() {
        $.ajax({
            url : phpApiMgr + '/save_retos/',
            type : 'POST',
            data : {
                id_reto: sessionStorage.getItem('lastID') || null,
                user_retador: sessionStorage.getItem('username'),
                unidad_id: sessionStorage.getItem('unidadId') || "",
                courseId: sessionStorage.getItem('courseId') || "",
                user_retado: sessionStorage.getItem('userRetado') || "",
                id_temageneral: sessionStorage.getItem('themeGeneral') || "",
                'csrf_name' : sessionStorage.getItem('csrf_name'),
                'csrf_value' : sessionStorage.getItem('csrf_value')
            }
            
        })
        .done(function (data) {
            if (data != "") {
                sessionStorage.setItem('lastID', data);
            }
        });
    }

    function dateRetoAceptado(id) {
        $.ajax({
            url : phpApiMgr + '/updateDateReto/',
            type : 'POST',
            data : {
                idReto: id,
                username: sessionStorage.getItem('username'),
                'csrf_name' : sessionStorage.getItem('csrf_name'),
                'csrf_value' : sessionStorage.getItem('csrf_value')
            }
            
        })
        .done(function (data) {
            console.log(data);
        });
    }

    function getResumenReto() {
        $.ajax({
            url : phpApiMgr + "/get_resumen_juego/",
            type : 'GET',
            dataType : 'json',
            data : {
                id: sessionStorage.getItem('lastID') || TmpLastRecord
            }
            
        })
        .done(function (e) {
            if (sessionStorage.getItem('lastID') != "") {
                TmpLastRecord = sessionStorage.getItem('lastID');
            }

            sessionStorage.removeItem('lastID');
            var resumen = renderResumenReto(e);
            $('.resumen-questions').html(resumen);
        });
    }

    function updRetos(cancelled) {

        myApp.showPreloader('Espere, por favor...');

        $.ajax({
            url : phpApiMgr + '/update_retos/',
            type : 'POST',
            data : {
                countCorrect: initPuntajeQuestion,
                idQuestion: sessionStorage.getItem('lastID'),
                username: sessionStorage.getItem('username'),
                cancelled: cancelled || "",
                'csrf_name' : sessionStorage.getItem('csrf_name'),
                'csrf_value' : sessionStorage.getItem('csrf_value')
            }
            
        })
        .done(function (data) {
            sessionStorage.setItem('handled', null);

            if (typeof cancelled == "undefined") {
                $.post(phpApiMgr + '/sendNotification/', {
                    toUser: sessionStorage.getItem('userRetado'),
                    fromUser: sessionStorage.getItem('nikname'),
                    'csrf_name' : sessionStorage.getItem('csrf_name'),
                    'csrf_value' : sessionStorage.getItem('csrf_value')
                })
                .done(function () {
                    myApp.hidePreloader();
                    mainView.router.loadPage("views/misRetos/misRetosResumen.html");
                })
                .fail(function () {
                    myApp.hidePreloader();
                    myApp.alert("Notificación no enviada");
                })
                .always(function () {
                    myApp.hidePreloader();
                    mainView.router.loadPage("views/misRetos/misRetosResumen.html");
                });
            } else {
                myApp.hidePreloader();
                sessionStorage.removeItem('lastID');
            }
        });
    }

    function getRetos(get, id, page) {

        if(get != 'history')
            myApp.showPreloader('Espere, por favor...');

        $.ajax({
            url : phpApiMgr + '/list-retos/',
            data : {
                args: sessionStorage.getItem("username"),
                get: get,
                id: id || "",
                page : page || 0
            },
            type : 'GET',
            dataType : 'json'
            
        })
        .done(function (data) {
            myApp.hidePreloader();

            loading = false;

            $('.infinite-scroll-preloader').addClass('innactive');

            if (typeof data.Detalle == "undefined") {

                if(typeof data.Enviado == "undefined" && typeof data.Recibido == "undefined") {

                    if(data.Historial[0] == null) {

                        $('.error_message span').html('No hay más registros');
                        document.getElementById('errorDiv').classList.add('error_active');

                        setTimeout(function(){
                            document.getElementById('errorDiv').classList.remove('error_active');
                        }, 3000);

                        $('.infinite-scroll-preloader').remove();

                        loading = true;
                    }

                    var htmlHistorial = renderListRetosHistorial(data.Historial);
                    $('#history').append(htmlHistorial);
                } else {
                    var htmlEnviado = renderListRetosEnviados(data.Enviado);
                    var htmlRecibido = renderListRetosRecibidos(data.Recibido);
                    var htmlHistorial = renderListRetosHistorial(data.Historial);

                    $('#send').html(htmlEnviado);
                    $('#receive').html(htmlRecibido);
                    $('#history').html(htmlHistorial);
                }
            } else {
                var htmlDetalle = renderListRetosDetalle(data.Detalle);

                var rsimage = new Image();
                rsimage.setAttribute('style', 'width:100%');

                if (data.Detalle[0].resultado == 'Has ganado') {
                    rsimage.src = 'statics/img/has_ganado.png';
                } else {
                    rsimage.src = 'statics/img/has_perdido.png'
                }

                rsimage.onload = function () {
                    $('.detail-title').html(rsimage);
                }

                //$('.content-block-title').html(data.Detalle[0].resultado);
                $('#detalle').html(htmlDetalle);
            }
        });
    }

    function searchUser(keyword) {

        $('.page_title').html('<div style="display: inline;"><i class="icon-flag-checkered mb-b">' +
                '</i> Retar a un amigo</div><span class="preloader" style="float: right;"></span>');

        $.ajax({
            url : phpApiMgr + '/list-users/',
            data : {
                username: sessionStorage.getItem("username"),
                keywords: $.trim(keyword)
            },
            type : 'GET',
            dataType : 'json'
            
        })
        .done(function (data) {
            $('.page_title').find('span').remove();
            $('#list-users').html(renderListUsuarios(data));
        });
    }

    function getUserProfile(uid) {
        $.ajax({
            url : phpApiMgr + '/get_profile/',
            data : {
                username: uid || sessionStorage.getItem('username')
            },
            type : 'GET',
            dataType : 'json'
            
        })
        .done(function (data) {
            $('#ganadas').text(data.Ganados[0].ganado);
            $('#perdidas').text(data.Perdidos[0].perdido);
            $('#punto').text(data.Puntaje[0].total + ' Puntos');
        });

        database.transaction(function (tx) {
            tx.executeSql("SELECT * FROM userlogued", [], function (tx, res) {
                if (res.rows.length > 0) {
                    var apellido = res.rows.item(0).lastname.split(" ");
                    $('.header-text h3').html(res.rows.item(0).firstname + " " + apellido[0]);
                    $('.header-text p').html(res.rows.item(0).nikname);
                    $('#photoAvatar').html('<img src="statics/img/avatar/' + res.rows.item(0).image_avatar + '.png" />');
                }
            });
        }, function (error) {
            alert(error);
        }, function () {
            console.log('ok');
        });
    }

    function editNickUser(nik, img) {
        var newimage = (img == "") ? 'default' : img;

        $.ajax({
            url : phpApiMgr + '/change_nick/',
            data : {
                userid: sessionStorage.getItem('usuario_id'),
                niknam: nik,
                image: newimage,
                'csrf_name' : sessionStorage.getItem('csrf_name'),
                'csrf_value' : sessionStorage.getItem('csrf_value')
            },
            type : 'POST'
            
        })
        .done(function (data) {

            sessionStorage.setItem('nikname', nik);
            sessionStorage.setItem('image_avatar', newimage);

            myApp.alert("Se ha actualizado correctamente tus datos", "Preguntados UTP");

            database.transaction(function (tx) {
                var query = "UPDATE userlogued set image_avatar = ?, nikname = ? WHERE usuario_id = ?";

                tx.executeSql(query, [newimage, nik, sessionStorage.getItem('usuario_id')], function (tx, res) {

                }, function (error) {
                    alert(error);
                });
            }, function (error) {
                alert(error);
            }, function () {
                console.log('ok');
            });

            $('.header-text p').html(nik);
            $('#photoAvatar').html('<img src="statics/img/avatar/' + newimage + '.png" />');

        });
    }

    function cancelReto() {
        myApp.confirm("Perderá si sale del juego, Seguro que deseas salir?", function () {
            clearInterval(Handle_Mi_Timer);
            mediaTimer.stop();
            updRetos('cancelled');
            gotoMainmenu();
        });
    }

    function getYearAndMonth() {
        $.ajax({
            dataType : 'json',
            url : phpApiMgr + '/getYearAndMonth/',
            type : 'GET'
            
        })
        .done(function(data){
            for (var i in data) {
                var combo = "";
                for (var item in data[i]) {

                    if (item == "selected")
                        continue;

                    var selected = "";

                    if (item == data[i]['selected']) {

                        selected = "selected";
                        $('#div_' + i).html(data[i][item]);
                    }

                    combo += "<option value='" + item + "' " + selected + ">" + data[i][item] + "</option>";
                }

                $('#' + i).html(combo);
            }
        });
    }

    function getRankingByCourse(year, month) {
        myApp.showPreloader('Espere, por favor...');

        $.ajax({
            url : phpApiMgr + '/getRankingByCourse/',
            data : {
                courseId: sessionStorage.getItem('courseId'),
                year: year,
                month: month
            },
            type : 'GET',
            dataType : 'json'
            
        })
        .done(function (data) {
            myApp.hidePreloader();
            $('#list-ranking').empty().html(renderUsuariosRanking(data));
        });
    }

    function logout() {
        navigator.notification.confirm("Salir de la aplicación?", function (indexButton) {

            if (indexButton == 1) {

                database.transaction(function (tx) {
                    var query = "DELETE FROM userlogued WHERE usuario_id = ?";
                    tx.executeSql(query, [sessionStorage.getItem('usuario_id')], function (tx, res) {

                    }, function (error) {
                        alert(error);
                    });
                }, function (error) {
                    alert(error);
                }, function () {
                    sessionStorage.clear();
                    document.location.href = "index.html";
                });
            }

        }, "Desafío UTP");
    }

    function countRetosRecibidos() {
        $.ajax({
            url : phpApiMgr + '/counter/',
            data : {
                uname: sessionStorage.getItem('username')
            },
            type : 'GET',
            dataType : 'json'
            
        })
        .done(function (data) {
            //console.log(data[0]['retos']);
            if (data[0]['retos'] != '0') {
                $('#misRetos').html('<span class="badge bg-red" id="countRetosRecibidos">' + data[0]['retos'] + '</span><span>Mis Retos</span>');
            }
        });
    }

    function getTokenCsrf() {
        $.getJSON(phpApiMgr + '/getToken/', function(data){
            sessionStorage.setItem('csrf_name', data['csrf_name']);
            sessionStorage.setItem('csrf_value', data['csrf_value']);

            return 'ok';
        });
    }

    function gotoMainmenu() {
        mainView.router.loadPage("views/mainMenu/menu.html");
    }

    function closeApp() {
        navigator.app.exitApp();
    }

    return {
        viewLogin           :   viewLogin,
        login               :   login,
        InitmenuSlide       :   InitmenuSlide,
        getDataApiJSON      :   getDataApiJSON,
        PreloadQuestions    :   PreloadQuestions,
        listQuestions       :   listQuestions,
        fillButton          :   fillButton,
        //saveRetos           :   saveRetos,
        getRetos            :   getRetos,
        dateRetoAceptado    :   dateRetoAceptado,
        searchUser          :   searchUser,
        getResumenReto      :   getResumenReto,
        logout              :   logout,
        getUserProfile      :   getUserProfile,
        editNickUser        :   editNickUser,
        cancelReto          :   cancelReto,
        closeApp            :   closeApp,
        gotoMainmenu        :   gotoMainmenu,
        getYearAndMonth     :   getYearAndMonth,
        getRankingByCourse  :   getRankingByCourse,
        countRetosRecibidos :   countRetosRecibidos,
        renderImageAvatar   :   renderImageAvatar,
        getTokenCsrf        :   getTokenCsrf
    }

})();

$$(document).on("pageInit", function (page) {
    var logout = document.getElementsByClassName('logout').item(0);

    logout.addEventListener("touchstart", function (event) {
        event.stopImmediatePropagation();
        app.logout();
    }, false);

    if (page.detail.page.name == "menu") {
        document.addEventListener("deviceready", function () {
            document.addEventListener("backbutton", app.closeApp, false);
        }, false);
    } else {
        document.removeEventListener("backbutton", app.closeApp);
    }

    if (page.detail.page.name == "ListaPreguntas") {
        document.addEventListener("deviceready", function () {
            document.addEventListener("backbutton", app.cancelReto, false);
        }, false);
    } else {
        document.removeEventListener("backbutton", app.cancelReto);
    }

    if (page.detail.page.name == "resumenRetos") {
        document.addEventListener("deviceready", function () {
            document.addEventListener("backbutton", app.gotoMainmenu, false);
        }, false);
    } else {
        document.removeEventListener("backbutton", app.gotoMainmenu);
    }
});

myApp.onPageBeforeAnimation("menu", function (page) {

    if(sessionStorage.getItem('csrf_value') == null) {
        app.getTokenCsrf();
    }
    
    app.countRetosRecibidos();
});

myApp.onPageAfterAnimation("menu", function (page) {

    if (sessionStorage.getItem('error') != null) {
        myApp.showPreloader('Ha ocurrido un error inesperado, reiniciando...');

        setTimeout(function () {
            myApp.hidePreloader();
            sessionStorage.removeItem('error');
        }, 3000);
    }

    $('.user_details').html('<p>Usuario conectado, <span>' + sessionStorage.getItem('firstname') + '</span></p>');

    $('.main-nav ul li').on("click", function () {
        var href = $(this).attr('id');
        if (href != 'Help') {
            mainView.router.loadPage('views/' + href + "/" + href + ".html");
        }
    });
});

myApp.onPageAfterAnimation("listadoCursos", function (page) {
    app.getDataApiJSON({
        href: 'list-courses',
        elem: '#list',
        func: 'renderDefaultList'
    });

    $('#list').on("click", "a", function () {
        var courseCode = $(this).attr('alt');
        var courseName = $(this).text();
        sessionStorage.setItem("courseId", courseCode);
        sessionStorage.setItem("courseName", courseName.trim());
        mainView.router.loadPage("views/ListaCursos/ListaUnidades.html");
    });
});

myApp.onPageAfterAnimation("listadoUnidades", function (page) {
    //$('.page_title').text("Temas disponibles en " + sessionStorage.getItem("courseName"));

    app.getDataApiJSON({
        href: 'list-unidad',
        func: 'renderDefaultList',
        args: {
            courseId: sessionStorage.getItem("courseId")
        },
        elem: '#list-unidad'
    });

    $('#list-unidad').on("click", "a", function () {
        var unidadId = $(this).attr('alt');
        var unidadName = $(this).text();
        sessionStorage.setItem("unidadId", unidadId);
        sessionStorage.setItem("unidadName", unidadName.trim());

        mainView.router.loadPage("views/ListaCursos/ListaUsuarios.html");
    });
});

myApp.onPageAfterAnimation("listadoUsuarios", function (page) {

    app.searchUser(null);

    $('#autocomplete-dropdown').keyup(function () {
        app.searchUser($(this).val());
    });

    $('#autocomplete-dropdown').key("backsp", function () {
        app.searchUser($('#autocomplete-dropdown').val());
    });

    $('.searchbar-submit').click(function () {
        app.searchUser($('#autocomplete-dropdown').val());
    });

    $('#autocomplete-dropdown').key("enter", function () {
        app.searchUser($('#autocomplete-dropdown').val());
    });

    $('#list-users').on("touchstart", ".btn-retar", function () {
        var username = $(this).attr('alt');
        sessionStorage.setItem("userRetado", username);
        var message = "Se enviará una notificación al usuario seleccionado. ¿Estás listo para empezar a jugar?";
        navigator.notification.confirm(message, function (indexButton) {
            if (indexButton == 1) {
                mainView.router.loadPage("views/ListaCursos/ListaPreguntas.html");
            }
        }, "Desafío UTP", ['Aceptar', 'Cancelar']);
    });
});

myApp.onPageAfterAnimation("listadoRetos", function (page) {
    app.getRetos('all');
    var page = 0;

    var idReto,
        idUnidad,
        idCourse,
        idTemaGe;

    $('#receive').off("click");

    $('#receive').on("click", ".item-inner", function () {
        var items = $(this).attr('alt');
        var args = items.split("|");

        idReto      = args[0];
        idUnidad    = args[1];
        idCourse    = args[2];
        idTemaGe    = args[3];
        idWho       = args[4];
        avatar      = args[5];

        sessionStorage.setItem("courseId", idCourse);
        sessionStorage.setItem("unidadId", idUnidad);
        sessionStorage.setItem('lastID', idReto);

        $('#minik').html(sessionStorage.getItem('nikname'));
        $('#tunik').html(idWho);

        $('#miavatar').attr("src", "statics/img/avatar/" + sessionStorage.getItem('image_avatar') + ".png");
        $('#tuavatar').attr("src", "statics/img/avatar/" + avatar + ".png");

        myApp.popup(".popup-about");
    });

    $('.infinite-scroll').on('infinite', function(){

        if(loading) return;

        loading = true;

        $('.infinite-scroll-preloader').removeClass('innactive');

        app.getRetos('history', "", ++page);
    });

    $('#btnAceptarReto').click(function () {
        app.dateRetoAceptado(idReto);
        myApp.closeModal();
        mainView.router.loadPage("views/ListaCursos/ListaPreguntas.html");
    });

    $('#history').on("touchstart", '.btnHistorial', function () {
        sessionStorage.setItem('Reto', $(this).attr('alt'));
        mainView.router.loadPage("views/misRetos/misRetosDetalle.html");
    });

    $('#send').on('click', '.item-inner', function () {
        var id_reto = $(this).attr('alt');
        sessionStorage.setItem('lastID', id_reto),
                mainView.router.loadPage("views/misRetos/misRetosResumen.html");
    });
});

/*myApp.onPageBeforeAnimation("ListaPreguntas", function (page) {
    //app.saveRetos();
    //app.PreloadQuestions();
});*/

myApp.onPageAfterAnimation("resumenRetos", function (page) {
    app.getResumenReto();
});

myApp.onPageAfterAnimation("ListaPreguntas", function (page) {
    app.PreloadQuestions();

    //$('.questions-content').append(app.listQuestions(0));
});

myApp.onPageBeforeAnimation("detalleRetos", function (page) {
    app.getRetos('detalle', sessionStorage.getItem('Reto'));
});

myApp.onPageBeforeAnimation("profile", function (page) {
    app.getUserProfile();

    $(document).on("touchstart", "#editar", function () {
        myApp.popup('.popup-profile');
        $('#images_avatar').html(app.renderImageAvatar());
        $('#txtNikName').val(sessionStorage.getItem('nikname'));
    });

    $(document).on("touchstart", "#saveAvatarProfile", function () {
        var image = "";
        $('.avatarImage').each(function () {
            if ($(this).is(':checked')) {
                image = $(this).val();
            }
        });
        var nikname = $.trim($('#txtNikName').val());

        app.editNickUser(nikname, image);

    });
});

myApp.onPageAfterAnimation("listadoCursosRanking", function (page) {
    app.getDataApiJSON({
        href: 'list-courses',
        elem: '#list',
        func: 'renderDefaultList'
    });

    $('#list').on("click", "a", function () {
        var courseCode = $(this).attr('alt');
        var courseName = $(this).text();
        sessionStorage.setItem("courseId", courseCode);
        sessionStorage.setItem("courseName", courseName.trim());
        mainView.router.loadPage("views/ListCourseRanking/Ranking.html");
    });
});

myApp.onPageAfterAnimation("listaRanking", function (page) {
    app.getYearAndMonth();

    setTimeout(function () {
        var year = $('#year').val();
        var month = $('#mes').val();
        app.getRankingByCourse(year, month);
    }, 500);

    $('#year, #mes').change(function () {
        app.getRankingByCourse($('#year').val(), $('#mes').val());
    });
});
