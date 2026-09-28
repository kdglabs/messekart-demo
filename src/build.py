#!/usr/bin/env python3
"""Setter sammen v3-delene til /workspace/messekart/index.html."""
from pathlib import Path
src = Path(__file__).parent
r = lambda n: (src / n).read_text(encoding='utf-8')
css = ''.join(r(f) for f in ['v3-a.css', 'v3-b.css', 'v3-c.css', 'v3-d.css'])
js = ''.join(r(f'v3-{i}.js') for i in range(1, 8))
html = (r('v3-head.html') + '<style>\n' + css + '</style>\n</head>\n<body>\n' +
        r('v3-body1.html') + r('v3-body2.html') +
        '<script>\n(function () {\n' + js + '})();\n</script>\n</body>\n</html>\n')
out = src.parent / 'index.html'
out.write_text(html, encoding='utf-8')
print(out, len(html), 'tegn')
