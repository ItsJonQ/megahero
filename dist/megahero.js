(function ($, undefined) {

    // Return false if jQuery is not defined
    if(!$) {
        return false;
    }

    // Creating the plugin
    $.fn.megahero = function( options ) {

        var self = this;
        var $window = $(window);

        /**
         * settings
         *
         * These are the default settings/options for the plugin
         * @type { Object }
         */
        var settings = $.extend({
            backgroundPosition: 'center center',
            container: self.parent(),
            dynamicHeight: true,
            threshold: 120,
            height: 0.7
        }, options );

        /**
         * collection
         *
         * This collection stores the MegaHero models
         * @type { Array }
         */
        self.collection = [];

        /**
         * Private Settings
         */
        var _settings = {
            className: 'megahero-hero-panel',
            count: self.length,
            dataName: 'megahero',
            windowWidth: document.body.clientWidth
        };

        /**
         * now
         *
         * This Date object is used with debounce for optimized resize performance
         * @source: http://underscorejs.org/
         */
        self.now = Date.now || function() { return new Date().getTime(); };

        /**
         * debounce
         *
         * This is used optimized resize performance
         * @source: http://underscorejs.org/
         */
        self.debounce = function(func, wait, immediate) {
            var timeout, args, context, timestamp, result;

            var later = function() {
                var last = self.now() - timestamp;

                if (last < wait && last > 0) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;
                    if (!immediate) {
                        result = func.apply(context, args);
                        context = args = null;
                    }
                }
            };

            return function() {
                context = this;
                args = arguments;
                timestamp = self.now();
                var callNow = immediate && !timeout;
                if (!timeout) {
                    timeout = setTimeout(later, wait);
                }
                if (callNow) {
                    result = func.apply(context, args);
                    context = args = null;
                }

                return result;
            };
        };

        self.addToCollection = function(model) {
            if(!model) {
                return false;
            }

            self.collection.push(model);

            if(self.collection.length >= _settings.count) {

                self.updateWindowWidth();

                self.resizeHeros();
            }
        };

        self.updateWindowWidth = function(width) {
            if(typeof width !== 'number') {
                width = document.body.clientWidth;
            }

            _settings.windowWidth = width;

            return self;

        };

        /**
         * MegaHero
         * This is the constructor for a MegaHero model
         * @constructor
         * @param { dom element } el [ The megahero dom element ]
         */
        var MegaHero = function(el) {
            // Return false if el is invalid
            if(!el || typeof el !== 'object') {
                return false;
            }

            this.el = el;
            this.$el = $(el);

            this.initialize();

            return this;

        };

        MegaHero.prototype.initialize = function() {
            var windowWidth = document.body.clientWidth;

            this.el.classList.add(_settings.className);

            // Creating the placeholder
            this.createPlaceholder();

            // Adding the MegaHero to the plugin's collection
            self.addToCollection(this);

            /**
             * Check to see if the windowWidth is the same as the initial
             * calculated windowWidth.
             *
             * This is necessary to account for the scroll bar width that will,
             * in most cases, appear after the page renders.
             */
            if(windowWidth === _settings.windowWidth) {
                // Resize this Hero
                this.resize();
            } else {
                // Update the plugin's window width
                self.updateWindowWidth(windowWidth);
                // Resize all Heros that have already been rendered
                self.resizeHeros();
            }

            this.render();

            return this;

        };

        MegaHero.prototype.verifyWidth = function(width) {
            if(!width || typeof width !== 'number') {
                return;
            }

            if(width !== _settings.windowWidth) {
                // Update the plugin's window width
                self.updateWindowWidth(width);
                // Resize all Heros that have already been rendered
                self.resizeHeros();

                return false;
            }

            return true;
        };

        MegaHero.prototype.createPlaceholder = function() {
            var $el = this.$el;
            var placeholder;
            var $placeholder;

            // Creating the placeholder
            placeholder = document.createElement('div');
            placeholder.classList.add('megahero-placeholder');
            $placeholder = $(placeholder);
            $placeholder.insertBefore($el);

            this.$placeholder = $placeholder;

            return this;
        };

        MegaHero.prototype.parseHeight = function() {
            var height = this.el.getAttribute('data-megahero-height');
            var windowHeight = $window.height();

            // Use the default height if custom data-megahero-height is not present
            if(!height) {
                height = settings.height;
            }

            // If the height is a number (default height)...
            if(typeof height === 'number') {
                return Math.round((windowHeight * height));
            }

            // If height contains "px"...
            if(height.indexOf('px') >= 0) {
                return height;
            }

            // If height contains "%"...
            if(height.indexOf('%') >= 0) {
                height = parseFloat(height.replace('%', '')) / 100;
            }

            // If the height is a string...
            if(typeof height === 'string') {
                height = parseFloat(height);
            }

            // Return the windowHeight multiplied by the parsed height
            return Math.round((windowHeight * height));
        };

        MegaHero.prototype.render = function() {

            this.renderImage();
            this.renderDim();

            return this;

        };

        MegaHero.prototype.renderDim = function() {
            var el = this.el;
            var dim = el.getAttribute('data-megahero-dim');

            if(!dim) {
                return false;
            }


        };

        MegaHero.prototype.renderImage = function() {
            var el = this.el;
            var image = el.getAttribute('data-megahero-image');
            if(!image) {
                return this;
            }

            $('div:after').css('content', '22');

            el.style.backgroundImage = 'url('+image+')';
            el.style.webkitBackgroundSize = 'cover';
            el.style.mozBackgroundSize = 'cover';
            el.style.OBackgroundSize = 'cover';
            el.style.backgroundSize  = 'cover';
            el.style.backgroundPosition = settings.backgroundPosition;

        };

        MegaHero.prototype.resize = function() {
            var windowWidth = document.body.clientWidth;
            var that = this;
            var $el = this.$el;
            var $placeholder = this.$placeholder;

            if(!that.verifyWidth(windowWidth)) {
                return this;
            }

            if(!$el || !$placeholder) {
                return false;
            }

            var offset = this.$placeholder.offset().left;

            $el.css('marginLeft', -(Math.round(offset)));
            $el.width(_settings.windowWidth);
            $el.css(_settings.heightAttr, that.parseHeight());

            if(!settings.dynamicHeight) {
                $el.css('overflow', 'hidden');
            }


            return this;
        };



        self.resizeHeros = function() {

            self.updateWindowWidth();

            for(var i = 0, len = self.collection.length; i < len; i++) {
                self.collection[i].resize();
            }

            return self;
        };

        self.initialize = function() {
            settings.container = $(settings.container);

            if(settings.dynamicHeight) {
                _settings.heightAttr = 'min-height';
            } else {
                _settings.heightAttr = 'height';
            }

            // Add overflow: visible to the container (Just in case the container has overflow: hidden)
            settings.container.css('overflow', 'visible');
        };

        self.debouncedResize = self.debounce(self.resizeHeros, settings.threshold);

        $window.on('resize', self.debouncedResize);
        $window.bind('orientationchange', self.debouncedResize);

        self.initialize();

        return this.each(function() {

            var $this = $(this);
            if($this.data(_settings.dataName)) return;

            var megahero = new MegaHero(this);
            $this.data(_settings.dataName, megahero);

        });

    };

})(jQuery);