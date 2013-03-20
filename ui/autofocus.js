/**
 * IE6-9 不支持autofocus属性
 * domready后聚焦，避免用户手动聚焦或滚动页面导致唐突
 * https://developer.mozilla.org/zh-CN/docs/HTML/Element/Input
 */
$.fn.autofocus = function() {
	var el = this;
	$(function() {
		if ( !('autofocus' in el) ) {
			el.focus()
		}
	})
};
