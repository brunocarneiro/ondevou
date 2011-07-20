/*
 * jQuery Star Rating plugin
 * Version 1.0.0 (10/02/2009)
 * @requires jQuery v1.2.1 or later
 *
 * Copyright (c) 2009 Aleksandar Pavic
 * http://acosonic.com/jquery_star_rating/

USAGE:
	$(  ).starRatingImages(); 	//uses images
		or
	$(  ).starRatingBg(); 		//uses 1 background image
*/
(function($) {

$.fn.starRating = function(options) {

var opts = $.extend({}, $.fn.starRating.defaults, options);

return this.each(function() {

	$this = $(this);
	var ratingID = $(this).attr('id');			//grab id of element star rating is used on
	if ($.fn.starRating.opts[ratingID]){
		$this.empty();
	}
	var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
	//read settings (enabled/disabled) from configuration or starRating object if it's already used
	$.fn.starRating.clickable[ratingID]=o.clickable != false;
	if($.fn.starRating.clickable[ratingID] != false) {
		$.fn.starRating.clickable[ratingID] = true;
	}
	//read settings (enabled/disabled) from configuration or starRating object if it's already used
	$.fn.starRating.hoverable[ratingID] = o.hoverable != false;
	
	if ($.fn.starRating.hoverable[ratingID] != false) {
		$.fn.starRating.hoverable[ratingID] = true;
        //add hover functionality to stars holder
        //$this.hover( function() {console.log("jos");}, function() {	$.fn.starRating.updateStars(o.rating,ratingID);});
        $this.bind('mouseout', function(){
			$.fn.starRating.updateStars(o.rating,ratingID);
		});
    }
	$.fn.starRating.opts[ratingID]=o;			//remember the settings for rate function
	//o.rating = Math.round(o.rating);
	$.fn.starRating.drawStars(o.rating,ratingID);
 });
 };
 
// rating function, performs ajax rating
$.fn.starRating.rate = function(val,ratingID) {
	var o = $.fn.starRating.opts[ratingID];
	if (o.click){
		o.click(o, val);
	}
  var paramId = o.paramId;
	var paramValue = o.paramValue;
	//ajax request with callback
  var params = {};
  if (paramId){
  params[paramId] = ratingID; 
  }
  if (paramValue){
	params[paramValue] = val;
	}
  for(param in o.customParams) {
    params[param] = o.customParams[param];
  }

  $.get(o.ratingUrl, params , function(data) { //perform ajax voting and update stars with new result
		if(data){
			if (typeof(o.result)=='function') {
				data = o.result(data);
				$.fn.starRating.clickable[ratingID] = (data.clickable === true);
				$.fn.starRating.hoverable[ratingID] = (data.hoverable === true);
				$("#"+ratingID+"no").html(data.rating);
				$.fn.starRating.updateStars(data.rating, ratingID);
			} else {
				$.fn.starRating.clickable[ratingID] = false;
				$.fn.starRating.hoverable[ratingID] = false;
				$("#"+ratingID+"no").html(o.rating);
				$.fn.starRating.updateStars(data, ratingID);
			}
			if (typeof(o.sucess)=='function') o.sucess(data);
		} else if(typeof(o.failure)=='function') o.failure(data);
	});	
};

$.fn.starRating.drawStars = function(rate,ratingID) {
	var o = $.fn.starRating.opts[ratingID];
	for(var i=0;i<o.ratingStars;i++) {			//create stars for voting
		var j = i+1;
		var star				= document.createElement('img');
		if(j<=rate) star.src 	= o.ratedImage;
		else star.src		= o.basicImage;
		star.id					= ratingID + "StarRating" + j;
		star.alt				= j;
		star.title			= j;
		var $star				= $(star);
		this.star				= $star;
		$this.append($star);
    //add onclick voting functionality if click functionality is enabled
		if($.fn.starRating.clickable[ratingID] == true) {
			$('#'+star.id).click(function() {
			      $.fn.starRating.hoverable[ratingID] = false;
            $this.unbind('mouseout');
            if($.fn.starRating.clickable[ratingID] == true)
							$.fn.starRating.rate($(this).attr('title'),ratingID);
              return false;
			});
		}
		
    //add hover functionality if click functionality is enabled
		if($.fn.starRating.hoverable[ratingID] == true) {
		$('#'+star.id).hover(function() {
		 if($.fn.starRating.hoverable[ratingID] == true) {
			 $("#"+ratingID+"no").html($(this).attr('alt'));
			if($(this).attr("src") == o.basicImage || $(this).attr("src") == o.ratedImage) {
				$(this).attr("src",o.hoverImage);
				$(this).prevAll().attr("src",o.hoverImage);
			} else {
				if($(this).attr('alt')<=rate) { //if you are hovering a rated star
					$(this).attr("src",o.ratedImage);
					$(this).nextAll(function(){
						if($(this).attr('alt')<=rate)$(this).attr("src",o.ratedImage);
						else $(this).attr("src",o.basicImage);
					});
				} else {
					if($(this).attr('alt')>=rate) { //if you are hovering unrated star
					$(this).nextAll().attr("src",o.basicImage);
					}

				}
			}
		 }
		},function() {
				if($.fn.starRating.hoverable[ratingID] == true) {
					if($(this).attr('alt')<=rate) $(this).attr("src",o.ratedImage);
					else $(this).attr("src",o.basicImage);
					}
		});
		}
		
	}
	if(o.showNumber) { //show value as number after the stars ***** 4
		var numb				= document.createElement('span');
		numb.id					= ratingID + "no";
		$this.append(numb);
		$("#"+numb.id).html(o.rating);
	}
}

$.fn.starRating.updateStars = function(rate,ratingID) {
	var o = $.fn.starRating.opts[ratingID];
	$("#"+ratingID+"no").html(rate);
	for(var i=0;i<o.ratingStars;i++) {			
		var j = i+1;
		if(j<=rate) $("#"+ratingID+"StarRating" + j).attr('src',o.ratedImage);
		else $("#"+ratingID+"StarRating" + j).attr('src',o.basicImage);
		}
}
  
  $.fn.starRating.clickable = [];
  $.fn.starRating.hoverable = [];
  $.fn.starRating.opts = {};
  
  $.fn.starRating.defaults = {
	basicImage   : 'star.gif',	
	ratedImage   : 'star_hover.gif',	
	hoverImage   : 'star_blue.gif',
	ratingStars  : 5,             //how much stars to draw
	ratingUrl	   : 'rate.php',    //url for ajax request which will manage  ratings
	paramValue   : 'rate',        //parameter holding the value of rating ?rate=4
	paramId      : 'id',          //parameter holding the id of rate ?rate=4&id=photo442
	customParams : {},            //lets you use custom params for request for example ?rate=4&id=photo442&type=photos ...
    clickable	: true,             //click enabled or disabled
	hoverable	: true,             //hover effect enabled or disabled
	result		: null,				// funcao para tratar resultado
	sucess		: null,             //callback on sucessful rating
	failure		: null,             //callback on failure rating
	rating		: 0,                //current rating
	showNumber	: false           //show number after stars
  };

})(jQuery);