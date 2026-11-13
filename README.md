# Cores2Drill

Website for Cores2Drill, a diamond core drilling and concrete sawing subcontractor based in Galway and working nationwide.

Live preview: https://juliusjogela.github.io/cores2drill/

## Structure

Plain HTML, CSS and JS. There is no build step: open `index.html` in a browser to preview, and every push to `main` redeploys GitHub Pages.

- `index.html`: all page content
- `css/style.css`: styles
- `js/main.js`: mobile menu and scroll animations
- `images/`: logo, favicon and photos

## Placeholders still to fill in

Search `index.html` for `PLACEHOLDER` to find each one.

- Service photos (core drilling, concrete saw)
- Gallery photos (six tiles)
- Saw make, model and the kinds of jobs it's for
- Instagram link in the footer
- Original logo file (the current one is cropped from a screenshot)

To replace a photo placeholder, put the image in `images/` and swap the `<div class="ph">…</div>` for:

```html
<img src="images/your-photo.jpg" alt="Short description of the photo">
```
