"use strict"

window.onload = function()
{
	var slidesCount,
		CurrentSlide,
		SliderScroller,
		MenuAnimated;

	var logoSpace = +$("#Menu").css("padding-top").replace("px", "") + +$("#menuHeader").height() + +$("#menuHeader").css("margin-bottom").replace("px", ""),
		menuSpace = +$("#menuRows").height();

	const sliderAutoscrollInterval = 5000;

	const menuAnimDuration = 1500;

	if(navigator.userAgent.match(/iPad/i))
		var sliderScrollSlidesCount = 2;

	if(isMobile())
		{
			var sliderAnimationType = "opacity";
			var sliderScrollSlidesCount = 1;
			InitializeTriangle();
			InitializeSubscribe(5000);
			$("#SubscribeCloser").click(function(){
				CloseSubscribe();
			});
		}

	else
		{
			InitializeMenu();
			var sliderAnimationType = "scroll";
			var sliderScrollSlidesCount = 3;
			InitializeLogoAnim();
		}

	initializeScroller();
	initializeSlider(true);

	function InitializeLogoAnim()
		{
			var default2 = $("header > h2").css("right");
			var default3 = $("header > h3").css("right");
			$("header > h2").css("right", "0").css("opacity", "0").stop().animate({"right": default2, "opacity": "1"}, 600);
			$("header > h3").css("right", "0").css("opacity", "0").stop().animate({"right": default3, "opacity": "1"}, 700);
		}


	function scroll(id)
		{
			if(id != "Menu")
				StopMenu();

			$('html, body').stop().animate({scrollTop: $("#" + id).offset().top}, 1000);
		}

	
	function parallaxSetPercents(topPosition)
		{
			var percents = (window.innerWidth - topPosition)/(window.innerWidth);
			percents = 100 - percents*100;
			
			if(percents < 0)
				percents = 0;

			if(percents > 100)
				percents = 100;

			return percents;
		}


	function InitializeMenu()
		{
			$(window).scroll(function(){
				$("main").css("background-position", "50% " + parallaxSetPercents($(window).scrollTop()) + "%");
			
				if($(window).scrollTop() >= $("#Menu").offset().top - $(window).height()/10 && !MenuAnimated)
					AnimateMenu();
			});

			$("#menuRows").css("opacity", "0").css("position",  "absolute").css("top", (logoSpace - menuSpace) + "px");
		}

	function AnimateMenu()
		{
			if(!MenuAnimated)
				{
					MenuAnimated = true;
					$("#Menu").animate({
						"height": logoSpace + menuSpace
					}, menuAnimDuration, "swing", function(){
						StopMenu();
					});
					$("#menuRows").animate({
						"top": logoSpace,
						"opacity": 1
					}, menuAnimDuration, "swing");
				}
		}

	function StopMenu()
		{
			$("#Menu").css("height", "auto").stop();
			$("#menuRows").css("position", "static").css("opacity", "1").stop();
		}


	function InitializeTriangle()
		{
			$("#triangle").css("border-left", window.innerWidth + "px solid transparent").css("border-right", window.innerWidth + "px solid transparent");

			$(window).resize(function(){
				$("#triangle").css("border-left", window.innerWidth + "px solid transparent").css("border-right", window.innerWidth + "px solid transparent");
			});
		}
	
	function initializeScroller()
		{
			$("#navMenu").click(function(){scroll("Menu");});
			$("#navContact").click(function(){scroll("Contact");});
			$("#navAbout").click(function(){scroll("Slider");});
		}


	function slideLeft(preventRemove)
		{
			var slide = CurrentSlide;
		
			if(slide > 0)
				slide --;
		
			else
				slide = slidesCount - 1;
		
			renderSlider(slide);
			
			if(!preventRemove)
				removeSliderScroller();
		}
	
	function slideRight(preventRemove)
		{
			var slide = CurrentSlide;
		
			if(slide < slidesCount - 1)
				slide ++;
		
			else
				slide = 0;
		
			renderSlider(slide);
			
			if(!preventRemove)
				removeSliderScroller();
		}
	
	function slideTo(i, preventRemove)
		{
			var slide = CurrentSlide;
		
			if(i >= 0 && i < slidesCount)
				{
					slide = i;
				}
		
			renderSlider(slide);
			
			if(!preventRemove)
				removeSliderScroller();
		}

	function initializeSlider(doAutoScroll)
		{
			sliderLoadImages();
			slidesCount = $("#sliderImages").children().length;
			$("#sliderCircles").css("width", 32*slidesCount + "px");

			if(sliderAnimationType === "scroll")
				{
					$("#sliderImages").css("width", slidesCount * 100 + "%");
					$("#sliderImages > div").css("width", 100 / slidesCount / sliderScrollSlidesCount + "%");
				}

			if(sliderAnimationType === "opacity")
				{
					$("#sliderImages > div").css("position", "absolute").css("top", "0");
				}

			for(let i = 0; i < slidesCount; i ++)
				{
					$("#control-circle-" + i).click(function(){
						slideTo(i)
					});
				}
	
			$("#control-arrow-1").click(function(){
				slideLeft();
			});
			
			$("#control-arrow-2").click(function(){
				slideRight();
			});

			if(doAutoScroll === true)
				addSliderScroller();

			renderSlider(CurrentSlide = 0);
		}
	
	function renderSlider(n)
		{
			CurrentSlide = n;

			if(sliderAnimationType === "scroll" && n > slidesCount - sliderScrollSlidesCount)
				{
					n = slidesCount - sliderScrollSlidesCount;
				}
		
			for(var i = 0; i < slidesCount; i ++)
				{	
					if(i === CurrentSlide)
						{
							$("#control-circle-" + i).addClass("selected");

							if(sliderAnimationType === "opacity")
								$("#slider-image-" + i).css("opacity", "1");

							if(sliderAnimationType === "scroll")
								$("#sliderImages").stop().animate({"left": "-" + +(100 / sliderScrollSlidesCount * n) + "%"}, 1000, "swing");
						}
	
					else
						{
							$("#control-circle-" + i).removeClass("selected");

							if(sliderAnimationType === "opacity")
								$("#slider-image-" + i).css("opacity", "0");
						}
				}
		}

	function addSliderScroller()
		{
			SliderScroller = window.setInterval(function(){slideRight(true);}, sliderAutoscrollInterval);
		}

	function removeSliderScroller()
		{
			clearInterval(SliderScroller);
		}

	function sliderLoadImages()
		{
			var loaded = 0;

			sliderImages.forEach(function(imageDescription){
				var image = document.getElementById("slider-image-" + imageDescription.number);
				var downloadingImage = new Image();
				downloadingImage.onload = function(){
					image.style.backgroundImage = "url(" + downloadingImage.src + ")";
					loaded += 1;

					if(loaded == Object.keys(sliderImages).length)
						{
							window.setTimeout(function()
								{
									$("#sliderImages").css("opacity", "0").css("display", "block").stop().animate({"opacity": "1"}, 1000, function(){$("#sliderLoader").css("display", "none");});
									if(!isMobile())
										{
											$("#sliderArrows").css("opacity", "0").css("display", "block").stop().animate({"opacity": "1"}, 1000);
											$("#sliderCircles").css("opacity", "0").css("display", "block").stop().animate({"opacity": "1"}, 1000);
										}
								}, 1000);
						}
				};
				downloadingImage.src = imageDescription.name;
			});

		}


	function InitializeSubscribe(timeout)
		{
			window.setTimeout(function(){
				$("#Subscribe")
				.css("opacity", "0")
				.css("display", "block")
				.animate(
					{"opacity": "1"},
					500,
					function(){
						$("#Subscribe").stop().css("opacity", "1");
					});
			}, timeout);
		}

	function CloseSubscribe()
		{
			$("#Subscribe").css("display", "none");
		}


	function isMobile()
		{ 
			if(navigator.userAgent.match(/Android/i)
			|| navigator.userAgent.match(/webOS/i)
			|| navigator.userAgent.match(/iPhone/i)
			|| navigator.userAgent.match(/iPod/i)
			|| navigator.userAgent.match(/BlackBerry/i)
			|| navigator.userAgent.match(/Windows Phone/i))
				return true;
 			
 			else
 				return false;
		}
}