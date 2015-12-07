/*
 * jQuery Combobox
 * http://jqueryui.com/demos/autocomplete/#combobox
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 * Modify by waiting@issence.com
 * http://waiting.javaeye.com/blog/714655
 *
 * Depends:
 *	jQuery.UI v1.84
 *	jquery.ui.widget.js
 *	UI Core, UI Widget, UI Position
 * $(selector).combobox()
 * $(selector).combobox({size: 30})
 * $(selector).combobox({size: 30, delay: 300, title:'Show All Items'})	// greater delay for ajax
 *
 */

/* FIX 下拉超长则纵向滚动条*/
/* jQueryUI默认大按钮样式
<style>
.ui-button-icon-only .ui-button-text { padding: 0.35em; }
.ui-autocomplete-input {margin: 0; padding: 0.5em 0 0.51em 0.4em; *padding:0.72em 0 0.46em 0.4em;}
button.comboboxButton { margin-left: -1px; width: 2.2em; line-height:1.35; }
ul.ui-autocomplete {max-height: 200px; overflow-x: hidden; overflow-y: auto; padding:2px;}
</style>
*/

/* jQueryUI小按钮样式
<style>
button.comboboxButton {width:2em;  margin-left: -1px;}
button.comboboxButton .ui-button-text {display:block; line-height:1;}
.ui-autocomplete-input {margin:0; padding:0.3em 0 0.31em 0.3em; *padding:0.38em 0 0.46em 0.3em;}
ul.ui-autocomplete {max-height: 200px; overflow-x: hidden; overflow-y: auto; padding:2px;}
</style>
*/

if(typeof $.widget==='function'&&typeof $.fn.combobox!=='function'){(function($){$.widget("ui.combobox",{options:{delay:60,size:0,title:'展开'},_create:function(){var d=this,select=d.element.hide(),size=d.options.size||'',delay=d.options.delay,el_selected=select.children(':selected').eq(0),select_name=el_selected[0]&&el_selected.text()||'';var e=d.input=$('<input/>').attr('id','combobox_'+(''+Math.random()).slice(-6)).css('display','inline').attr('size',size).addClass("ui-widget ui-widget-content ui-corner-left").val(select_name).insertAfter(select).autocomplete({source:function(b,c){c(select.children("option").not(':disabled').map(function(){var a=$(this).text();if(this.value&&(!b.term||a.indexOf(b.term)>=0)){return{label:a.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)("+$.ui.autocomplete.escapeRegex(b.term)+")(?![^<>]*>)(?![^&;]+;)","gi"),"<strong>$1</strong>"),value:a,option:this}}}))},select:function(a,b){select.val(b.item.option.value);b.item.option.selected=true;d._trigger("selected",a,{item:b.item.option})},change:function(a,b){var c=$(this),inputVal=c.val(),valid=false;select.children("option").each(function(){if(this.text===inputVal){this.selected=valid=true;return false}});if(!valid){c.val('');select.attr('selectedIndex',-1).val('');c.data("autocomplete").term='';return false}},delay:delay,minLength:0}).dblclick(function(){$(this).select()});if(!jQuery.browser.msie){e[0].addEventListener('input',function(){var a=this.value;if(a){$(this).autocomplete("search",a)}},false)}e.data("autocomplete")._renderItem=function(a,b){return $("<li></li>").data("item.autocomplete",b).append("<a>"+b.label+"</a>").appendTo(a)};this.button=$('<button type="button">&nbsp;</button>').attr("tabIndex",-1).attr('title',d.options.title).insertAfter(e).button({icons:{primary:"ui-icon-triangle-1-s"},text:false}).removeClass("ui-corner-all").addClass("ui-corner-right ui-button-icon comboboxButton").click(function(){if(e.autocomplete("widget").is(":visible")){e.autocomplete("close");return false}$(this).blur();e.autocomplete("search","").focus();return false});el_selected=select_name=null},_setOption:function(a,b){var c=this;var d=c.element,input=d.next();if(a=='size'){b=parseInt(b,10);input.attr('size',b)}else{this.options[a]=b}},destroy:function(){this.input.remove();this.button.remove();this.element.show();$.Widget.prototype.destroy.call(this)}})})(jQuery)}
