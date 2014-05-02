/**
 * Base Test
 * These tests ensure that jQuery and the MegaHero plugin has been loaded
 * corretly in the test-runner
 */
// jQuery
test('jQuery presence', function() {
    equal( typeof $, 'function' , 'jQuery has been loaded correctly.' );
});

// MegaHero.js
test('MegaHero presence', function() {
    equal( typeof $.fn.megahero, 'function' , 'MegaHero.js plugin has been loaded correctly.' );
});


/**
 * Setup
 * Since MegaHero involves manipulating elements in the DOM, we'll need
 * to inject something into the test runner
 */
var _setup = function() {
    // Creating the div.megahero
    window.$hero = $('<div class="megahero"></div>');
    // Append the $hero to the dom
    $('body').append($hero);
};




/**
 * Plugin Tests
 */
module("MegaHero Default Render Dimensions", {
    setup: function() {
        _setup();
        // Triggering the mega hero
        $hero.megahero();
    },
    teardown: function() {
        $hero.remove();
    }
});
// Testing for Hero's width
// Added -16 to account for the scrollbar in this test
test("Hero's width is the same as the window's width", function() {
    equal( $hero.width(), ($(window).width() - 16),
        "Hero width renders correctly." );
});
// Testing for Hero's Height
test("Hero's height should be 70% of the window's height" , function() {
    equal( $hero.height(), (Math.round($(window).height() * 0.7)),
        "Hero's height renders correctly." );
});


module("MegaHero Default Content Handling", {
    setup: function() {
        _setup();
        // Injecting a title into the hero
        $hero.html('<h1>Title</h1>');
        // Triggering the mega hero
        $hero.megahero();
    },
    teardown: function() {
        $hero.remove();
    }
});

test("Hero's content should be wrapped in a div.megahero-content", function() {
    equal( $hero.find('.megahero-content').length, 1,
    "Hero's content was wrapped correctly." );
});