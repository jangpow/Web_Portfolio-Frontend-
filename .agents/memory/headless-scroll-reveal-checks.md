---
name: Headless scroll-reveal checks
description: How to verify IntersectionObserver-driven content in this workspace.
---

`chromium --headless --dump-dom` did not reliably deliver `IntersectionObserver` callbacks after scripted scrolling, including in an iframe and a fragment-loaded page. A real rendered preview showed the scroll-revealed content correctly.

**Why:** DOM-dump testing produced false negatives for behavior that depends on rendered frames.

**How to apply:** Use DOM dumps for static markup and non-visual JavaScript checks. Verify scroll-triggered reveals in a rendered app preview opened at the relevant section, or with browser automation that drives rendered frames.
