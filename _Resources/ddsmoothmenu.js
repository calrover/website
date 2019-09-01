//** Smooth Navigational Menu- By Dynamic Drive DHTML code library: http://www.dynamicdrive.com
//** Script Download/ instructions page: http://www.dynamicdrive.com/dynamicindex1/ddlevelsmenu/
//** Menu created: Nov 12, 2008

//** Dec 12th, 08" (v1.01): Fixed Shadow issue when multiple LIs within the same UL (level) contain sub menus: http://www.dynamicdrive.com/forums/showthread.php?t=39177&highlight=smooth

//** Feb 11th, 09" (v1.02): The currently active main menu item (LI A) now gets a CSS class of ".selected", including sub menu items.

//** May 1st, 09" (v1.3):
//** 1) Now supports vertical (side bar) menu mode- set "orientation" to 'v'
//** 2) In IE6, shadows are now always disabled

//** July 27th, 09" (v1.31): Fixed bug so shadows can be disabled if desired.
//** Feb 2nd, 10" (v1.4): Adds ability to specify delay before sub menus appear and disappear, respectively. See showhidedelay variable below

/*
2010-08: Adapted for use in Sandvox 2.
*/



var ddsmoothmenu={

/* 2010-08-05, ssp:
	Use shorter times. Check whether they may still be too long.
	Remove arrow image setup, we do this in CSS.
*/
//Specify full URL to down and right arrow images (0 is padding-right added to top level LIs with drop downs):
transition: {overtime:20, outtime:300}, //duration of slide in/ out animation, in milliseconds
shadow: {enable:false, offsetx:5, offsety:5}, //enable shadow?
showhidedelay: {showdelay: 40, hidedelay: 80}, //set delay in milliseconds before sub menus appear and disappear, respectively

///////Stop configuring beyond here///////////////////////////

detectwebkit: navigator.userAgent.toLowerCase().indexOf("applewebkit")!=-1, //detect WebKit browsers (Safari, Chrome etc)
detectie6: document.all && !window.XMLHttpRequest,
detectoldopera: (window.opera && parseInt(window.opera.version().split('.')[0]) < 11),

/* 2010-08-05, ssp
	Removed getajaxmenu function, our menus are in markup.
*/

buildmenu:function($, setting){
	var smoothmenu=ddsmoothmenu
	var $mainmenu=$("#"+setting.mainmenuid+">ul") //reference main menu UL
	$mainmenu.parent().get(0).className=setting.classname || "ddsmoothmenu"
	var $headers=$mainmenu.find("ul").parent()
	/* 2010-08-01, ssp
		Replaced selector a:eq(0) by a:eq(0),.in:eq(0) in the following lines,
		so we cann affect the .currentItem without an a but just a span.in as well.
	*/
	$headers.hover(
		function(e){
			$(this).children('a:eq(0),.in:eq(0)').addClass('selected');
		},
		function(e){
			$(this).children('a:eq(0),.in:eq(0)').removeClass('selected');
		}
	)
	$headers.each(function(i){ //loop through each LI header
		/* 2010-08-01, ssp:
			Use really high z-index, so we are sure to exceed z-indices used in all designs.
		*/
		var $curobj = $(this); //reference current LI header
		/* 2011-09-22 & 2013-03-06 (jQuery 1.9), ssp:
			Opera < 11 does not render the submenu items when the z-index line has run, do not run it in that case.
		*/
		if (!ddsmoothmenu.detectoldopera) {
			$curobj.css({'zIndex': 6000-i});
		}
		var $subul=$curobj.find('ul:eq(0)').css({display:'block'});
		$subul.data('timers', {})
		this.istopheader=$curobj.parents("ul").length==1? true : false //is top level header?

		/* 2010-08-01, ssp:
			The following lines removed because we handle the padding in CSS in Sandvox.
			$curobj.children("a:eq(0),.in:eq(0)").css(this.istopheader? {paddingRight: smoothmenu.arrowimages.down[2]} : {}).append( //add arrow images
			'<img src="'+ (this.istopheader && setting.orientation!='v'? smoothmenu.arrowimages.down[1] : smoothmenu.arrowimages.right[1])
			+'" class="' + (this.istopheader && setting.orientation!='v'? smoothmenu.arrowimages.down[0] : smoothmenu.arrowimages.right[0])
			+ '" style="border:0;" />'
		*/

		/* 2010-08-01, ssp:
			Slightly change DOM, to take into account the span.in and the potential lack of link.
			Old DOM: a > img
			New DOM: a > span.in > img for items with a link and span.in > img for .currentPage.
			Also remove style="border:0" because it's part of our CSS already.
		*/
		var firstLink = $curobj.children("a:eq(0)");
		var element;
		if (firstLink.length == 1) {
			element = firstLink.children(".in:eq(0)");
		}
		else {
			element = $curobj.children(".in:eq(0)");
		}

		/* 2010-08-03, ssp:
			Don't use images like original but insert a div instead,
			which will be styles approriately by CSS.
		*/
		element.append('<span class="submenu-indicator"></span>');

		/* 2010-08-05, ssp:
			Remove shadow code, we do this in CSS.
		*/
		$curobj.hover(
			function(e){
				var $targetul = $subul; //reference UL to reveal
				var header = $curobj.get(0); //reference header LI as DOM object
				/* 2012-09-30, ssp:
					 Get li sizing information. Moved here from initialisation because
					 	Opera 12 can give incorrect values there.
				*/
				if (!header._dimensions) {
					header._dimensions = {
						w: header.offsetWidth,
						h: header.offsetHeight,
						subulw: $targetul.outerWidth(),
						subulh: $targetul.outerHeight()
					};
				}
				$targetul.css({
					top: header.istopheader && setting.orientation!='v'? header._dimensions.h + "px" : 0
				});
				clearTimeout($targetul.data('timers').hidetimer)
				$targetul.data('timers').showtimer=setTimeout(function(){
					header._offsets={left:$curobj.offset().left, top:$curobj.offset().top}
					var menuleft=header.istopheader && setting.orientation!='v'? 0 : header._dimensions.w
					menuleft=(header._offsets.left+menuleft+header._dimensions.subulw>$(window).width())? (header.istopheader && setting.orientation!='v'? -header._dimensions.subulw+header._dimensions.w : -header._dimensions.w) : menuleft //calculate this sub menu's offsets from its parent
					if ($targetul.queue().length<=1){ //if 1 or less queued animations
						$targetul.css({left:menuleft+"px", width:header._dimensions.subulw+'px'}).animate({height:'show',opacity:'show'}, ddsmoothmenu.transition.overtime)
						if (smoothmenu.shadow.enable){
							var shadowleft=header.istopheader? $targetul.offset().left+ddsmoothmenu.shadow.offsetx : menuleft
							var shadowtop=header.istopheader?$targetul.offset().top+smoothmenu.shadow.offsety : header._shadowoffset.y
							if (!header.istopheader && ddsmoothmenu.detectwebkit){ //in WebKit browsers, restore shadow's opacity to full
								header.$shadow.css({opacity:1})
							}
							header.$shadow.css({overflow:'', width:header._dimensions.subulw+'px', left:shadowleft+'px', top:shadowtop+'px'}).animate({height:header._dimensions.subulh+'px'}, ddsmoothmenu.transition.overtime)
						}
					}
				}, ddsmoothmenu.showhidedelay.showdelay)
			},
			function(e){
				var $targetul=$subul
				var header=$curobj.get(0)
				clearTimeout($targetul.data('timers').showtimer)
				$targetul.data('timers').hidetimer=setTimeout(function(){
					$targetul.animate({height:'hide', opacity:'hide'}, ddsmoothmenu.transition.outtime)
					if (smoothmenu.shadow.enable){
						if (ddsmoothmenu.detectwebkit){ //in WebKit browsers, set first child shadow's opacity to 0, as "overflow:hidden" doesn't work in them
							header.$shadow.children('div:eq(0)').css({opacity:0})
						}
						header.$shadow.css({overflow:'hidden'}).animate({height:0}, ddsmoothmenu.transition.outtime)
					}
				}, ddsmoothmenu.showhidedelay.hidedelay)
			}
		) //end hover
	}) //end $headers.each()
	$mainmenu.find("ul").css({display:'none', visibility:'visible'})
},

/* 2010-08-05, ssp
	Remove custom menu colour and shadow code, we do this in CSS.
	Remove AJAX menu building, our menus are in markup.
*/
init:function(setting){
	$(document).ready(function($){ //ajax menu?
		ddsmoothmenu.buildmenu($, setting)
	})
}

} //end ddsmoothmenu variable
