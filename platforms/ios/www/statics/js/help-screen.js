var welcomescreen_slides = [
	{
		id: 'slide0',
		picture : '<div class="tutorialicon"><img src="statics/img/help/help1.jpg" width="100%" height="100%" /></div>'
		//picture: '<div class="tutorialicon">♥</div>'
		//text: 'Welcome to this tutorial. In the next steps we will guide you through a manual that will teach you how to use this app.'
	},
	{
		id: 'slide1',
		picture : '<div class="tutorialicon"><img src="statics/img/help/help2.jpg" width="100%" height="100%" /></div>'
		//picture: '<div class="tutorialicon">✲</div>'
		//text: 'This is slide 2'
	},
	{
		id: 'slide2',
		picture : '<div class="tutorialicon"><img src="statics/img/help/help3.jpg" width="100%" height="100%" /></div>'
		//picture: '<div class="tutorialicon">♫</div>'
		//text: 'This is slide 3'
	},
	{
		id: 'slide3',
		picture : '<div class="tutorialicon"><img src="statics/img/help/help3.jpg" width="100%" height="100%" /></div>'
		//picture: '<div class="tutorialicon">☆</div>'
		//text: 'Thanks for reading! Enjoy this app.<br><br><a id="tutorial-close-btn" href="#">End Tutorial</a>'
	}
];

var options = {
	'bgcolor': '#0da6ec',
	'fontcolor': '#fff',
	'closeButtonText' : '[X]'
}

var welcomescreen = myApp.welcomescreen(welcomescreen_slides, options);

$(document).on("click", "#Help", function(){
	welcomescreen.open();
});

$(document).on("click", "#helpside", function(){
	welcomescreen.open();
})

$(document).on("click", '.welcomescreen-closebtn', function(){
		$('.welcomescreen-container').remove();
})