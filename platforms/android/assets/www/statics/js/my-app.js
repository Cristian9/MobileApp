// Initialize your app

var $$ = Dom7;

var myApp = new Framework7({
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
    template7Pages: false
});

var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: false
});

var app = (function(){
    new FastClick(document.body);
	var API = "http://10.30.15.218/CodeApiMobile",
		numberPage = 1,
		timerInicial = 30,
        dataQuestion = "",
        pageDinamic,
        totalQuestions,
        initNumberQuestion = 0,
        initPuntajeQuestion = 0,
		myScroll,
        Handle_Mi_Timer = null,
        Contador = 30;

	String.prototype.ucfirst = function(){
        return this.charAt(0).toUpperCase() + this.substr(1);
    }

	function StyleApp(topParam) {
        var heightCuerpo=window.innerHeight - 92;//92/*46*/;
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.auxCSS { position:absolute; z-index:2; left:0; top:' + 
                topParam + 'px; width:100%; height: ' + heightCuerpo + 'px; overflow:auto;}';

        document.getElementsByTagName('head')[0].appendChild(style);
    }

    function InitmenuSlide() {
        StyleApp(0);
        $('#wrapper').addClass('auxCSS');

        // Creamos los 2 scroll mediante el plugin iscroll, uno para el menœ principal y otro para el cuerpo
        myScroll = new iScroll('wrapper', { hideScrollbar: true });
        
        //new FastClick(document.body);
    }

	function viewLogin() {
		//myApp.popup('.popup-login');
        myApp.loginScreen()
	}

	function renderDefaultList(data) {
        var lista = '';

        for (var i = 0; i < data.length; i++) {
            lista += '<li><a class="item item-icon-left icon-book" alt="' + data[i].id + '">&nbsp;&nbsp;';
            lista += 	data[i].description.toLowerCase().ucfirst();
            lista += '</a></li>';
        }

        return lista;
    }

    function renderListRetosEnviados(data) {
        var html = "";
        if(data.Enviado == "")
            return false;

        html = data.Enviado.map(function(elem){
            return ('<li class="item-content">' + 
                        '<div class="item-inner" alt="'+elem.id_reto+'|'+elem.unidad_id+'|'+elem.curso_id+'|'+elem.id_temageneral+'">' + 
                            '<div class="item-title">'+elem.nikname+'<div class="item-after-down">Pendiente</div></div>' + 
                            '<div class="item-title">'+elem.para_ganar+'<div class="item-after-down">Para ganar</div></div>' + 
                        '</div>' + 
                    '</li>');
        }).join(" ");

        return html;
    }

    function renderListRetosRecibidos(data){
        var html = "";
        if(data.Recibido == "")
            return false;

        html = data.Recibido.map(function(elem){
            return ('<li class="item-content">' + 
                        '<div class="item-inner"  alt="'+elem.id_reto+'|'+elem.unidad_id+'|'+elem.curso_id+'|'+elem.id_temageneral+'">' + 
                            '<div class="item-title">'+elem.nikname+'<div class="item-after-down">Pendiente</div></div>' + 
                            '<div class="item-title">'+elem.para_perder+'<div class="item-after-down">Para perder</div></div>' + 
                        '</div>' + 
                    '</li>');
        }).join(" ");

        return html;
    }

    function renderListUsuarios(data) {
        var lista = "";

        for (var i = 0; i < data.length; i++) {
            lista += '<li class="item-content"><div class="item-inner">' + 
                '<div class="item-title">' + 
                    data[i].usuario.toLowerCase().ucfirst() + 
                '</div>' + 
                '<div class="item-after">' + 
                    '<button class="button button-positive btn-retar" alt="'+data[i].username+'">Retar</button>' + 
                '</div></div></li>';
        };

        return lista;
    }

	function getMainList(option) {

        var href = option.href,
            func = option.func,
            args = option.args || "",
            elem = option.elem || "list",
            ptop = option.ptop || 0;
            //pwid = option.pwid;

        window.localStorage.setItem('href', href);

        StyleApp(ptop);

        $('#wrapper').addClass('auxCSS');

        if(typeof myScroll != "undefined" && myScroll != null) {
            myScroll.destroy();
            myScroll = null;
            
            numberPage > 1 && (numberPage = 1);
        }

        myApp.showPreloader('Espere, por favor...');

        $.ajax({
            type        : 'GET',
            url         : API + "/" + href + "/",
            contentType : "application/json; charset=utf-8",
            dataType    : "json",
            data        : {
                'page'  : numberPage,
                'args'  : args
            }
        })
        .done(function(data){
            var data = eval(data);
            myApp.hidePreloader();
            if(data[0] == null) {
                $('#' + elem).html($("<center style='padding:11%; color:#B33831; font-size:15px; font-weight:bold;'></center>")
                          .append('No hay registros para mostrar'));

                return false;
            }

            var list = eval(func + "(data)");
            
            $('#' + elem).empty().html(list);

            //$('#pullUp, #pullDown').removeClass('hide').addClass('show');

            //ScrollMove();
        });
        
        //new FastClick(document.body);
    }

	function login() {
		myApp.showPreloader('Espere, por favor...');
		$.post(API + '/login/', {
			user : $('#txtuser').val(),
			pass : $('#txtpassword').val()
		})
		.done(function(data){
			myApp.hidePreloader();
			var data = eval(data);
            if(!data) {
                myApp.alert('Hubo un error, verifique sus datos', 'Error!!!');
            } else {
            	myApp.closeModal('.login-screen');
                window.localStorage.setItem("userSession", $('#txtuser').val());
            	$('.pages').empty();
            	mainView.router.loadPage('views/mainMenu/menu.html');
            }
		});
	}

    function fillButton (obj, n, pts) {
        clearInterval(Handle_Mi_Timer);

        var correct = $(obj).attr('alt');

        if(correct == '1') {
            $(obj).removeClass('active').addClass('button-fill color-green');
        } else {

            $(obj).removeClass('active').addClass('button-fill color-red');

            $('.button').each(function(){
                if($(this).attr('alt') == 1) {
                    $(this).removeClass('active').addClass('button-fill color-green');
                }
            });
        }
        nextQuestion(n, 800, pts); 
    }

    function nextQuestion(n, delay, pts) {
        $('.siguiente_' + (n-1)).delay(delay).animate({'left' : '-100%'}, function(){
            initPuntajeQuestion += pts;
            $('.questions-content').empty().append(app.listQuestions(n));
            $('.siguiente_' + n).removeClass('innactive').animate({'right' : '0'});
        });
    }

    function PreloadQuestions() {
        initNumberQuestion = 0;
        initPuntajeQuestion = 0;

        $.getJSON(API + '/getQuestions/', {
            course : window.localStorage.getItem("courseId"),
            unidad : window.localStorage.getItem("unidadId")
        })
        .done(function(data){
            dataQuestion = data;
            totalQuestions = dataQuestion.length;
        });
    }

    function reset_timer() {
        Contador = 30;
        $('.timer').html(Contador);
        Handle_Mi_Timer = window.setInterval(function(){
            Contador--;

            if(Contador == 0) {

                nextQuestion(initNumberQuestion, 100);
                clearInterval(Handle_Mi_Timer);
            }

            $('.timer').html(Contador);

        }, 1000);
    }

    function listQuestions(index) {
        var correct,
            respuesta,
            puntaje,
            templateQuestion = "";

        initNumberQuestion += 1;

        clearInterval(Handle_Mi_Timer);
        reset_timer();

        if(index == '0') {
            var visible = 'active';
            var rightS = '0';
        }else {
            var visible = 'innactive';
            var rightS = '-100%';
        }

        if(totalQuestions < 1) {
            templateQuestion = "<h1>Ups, algos ha salido mal, intente</h1>";
        } else {
            if (index < totalQuestions){
                templateQuestion = "<div class='siguiente_" + index + " contenedor_question " + visible + "' style='right:" + rightS + "'>" + 
                            "<h2 class='page_title timer' style='text-align:right;'>30</h2>" +
                            "<div class='wrapper-questions'>" +
                            "<div class='scroller'>" + 
                            "<div class='content-block questions' style='font-size: 20px; background-color: #e4e4e3;'>" 
                                + (index + 1) + '.- ' + dataQuestion[index].preguntas + "</div>" + 
                            "<div class='content-block answer'>";

                for(var j = 0; j < dataQuestion[index].Respuesta.length; j++) {
                    correct = dataQuestion[index].Respuesta[j].is_correct;
                    respuesta = dataQuestion[index].Respuesta[j].respuesta;
                    puntaje = dataQuestion[index].Respuesta[j].puntaje;

                    templateQuestion += "<p><a onclick='app.fillButton(this, " + initNumberQuestion + ", " + puntaje + ")'" + 
                        " class='button button-round active " + correct + "' alt='" + correct + "'>" + respuesta + "</a></p>";
                }
                templateQuestion += "</div></div></div></div>";
            } else {
                templateQuestion = "<h1>Terminaste</h1>";

                updRetos();
            }
        }

        return templateQuestion;
    }

    function saveRetos() {
        $.post(API + '/save_retos/', {
            user_retador    :   window.localStorage.getItem('userSession'),
            unidad_id       :   window.localStorage.getItem('unidadId') || "",
            courseId        :   window.localStorage.getItem('courseId') || "",
            user_retado     :   window.localStorage.getItem('userRetado') || "",
            id_temageneral  :   window.localStorage.getItem('themeGeneral') || ""
        })
        .done(function(data){
            window.localStorage.setItem('lastID', data);
        });
    }

    function dateRetoAceptado(id) {
        $.post(API + '/updateDateReto/', {
            idReto : id
        })
        .done(function(data){
            console.log(data);
        })
    }

    function updRetos() {
        $.post(API + '/update_retos/', {
            countCorrect    :   initPuntajeQuestion,
            idQuestion      :   window.localStorage.getItem('lastID'),
            username        :   window.localStorage.getItem('userSession')
        })
        .done(function(data){
            console.log(data);
        });
    }

    function getRetos() {
        myApp.showPreloader('Espere, por favor...');
        $.getJSON(API + '/list-retos/', {
            args : window.localStorage.getItem("userSession")
        })
        .done(function(data){
            myApp.hidePreloader();
            var htmlSend = renderListRetosEnviados(data);
            var htmlRecerve = renderListRetosRecibidos(data);

            $('#send').html(htmlSend);
            $('#receive').html(htmlRecerve);
        });
    }

	return {
		viewLogin          :    viewLogin,
		login 	           :    login,
		InitmenuSlide      :    InitmenuSlide,
		getMainList        :    getMainList,
        PreloadQuestions   :    PreloadQuestions,
        listQuestions      :    listQuestions,
        fillButton         :    fillButton,
        saveRetos          :    saveRetos,
        getRetos           :    getRetos,
        dateRetoAceptado   :    dateRetoAceptado
	}

})();

myApp.onPageInit("menu", function(page){
	$('.main-nav ul li').on("click", function(){
		var href = $(this).attr('id');
		$('.pages').empty();
		mainView.router.loadPage('views/' + href + "/" + href + ".html");
	});
});

myApp.onPageAfterAnimation("listadoCursos", function(page){
	app.getMainList({
		href : 'list-courses',
		func : 'renderDefaultList',
		ptop : 50
	});

	$('#list').on("click", "a", function(){
		var courseCode = $(this).attr('alt');
	    var courseName = $(this).text();
	    window.localStorage.setItem("courseId", courseCode);
	    window.localStorage.setItem("courseName", courseName.trim());
	    mainView.router.loadPage("views/ListaCursos/ListaUnidades.html");
	});
});

myApp.onPageInit("listadoUnidades", function(page){
	$('.page_title').text("Temas disponibles en " + window.localStorage.getItem("courseName"));
})

myApp.onPageAfterAnimation("listadoUnidades", function(page){
	app.getMainList({
		href : 'list-unidad',
		func : 'renderDefaultList',
		args : window.localStorage.getItem("courseId"),
		elem : 'list-unidad',
		ptop : 50
	});

	$('#list-unidad').on("click", "a", function(){
		var unidadId = $(this).attr('alt');
	    var unidadName = $(this).text();
	    window.localStorage.setItem("unidadId", unidadId);
	    window.localStorage.setItem("unidadName", unidadName.trim());
	  	
	    mainView.router.loadPage("views/ListaCursos/ListaUsuarios.html");
	});
});

myApp.onPageAfterAnimation("listadoUsuarios", function(page){
    
    $('#list-users').off("click");
	app.getMainList({
		href : 'list-users',
		func : 'renderListUsuarios',
		args : window.localStorage.getItem("courseId"),
		elem : 'list-users',
		ptop : 50
	});

	$('#list-users').on("click", ".btn-retar", function(){
		var username = $(this).attr('alt');
		window.localStorage.setItem("userRetado", username);
        app.saveRetos();
		myApp.alert('Se ha enviado una notificación al usuario', 'Preguntados UTP', function () {
	        mainView.router.loadPage("views/ListaCursos/ListaPreguntas.html");
	    });
	});
});

myApp.onPageAfterAnimation("listadoRetos", function(page){
    app.getRetos();

    var idReto,
        idUnidad,
        idCourse,
        idTemaGe;

    $('#receive').off("click");

    $('#receive').on("click", ".item-inner", function(){
        var items = $(this).attr('alt');
        var args = items.split("|");

        idReto   = args[0];
        idUnidad = args[1];
        idCourse = args[2];
        idTemaGe = args[3];

        window.localStorage.setItem("courseId", idCourse);
        window.localStorage.setItem("unidadId", idUnidad);
        window.localStorage.setItem('lastID', idReto);
        myApp.popup(".popup-about");
    });

    $('#btnAceptarReto').click(function(){
        app.dateRetoAceptado(idReto);
        myApp.closeModal();
        mainView.router.loadPage("views/ListaCursos/ListaPreguntas.html");
    });
});

myApp.onPageBeforeAnimation("ListaPreguntas", function(page){
    app.PreloadQuestions();
});

myApp.onPageAfterAnimation("ListaPreguntas", function(page){
    $('.questions-content').append(app.listQuestions(0));
});