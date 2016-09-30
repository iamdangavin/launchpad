!function($,window,undefined){function reinitHeightMatch(){$("[data-height-match-children]").each(function(){var me=$(this),cur_height_match=me.attr("data-height-match-children");me.removeAttr("data-height-match-children").attr("data-height-match-group",cur_height_match).children().each(function(){$(this).attr("data-height-match","")})})}function initHeightMatch(){function heightMatch(){$("[data-height-match-group]").each(function(){var me=$(this),height=0,lowest_width=me.attr("data-height-match-group"),is_match=!1,matchable=me.children("[data-height-match]");me.attr("data-height-match-query")&&(matchable=me.find(me.attr("data-height-match-query")+"[data-height-match]")),isNaN(+lowest_width)?(is_match=window.matchMedia(lowest_width),is_match=is_match===!1||is_match.matches):is_match=+lowest_width<$(document.body).width(),is_match?matchable.css("height","auto").each(function(){var h=$(this).outerHeight();h>height&&(height=h)}).css("height",height):matchable.css("height","auto")})}reinitHeightMatch(),setTimeout(heightMatch,1),$(window).on("resizeEnd",heightMatch),$(document.body).on("ajaxComplete load",function(){setTimeout(heightMatch,100)})}function detectTouchCapable(){return window.supports.touch!==undefined?void(window.supports.touch?$(document.body).addClass("touch"):$(document.body).addClass("no-touch")):(window.hasOwnProperty&&window.hasOwnProperty("ontouchstart")?($(document.body).addClass("touch"),window.supports.touch=!0):($(document.body).addClass("no-touch"),window.supports.touch=!1),void(gaon&&ga("set","metric1",window.supports.touch?1:0)))}function detectTransitions(){var test;return window.supports.transitions!==undefined?void(window.supports.transitions&&$(document.body).addClass("css-transitions")):(test=document.createElement("p").style,"transition"in test||"WebkitTransition"in test||"MozTransition"in test||"msTransition"in test?($(document.body).addClass("css-transitions"),window.supports.transitions=!0):window.supports.transitions=!1,void(gaon&&ga("set","metric2",window.supports.transitions?1:0)))}function detectPositionSticky(){var test;return window.supports.sticky!==undefined?void(window.supports.sticky?$(document.body).addClass("css-sticky"):$(document.body).addClass("css-not-sticky")):(test=$('<div style="position: absolute; position: -webkit-sticky; position: -moz-sticky; position: -ms-sticky; position: sticky; "></div>'),"absolute"!==test.css("position")?(window.supports.sticky=!0,$(document.body).addClass("css-sticky")):(window.supports.sticky=!1,$(document.body).addClass("css-not-sticky")),void(gaon&&ga("set","metric3",window.supports.sticky?1:0)))}function detectDPI(){window.supports.dpi=1,window.devicePixelRatio!==undefined&&(window.supports.dpi=window.devicePixelRatio),gaon&&ga("set","metric4",window.supports.dpi)}function handleGrid(e){var win=$(window),body=$(document.body),coverel=win.height()>body.height()?win:body,grid=body.css("line-height"),c,l;if(71===e.which&&$(e.target).is("body"))if(body.hasClass("grid"))$(".grid-item").remove(),body.removeClass("grid");else{for(l=$("<p>"),$(document.body).append(l),grid=+l.css("line-height").replace("px",""),l.remove(),body.addClass("grid"),c=grid,l=coverel.width();c<l;c+=grid)body.append($('<div class="grid-item vertical"></div>').css("left",c+"px"));for(c=grid,l=coverel.height();c<l;c+=grid)body.append($('<div class="grid-item horizontal"></div>').css("top",c+"px"))}}function reinit(){window.dev&&console.log("Executing multi-run initialization."),document.body.className=document.body.className.replace(/no-js/g,"js"),window.navigator.standalone&&(document.body.className+=" apple-standalone"),detectDPI(),detectPositionSticky(),detectTransitions(),detectTouchCapable(),reinitHeightMatch(),$(document.body).trigger("launchpadReinit")}function init(){var body=$(document.body),addthis_id=$("body[data-addthis]"),scrollingIsJanky=body.data("scroll-helper"),doNotSupport=[/MSIE [12345678]\.(?!.*IEMobile)/],l,i,startupImage=!1;for(body.trigger("launchpadPreInit"),window.supports={},window.dev&&(window.dev=window.console&&window.dev),window.dev&&console.log("Executing first run initialization."),window._gaq||(window._gaq=[]),window.doNotSupportOverride&&(doNotSupport=doNotSupportOverride),i=0,l=doNotSupport.length;i<l;i++)if(navigator.userAgent.match(doNotSupport[i]))return $("#screen-css").remove(),void $("head").append($('<link rel="stylesheet" type="text/css" id="screen-css" media="screen, projection, handheld, tv" href="/css/unsupported.css">'));initHeightMatch(),$(window).load(initHeightMatch),$('[data-ajax="true"]').length&&history.pushState?window.supports.ajax=!0:window.supports.ajax=!1,addthis_id.length&&(addthis_id=addthis_id.data("addthis"),body.append($('<script src="//s7.addthis.com/js/300/addthis_widget.js#pubid='+addthis_id+'"></script>'))),window.navigator.standalone&&window.supports.ajax&&($("link[rel=apple-touch-startup-image]").each(function(){var me=$(this),media=me.attr("media");media&&window.matchMedia(media).matches&&(startupImage=me.attr("href"))}),startupImage&&(startupImage=$('<img src="'+startupImage+'">').load(function(){setTimeout(function(){$("#apple-standalone-startup-image").animate({opacity:0},750,function(){$(this).remove()})},1e3)}),body.append($('<div id="apple-standalone-startup-image"></div>')),$("#apple-standalone-startup-image").append(startupImage))),body.on("click","*",function(e){var i=$(this),href=i.attr("href");href&&window.navigator.standalone&&!window.supports.ajax&&("/"!==href.substr(0,1)&&location.href.split("/")[2]!==href.split("/")[2]||(e.preventDefault(),location.href=href))}).on("ajaxComplete",reinit),scrollingIsJanky&&$(window).on("scrollStart scrollEnd",function(e){switch(e.type){case"scrollStart":$(document.body).append($('<div id="launchpad-cover"></div>').css({"-webkit-transform":"translate3d(0,0,0)",transform:"translate3d(0,0,0)",position:"fixed",top:"0",right:"0",left:"0",bottom:"0",opacity:"0","z-index":"9","pointer-events":"none"}));break;case"scrollEnd":$("#launchpad-cover").remove()}}),body.on("click",".flexible-accordion-list dt a",function(e){e.preventDefault(),$(this).closest("dt").toggleClass("target")}).on("addThisInit",function(){addthis_id.length&&(addthis.init(),addthis.toolbox(".addthis_toolbox"))}),window.dev===!0&&$(document).on("keyup","body",handleGrid),body.trigger("launchpadInit"),reinit()}if($===undefined)return void(window.dev&&window.console&&console.log("jQuery failed to load in time.  Launchpad JavaScript is disabled."));var gaon=$("#google-analytics").length>0;$(window).on("resize",function(){var curViewPortValue=window.getComputedStyle(document.querySelector('meta[name="viewport"]')).getPropertyValue("content");curViewPortValue!==$('meta[name="viewport"]').attr("data-current-size")&&($('meta[name="viewport"]').attr("data-current-size",curViewPortValue),$(window).trigger("mediaQueryChange",[curViewPortValue]))}),$('meta[name="viewport"]').attr("data-current-size",window.getComputedStyle(document.querySelector('meta[name="viewport"]')).getPropertyValue("content")),window.currentMediaQuerySize=function(){return window.getComputedStyle(document.querySelector('meta[name="viewport"]')).getPropertyValue("content")},$(document).ready(init)}(window.jQuery,this),function($,window,undefined){"use strict";var customEvents=["scrollStart","scrollEnd","resizeStart","resizeEnd"],timeoutResize=250,timeoutScroll=100;$!==undefined&&($.event.special.scrollStart={enabled:!0,setup:function(){function trigger(){$.event.dispatch.call(me,"scrollStart")}var me=this,jqme=$(me),timer;"undefined"==typeof jqme.data("track-scroll")&&jqme.data("track-scroll-start",!1),jqme.bind("touchmove.scrollstart scroll.scrollstart",function(){jqme.data("track-scroll-start")||(jqme.data("track-scroll-start",!0),trigger()),clearTimeout(timer),timer=setTimeout(function(){jqme.data("track-scroll-start",!1)},timeoutScroll)})},teardown:function(){$(this).unbind("touchmove.scrollstart scroll.scrollstart")}},$.event.special.scrollEnd={enabled:!0,setup:function(){function trigger(){$.event.dispatch.call(me,"scrollEnd")}var me=this,jqme=$(me),timer;"undefined"==typeof jqme.data("track-scroll-end")&&jqme.data("track-scroll-end",!1),jqme.bind("touchmove.scrollend scroll.scrollend",function(){jqme.data("track-scroll-end")||jqme.data("track-scroll-end",!0),clearTimeout(timer),timer=setTimeout(function(){jqme.data("track-scroll-end",!1),trigger()},timeoutScroll)})},teardown:function(){$(this).unbind("touchmove.scrollend scroll.scrollend")}},$.event.special.resizeStart={enabled:!0,setup:function(){function trigger(){$.event.dispatch.call(me,"resizeStart")}var me=this,jqme=$(me),timer;"undefined"==typeof jqme.data("track-resize")&&jqme.data("track-resize-start",!1),jqme.bind("resize.resizestart",function(){jqme.data("track-resize-start")||(jqme.data("track-resize-start",!0),trigger()),clearTimeout(timer),timer=setTimeout(function(){jqme.data("track-resize-start",!1)},timeoutResize)})},teardown:function(){$(this).unbind("resize.resizestart")}},$.event.special.resizeEnd={enabled:!0,setup:function(){function trigger(){$.event.dispatch.call(me,"resizeEnd")}var me=this,jqme=$(me),timer;"undefined"==typeof jqme.data("track-resize-end")&&jqme.data("track-resize-end",!1),jqme.bind("resize.resizeend",function(){jqme.data("track-resize-end")||jqme.data("track-resize-end",!0),clearTimeout(timer),timer=setTimeout(function(){jqme.data("track-resize-end",!1),trigger()},timeoutResize)})},teardown:function(){$(this).unbind("resize.resizeend")}},$.each(customEvents,function(i,name){$.fn[name]=function(handler){return handler?this.bind(name,handler):this.trigger(name)}}))}(window.jQuery,this),function(){function placeHolderFocus(e){e=e||event;var t=e.target||e.srcElement,placeholder=t.getAttribute("placeholder");t.value===placeholder&&(t.value="")}function placeHolderBlur(e){e=e||event;var t=e.target||e.srcElement,placeholder=t.getAttribute("placeholder");""===t.value&&(t.value=placeholder)}function init(){var standards=window.addEventListener,els=document.getElementsByTagName("*"),l=els.length,c=0,cur;for(c;c<l;c+=1)switch(cur=els[c],cur.nodeName.toLowerCase()){case"input":case"textarea":cur.getAttribute("placeholder")&&(standards?(cur.addEventListener("focus",placeHolderFocus),cur.addEventListener("blur",placeHolderBlur)):(cur.attachEvent("onfocus",placeHolderFocus),cur.attachEvent("onblur",placeHolderBlur)),""===cur.value&&(cur.value=cur.getAttribute("placeholder")))}}"placeholder"in document.createElement("input")||init()}(),function(){window.pollyfillMediaMatch=function(mq){var ie_precheck=/MSIE [2345678]\./,testel_width=4,el_id_base="media-match-polyfill-check-"+(new Date).getTime(),syle_base=el_id_base+"-style",style=document.createElement("style"),style_cont="#"+el_id_base+"{width: "+testel_width+"px; position: absolute;}",testel=document.createElement("div");return!navigator.userAgent.match(ie_precheck)&&(testel.id=el_id_base,style.id=syle_base,style_cont="@media "+mq+" { "+style_cont+" }",style.styleSheet?style.styleSheet.cssText=style_cont:style.appendChild(document.createTextNode(style_cont)),(document.head||document.getElementsByName("head")[0]).appendChild(style),document.body.appendChild(testel),testel_width=testel.offsetWidth===testel_width,style.parentNode.removeChild(style),testel.parentNode.removeChild(testel),{matches:testel_width,media:mq})},window.matchMedia||(window.matchMedia=window.pollyfillMediaMatch)}();