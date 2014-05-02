// jQuery
test( "jQuery presence", function() {
    equal( typeof $, 'function' , "jQuery has been loaded correctly." );
});

// MegaHero.js
test( "MegaHero presence", function() {
    equal( typeof $.fn.megahero, 'function' , "MegaHero.js plugin has been loaded correctly." );
});