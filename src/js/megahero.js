(function ($, undefined) {

    // Return false if jQuery is not defined
    if(!$) {
        return false;
    }

    // Creating the plugin
    $.fn.megahero = function( options ) {

        // Defining defaults
        var self = this;
        var $window = $(window);

        /**
         * settings
         * These are the default settings/options for the plugin
         *
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
         * _settings
         * These are private/internal settings and variables that megahero uses
         *
         * @private
         */
        var _settings = {
            count: self.length,
            dataName: 'megahero',
            windowWidth: document.body.clientWidth
        };

        /**
         * _classNames
         * These are private/internal class names megahero uses
         *
         * @private
         */
        var _className = {
            content: 'megahero-content',
            cover: 'megahero-cover',
            coverVideo: 'megahero-cover-video',
            dim: 'dim',
            main: 'megahero',
            panel: 'megahero-hero-panel',
            placeholder: 'megahero-placeholder'
        };

        /**
         * _dataAttr
         * These are private data attributes megahero uses
         */
        var _dataAttr = {
            dim: 'data-megahero-dim',
            image: 'data-megahero-image',
            height: 'data-megahero-height',
            youtube: 'data-megahero-yt'
        };

        /**
         * now
         * This Date object is used with debounce for optimized resize performance
         *
         * @source: http://underscorejs.org/
         */
        self.now = Date.now || function() { return new Date().getTime(); };

        /**
         * debounce
         * This is used optimized resize performance
         *
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


        /**
         * collection
         * This collection stores the MegaHero models
         *
         * @type { Array }
         */
        self.collection = [];

        /**
         * addToCollection
         * This method adds a MegaHero model into the plugin's collection
         *
         * @param  { object } model [ MegaHero model ]
         * @return { self }
         */
        self.addToCollection = function(model) {
            // Return if model is not valid
            if(!model) {
                return false;
            }
            // Add the model to the collection
            self.collection.push(model);

            /**
             * Resizing all Heros
             * This resizes all the hero model els once the final MegaHero
             * model has been added to the collection. This is to combat/handle
             * the width change due to the absense/precense of a scrollbar
             */
            if(self.collection.length >= _settings.count) {
                // Update the window width in _settings
                self.updateWindowWidth();
                // Resize all the hero models
                self.resizeHeros();
            }
            // Return self
            return self;
        };

        /**
         * updateWindowWidth
         * This method updates the stored window width variable in _settings
         *
         * @param  { number } width [ The width as a number ]
         * @return { self }
         */
        self.updateWindowWidth = function(width) {
            // If width is invalid, grab the variable from the document.body
            if(!width || typeof width !== 'number') {
                width = document.body.clientWidth;
            }
            // Update the window width in _settings
            _settings.windowWidth = width;
            // Return self
            return self;
        };

        /**
         * MegaHero
         * This is the constructor for a MegaHero model
         *
         * @constructor
         * @param  { dom element } el   [ The megahero dom element ]
         * @return { model }            [ Returns itself ]
         */
        var MegaHero = function(el) {
            // Return false if el is invalid
            if(!el || typeof el !== 'object') {
                return false;
            }
            // Defining the model's els
            this.el = el;
            this.$el = $(el);

            // Initialize the model (from prototype)
            this.initialize();

            // Returning the model
            return this;
        };

        /**
         * initialize
         * This method initializes the MegaHero model
         *
         * @model.prototype
         * @return { model }
         */
        MegaHero.prototype.initialize = function() {
            // Defining the variables
            var windowWidth = document.body.clientWidth;
            var el = this.el;

            // Adding the panel class to the el
            el.classList.add(_className.panel);
            // If the el doesn't have the main 'megahero class', add it to the el
            if(!el.classList.contains(_className.main)) {
                el.classList.add(_className.main);
            }

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

            // Render the model
            this.render();
            // Returning the model
            return this;
        };

        /**
         * verifyWidth
         * This method checks to see if the width has changed at any point
         * when the model is rendering the els
         *
         * @model.prototype
         * @param  { number } width [ The width to verify ]
         * @return { boolean }  [ True/false if the width is the same as storage ]
         */
        MegaHero.prototype.verifyWidth = function(width) {
            // Return if width is invalid
            if(!width || typeof width !== 'number') {
                return;
            }

            // If the width is NOT the same as the one stored in _settings
            if(width !== _settings.windowWidth) {
                // Update the plugin's window width
                self.updateWindowWidth(width);
                // Resize all Heros that have already been rendered
                self.resizeHeros();
                // Return false
                return false;
            }
            // Return true
            return true;
        };

        /**
         * createPlaceholder
         * This method creates and inserts the placeholder DOM element
         * needed to calculate the margin-left offset for the full-width Hero
         *
         * @model.prototype
         * @return { model }
         */
        MegaHero.prototype.createPlaceholder = function() {
            // Defining the variables
            var $el = this.$el;
            var placeholder;
            var $placeholder;

            // Creating the placeholder
            placeholder = document.createElement('div');
            placeholder.classList.add(_className.placeholder);
            $placeholder = $(placeholder);
            // Inserting the placeholder before the MegaHero el
            $placeholder.insertBefore($el);

            // Setting the placeholder in the MegaHero model
            this.$placeholder = $placeholder;

            // Returning the model
            return this;
        };

        /**
         * createYTEmbed
         * This method creates a YouTube embed URL that's used to
         * add YouTube video embeds as MegaHero backgrounds.
         *
         * @model.prototype
         * @param  { string } [ id ] [ YouTube Video URL ]
         * @return { string } [ YouTube embed URL ]
         */
        MegaHero.prototype.createYTEmbed = function(url) {
            // Return if the url is not valid
            if(!url || typeof url !== 'string') {
                return false;
            }
            var embed;
            // Getting the YT ID by parsing the URL
            var id = this.parseVideo(url);
            if(id) {
                // Define the embed code with the YT ID
                embed = '//youtube.com/embed/'+id+'?showinfo=0&autohide=1&volume=0';
            }
            // Returning the embed code
            return embed;
        };

        /**
         * parseHeight
         * This method parses and calculates the number of pixels for the
         * height of each MegaHero model. By default, the height is defined by
         * settings. However, the user can specify custom heights using
         * data-megahero-height.
         *
         * This method is able to parse numbers and strings that might contain
         * "px" or "%"
         *
         * @model.prototype
         * @return { number } [ Returns the calculated height for MegaHero el ]
         */
        MegaHero.prototype.parseHeight = function() {
            // Defining the defaults
            var height = this.el.getAttribute(_dataAttr.height);
            var windowHeight = $window.height();

            // Use the default height if custom data-megahero-height is not present
            if(!height) {
                height = settings.height;
            }

            // If the height is a number (default height)...
            if(typeof height === 'number') {
                // Return the windowHeight * height percentage
                return Math.round((windowHeight * height));
            }

            // If height contains "px"...
            if(height.indexOf('px') >= 0) {
                // Returning the exact height defined by pixels
                return height;
            }

            // If height contains "%"...
            if(height.indexOf('%') >= 0) {
                // Update the height variable with calculated percentage
                height = parseFloat(height.replace('%', '')) / 100;
            }

            // If the height is a string...
            if(typeof height === 'string') {
                // Update the height variable height as number
                height = parseFloat(height);
            }

            // Return the windowHeight multiplied by the parsed height
            return Math.round((windowHeight * height));
        };

        /**
         * parseVideo
         * This method parses a YouTube video URL to return the
         * video's ID
         *
         * @model.prototype
         * @param  { string } url [ The YouTube video URL ]
         * @return { string }     [ This returns the YT video ID ]
         */
        MegaHero.prototype.parseVideo = function(url) {
            var id;
            // Return false if the url is invalid
            if(!url || typeof url !== 'string') {
                return false;
            }
            // Split the URL based on '/'
            url = url.split('/');
            // Filter string array to locate something like 'watch?=TO-KH8Eu-Xw'
            id = url.filter(function(string) {
                return(string.indexOf('watch?v=') >= 0);
            });

            // Use the first string from id array
            // Example: ['watch?v', 'TO-KH8Eu-Xw'];
            //      Split the string via =
            //      Return the second item from the array
            return id[0].split('=')[1];
        };

        /**
         * render
         * This method renders the MegaHero model
         *
         * @model.prototype
         * @return { model }
         */
        MegaHero.prototype.render = function() {
            // Rendering..
            this.renderContent();
            this.renderImage();
            this.renderVideo();
            this.renderDim();

            // Returning the model
            return this;
        };

        /**
         * renderContent
         * This method wraps the existing content within MegaHero with a
         * containing div. This is needed to elevate the context layer, allowing
         * for media backgrounds (eg. images).
         *
         * @model.prototype
         * @return { model }
         */
        MegaHero.prototype.renderContent = function() {
            // Wrappiung all the children elements with a MegaHero content wrapper div
            this.$el.children().wrapAll('<div class="'+_className.content+'"></div>');
            // Returning the model
            return this;
        };

        /**
         * renderDim
         * This method "dims" the media in the MegaHero, allow for context within
         * to stand out.
         *
         * The user can trigger dimming by added data-megahero-dim="true" to
         * their selector.
         *
         * @model.prototype
         * @return { model }
         */
        MegaHero.prototype.renderDim = function() {
            // Defining the el
            var el = this.el;
            // Getting the "dim" setteings
            var dim = el.getAttribute(_dataAttr.dim);
            // Return false if dim settings are not present
            if(!dim) {
                return false;
            }

            // Adding the "dim" class to the el
            el.classList.add(_className.dim);

            // Returning the model
            return this;
        };

        /**
         * renderImage
         * This method adds an image as a background in the MegaHero el.
         *
         * The user can define the image by added data-megahero-image="src.jpg" to
         * their selector.
         *
         * @model.prototype
         * @return { model }
         */
        MegaHero.prototype.renderImage = function() {
            // Defining the variables
            var cover;
            var image;
            // Defining the el
            var el = this.el;
            // Getting the image source
            var imageSrc = el.getAttribute(_dataAttr.image);
            // Return false if the image source is not defined
            if(!imageSrc) {
                return this;
            }

            // Creating the background cover image
            cover = document.createElement('div');
            cover.classList.add(_className.cover);
            cover.style.backgroundImage = "url('"+imageSrc+"')";
            // Adding the cover image into the MegaHero el
            el.appendChild(cover);

            // Returning the model
            return this;
        };

        /**
         * renderVideo
         * This method adds a YouTube video as the background in the
         * MegaHero el.
         *
         * The user can define the image by added data-megahero-yt="" to their selector.
         *
         * @model.prototype
         * @return { model }
         */
        MegaHero.prototype.renderVideo = function() {
            // Defining the el
            var el = this.el;
            // Getting the YouTube video URL
            var ytUrl = el.getAttribute(_dataAttr.youtube);

            console.log(ytUrl);
            // Defining variables
            var iframe;
            var embed;

            // Return if the youtubeUrl is not defined
            if(!ytUrl) {
                return false;
            }

            // Creating the YT Embed code
            embed = this.createYTEmbed(ytUrl);
            // Creating the YT Embed iFrame
            iframe = document.createElement('iframe');
            iframe.src = embed;
            iframe.frameBorder = 0;
            iframe.height = '100%';
            iframe.width = '100%';
            iframe.volume = 0;

            // Creating the background cover image
            cover = document.createElement('div');
            cover.classList.add(_className.coverVideo);

            cover.appendChild(iframe);
            el.appendChild(cover);


        };

        /**
         * resize
         * This method adjusts the width and height of the MegaHero el. This
         * method fires on render, as well as when the brower size/orientation
         * changes.
         *
         * @model.prototype
         * @return { model }
         */
        MegaHero.prototype.resize = function() {
            var that = this;
            // Defining the window width
            var windowWidth = document.body.clientWidth;
            var offset;
            // Defining the els
            var $el = this.$el;
            var $placeholder = this.$placeholder;

            // Return false if els are not valid
            if(!$el || !$placeholder) {
                return false;
            }

            // Return if the width is not the same as the width stored in settings.
            // the verifyWidth method takes care of the resize rendering.
            if(!that.verifyWidth(windowWidth)) {
                return this;
            }

            // Setting the offset from the placeholder el's offset().left
            offset = this.$placeholder.offset().left;

            // Adding the offset to the MegaHero el
            $el.css('marginLeft', -(Math.round(offset)));
            // Adjusting the width of the MegaHero el to full width
            $el.width(_settings.windowWidth);
            // Adjusting the height of the MegaHero el
            $el.css(_settings.heightAttr, that.parseHeight());

            // Add 'overflow: hidden' if the dynamicHeight setting is disabled
            if(!settings.dynamicHeight) {
                $el.css('overflow', 'hidden');
            }

            // Return model
            return this;
        };



        /**
         * resizeHeros
         * This method resizes the els of all the MegaHero models in the
         * collection
         *
         * @return { self }
         */
        self.resizeHeros = function() {
            // Update the window width
            self.updateWindowWidth();
            // Loop through all the models in the collection
            for(var i = 0, len = self.collection.length; i < len; i++) {
                // Resize the model
                self.collection[i].resize();
            }
            // Returning self
            return self;
        };

        /**
         * debouncedResize
         * This "method" utilizes the debounce method from Underscore (included
         * in the plugin) to optimize the firing of the resizeHeros method.
         */
        self.debouncedResize = self.debounce(self.resizeHeros, settings.threshold);

        /**
         * initialize
         * This method initializes the plugin.
         *
         * @return { self }
         */
        self.initialize = function() {
            // Define/set the container for the models
            settings.container = $(settings.container);

            // Adjust the CSS height attribute based on the dynamicHeight setting
            if(settings.dynamicHeight) {
                _settings.heightAttr = 'min-height';
            } else {
                _settings.heightAttr = 'height';
            }

            // Add overflow: visible to the container (Just in case the container has overflow: hidden)
            settings.container.css('overflow', 'visible');

            // Adding events for resize and orientation change for the debounced
            // resize method.
            $window.on('resize', self.debouncedResize);
            $window.bind('orientationchange', self.debouncedResize);

            // Returning self
            return self;
        };


        // Initializing the plugin
        self.initialize();

        // Returning the plugin jQuery objects to allow for jQuery chaining
        return this.each(function() {
            // Defining $this
            var $this = $(this);
            // Defining the megahero
            var megaHero;

            // If this jQuery object has already rendered MegaHero, return
            if($this.data(_settings.dataName)) return;

            // Create a new MegaHero class
            megaHero = new MegaHero(this);
            // Set the megaHero in the jQuery object's data
            $this.data(_settings.dataName, megaHero);
        });

    };
})(jQuery);