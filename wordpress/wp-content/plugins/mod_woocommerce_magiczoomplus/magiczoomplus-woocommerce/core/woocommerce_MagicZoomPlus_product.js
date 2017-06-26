var mjsAddEventMethod = 'je1';
    if(typeof(magicJS.Doc.je1) == 'undefined') mjsAddEventMethod = 'jAddEvent';
    
var magicToolboxLinks = [];
var allowHighlightActiveSelectorOnUpdate = true;


$mjs(window)[mjsAddEventMethod]('DOMContentLoaded', function() {
    magictoolboxBindSelectors();
})

function magictoolboxBindSelectors(){
    var container = document.getElementById('MagicToolboxSelectors'+productId);
    if(container) {
        var aTagsArray = Array.prototype.slice.call(container.getElementsByTagName('a'));
        for(var i = 0; i < aTagsArray.length; i++) {
            if(aTagsArray[i].getElementsByTagName('img').length) {
                magicToolboxLinks.push(aTagsArray[i]);
            }
        }
    }
    
    //NOTE: to swicth between 360, zoom and video
    var isMagicZoom = (magicToolboxTool == 'magiczoom' || magicToolboxTool == 'magiczoomplus'),
        loadVimeoJSFramework = function() {
            //NOTE: to avoid multiple loading
            if(typeof(arguments.callee.loadedVimeoJSFramework) !== 'undefined') {
                return;
            }
            arguments.callee.loadedVimeoJSFramework = true;

            //NOTE: load vimeo js framework
            if(typeof(window.$f) == 'undefined') {
                var firstScriptTag = document.getElementsByTagName('script')[0],
                    newScriptTag = document.createElement('script');
                newScriptTag.async = true;
                newScriptTag.src = 'https://secure-a.vimeocdn.com/js/froogaloop2.min.js';
                firstScriptTag.parentNode.insertBefore(newScriptTag, firstScriptTag);
            }
        },
        loadYoutubeApi = function() {
            //NOTE: to avoid multiple loading
            if(typeof(arguments.callee.loadedYoutubeApi) !== 'undefined') {
                return;
            }
            arguments.callee.loadedYoutubeApi = true;

            //NOTE: load youtube api
            if(typeof(window.YT) == 'undefined' || typeof(window.YT.Player) == 'undefined') {
                var firstScriptTag = document.getElementsByTagName('script')[0],
                    newScriptTag = document.createElement('script');
                newScriptTag.async = true;
                newScriptTag.src = 'https://www.youtube.com/iframe_api';
                firstScriptTag.parentNode.insertBefore(newScriptTag, firstScriptTag);
            }
        },
        pauseYoutubePlayer = function(iframe) {
            if(typeof(arguments.callee.youtubePlayers) === 'undefined') {
                arguments.callee.youtubePlayers = {};
            }
            var id = iframe.getAttribute('id');
            if(id && typeof(arguments.callee.youtubePlayers[id]) != 'undefined') {
                arguments.callee.youtubePlayers[id].pauseVideo();
                return;
            }
            var player = new window.YT.Player(iframe, {
                events: {
                    'onReady': function(event) {
                        event.target.pauseVideo();
                    }
                }
            });
            id = iframe.getAttribute('id');
            arguments.callee.youtubePlayers[id] = player;
            return;
        },
        switchFunction = function(event) {
            event = event || window.event;
            var element = event.target || event.srcElement,
                currentContainer = document.querySelector('.mt-active'),
                currentSlideId = null,
                newSlideId = null,
                newContainer = null,
                switchContainer = false;

            if(!currentContainer) {
                return false;
            }
            

            if(element.tagName.toLowerCase() == 'img' || element.tagName.toLowerCase() == 'span') {
                element = element.parentNode;
            }

            currentSlideId = currentContainer.getAttribute('data-magic-slide');
            newSlideId = element.getAttribute('data-magic-slide-id');

            if(currentSlideId == newSlideId/* && currentSlideId == 'zoom'*/) {
                //if(isMagicZoom) {
                    allowHighlightActiveSelectorOnUpdate = false;
                    magicToolboxHighlightActiveSelector(element);
                //}
                return false;
            }

            //NOTE: check when one image + 360 selector
            newContainer = document.querySelector('div[data-magic-slide="'+newSlideId+'"]');

            if(!newContainer) {
                return false;
            }

            if(newSlideId == 'zoom' && isMagicZoom) {
                //NOTE: in order to magiczoom(plus) was not switching selector
                event.stopQueue && event.stopQueue();
            }

            //NOTE: switch slide container
            currentContainer.className = currentContainer.className.replace(/(\s|^)mt-active(\s|$)/, ' ');
            newContainer.className += ' mt-active';

            if(newSlideId == 'zoom') {
                if(isMagicZoom){
                    //NOTE: hide image to skip magiczoom(plus) switching effect
                    if(!$mjs(element).jHasClass('mz-thumb-selected')) {
                        document.querySelector('#'+magicToolboxToolMainId+' .mz-figure > img').style.visibility = 'hidden';
                    }
                    //NOTE: switch image
                    MagicZoom.switchTo(magicToolboxToolMainId, element);
                    allowHighlightActiveSelectorOnUpdate = false;
                }
                magicToolboxHighlightActiveSelector(element);
            }

            var videoType = null;

            //NOTE: stop previous video slide
            if(currentSlideId.match(/^video\-\d+$/)) {
                //NOTE: need to stop current video
                var iframe = currentContainer.querySelector('iframe');
                if(iframe) {
                    videoType = iframe.getAttribute('data-video-type');
                    if(videoType == 'vimeo') {
                        var vimeoPlayer = window.$f(iframe);
                        if(vimeoPlayer) {
                            vimeoPlayer.api('pause');
                        }
                    } else if(videoType == 'youtube') {
                        pauseYoutubePlayer(iframe);
                    }
                }
            }

            //NOTE: load api for video if need it
            if(newSlideId.match(/^video\-\d+$/)) {
                videoType = element.getAttribute('data-video-type');
                if(videoType == 'vimeo') {
                    loadVimeoJSFramework();
                } else if(videoType == 'youtube') {
                    loadYoutubeApi();
                }
                magicToolboxHighlightActiveSelector(element);
            }

            //if(newSlideId == '360' && isMagicZoom) {
            if(newSlideId == '360') {
                magicToolboxHighlightActiveSelector(element);
            }

            event.preventDefault ? event.preventDefault() : (event.returnValue = false);

            return false;
        },
        switchEvent;

    if(isMagicZoom || magicToolboxTool == 'magicthumb') {
        if(isMagicZoom) {
            switchEvent = (magicToolboxSwitchMetod == 'click' ? 'btnclick' : magicToolboxSwitchMetod);}

            //NOTE: mark thumbnail
            var activeSlide, slideId, query, thumbnail;
            activeSlide = document.querySelector('.magic-slide.mt-active');
            if(activeSlide) {
                slideId = activeSlide.getAttribute('data-magic-slide');
                var query = '';
                if(isMagicZoom){
                    query = slideId != 'zoom' ? '[data-magic-slide-id="'+slideId+'"]' : '.mz-thumb.mz-thumb-selected';
                }else{
                    query = slideId != 'zoom' ? '[data-magic-slide-id="'+slideId+'"]' : '.mgt-selector.mgt-active';
                }
                
                thumbnail = document.querySelector(query);
                if(thumbnail) {
                    thumbnail.className += ' active-selector';
                }
            }
        //}
        //NOTE: a[data-magic-slide-id]
        for(var j = 0, linksLength = magicToolboxLinks.length; j < linksLength; j++) {
            if(isMagicZoom) {
                //NOTE: if MagicThumb is present
                if(mjsAddEventMethod == 'je1') {
                    $mjs(magicToolboxLinks[j])[mjsAddEventMethod](magicToolboxSwitchMetod, switchFunction);
                    $mjs(magicToolboxLinks[j])[mjsAddEventMethod]('touchstart', switchFunction);
                } else {
                    $mjs(magicToolboxLinks[j])[mjsAddEventMethod](switchEvent+' tap', switchFunction, 1);
                }
            } else if(magicToolboxTool == 'magicthumb') {
                $mjs(magicToolboxLinks[j])[mjsAddEventMethod](magicToolboxSwitchMetod, switchFunction);
                $mjs(magicToolboxLinks[j])[mjsAddEventMethod]('touchstart', switchFunction);
            }
        }
        
        //NOTE: start magicscroll if need it
        if((typeof(window['MagicScroll']) != 'undefined') && container && container.className.match(/(?:\s|^)MagicScroll(?:\s|$)/)) {
            if(isMagicZoom) {
                var mscontainer = document.querySelector('.MagicScroll');
                var attr = mscontainer.getAttribute('data-options');
                mscontainer.setAttribute('data-options', attr.replace(/autostart\:false;/,''));
                MagicScroll.start('MagicToolboxSelectors'+productId);
            } else {
                window.checkForThumbIsReadyIntervalID = setInterval(function() {
                     if (MagicThumb && MagicThumb.isReady('MagicThumbImage_Main')) {
                        MagicScroll.start('MagicToolboxSelectors'+productId);
                        clearInterval(window.checkForThumbIsReadyIntervalID);
                        window.checkForThumbIsReadyIntervalID = null;
                    }
                }, 100);
            }
        }
    }
}

function magicToolboxHighlightActiveSelector(selectedElement) {
    //NOTE: to highlight selector when switching thumbnails
    for(var i = 0; i < magicToolboxLinks.length; i++) {
        magicToolboxLinks[i].className = magicToolboxLinks[i].className.replace(/(\s|^)active\-selector(\s|$)/, ' ');
    }
    selectedElement.className += ' active-selector';
}