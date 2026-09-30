#!/usr/bin/env python3
"""Setter sammen v4-delene til /workspace/messekart/index.html (v4)."""
from pathlib import Path
src = Path(__file__).parent
r = lambda n: (src / n).read_text(encoding='utf-8')
css = ''.join(r(f) for f in ['v4-a.css', 'v4-b.css'])
js = ''.join(r(f'v4-{i}.js') for i in range(1, 7))
back = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>'
body = (r('v4-body1.html') + r('v4-body2.html') + r('v4-body3.html')).replace('__BACK__', back)
html = (r('v4-head.html') + '<style>\n' + css + '</style>\n' + body +
        '<script>\n(function () {\n' + js + '})();\n</script>\n</body>\n</html>\n')
out = src.parent / 'index.html'
out.write_text(html, encoding='utf-8')
print(out, len(html), 'tegn')
