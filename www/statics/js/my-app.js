// Initialize your app
var myApp = new Framework7({
    cache : false,
    modalTitle : "Desafío UTP",
    animateNavBackIcon: true,
    // Enable templates auto precompilation
    precompileTemplates: true,
    // Enabled pages rendering using Template7
    swipeBackPage: false,
    swipeBackPageThreshold: 1,
    swipePanel: "left",
    swipePanelCloseOpposite: true,
    pushState: true,
    pushStateRoot: undefined,
    pushStateNoAnimation: false,
    pushStateSeparator: '#!/',
    template7Pages: true
});

var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: false
});

var app = (function () {
    new FastClick(document.body);
    var phpApiMgr = "http://10.31.1.84/CodeApiMobile",
    //var phpApiMgr = "http://10.30.15.218/CodeApiMobile",
        numberPage = 1,
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
        TmpLastRecord = "";

    String.prototype.ucfirst = function () {
        return this.charAt(0).toUpperCase() + this.substr(1);
    }

    function StyleApp() {
        var heightCuerpo = window.innerHeight - 246;//92/*46*/;
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.auxCSS { position:absolute; z-index:2; left:0; top:60px; width:100%; height: ' + heightCuerpo + 'px; overflow:auto;}';

        $('#pages_maincontent').css({
            'height' : heightCuerpo
        });

        document.getElementsByTagName('head')[0].appendChild(style);
    }

    function InitmenuSlide() {
        StyleApp(0);
        $('#wrapper').addClass('auxCSS');

        // Creamos los 2 scroll mediante el plugin iscroll, uno para el menœ principal y otro para el cuerpo
        myScroll = new iScroll('wrapper', {hideScrollbar: true});
    }

    function viewLogin() {
        myApp.loginScreen()
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
                        '<div class="item-media"><img src="statics/img/avatar.jpg" width="40" /></div>' +
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
            return ('<li class="item-content">' +
                        '<div class="item-media"><img src="statics/img/avatar.jpg" width="40" /></div>' +
                        '<div class="item-inner"  alt="' + e.id_reto + '|' + e.unidad_id + '|' + e.curso_id + '|' + e.id_temageneral + '|' + e.nikname + '">' +
                            '<div class="item-title">' + e.nikname + '<div class="item-after-down">Pendiente</div></div>' +
                            '<div class="item-title">' + e.para_perder + '<div class="item-after-down">Para perder</div></div>' +
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
                        '<div class="item-media"><img src="statics/img/avatar.jpg" width="40" /></div>' +
                        '<div class="item-inner">' +
                            '<div class="item-title">' + e.nikname +
                                '<div class="item-after-down" style="color:' + color + '">' + e.resultado + ' (' + e.origen + ')</div>' +
                            '</div>' +
                            '<div class="item-title">'+
                                '<button class="button button-fill btnHistorial" alt="' + e.id_reto + '">Ver detalle</button>' +
                            '</div>' +
                        '</div>' +
                    '</li>');
        }).join(" ");

        return html;
    }

    function renderListRetosDetalle(data) {
        var html = "";
        if(data == "")
            return false;

        html = data.map(function(e){
            return ('<li class="item-content">' +
                        '<div class="item-media"><img src="statics/img/avatar.jpg" width="40" /></div>' +
                        '<div class="item-inner">' +
                            '<div class="item-title mb-b">' + e.myNik +
                            '</div>' +
                            '<div class="item-title" style="text-align: center;">' +
                                '<div class="item-after-point mb-b">' + e.mis_correctas + '</div>' +
                                '<div class="item-after-down">'+e.miTiempo+'</div>' +
                            '</div>' +
                        '</div>' +
                    '</li>' +
                    '<li class="item-content">' +
                        '<div class="item-media"><img src="statics/img/avatar.jpg" width="40" /></div>' +
                        '<div class="item-inner">' +
                            '<div class="item-title mb-b">' + e.nikname +
                            '</div>' +
                            '<div class="item-title" style="text-align: center;">' +
                                '<div class="item-after-point mb-b">' + e.correctas_rival + '</div>' +
                                '<div class="item-after-down">'+e.tiempoRival+'</div>' +
                            '</div>' +
                        '</div>' +
                    '</li>');
        }).join(" ");

        return html;
    }


    function renderListUsuarios(data) {
        var html = "";

        html = data.map(function(item) {
            return ('<li class="item-content">' +
                        '<div class="item-media"><img src="statics/img/avatar.jpg" width="40" /></div>' +
                        '<div class="item-inner">' +
                            '<div class="item-title">' + item.uname +
                            '<div class="item-after-down">' + item.usuario + '</div></div>' +
                            '<div class="item-after">' +
                                '<button class="button button-fill btn-retar" alt="' + item.username + '">Retar</button>' +
                            '</div>' +
                        '</div>'+
                    '</li>');
        }).join(" ");

        return html;
    }

    function renderUsuariosRanking(data){
        var html = "";

        html = data.map(function(item) {
            return ('<li class="item-content">' +
                        '<div class="item-media"><img src="statics/img/avatar.jpg" width="40" /></div>' +
                        '<div class="item-inner">' +
                            '<div class="item-title">' + item.nikname +
                            '<div class="item-after-down">' + item.tiempo_jugado + '</div></div>' +
                            '<div class="item-after">' + item.puntaje + ' pts</div>' +
                        '</div>'+
                    '</li>');
        }).join(" ");

        return html;
    }

    function renderResumenReto(data) {
        var html = data.Resumen.map(function(item){
            return('<div class="wrapper-resumen">' +
                        '<h2>' + item.para_ganar + '</h2>' +
                        '<div class="row">' +
                            '<div class="col-33">' +
                                '<div class="item-media"><img src="statics/img/avatar.jpg" width="40" /></div>' +
                                '<div class="item-title">' + item.nikRetador + "</div>" +
                            '</div>' +
                            '<div class="col-33" style="font-size: 2em; padding-top: 3%;">' + item.correctas_retador + '</div>' +
                            '<div class="col-33" style="font-size: 1.3em; padding-top: 3%;">' + item.tiempo_juego_retador + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="wrapper-resumen">' +
                        '<div class="row">' +
                            '<div class="col-33">' +
                                '<div class="item-media"><img src="statics/img/avatar.jpg" width="40" /></div>' +
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

    function getDataApiJSON(option) {

        var href = option.href,
            func = option.func,
            elem = option.elem,
            args = option.args || "";


        StyleApp();

        $('#wrapper').addClass('auxCSS');

        myApp.showPreloader('Espere, por favor...');

        $.getJSON(phpApiMgr + "/" + href + "/", args)
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
            "android" : {
                "senderID" : "374982523203"
            },
            "ios" : {
                "alert" : "true",
                "badge" : "true",
                "sound" : "true"
            },
            "windows" : {}
        });

        //console.log(push);

        push.on("registration", function(data){
            sessionStorage.setItem('identifier', data.registrationId);
            $.post(phpApiMgr + "/registerDevice/", {
                identifier  : data.registrationId,
                userid      : sessionStorage.getItem("usuario_id")
            })
            .done(function(data){
                console.log(data);
            });
        });

        push.on("error", function(e){
            console.log(e.message);
        });
    }

    function login() {
        myApp.showIndicator();

        $.post(phpApiMgr + '/login/', {
            user: $('#txtuser').val(),
            pass: $('#txtpassword').val()
        })
        .done(function (data) {
            myApp.hideIndicator();
            var data = eval(data);
            if (!data) {
                $('.error_message span').html(wrong_user);
                document.getElementById('errorDiv').classList.add('error_active');

                $('#txtuser, #txtpassword').val("");
            } else {

                for(session in data[0]) {
                    sessionStorage.setItem(session, data[0][session]);
                }

                getDeviceIdentifier();

                myApp.closeModal('.login-screen');

                //$('.pages').empty();
                //mainView.router.loadPage('views/mainMenu/menu.html');
                gotoMainmenu();
            }
        })
        .fail(function(e){
            if(e.status == 0) {
                myApp.hideIndicator();
                $('.error_message span').html(serve_gone_away);
                document.getElementById('errorDiv').classList.add('error_active');

                $('#txtuser, #txtpassword').val("");
            }
        });
    }

    function fillButton(obj, n, pts, idrpta, idprta) {
        clearInterval(Handle_Mi_Timer);

        var correct = $(obj).attr('alt');

        if (correct == '1') {
            $(obj).removeClass('active active-state').addClass('button-fill color-green');
        } else {

            $(obj).removeClass('active active-state').addClass('button-fill color-red');

            $('.button').each(function () {
                if ($(this).attr('alt') == 1) {
                    $(this).removeClass('active active-state').addClass('button-fill color-green');
                }
            });
        }
        nextQuestion(n, 1200, pts, idrspta, idprta);
    }

    function nextQuestion(n, delay, pts, idrspta, idprta) {
        $('.siguiente_' + (n - 1)).delay(delay).animate({'left': '-100%'}, function () {

            initPuntajeQuestion += pts;
            $.post(phpApiMgr + "/save_selected_rpta/", {
                reto_id  : sessionStorage.getItem('lastID'),
                username : sessionStorage.getItem('username'),
                courseid : sessionStorage.getItem('courseId') || "",
                unidadid : sessionStorage.getItem('unidadId') || "",
                generalt : sessionStorage.getItem('idtemageneral') || "",
                pregunta : idprta,
                respuest : idrspta
            });

            $('.questions-content').empty().append(app.listQuestions(n));
            $('.siguiente_' + n).removeClass('innactive').animate({'right': '0'});
        });
    }

    function PreloadQuestions() {
        initNumberQuestion = 0;
        initPuntajeQuestion = 0;

        $.getJSON(phpApiMgr + '/getQuestions/', {
            course: sessionStorage.getItem("courseId"),
            unidad: sessionStorage.getItem("unidadId")
        })
        .done(function (data) {
            dataQuestion = data;
            totalQuestions = dataQuestion.length;
        });
    }

    function reset_timer() {
        Contador = 30;
        $('.timer').html(Contador);
        Handle_Mi_Timer = window.setInterval(function () {
            Contador--;

            if (Contador == 0) {

                nextQuestion(initNumberQuestion, 100, 0, 0, 0);
                clearInterval(Handle_Mi_Timer);
            }

            $('#timer').html("00:" + Contador);

        }, 1000);
    }

    function listQuestions(index) {
        var correct,
            respuesta,
            puntaje,
            Quiz = "";

        initNumberQuestion += 1;

        clearInterval(Handle_Mi_Timer);
        reset_timer();

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
            if (index < totalQuestions) {
                idPregunta = dataQuestion[index].id_preguntas;
                $('#stage').html((index + 1) + " / " + totalQuestions);
                Quiz = "<div class='siguiente_" + index + " contenedor_question " + visible + "' style='right:" + rightS + "'>" +
                            "<div class='wrapper-questions'>" +
                                "<div class='scroller'>" +
                                    "<div class='content-block questions' style='font-size: 20px; /*background-color: #e4e4e3;*/ font-weight:bolder;'>" +
                                        + (index + 1) + '.- ' + dataQuestion[index].preguntas +
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
                Quiz = "<h3>Resumiendo...</h3>";
                updRetos();
            }
        }

        return Quiz;
    }

    function saveRetos() {
        $.post(phpApiMgr + '/save_retos/', {
            id_reto         : sessionStorage.getItem('lastID') || null,
            user_retador    : sessionStorage.getItem('username'),
            unidad_id       : sessionStorage.getItem('unidadId') || "",
            courseId        : sessionStorage.getItem('courseId') || "",
            user_retado     : sessionStorage.getItem('userRetado') || "",
            id_temageneral  : sessionStorage.getItem('themeGeneral') || ""
        })
        .done(function (data) {
            if(data != "") {
                sessionStorage.setItem('lastID', data);
            }
        });
    }

    function dateRetoAceptado(id) {
        $.post(phpApiMgr + '/updateDateReto/', {
            idReto: id,
            username : sessionStorage.getItem('username')
        })
        .done(function (data) {
            console.log(data);
        })
    }

    function getResumenReto() {

        $.getJSON(phpApiMgr + "/get_resumen_juego/", {
            id : sessionStorage.getItem('lastID') || TmpLastRecord
        })
        .done(function(e){
            if(sessionStorage.getItem('lastID') != "") {
                TmpLastRecord = sessionStorage.getItem('lastID');
            }

            sessionStorage.removeItem('lastID');
            var resumen = renderResumenReto(e);
            $('.resumen-questions').html(resumen);
        });
    }

    function updRetos(cancelled) {
        myApp.showPreloader('Espere, por favor...');
        $.post(phpApiMgr + '/update_retos/', {
            countCorrect: initPuntajeQuestion,
            idQuestion: sessionStorage.getItem('lastID'),
            username: sessionStorage.getItem('username'),
            cancelled : cancelled || ""
        })
        .done(function (data) {

            if(typeof cancelled == "undefined") {
                $.post(phpApiMgr + '/sendNotification/', {
                    toUser : sessionStorage.getItem('userRetado'),
                    fromUser : sessionStorage.getItem('nikname')
                })
                .done(function(){
                    myApp.hidePreloader();
                    mainView.router.loadPage("views/misRetos/misRetosResumen.html");
                })
                .fail(function(){
                    myApp.hidePreloader();
                    myApp.alert("Notificación no enviada");
                })
                .always(function(){
                    myApp.hidePreloader();
                    mainView.router.loadPage("views/misRetos/misRetosResumen.html");
                });
            } else {
                myApp.hidePreloader();
                sessionStorage.removeItem('lastID');
            }
        });
    }

    function getRetos(get, id) {
        myApp.showPreloader('Espere, por favor...');
        $.getJSON(phpApiMgr + '/list-retos/', {
            args: sessionStorage.getItem("username"),
            get : get,
            id : id || ""
        })
        .done(function (data) {
            myApp.hidePreloader();

            if (typeof data.Detalle == "undefined") {
                var htmlEnviado     = renderListRetosEnviados(data.Enviado);
                var htmlRecibido    = renderListRetosRecibidos(data.Recibido);
                var htmlHistorial   = renderListRetosHistorial(data.Historial);

                $('#send').html(htmlEnviado);
                $('#receive').html(htmlRecibido);
                $('#history').html(htmlHistorial);
            } else {
                var htmlDetalle = renderListRetosDetalle(data.Detalle);

                var rsimage = new Image();
                rsimage.setAttribute('style', 'width:100%');

                if(data.Detalle[0].resultado == 'Has ganado') {
                    rsimage.src = 'statics/img/has_ganado.png';
                } else {
                    rsimage.src = 'statics/img/has_perdido.png'
                }

                rsimage.onload = function(){
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

        $.getJSON(phpApiMgr + '/list-users/', {
            username : sessionStorage.getItem("username"),
            keywords : $.trim(keyword)
        })
        .done(function(data){
            $('.page_title').find('span').remove();
            $('#list-users').html(renderListUsuarios(data));
        });
    }

    function getUserProfile(uid) {
        $.getJSON(phpApiMgr + '/get_profile/', {
            username : uid || sessionStorage.getItem('username')
        })
        .done(function(data){
            $('#ganadas').text(data.Ganados[0].ganado);
            $('#perdidas').text(data.Perdidos[0].perdido);
            $('#punto').text(data.Puntaje[0].total + ' Puntos');
        });
    }

    function editNickUser(nik) {
        $.post(phpApiMgr + '/change_nick/', {
            userid : sessionStorage.getItem('usuario_id'),
            niknam : nik
        })
        .done(function(data){
            sessionStorage.setItem('nikname', nik);
            $('.header-text p').html(nik + ' <i class="icon ion-compose"></i>');
            myApp.alert("Tu Nikname ha cambiado", "Preguntados UTP");
        });
    }

    function cancelReto() {
        myApp.confirm("Perderá si sale del juego, Seguro que deseas salir?", function(){
            clearInterval(Handle_Mi_Timer);
            updRetos('cancelled');
            gotoMainmenu();
        });
    }

    function getYearAndMonth(){
        $.getJSON(phpApiMgr + '/getYearAndMonth/')
        .done(function(data){
            for(var i in data){
                var combo = "";
                for(var item in data[i]){
                    
                    if(item == "selected")
                        continue;

                    var selected = "";

                    if(item == data[i]['selected']) {

                        selected = "selected";
                        $('#div_' + i).html(data[i][item]);
                    }
                        
                    combo += "<option value='" + item + "' " + selected + ">" + data[i][item] + "</option>";
                }

                $('#' + i).html(combo);
            }
        });
    }

    function getRankingByCourse(year, month){
        myApp.showPreloader('Espere, por favor...');
        $.getJSON(phpApiMgr + '/getRankingByCourse/', {
            courseId : sessionStorage.getItem('courseId'),
            year : year,
            month : month
        })
        .done(function(data){
            myApp.hidePreloader();
            $('#list-ranking').html(renderUsuariosRanking(data));
        });
    }

    function logout() {
        navigator.notification.confirm("Salir de la aplicación?", function(indexButton){
            if(indexButton == 1) {
                sessionStorage.clear();
                document.location.href = "index.html";
            }

        }, "Desafío UTP");
    }

    function gotoMainmenu(){
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
        saveRetos           :   saveRetos,
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
        getRankingByCourse  :   getRankingByCourse
    }

})();

$$(document).on("pageInit", function(page){
    var logout = document.getElementsByClassName('logout').item(0);

    logout.addEventListener("touchstart", function(event){
        event.stopImmediatePropagation();
        app.logout();
    }, false);

    if(page.detail.page.name == "menu") {
        document.addEventListener("deviceready", function(){
            document.addEventListener("backbutton", app.closeApp, false);
        }, false);
    } else {
        document.removeEventListener("backbutton", app.closeApp);
    }

    if(page.detail.page.name == "ListaPreguntas") {
        document.addEventListener("deviceready", function(){
            document.addEventListener("backbutton", app.cancelReto, false);
        }, false);
    } else {
        document.removeEventListener("backbutton", app.cancelReto);
    }

    if(page.detail.page.name == "resumenRetos") {
        document.addEventListener("deviceready", function(){
            document.addEventListener("backbutton", app.gotoMainmenu, false);
        }, false);
    } else {
        document.removeEventListener("backbutton", app.gotoMainmenu);
    }

});

myApp.onPageInit("menu", function (page) {

    if(sessionStorage.getItem('error') != null) {
        myApp.showPreloader('Ha ocurrido un error inesperado, inicializando...');

        setTimeout(function(){
            myApp.hidePreloader();
            sessionStorage.removeItem('error');
        }, 3000);
    }

    $('.user_details').html('<p>Usuario conectado, <span>'+sessionStorage.getItem('firstname')+'</span></p>');

    $('.main-nav ul li').on("click", function () {
        var href = $(this).attr('id');
        mainView.router.loadPage('views/' + href + "/" + href + ".html");
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
            courseId : sessionStorage.getItem("courseId")
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
    /*$('#autocomplete-dropdown').keyup(function(){
        app.searchUser($(this).val());
    });*/

    $('#autocomplete-dropdown').key("backsp", function(){
        app.searchUser($('#autocomplete-dropdown').val());
    });

    $('.searchbar-submit').click(function(){
        app.searchUser($('#autocomplete-dropdown').val());
    });

    $('#autocomplete-dropdown').key("enter", function(){
        app.searchUser($('#autocomplete-dropdown').val());
    });

    $('#list-users').on("touchstart", ".btn-retar", function () {
        var username = $(this).attr('alt');
        sessionStorage.setItem("userRetado", username);
        navigator.notification.confirm("Se enviará una notificación al usuario seleccionado, Desea continuar?", function(indexButton){
            if(indexButton == 1) {
                mainView.router.loadPage("views/ListaCursos/ListaPreguntas.html");
            }
        }, "Desafío UTP", ['Aceptar', 'Cancelar']);
    });
});

myApp.onPageAfterAnimation("listadoRetos", function (page) {
    app.getRetos('all');

    var idReto,
        idUnidad,
        idCourse,
        idTemaGe;

    $('#receive').off("click");

    $('#receive').on("click", ".item-inner", function () {
        var items = $(this).attr('alt');
        var args = items.split("|");

        idReto   = args[0];
        idUnidad = args[1];
        idCourse = args[2];
        idTemaGe = args[3];
        idWho    = args[4];

        sessionStorage.setItem("courseId", idCourse);
        sessionStorage.setItem("unidadId", idUnidad);
        sessionStorage.setItem('lastID', idReto);

        $('#minik').html(sessionStorage.getItem('nikname'));
        $('#tunik').html(idWho);

        myApp.popup(".popup-about");
    });

    $('#btnAceptarReto').click(function () {
        app.dateRetoAceptado(idReto);
        myApp.closeModal();
        mainView.router.loadPage("views/ListaCursos/ListaPreguntas.html");
    });

    $('#history').on("touchstart", '.btnHistorial', function(){
        sessionStorage.setItem('Reto', $(this).attr('alt'));
        mainView.router.loadPage("views/misRetos/misRetosDetalle.html");
    });

    $('#send').on('click', '.item-inner', function(){
        var id_reto = $(this).attr('alt');
        sessionStorage.setItem('lastID', id_reto),
        mainView.router.loadPage("views/misRetos/misRetosResumen.html");
    });
});

myApp.onPageBeforeAnimation("ListaPreguntas", function (page) {
    app.saveRetos();
    app.PreloadQuestions();
});

myApp.onPageAfterAnimation("resumenRetos", function(page){
    app.getResumenReto();
});

myApp.onPageAfterAnimation("ListaPreguntas", function (page) {
    $('.questions-content').append(app.listQuestions(0));
});


myApp.onPageBeforeAnimation("detalleRetos", function(page){
    app.getRetos('detalle', sessionStorage.getItem('Reto'));
});

myApp.onPageBeforeAnimation("profile", function(page){
    var apellido = sessionStorage.getItem('lastname').split(" ");
    $('.header-text h3').html(sessionStorage.getItem('firstname') + " " + apellido[0]);
    $('.header-text p').html(sessionStorage.getItem('nikname') + ' <i class="icon ion-compose"></i>');

    app.getUserProfile();

    $('.header-text').on("touchstart", ".nikname", function(){

        navigator.notification.prompt("Ingrese su Nikname", function(result){
            if($.trim(result.input1) == "")
                return false;

            if(result.buttonIndex == 1) {
                app.editNickUser($.trim(result.input1));
            }
        }, "Desafío UTP");
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

myApp.onPageAfterAnimation("listaRanking", function(page){
    app.getYearAndMonth();

    setTimeout(function(){
        var year = $('#year').val();
        var month = $('#mes').val();
        app.getRankingByCourse(year, month);
    }, 500);

    $('#year, #mes').change(function(){
        app.getRankingByCourse($('#year').val(), $('#mes').val());
    });
});