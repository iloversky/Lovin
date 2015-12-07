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
 * Update:
 *	2010.07.16	扩展设置, 解决兼容, 双击输入框选中内容 
 *	2010.07.23	修正输入+或者c++时抛出 'invalid quantifier +' 错误
 *	2010.08.04	FF下给input添加input事件，补丁解决中文输入时触发匹配问题
 *				解决通过下拉菜单选择项目之后继续输入字符到不匹配状态后失焦时无法清空
 *	2010.08.12	jQuery.UI升级到1.84，在此基础上修改。
 *		add:	直接输入匹配字符失焦后保留
 *		add:	添加title参数，可自定义下拉按钮问题说明，默认是‘展开’
 *	2010.08.23	添加小图标样式，见下注释
 *	2010.08.27	在jQueryUI.dialog中应用，FF下点击‘展开’按钮会提交表单.  @FIXME FF下表单内展开时会闪动
 *	2011.07.29	
 *		fix:	改进生成input对象方式，修正如果选项内容包含双引号时导致value赋值错误从而input元素错乱问题
 *		fix:	兼容jQuery 1.6+ .prop() 请修改125-126行
 *		add:	根据官网添加 destroy() 方法
 *
 * Bugs:
 *
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


if (typeof $.widget === 'function' && typeof $.fn.combobox !== 'function') {
	(function($) {
		$.widget("ui.combobox", {
			options: {
				delay: 60,
				size: 0,
				title: '展开'
			},
			_create: function() {
				var self = this,
					select = self.element.hide(),
					size = self.options.size || '',
					delay = self.options.delay,
					el_selected = select.children(':selected').eq(0),
					select_name = el_selected[0] && el_selected.text()  || '';
				
				var input = self.input = $('<input/>')
					.attr('id', 'combobox_' + (''+Math.random()).slice(-6))
					.css('display', 'inline')
					.attr('size', size)
					.addClass("ui-widget ui-widget-content ui-corner-left")
					.val( select_name )
					.insertAfter(select)
					.autocomplete({
						source: function(request, response) {
							// var matcher = new RegExp(request.term, "i");	// 当输入如c++的类正则字符时会抛出 invalid quantifier +
							// edit waiting: 使用not过滤掉被禁止项目，实现通过仅用项目来动态屏蔽搜索结果
							response(select.children("option").not(':disabled').map(function() {
								var text = $(this).text();
								// if (this.value && (!request.term || matcher.test(text)))
								if (this.value && (!request.term || text.indexOf(request.term) >= 0)) {
									return {
										label: text.replace(
											new RegExp(
												"(?![^&;]+;)(?!<[^<>]*)(" +
												$.ui.autocomplete.escapeRegex(request.term) +
												")(?![^<>]*>)(?![^&;]+;)", "gi"
											), "<strong>$1</strong>" ),
										value: text,
										option: this
									};
								}
							}));
						},
						// 修正 change事件的滞后性,用于表单当通过按钮选择项目后直接提交会导致select选项未更新从而提交的是错误值 !
						select: function(event, ui) {
							select.val( ui.item.option.value );	// 更新select值
							ui.item.option.selected = true;
							self._trigger("selected", event, {
								item: ui.item.option
							});
							// select.change();
						},
						change: function(event, ui) {	// 用select事件来联动<select>,change只用来做输入不匹配时处理
							
						//if (!ui.item) {	// 当选择提示条目后继续输入到不匹配状态然后失焦,IE为空,FF为真,故跳过此判断
							var input = $(this),
								inputVal = input.val(),
								valid = false;
							select.children( "option" ).each(function() {
								if ( this.text === inputVal ) {	// 如果手动输入有匹配项目则不清空
									this.selected = valid = true;
									return false;
								}
							});
							if (!valid) {
								// remove invalid value, as it didn't match anything
								input.val('');
								select.prop('selectedIndex', -1).val('');  // for jQuery 1.6+
								//select.attr('selectedIndex', -1).val('');	// for jQuery pre 1.6
								input.data( "autocomplete" ).term = '';
								return false;
							}
							//}
						},
						delay: delay,
						minLength: 0
					})
					.dblclick(function() {
						$(this).select();
					});
				
				// 非IE下绑定input事件来兼容输入法中文输入
				if (!jQuery.browser.msie) {
					input[0].addEventListener(
							'input', 
							function() {
								var val = this.value;
								if (val) {
									$(this).autocomplete("search", val);
								}
							}, false
					);
				}
				
				input.data( "autocomplete" )._renderItem = function( ul, item ) {
					return $( "<li></li>" )
						.data( "item.autocomplete", item )
						.append( "<a>" + item.label + "</a>" )
						.appendTo( ul );
				};
				
				this.button = $('<button type="button">&nbsp;</button>')
				.attr("tabIndex", -1)
				.attr('title', self.options.title)
				.insertAfter(input)
				.button({
					icons: {
						primary: "ui-icon-triangle-1-s"
					},
					text: false
				})
				.removeClass("ui-corner-all")
				.addClass("ui-corner-right ui-button-icon comboboxButton")
				.click(function() {
					// close if already visible
					if (input.autocomplete("widget").is(":visible")) {
						input.autocomplete("close");
						return false;		
					}
					// work around a bug (likely same cause as #5265)
					$( this ).blur();

					// pass empty string as value to search for, displaying all results
					input.autocomplete("search", "").focus();
					//alert(input.autocomplete( "option", "source" ) )
					return false;	// false 和jQueryUI.dialog协作时FF下会提交表单
				});
				el_selected = select_name = null;
			},
				
			_setOption: function(key, value) {
				var self = this;
				var select = self.element,
					input = select.next();
				if (key == 'size') {
					value = parseInt(value, 10);
					input.attr('size', value);	
				}
				else {
					this.options[key] = value;
				}
			},

			destroy: function() {
				 this.input.remove();
				 this.button.remove();
				 this.element.show();
				 $.Widget.prototype.destroy.call( this );
			}
		});
	})(jQuery);
}
// ui-autocomplete-input ui-widget ui-widget-content ui-corner-left ui-autocomplete-loading
