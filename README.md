# p5.js-svg

The main goal of p5.SVG is to provide a SVG runtime for p5.js, so that we can
draw using p5's powerful API in \<svg\>, save things to svg file and
manipulating existing SVG file without rasterization.

## Note about this fork, a fork of a fork.

This fork is a temporary solution to fix the issue with the original package having an unmerged fix for a compatibility issue with p5.js versions 1.7 and beyond. I did not fix the incompatibility issue. The actual fix in the code is in this fork, [https://github.com/nkymut/p5.js-svg](https://github.com/nkymut/p5.js-svg). I have forked this fork.

The original package can be found [here](https://github.com/zenozeng/p5.js-svg). At the time of writing this, the original package is at 1.5.1. This fork is at 1.5.2.

### Why this fork of a fork?

The forked version does address the compatibility issue, but the ES6 module import is not working.

To address that, I've updated the rollup configuration to generate an ES6 module version of the package, dist/p5.svg.esm.js. This version can be imported as an ES6 module in a project. To allow this import, I've also updated the package.json file. The main field is now pointing to the CommonJS version of the package, and the module field is pointing to the ES6 module version.

To install this version directly from GitHub, you can run the following command:

```
npm install johnfmorton/p5.js-svg#main
```

This will install the package from the main branch of this repository.

This will allow you to import the package as an ES6 module in your project.

```javascript
import init, { p5SVG } from 'p5.js-svg'
```
You can reference my p5js svg starter project [here](https://github.com/johnfmorton/p5js-svg-starter) to see how I'm using it. The starter project is using the ES6 module import.

### _The rest of the documentation is from the original package._

## Getting Started

Add this line in your projects index.html :

```html
<script src="https://unpkg.com/p5.js-svg@1.5.1"></script>
```

(p5.js-svg v1.5.x is compatible with p5.js v1.6.x)

Open your sketch.js and edit it:

```javascript
function setup() {
  createCanvas(100, 100, SVG);
  background(255);
  fill(150);
  stroke(150);
}

function draw() {
  var r = frameCount % 200 * Math.sqrt(2);
  background(255);
  ellipse(0, 0, r, r);
}
```

Then you can open your html file, and view the result. It's \<svg\>!

![SVG Gettting Started](./doc/svg-getting-started.png)

## Examples

- https://zenozeng.github.io/p5.js-svg/examples/
- https://zenozeng.github.io/p5.js-svg/test/
- [Vite + TypeScript](https://github.com/zenozeng/p5.js-svg/tree/main/examples/vite)

## SVG Renderer vs Canvas2D Renderer

The major difference is that SVG Renderer is based on SVG Document Object Model
while Canvas 2D Renderer is based on pixels. Therefore, the performance may not
be as good as canvas, but SVG-format vector images can be rendered at any size
without loss of quality.

Note that not all drawing results are exactly same in pixel-level.For example,
the round rects below are almost same, but there are some pixels different.

![round rect](doc/round-rect.png)

As for filters, gray(), invert(), threshold(), opaque() did have same behavior
as Canvas2D Renderer. But blur(), erode(), dilate() didn't.

To implement blur, feGaussianBlur was used, which is different from Processing's
blur. ![blur](doc/blur.png)

As for erode() and dilate(), they were implemnted using feOffset and feBlend.
So, the result is not exactly same. ![erode](doc/erode.png)

You can view all the pixels based diff on the
[online tests](http://zenozeng.github.io/p5.js-svg/test/).

## Browser Compatibility

p5.js-svg@1.x was tested and should work on:

- Chromium 90 (Debian 11.0, LXQt 0.16)
- Safari (iPadOS 14)

## How it works

p5.RendererSVG is a class which extends p5.Renderer2D. A mocked \<canvas\>
element and a CanvasRenderingContext2D api are provided using
[svgcanvas](https://github.com/zenozeng/svgcanvas), which is JavaScript Object
that syncs proprieties and draws on \<svg\> element.

## Known issue

### Too many child elements

Since SVG is XML-based, every call of the draw function will insert elements
into it, and these elements keep existing even if they are not visible. So,
long-time running will result in too many child elements. We recommend calling
clear() in your draw function, which will trigger internal
context.__clearCanvas() to remove elements.

```javascript
function draw() {
  clear();
  // draw
}
```

See https://github.com/zenozeng/p5.js-svg/issues/32

### blendMode is not implemented yet.

## Building dist

To build dist files after cloning repo, you can run:

```bash
npm install
npm run build
```

## Tests

p5.SVG was driven by tests. We use Karma and mocha. Most tests are based on
pixel-diff. There are still some p5's methods not covered with unit tests. But
Rendering and Shape API are already covered with tests and should work.

If you found a bug, feel free to open a issue or pull a request.

All tests can be found here:
https://github.com/zenozeng/p5.js-svg/tree/master/test/unit

You can also run the online test yourself:
https://zenozeng.github.io/p5.js-svg/test/
