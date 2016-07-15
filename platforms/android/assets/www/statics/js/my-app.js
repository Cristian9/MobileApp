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

	var API = "http://10.30.15.218/API_Preguntados",
		numberPage = 1,
		timerInicial = 30,
		myScroll;

	String.prototype.ucfirst = function(){
        return this.charAt(0).toUpperCase() + this.substr(1);
    }

	function StyleApp(topParam) {
        var heightCuerpo=window.innerHeight - 50;//92/*46*/;
        alert(window.innerHeight);
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
		myApp.popup('.popup-login');
	}

	function renderDefaultList(data) {
        var lista = '';

        for (var i = 0; i < data.length; i++) {
            lista += '<li><a class="item item-icon-left" alt="' + data[i].id + '">';
            lista += '<i class="icon ion-compose"></i>' + data[i].description.toLowerCase().ucfirst();
            lista += '</a></li>';
        }

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

        /*$.mobile.loading('show', {
            text : 'Cargando...',
            textVisible : true,
            theme : 'b',
            textonly : false
        });*/
        myScroll = new iScroll('wrapper', { hideScrollbar: true });
        myApp.showPreloader('Espere, por favor...');

        $.ajax({
            type        : 'GET',
            url         : API + "/" + href + "/",
            contentType : "application/json; charset=utf-8",
            dataType    : "json",
            data        : {
                'page'  : numberPage,
                'course': args
            }
        })
        .done(function(data){
            var data = eval(data);
            
            //$.mobile.loading("hide");
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
            	myApp.closeModal('.popup-login');
            	mainView.router.loadPage('views/mainMenu/menu.html');
            }
		});
	}

	return {
		viewLogin : viewLogin,
		login 	  : login,
		InitmenuSlide : InitmenuSlide,
		getMainList : getMainList
	}

})();

/*
// Export selectors engine
var $$ = Dom7;

// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: false
});*/

myApp.onPageInit("menu", function(page){
	$('.main-nav ul li').on("touchstart", function(){
		var href = $(this).attr('id');
		mainView.router.loadPage('views/' + href + "/" + href + ".html");
	});
});

myApp.onPageInit("listadoCursos", function(page){
	app.getMainList({
		href : 'list-courses',
		func : 'renderDefaultList',
		ptop : 50
	});
});


/*$$(document).on('pageInit', function (e) {
	//app.InitmenuSlide();
  		$(".swipebox").swipebox();
		
		$("#ContactForm").validate({
			submitHandler: function(form) {
				ajaxContact(form);
				return false;
			}
		});
		
		$("#RegisterForm").validate();
		$("#LoginForm").validate();
		$("#ForgotForm").validate();
		
		$('a.backbutton').click(function(){
			parent.history.back();
			return false;
		});
		

		$(".posts li").hide();	
		size_li = $(".posts li").size();
		x=4;
		$('.posts li:lt('+x+')').show();
		$('#loadMore').click(function () {
			x= (x+1 <= size_li) ? x+1 : size_li;
			$('.posts li:lt('+x+')').show();
			if(x == size_li){
				$('#loadMore').hide();
				$('#showLess').show();
			}
		});
        

	$("a.switcher").bind("click", function(e){
		e.preventDefault();
		
		var theid = $(this).attr("id");
		var theproducts = $("ul#photoslist");
		var classNames = $(this).attr('class').split(' ');
		
		
		if($(this).hasClass("active")) {
			// if currently clicked button has the active class
			// then we do nothing!
			return false;
		} else {
			// otherwise we are clicking on the inactive button
			// and in the process of switching views!

  			if(theid == "view13") {
				$(this).addClass("active");
				$("#view11").removeClass("active");
				$("#view11").children("img").attr("src","images/switch_11.png");
				
				$("#view12").removeClass("active");
				$("#view12").children("img").attr("src","images/switch_12.png");
			
				var theimg = $(this).children("img");
				theimg.attr("src","images/switch_13_active.png");
			
				// remove the list class and change to grid
				theproducts.removeClass("photo_gallery_11");
				theproducts.removeClass("photo_gallery_12");
				theproducts.addClass("photo_gallery_13");

			}
			
			else if(theid == "view12") {
				$(this).addClass("active");
				$("#view11").removeClass("active");
				$("#view11").children("img").attr("src","images/switch_11.png");
				
				$("#view13").removeClass("active");
				$("#view13").children("img").attr("src","images/switch_13.png");
			
				var theimg = $(this).children("img");
				theimg.attr("src","images/switch_12_active.png");
			
				// remove the list class and change to grid
				theproducts.removeClass("photo_gallery_11");
				theproducts.removeClass("photo_gallery_13");
				theproducts.addClass("photo_gallery_12");

			} 
			else if(theid == "view11") {
				$("#view12").removeClass("active");
				$("#view12").children("img").attr("src","images/switch_12.png");
				
				$("#view13").removeClass("active");
				$("#view13").children("img").attr("src","images/switch_13.png");
			
				var theimg = $(this).children("img");
				theimg.attr("src","images/switch_11_active.png");
			
				// remove the list class and change to grid
				theproducts.removeClass("photo_gallery_12");
				theproducts.removeClass("photo_gallery_13");
				theproducts.addClass("photo_gallery_11");

			} 
			
		}

	});	
	
	document.addEventListener('touchmove', function(event) {
	   if(event.target.parentNode.className.indexOf('navbarpages') != -1 || event.target.className.indexOf('navbarpages') != -1 ) {
		event.preventDefault(); }
	}, false);
	
	// Add ScrollFix
	/*var scrollingContent = document.getElementById("pages_maincontent");
	new ScrollFix(scrollingContent);
	
	
	var ScrollFix = function(elem) {
		// Variables to track inputs
		var startY = startTopScroll = deltaY = undefined,
	
		elem = elem || elem.querySelector(elem);
	
		// If there is no element, then do nothing	
		if(!elem)
			return;
	
		// Handle the start of interactions
		elem.addEventListener('touchstart', function(event){
			startY = event.touches[0].pageY;
			startTopScroll = elem.scrollTop;
	
			if(startTopScroll <= 0)
				elem.scrollTop = 1;
	
			if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
				elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
		}, false);
	};

})*/