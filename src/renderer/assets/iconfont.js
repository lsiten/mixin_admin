(function (window) { var svgSprite = '<svg><symbol id="el-icon-xuelv-user" viewBox="0 0 1024 1024"><path d="M283.083845 290.799062c0 126.207423 102.313224 228.5186 228.511437 228.5186 126.2064 0 228.514507-102.311177 228.514507-228.5186 0-126.202307-102.308107-228.51553-228.514507-228.51553C385.390929 62.283532 283.083845 164.596755 283.083845 290.799062L283.083845 290.799062zM647.796314 519.854898c-39.302121 25.200962-86.044702 39.814798-136.202055 39.814798-50.154283 0-96.894817-14.613836-136.197962-39.814798-171.106006 56.998155-294.485011 218.435964-294.485011 408.697239 0 11.157107 0.422625 22.218024 1.254573 33.164331l858.852706 0c0.831948-10.946306 1.255597-22.007223 1.255597-33.164331 0-190.261275-123.372865-351.698061-294.483988-408.697239L647.796314 519.854898zM647.796314 519.854898"  ></path></symbol></svg>'; var script = (function () { var scripts = document.getElementsByTagName('script'); return scripts[scripts.length - 1] }()); var shouldInjectCss = script.getAttribute('data-injectcss'); var ready = function (fn) { if (document.addEventListener) { if (~['complete', 'loaded', 'interactive'].indexOf(document.readyState)) { setTimeout(fn, 0) } else { var loadFn = function () { document.removeEventListener('DOMContentLoaded', loadFn, false); fn() }; document.addEventListener('DOMContentLoaded', loadFn, false) } } else if (document.attachEvent) { IEContentLoaded(window, fn) } function IEContentLoaded (w, fn) { var d = w.document, done = false, init = function () { if (!done) { done = true; fn() } }; var polling = function () { try { d.documentElement.doScroll('left') } catch (e) { setTimeout(polling, 50); return }init() }; polling(); d.onreadystatechange = function () { if (d.readyState == 'complete') { d.onreadystatechange = null; init() } } } }; var before = function (el, target) { target.parentNode.insertBefore(el, target) }; var prepend = function (el, target) { if (target.firstChild) { before(el, target.firstChild) } else { target.appendChild(el) } }; function appendSvg () { var div, svg; div = document.createElement('div'); div.innerHTML = svgSprite; svgSprite = null; svg = div.getElementsByTagName('svg')[0]; if (svg) { svg.setAttribute('aria-hidden', 'true'); svg.style.position = 'absolute'; svg.style.width = 0; svg.style.height = 0; svg.style.overflow = 'hidden'; prepend(svg, document.body) } } if (shouldInjectCss && !window.__iconfont__svg__cssinject__) { window.__iconfont__svg__cssinject__ = true; try { document.write('<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>') } catch (e) { console && console.log(e) } }ready(appendSvg) })(window)