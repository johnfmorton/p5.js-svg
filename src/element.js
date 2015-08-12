module.exports = function(p5) {
    p5.prototype.querySVG = function(selector) {
        var svg = this._graphics && this._graphics.svg;
        if (!svg) {
            return null;
        }
        return p5.SVGElement.prototype.query.call({elt: svg}, selector);
    };

    function SVGElement(element, pInst) {
        if (!element) {
            return null;
        }
        return p5.Element.apply(this, arguments);
    };

    SVGElement.prototype = Object.create(p5.Element.prototype);

    SVGElement.prototype.query = function(selector) {
        var elements = this.elt.querySelectorAll(selector);
        var objects = [];
        for (var i = 0; i < elements.length; i++) {
            objects[i] = new SVGElement(elements[i]);
        }
        return objects;
    };

    SVGElement.prototype.append = function(element) {
        var elt = element.elt || element;
        this.elt.appendChild(elt);
        return this;
    };

    SVGElement.prototype.attribute = function() {
        var args = arguments;
        if (args.length === 3) {
            this.elt.setAttributeNS.apply(this.elt, args);
        }
        if (args.length === 2) {
            this.elt.setAttribute.apply(this.elt, args);
        }
        if (args.length === 1) {
            return this.elt.getAttribute.apply(this.elt, args);
        }
        return this;
    };

    SVGElement.prototype._buildFilterString = function(filter, arg) {
        var prefix = "p5-svg-";
        return prefix + filter + "(" + arg + ")";
    };

    // We have to build a filter for each element
    // the filter: f1 f2 and svg param is not supported by many browsers
    // so we can just modify the filter def to do so
    SVGElement.prototype.filter = function(filter, arg) {
        var filters = this.attribute('filter');
        filters += ' ' + this._buildFilterString(filter, arg);
        this.attribute('filter', filters);
        return this;
    };

    SVGElement.prototype.unfilter = function(filter, arg) {
        var filters = this.attribute('filter');
        console.log('todo: unfilter');
        console.log(filters);
        return this;
    };

    SVGElement.create = function(nodeName, attributes) {
        attributes = attributes || {};
        var elt = document.createElementNS("http://www.w3.org/2000/svg", nodeName);
        Object.keys(attributes).forEach(function(k) {
            elt.setAttribute(k, attributes[k]);
        });
        return new SVGElement(elt);
    };

    // matches polyfill from MDN
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
    SVGElement.prototype.matches = function(selector) {
        var element = this.elt;
        var matches = (element.document || element.ownerDocument).querySelectorAll(selector);
        var i = 0;
        while (matches[i] && matches[i] !== element) {
            i++;
        }
        return matches[i] ? true : false;
    };

    SVGElement.prototype.parent = function(selector) {
        if (!selector) {
            return new SVGElement(this.elt.parentNode);
        }
        var elt = this;
        while (true) {
            elt = this.parent();
            if (elt.matches(selector)) {
                return elt;
            }
            if (!elt) { // already top layer
                return null;
            }
        }
    };

    p5.SVGElement = SVGElement;
};
