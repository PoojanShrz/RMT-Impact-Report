_winHeight = $(window).height();
_winWidth = $(window).width();

// Listen for orientation changes
window.addEventListener("orientationchange", function() {
	// Announce the new orientation number
	location.reload();
}, false);

function isDesktop() {
    return $(window).width() > 1024;
}

function handleContentScroll() {
    $activeSlide = $('.mainActive');
    $activeSlideContentSection = $activeSlide.find('#pages');
    $activeTab = $activeSlideContentSection.find(".page:not('.hide')");

    if (_winWidth > 1024) {
        var $scrollHeight = $activeTab.height();
        var $winHeight = _winHeight - 220;
        if ($winHeight < $scrollHeight) {
            $activeTab.height($winHeight);
            $activeTab.addClass('position-top');
        }
    }
}

$(function() {

    $('.js-splash-screen').addClass("bg-primary");

    _initNav();
    _initActionTabs();
    _initFullPage();

    function _initNav() {
        var $toggleMenu = $('#nav-icon');
        var tlm = new TimelineMax({ paused: true, reversed: true });
        // $('.t-navigation--list').removeClass("red");
        tlm.set('.t-navigation--fullscreen', { css: { zIndex: 7 } })
        //     .set('.theme-header', { css: { backgroundColor: 'rgba(0, 0, 0, 0)' } })
            tlm.set('.t-navigation--list', {  pointerEvents: "all" })
            tlm.to('.background-first',.5,{scaleY:1})
            .to('.background',.5,{scaleX:1})
            .to('.t-navigation--fullscreen .t-main--titlenav', .3, { opacity: 1 })
            .staggerTo('.t-navigation--fullscreen .t-navigation--item', .3, { y: 0, opacity: 1 }, .1);

        $toggleMenu.on('click', function () {
            $(this).toggleClass('is-active');
            $('body').toggleClass('nav-opened');
            $('.t-navigation--list').removeClass("overflow");
            tlm.reversed() ? tlm.play() : tlm.reverse();
        });

        tlm.call(function() {
            $('.t-navigation--list').toggleClass("overflow");
        },null,null,3);

        // Navigation Item Click Event
        $('.t-summary-nav--item, .t-navigation--item, .t-summary-nav--links').click(function() {
            fullpage_api.moveTo(1, $(this).data('slideto'));

            if ($('#nav-icon').hasClass('is-active')) {
                $('#nav-icon').trigger('click');
            }

            return false;
        });
    }

    // init action tabs
    function _initActionTabs() {

        $(".js-action-nav a").on('click', function (e) {
            e.preventDefault();

            var $this = $(this);
            var $page = $this.data('page');
            var $activeSlide = $(fullpage_api.getActiveSlide().item);
            var $tabContent = $this.parent().parent().next();

            $this.parent().find('a').removeClass('active');
            $this.addClass('active');

            $activeSlide.data('current', $this.data('page'));

            $tabContent.find(".page:not('.hide')").stop()
                .fadeOut('fast', function () {
                    $(this).addClass('hide');
                    $tabContent.find('.page[data-page="page' + $page + '"]')
                        .fadeIn('slow').removeClass('hide');

                    if (_winWidth > 1024) {
                        var $scrollHeight = $tabContent.find('.page[data-page="page' + $page + '"]').height();
                        var $winHeight = _winHeight - 220;
                        if ($winHeight < $scrollHeight) {
                            $tabContent.find('.page[data-page="page' + $page + '"]').height($winHeight);
                            $tabContent.find('.page[data-page="page' + $page + '"]').addClass('position-top');
                        }
                    }

                    fullpage_api.reBuild();
                });
        });
    }

    // init full fpage
    function _initFullPage() {

        var _options = {
            licenseKey: 'EDEED7F1-A2A74B2C-A01BC4F8-317D0CEC',
            anchors: ['rmtreport'],
            fitToSection: false,
            scrollingSpeed: 500,
            lazyLoading: true,
            loopTop: false,
            loopHorizontal: false,
            touchSensitivity: 20,
            css3: true,
            controlArrows: false,
        };

        if (isDesktop()) {
            _options.normalScrollElements = '.scroll-height , .page,.scroll-height-relative';
            _options.scrollBar = true;
            _options.scrollOverflow = false;
            _options.afterSlideLoad = afterSlideLoadOnDesktop;
            _options.onSlideLeave = onSlideLeaveOnDesktop;
        }

        if (!isDesktop()) {
            _options.normalScrollElements = '.t-navigation--list';
            
            _options.autoScrolling = true;
            _options.scrollBar = true;
            _options.scrollOverflow = true;
            _options.afterSlideLoad = afterSlideLoadOnMobile;
            _options.onSlideLeave = onSlideLeaveOnMobile;
        }

        

        new fullpage('#fullpage', _options);
    }


    window.currentTab34 = 1;
});

// Slide with tabs
$("body").keydown(function (e) {
    var $currentSlide = $(fullpage_api.getActiveSlide().item);
    var $currentTab = $(fullpage_api.getActiveSlide().item).data('current');

    if ($currentSlide.data('vertical') !== undefined && $currentSlide.data('vertical')) {

        if (e.keyCode == 37) { // left
            $currentTab--;
            $('.active.mainActive').find('a[data-page="' + $currentTab + '"]').trigger('click');

            if ($currentTab < 1) {
                fullpage_api.setKeyboardScrolling(true);
            } else {
                $(fullpage_api.getActiveSlide().item).data('current', $currentTab)
            }

        } else if (e.keyCode == 39) { // right

            $currentTab++;
            $('.active.mainActive').find('a[data-page="' + $currentTab + '"]').trigger('click');

            if ($currentTab > $currentSlide.data('verticaltotal')) {
                fullpage_api.setKeyboardScrolling(true);
            } else {
                $(fullpage_api.getActiveSlide().item).data('current', $currentTab)
            }
        }
    }
});

$(window).on('load', function () {

    var tl = new TimelineMax();

    if (window.location.hash) {
        $('.js-splash-screen, .t-section--loader').addClass("hide");
        //tl.to('.x-2', 1, { y: 0, opacity: 1 });
    } else {
        // $('.t-section--loader').removeClass('hide');
        $('.js-splash-screen').removeClass("bg-white");
        $('.js-splash-screen').addClass("bg-primary");


        tl.to($('.t-main--logotitle '), 1, { opacity: 1 });
        tl.to($('.t-section--mountain,.t-section--hikers'), 1, { y: 0, opacity: 1 });
        //tl.to($('.t-section--hikers'), 1, { x: 0, opacity: 1 });

        tl.to('.x2', 1, { y: 0, opacity: 1 })
            .to('.loader', 1, { width: '100%'})
            //.to('.x3', 1, { x: 0 })
            .to('.js-splash-screen', 1, { opacity: 0 }, "+=1")
            .staggerTo('.t-summary-01 .x-2', 1, { x: 0, opacity: 1 }, .2)
            .call(function () {
                $('.js-splash-screen').addClass("hide");
                //handleMobileNav($('.fp-slide.active'));
            }, null, "+=2");
    }
});

function nextSlide() {
    fullpage_api.moveSlideRight();
}

function previousSlide() {
    fullpage_api.moveSlideLeft();
}

function getMobileBackgroundColor(destination) {
    if ($(destination.item).find('.t-drink--bg').length) {
        // $('.theme-header').css('background', '#D94128');
    } else {
        // $('.theme-header').css('background', '#fff');
    }
}

function handleMobileNav(destination) {

    if ($('.fp-section.active').find('.fp-slide.active').find('.fp-scrollable').length == 0) {
        return;
    }

    var iscroll = $('.fp-section.active').find('.fp-slide.active').find('.fp-scrollable')[0].fp_iscrollInstance;

    if (iscroll && typeof iscroll !== undefined) {
        iscroll.on('scrollStart', function () {
            if (this.y == 0) {
                getMobileBackgroundColor(destination);
            }
        });

        iscroll.on('scrollEnd', function () {
            if (this.y < 0) {
                getMobileBackgroundColor(destination);
            } else {
                $('.theme-header').css('background', 'transparent');
            }
        });
    }
}

function afterSlideLoadOnDesktop(section, origin, destination, direction) {

    console.log('after slide load run')
    $(destination.item).addClass('mainActive');
    afterSlideLoadAnimate(destination, direction);

    if (hasVerticalTabs(destination)) {
        manageKeyboardScrolling(destination);
        handleContentScroll();
    }

    if (destination.index == 34 || destination.index == 35 || destination.index == 39) {
        $('.active.mainActive')
            .find('a[data-page="' + $(destination.item).data('current') + '"]')
            .trigger('click');
    }

    if (destination.index != 37 && destination.index != 39){
        if ($(destination.item).find('.container > div:first-child').hasClass('bg-punch')) {

            $('.category-left-menu span').addClass('text-white');
            $('.category-left-menu span').removeClass('text-punch');
        }
    }

    if ($(destination.item).find('.container > div:first-child').hasClass('t-action--bg-right')) {
        $('#nav-icon, .t-section-title--right, .navigations').addClass('text-white');
        $('#navigation-next, #navigation--prev, #navigation--slash').addClass('white');
    } else {
        $('#nav-icon, .t-section-title--right, .navigations').removeClass('text-white');
        $('#navigation-next, #navigation--prev, #navigation--slash').removeClass('white');
    }
    if (_winWidth > 1024) {
    var scroll_height = $(destination.item).find('.scroll-height').height();
    var scroll_height_v2 = $(destination.item).find('.scroll-height-v2').height();

    // var win_height = $(window).height() - 220; 26Dec2019
    var win_height = $(window).height() - 220;
    var win_height_v2 = $(window).height() - 220;

    if (win_height < scroll_height) {
        $(destination.item).find('.scroll-height').height(win_height);
        $(destination.item).find('.scroll-height').addClass('position-top');
    }
    if (win_height_v2 < scroll_height_v2) {
        $(destination.item).find('.scroll-height-v2').height(win_height_v2);
        $(destination.item).find('.scroll-height-v2').addClass('position-top');
    }

    }

    // if (destination.index == '7') {
    //     console.log(destination.index);
    //     var ss = new TimelineMax({ paused: true, reversed: true });

    //     ss.set('.t-loader', { css: { zIndex: 4 } })
    //             //     .set('.theme-header', { css: { backgroundColor: 'rgba(0, 0, 0, 0)' } })
    //                 // tlm.set('.t-navigation--list', {  pointerEvents: "all" })
    //                 ss.to('.t-loader--sidebar',.5,{scaleY:1})
    //                 .to('.t-loader--background',.5,{scaleX:1})
    //                 // .to('.t-navigation--fullscreen .t-main--titlenav', .3, { opacity: 1 })
    //                 // .staggerTo('.t-navigation--fullscreen .t-navigation--item', .3, { y: 0, opacity: 1 }, .1);
    // }
    handleContentScroll();
}

function onSlideLeaveOnDesktop(section, origin, destination, direction) {
    //afterSlideLoadAnimate(destination);
    onSlideLeaveAnimate(origin, destination, direction);

    var myArr = ['Community', 'Identity', 'Food', 'Action', 'Home', 'Closing']
    if ($(destination.item).data('index')) {
        var categoryid = $(destination.item).data('categoryid') === undefined ? '01' : $(destination.item).data('categoryid');
        $('.category-left-menu').html('<span class="text-punch"> ' + categoryid + ' </span> ' + $(destination.item).data('slide'));
        $('.cat-numbers').html('<span class="cat-numbers--text"> ' + categoryid + ' </span> ');

        $('.t-section--title').fadeIn();
        $('.navigations').fadeIn();

        $('.navigation-index--origin').text('0' + $(destination.item).data('index'));
        $('.navigation-index--destination').text('0' + $(destination.item).data('total'));
    } else {
        $('.navigations').fadeOut();
        $('.t-section--title').fadeOut();
    }

    if (destination.index == '48') {
        $('.navigations').fadeOut();
    }

    console.log('leave slide load run')

}


function afterSlideLoadOnMobile(section, origin, destination, direction) {
    $(destination.item).addClass('mainActive');
    afterSlideLoadAnimate(destination, direction);
    // checkIfVerticalTabs(destination);

    if ($(destination.item).find('.container > div:first-child').hasClass('bg-punch')) {

        $('.category-left-menu span').addClass('text-white');
        $('.category-left-menu span').removeClass('text-punch');
    }


    if ($(window).width() > 992 && $(window).width() <= 1024) {

    } else {
        var tlnew = new TimelineMax();
        if ($(destination.item).find('.t-drink--bg').length) {
            // tlnew.to($('.theme-header'), 1, { css: { backgroundColor: '#D94128' } });
        } else {
            // tlnew.to($('.theme-header'), 1, { css: { backgroundColor: '#fff' } });
        }
    }

    // adding class for mobile fixes of color
    if (destination.index == 9 || destination.index == 18 || destination.index == 25
        || destination.index == 33 || destination.index == 41 || destination.index == 47) {
        $('.t-section-title--left span').addClass('text-gray-100');
    }


}

function onSlideLeaveOnMobile(section, origin, destination, direction) {
    //afterSlideLoadAnimate(destination);
    onSlideLeaveAnimate(origin, destination, direction);


    var myArr = ['Community', 'Identity', 'Food', 'Action', 'Home', 'Closing']

    if ($(destination.item).data('index')) {
        var categoryid = $(destination.item).data('categoryid') === undefined ? '01' : $(destination.item).data('categoryid');
        $('.category-left-menu').html('<span class="text-punch"> ' + categoryid + ' </span> ' + $(destination.item).data('slide'));
        $('.cat-numbers').html('<span class="cat-numbers--text"> ' + categoryid + ' </span> ');
        $('.category-left-menu').addClass($(destination.item).data('slide'));
        $('.t-section--title').fadeIn();
        $('.navigations').fadeIn();

        $('.navigation-index--origin').text('0' + $(destination.item).data('index'));
        $('.navigation-index--destination').text('0' + $(destination.item).data('total'));

        if ($(destination.item).data('categoryid') == '01') {
            $('.category-left-menu').removeClass('Thanks Community Food Our Drink Home Action for Inspiration Ventures &');
        }
        if ($(destination.item).data('categoryid') == '02') {
            $('.category-left-menu').removeClass(' Identity Thanks Food Our Drink Home Action for Inspiration Ventures &');
        }
        if ($(destination.item).data('categoryid') == '03') {
            $('.category-left-menu').removeClass('Community Identity Thanks  Our Drink Home Action for Inspiration Ventures &');
        }
        if ($(destination.item).data('categoryid') == '04') {
            $('.category-left-menu').removeClass('Community Identity Thanks Food  Our Drink  Action for Inspiration Ventures &');
        }
        if ($(destination.item).data('categoryid') == '05') {
            $('.category-left-menu').removeClass('Community Identity Thanks Food  Our Drink  for Inspiration Ventures &');
        }
        if ($(destination.item).data('categoryid') == '06') {
            $('.category-left-menu').removeClass('Community Identity Thanks Food  Our Drink  Action for Inspiration  &');
        }
        if ($(destination.item).data('categoryid') == '07') {
            $('.category-left-menu').removeClass('Community Identity  Food  Our Drink  Action for Inspiration Ventures  &');
        }

    } else {
        $('.navigations').fadeOut();
        $('.t-section--title').fadeOut();
    }

    if (destination.index == '48') {
        $('.navigations').fadeOut();
    }
}


function manageKeyboardScrolling(destination) {
    if (hasVerticalTabs(destination)) {
        fullpage_api.setKeyboardScrolling(false);

        return;
    }

    fullpage_api.setKeyboardScrolling(true);
}

function hasVerticalTabs(destination) {
    if ($(destination.item).data('vertical') !== undefined
        && $(destination.item).data('vertical')) {
        return true;
    }

    return false;
}

function onSlideLeaveAnimate(origin, destination, direction) {
    var tl = new TimelineMax();
    var class1 = $(origin.item).find('.x-2');

    tl.to(class1, .3, { x: -20, opacity: 0 })
        .add( function(){
            $(origin.item).removeClass('mainActive');
        });


    if ($(destination.item).data('loader') !== undefined
        && $(destination.item).data('loader') && direction == 'right') {
        fullpage_api.setKeyboardScrolling(false);
        tl.set('.t-loader', { css: { zIndex: 9 } })
            .to('.t-loader--sidebar',.5,{scaleY:1})
            .to('.t-loader--background',.5,{scaleX:1})
            .to('.t-loader--inner', .5, { opacity: 1 }, 1)
            .to('.t-loader--inner', .5, { opacity: 0 }, 2 )
            .to('.t-loader--background',.5,{scaleX:0})
            .to('.t-loader--sidebar',.5,{scaleY:0})
            .set('.t-loader', { css: { zIndex: -6 } })
        // .staggerTo('.t-navigation--fullscreen .t-navigation--item', .3, { y: 0, opacity: 1 }, .1);
        fullpage_api.setKeyboardScrolling(true);
    }

    tl.to($('.t-section--loader'), .3, { opacity: 0 });
    tl.to($(origin.item).find('.bg-punch'), .3, { opacity: 0 });
    tl.to($(origin.item).find('.bg-primary'), .3, { opacity: 0 });
    tl.to($(origin.item).find('.t-funfact--bg'), .3, { opacity: 0 });


    // if ($(origin.item).data('loader') !== undefined
    // && $(origin.item).data('loader')) {
    //     console.log('here');
    //     tl.set('.t-loader', { css: { zIndex: 4 } })
    //     //     .set('.theme-header', { css: { backgroundColor: 'rgba(0, 0, 0, 0)' } })
    //         // tlm.set('.t-navigation--list', {  pointerEvents: "all" })
    //         // tlm.to('.background-first',.5,{scaleY:1})
    //         .to('.tl-loader--background',.5,{scaleX:1})
    //         // .to('.t-navigation--fullscreen .t-main--titlenav', .3, { opacity: 1 })
    //         // .staggerTo('.t-navigation--fullscreen .t-navigation--item', .3, { y: 0, opacity: 1 }, .1);

    // }

}

function afterSlideLoadAnimate(destination, direction) {
    if ($(destination.item).data('loader') !== undefined
        && $(destination.item).data('loader') && direction == 'right') {
        var categoryid = $(destination.item).data('categoryid') === undefined ? '01' : $(destination.item).data('categoryid');
        $('.t-loader--item').html('<span class="text-gray-500"> ' + categoryid + ' </span><span> ' + $(destination.item).data('slide') + '</span>');
        setTimeout(function() {
            afterLoadAnimate(destination);
        }, 2500);
    } else {
        afterLoadAnimate(destination);
    }



}


function afterLoadAnimate(destination) {
    var tl = new TimelineMax();
    var class1 = $(destination.item).find('.x-2');

    tl.to($(destination.item).find('.bg-punch, .bg-primary, .t-funfact--bg'), .2, { opacity: 1 });
    tl.staggerTo(class1, 1, { x: 0, opacity: 1 }, .3);
    tl.staggerTo('.fp-slide.active', 1, { x: 0, opacity: 1 }, .3);
}
