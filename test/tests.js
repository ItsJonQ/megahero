/**
 * Base Test
 * These tests ensure that jQuery and the MegaHero plugin has been loaded
 * corretly in the test-runner
 */
// jQuery
test('jQuery Load Test', function() {
    equal( typeof $, 'function' , 'jQuery has been loaded correctly.' );
});

// MegaHero.js
test('MegaHero Load Test', function() {
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

// Options: Default
module("Default Render Dimensions", {
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


// Options: Custom
module("Rendering Dimensions with Custom Parameters", {
    setup: function() {
        _setup();
    },
    teardown: function() {
        $hero.remove();
    }
});
// Test for custom height (number, integar)
test("Hero's height should reflect INTEGER set as options.height", function() {
    // Triggering the mega hero
    $hero.megahero({
        height: 0.35
    });
    equal( $hero.height(), (Math.round($(window).height() * 0.35)),
        "Hero's height renders correctly." );
});
// Test for custom height (pixel)
test("Hero's height should reflect #px set as options.height", function() {
    // Triggering the mega hero
    $hero.megahero({
        height: '50px'
    });
    equal( $hero.height(), 50,
        "Hero's height renders correctly." );
});
// Test for custom height (%)
test("Hero's height should reflect #% set as options.height", function() {
    // Triggering the mega hero
    $hero.megahero({
        height: '38%'
    });
    equal( $hero.height(), (Math.round($(window).height() * 0.38)),
        "Hero's height renders correctly." );
});
// Test for custom height (number, string)
test("Hero's height should reflect number (as string) set as options.height", function() {
    // Triggering the mega hero
    $hero.megahero({
        height: '0.35'
    });
    equal( $hero.height(), (Math.round($(window).height() * 0.35)),
        "Hero's height renders correctly." );
});
// Test for custom height set by data attribute (number, integar)
test("Hero's height should reflect number set by data attribute", function() {
    $hero.attr('data-megahero-height', 0.5);
    // Triggering the mega hero
    $hero.megahero();
    equal( $hero.height(), (Math.round($(window).height() * 0.5)),
        "Hero's height renders correctly." );
});
// Test for custom height set by data attribute(pixel)
test("Hero's height should reflect #px set by data attribute", function() {
    $hero.attr('data-megahero-height', '50px');
    // Triggering the mega hero
    $hero.megahero();
    equal( $hero.height(), 50,
        "Hero's height renders correctly." );
});
// Test for custom height set by data attribute (%)
test("Hero's height should reflect #% set by data attribute", function() {
    $hero.attr('data-megahero-height', '38%');
    // Triggering the mega hero
    $hero.megahero();
    equal( $hero.height(), (Math.round($(window).height() * 0.38)),
        "Hero's height renders correctly." );
});



// Content: Wrapping
module("Default Content Handling", {
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
// Testing for Hero's content wrapping
test("Hero's content should be wrapped in a div.megahero-content", function() {
    equal( $hero.find('.megahero-content').length, 1,
    "Hero's content was wrapped correctly." );
});