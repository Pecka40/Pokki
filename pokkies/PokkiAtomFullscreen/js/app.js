var App = function() {
    var unloaded = new LocalStore('unloaded'),
        splash_ran = unloaded.get() ? true : false,
        enterfullscreen_bubble,
        exitfullscreen_bubble,
        exitreminder_bubble,
        upgrade_bubble,
        shown_fullscreen_bubble = false,
        shown_exit_bubble = false,
        exitfullscreenTimer = 0,
        controls_left = document.getElementById('controls-left'),
        controls_right = document.getElementById('controls-right'),
        minPlatformVersion = 0.246; // min version for fullscreen support
    
    
    // Utility function to check platform version
    this.isPlatformValid = function(minVersion) {
        var this_eng = pokki.getPlatformVersion();
		if (!minVersion) return true;
		
		// compare engine versions
		return parseFloat(this_eng) >= parseFloat(minVersion);
    };
    
    
    // initialize tooltip bubbles
    if(this.isPlatformValid(minPlatformVersion)) {
        enterfullscreen_bubble = Bubbles.createNew('gofullscreen', {
            pinnedTo: '#fullscreen-go', 
            contentHTML: '<strong>Click <span class="ic fsgo"><span></span></span> to play in full screen!</strong>', 
            onHide: function() {
                shown_fullscreen_bubble = true;
            }
        });
        
        exitfullscreen_bubble = Bubbles.createNew('exitfullscreen', {
            pinnedTo: '#fullscreen-exit', 
            contentHTML: '<strong>Click <span class="ic fsexit"><span></span></span> to exit full screen!</strong>',
            onShow: function() {
                controls_left.classList.remove('_fsexitenabled');
            },
            onHide: function() {
                exitfullscreenTimer = setTimeout(function() { controls_left.classList.add('_fsexitenabled') }, 200);
                shown_exit_bubble = true;
            }
        });
        
        exitreminder_bubble = Bubbles.createNew('exitfullscreen2', {
            pinnedTo: '#fullscreen-exit', 
            contentHTML: '<strong>Click <span class="ic fsexit"><span></span></span> to exit full screen!</strong>',
            autoHide: 4000,
            onShow: function() {
                controls_left.classList.remove('_fsexitenabled');
            },
            onHide: function() {
                clearTimeout(exitfullscreenTimer);
                exitfullscreenTimerr = setTimeout(function() { controls_left.classList.add('_fsexitenabled') }, 200);
            }
        });
    }
    else {
        controls_left.style.display = 'none';
        upgrade_bubble = Bubbles.createNew('needupgrade', {
            contentHTML: '<strong>Your platform doesn\'t support fullscreen :(</strong><p>Please upgrade to use fullscreen.</p>',
        });
    }


    // attach click event to minimize button
    var minimize = document.getElementById('minimize');
    minimize.addEventListener('click', pokki.closePopup);
    
    // attach click event to fullscreen button
    var fullscreen = document.getElementById('fullscreen-go');
    fullscreen.addEventListener('click', function() {
        var wrapper = document.body;
        wrapper.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        
        if(!shown_exit_bubble) {
            exitfullscreen_bubble.show();
            shown_exit_bubble = true;
        }
        else {
            exitreminder_bubble.show();
        }
    });
    
    // attach click event to fullscreen button
    var fullscreenexit = document.getElementById('fullscreen-exit');
    fullscreenexit.addEventListener('click', function() {
        document.webkitCancelFullScreen();
    });
    
    
    // Initialize whatever else needs to be initialized
    
    
    
        
    // Kick off what needs to be done whenever the popup is about to be shown
    this.onPopupShowing = function() {    
    
    };
    
    
    // Kick off what needs to be done when the popup is shown
    this.onPopupShown = function() {
        // splash elements
        var splash = document.getElementById('splash');
        var atom = document.getElementById('atom');
        var wrapper = document.getElementById('wrapper');
        
        // animate splash on first run
        if(!splash_ran) {
            splash.classList.add('animate');
            atom.classList.add('animate');
            wrapper.classList.remove('show');
            
            // allows the css animation to run for some time before removing the animation class
            setTimeout(function() {
                splash.classList.remove('animate');
                atom.classList.remove('animate');
                wrapper.classList.add('show');
                controls_left.classList.add('_fsenabled');
                controls_right.style.opacity = 1;
                
                // stagger content animation
                var p = wrapper.getElementsByTagName('p');
                for(var i = 0; i < p.length; i++) {
                    p[i].style['-webkit-animation-delay'] = (100 * i + 330) + 'ms';
                }
                
                // display bubble tooltip
                if(enterfullscreen_bubble)
                    setTimeout(function() { enterfullscreen_bubble.show(); }, 1000);
                if(upgrade_bubble)
                    setTimeout(function() { upgrade_bubble.show(); }, 1000);
            }, 2200);
            
            splash_ran = true;
        }
        else if(unloaded.get()) {
            splash.classList.remove('animate');
            atom.classList.remove('animate');
            wrapper.classList.add('show');
            controls_left.classList.add('_fsenabled');
            controls_right.style.opacity = 1;
                
            // stagger content animation
            var p = wrapper.getElementsByTagName('p');
            for(var i = 0; i < p.length; i++) {
                p[i].style['-webkit-animation-delay'] = (100 * i + 330) + 'ms';
            }
                
            // display bubble tooltip
            if(enterfullscreen_bubble)
                setTimeout(function() { enterfullscreen_bubble.show(); }, 1000);
            if(upgrade_bubble)
                setTimeout(function() { upgrade_bubble.show(); }, 1000);
        }
        unloaded.remove();
    };
    
    
    // Kick off what needs to be done when the popup is hidden
    this.onPopupHidden = function() {
    
    };
    
    
    // Use this to store anything needed to restore state when the user opens the Pokki again
    this.onPopupUnload = function() {
        unloaded.set(true);
    };
};