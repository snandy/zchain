// 属性相关 hasAttribute / hasAttributes
// https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttributes

/**
 * 判断，符合以下两个条件的返回 true
 *
 *   1. 文本节点且trim后为空字符串
 *   2. 注释节点
 *
 * 例如以下 HTML， P的子节点有 3 个，前后都为文本节点，且值trim后为空
 *   <p>
 *       <span>1</span>
 *   </p>
 *
 */
function isTrimmable(node) {
	return node && (node.nodeType === 3 && !node.data.trim() || node.nodeType === 8);
}

/**
 * 去掉前后的空文本及注释节点
 *
 * @param {Node} node
 */
function trimNode(node) {
	var child;
	while (( child = node.firstChild, isTrimmable(child))) {
		node.removeChild(child);
	}
	while (( child = node.lastChild, isTrimmable(child))) {
		node.removeChild(child);
	}
}

/**
 * HTML 片段转成 Fragment
 *
 * @param {Node} node
 */
var stringToFragment = function() {

	var map = {
	    efault : [0, '', ''],
	    legend : [1, '<fieldset>', '</fieldset>'],
	    tr : [2, '<table><tbody>', '</tbody></table>'],
	    col : [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>']
	};

	map.td = map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];
	map.option = map.optgroup = [1, '<select multiple="multiple">', '</select>'];
	map.thead = map.tbody = map.colgroup = map.caption = map.tfoot = [1, '<table>', '</table>'];

	var tagRE$1 = /<([\w:]+)/;
    var entityRE = /&#?\w+?;/;

    return function() {
	    var frag = document.createDocumentFragment();
	    var tagMatch = templateStr.match(tagRE$1);
	    var entityMatch = entityRE.test(templateStr);

	    if (!tagMatch && !entityMatch) {
	        // text only, return a single text node.
	        frag.appendChild(document.createTextNode(templateStr));
	    } else {
	        var tag = tagMatch && tagMatch[1];
	        var wrap = map[tag] || map.efault;
	        var depth = wrap[0];
	        var prefix = wrap[1];
	        var suffix = wrap[2];
	        var node = document.createElement('div');

	        node.innerHTML = prefix + templateStr + suffix;
	        while (depth--) {
	            node = node.lastChild;
	        }

	        var child;
	        while ( child = node.firstChild) {
	            frag.appendChild(child);
	        }
	    }
	    if (!raw) {
	        trimNode(frag);
	    }
	    return frag;    	
    }
}();
