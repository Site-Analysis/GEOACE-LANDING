# GeoAce landing page

Complete source for the approved three-screen, scroll-driven landing page.
Built with plain HTML, CSS and JavaScript. No framework, installation, API keys or build step required.

## Open the page
1. Extract this ZIP into a folder.
2. Open index.html in a modern web browser.
3. Scroll to move through the three sections.

For development, you can also open the folder in VS Code and use Live Server.

## Files
- index.html: page content, logo placement, navigation and three sections.
- style.css: typography, colours, layout, responsive behaviour and transitions.
- app.js: animated canvas background, scroll effects and motion controls.
- brand.png: original GeoAce brand board; the logo is displayed using CSS background positioning.
- favicon.svg: browser tab icon.

## Make changes
Edit the text in index.html, the colours and typography in style.css, and the background animation in app.js.
The burnt-orange brand colour is controlled by --accent in style.css and the canvas colour values in app.js.
Keep these files together so the relative asset references continue to work.

## Publish elsewhere
Upload index.html, style.css, app.js, brand.png and favicon.svg together to any static website host. Use the folder containing index.html as the public root. No build command is necessary.

## Included behaviour
- Brand introduction with logo, studio name and catchphrase.
- Smooth anchor navigation and scroll-linked text transitions.
- Continuous animated point field that transforms into layers.
- Mobile layouts, section indicators and a scroll progress line.
- Animation pause control and reduced-motion support.

The point field is an abstract visual, not geographic measurements.
