/**
SidJS - JavaScript And CSS Lazy Loader 0.1

Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of SidJS nor the names of its contributors may be
      used to endorse or promote products derived from this software without
      specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL Alexandru Marasteanu BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


Sniffing by Boris Popoff <http://gueschla.com/> (see http://dean.edwards.name/weblog/2007/03/sniff/)

So why sniff? Well, the state of the browser is pretty fucked up:
Opera:
- script:
    - detects load
    - triggers load, readystatechange
- link:
    - detects load
    - triggers load
Safari, Chrome, Firefox:
- script:
    - detects load
    - triggers load
- link:
    - detects load (WebKit)
    - triggers NONE
IE8:
- script:
    - detects readystatechange
    - triggers readystatechange
- link:
    - detects load, readystatechange
    - triggers load, readystatechange
Assume all versions of IE support readystatechange
*/
(function() {
	var win = window,
		doc = document,
		proto = 'prototype',
		head = doc.getElementsByTagName('head')[0],
		body = doc.getElementsByTagName('body')[0],
		sniff = /*@cc_on!@*/1 + /(?:Gecko|AppleWebKit)\/(\S*)/.test(navigator.userAgent); // 0 - IE, 1 - O, 2 - GK/WK

	var createNode = function(tag, attrs) {
		var attr, node = doc.createElement(tag);
		for (attr in attrs) {
			if (attrs.hasOwnProperty(attr)) {
				node.setAttribute(attr, attrs[attr]);
			}
		}
		return node;
	};

	var load = function(type, urls, callback, scope) {
		if (this == win) {
			return new load(type, urls, callback, scope);
		}

		urls = (typeof urls == 'string' ? [urls] : urls);
		scope = (scope ? (scope == 'body' ? body : head) : (type == 'js' ? body : head));

		this.callback = callback || function() {};
		this.queue = [];

		var node, i = len = 0, that = this;

		for (i = 0, len = urls.length; i < len; i++) {
			this.queue[i] = 1;
			if (type == 'css') {
				node = createNode('link', { type: 'text/css', rel: 'stylesheet', href: urls[i] });
			}
			else {
				node = createNode('script', { type: 'text/javascript', src: urls[i] });
			}
			scope.appendChild(node);

			if (sniff) {
				if (type == 'css' && sniff == 2) {
					var intervalID = setInterval(function() {
						try {
							node.sheet.cssRules;
							clearInterval(intervalID);
							that.__callback();
						}
						catch (ex) {}
					}, 100);
				}else {
					node.onload = function() {
						that.__callback();
					}
				}
			}
			else {
				node.onreadystatechange = function() {
					if (/^loaded|complete$/.test(this.readyState)) {
						this.onreadystatechange = null;
						that.__callback();
					}
				};
			}
		}

		return this;
	};
	load[proto].__callback = function() {
		if (this.queue.pop() && (this.queue == 0)) { this.callback(); }
	};

	window.Sid = {
		css: function(urls, callback, scope) {
			return load('css', urls, callback, scope);
		},
		js: function(urls, callback, scope) {
			return load('js', urls, callback, scope);
		},
		load: function(type, urls, callback, scope) {
			return load(type, urls, callback, scope);
		}
	};
})();
