var SUtil, ScrollProxy,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

SUtil = require('./SUtil');


/*
  Main class, containing the scrolling related events and API

  @option _targetList [HTMLElement] target The anchor of the ScrollProxy
    instance
  @option _targetList [ScrollProxy] proxy The instance of ScrollProxy

  @option _events [String] type The event name of the event
  @option _events [Function] fn The function that will handle the callback
  @option _events [Number] timeout The timeout id of the throttled **fn**

  @since 0.1.0
  @author Matheus Kautzmann - <kautzmann5@gmail.com>
 */

module.exports = ScrollProxy = (function() {

  /*
    @property [Boolean] Class variable that indicates if ScrollProxy is
      currently enabled
   */
  ScrollProxy.active = false;


  /*
    @property [Array<Object>] Private Class variable that holds
      all the elements currently tracked by ScrollProxy
   */

  ScrollProxy._targetList = [];


  /*
    @property [String] Class constant that maps to the **scroll** event
      name
   */

  ScrollProxy.SCROLL = 'scroll';


  /*
    @property [String] Class constant that maps to the **offsetX**
      event name
   */

  ScrollProxy.OFFSET_X = 'offsetX';


  /*
    @property [String] Class constant that maps to the **offsetY**
      event name
   */

  ScrollProxy.OFFSET_Y = 'offsetY';


  /*
    @property [String] Class constant that maps to the **top**
      event name
   */

  ScrollProxy.TOP = 'top';


  /*
    @property [String] Class constant that maps to the **bottom**
      event name
   */

  ScrollProxy.BOTTOM = 'bottom';


  /*
    @property [String] Class constant that maps to the **left**
      event name
   */

  ScrollProxy.LEFT = 'left';


  /*
    @property [String] Class constant that maps to the **right**
      event name
   */

  ScrollProxy.RIGHT = 'right';


  /*
    @property [String] Class constant that maps to the **visible**
      event name
   */

  ScrollProxy.VISIBLE = 'visible';


  /*
    @property [String] Class constant that maps to the **invisible**
      event name
   */

  ScrollProxy.INVISIBLE = 'invisible';


  /*
    @property [String] Class constant that maps to the **disable-hover**
      event name
   */

  ScrollProxy.DISABLE_HOVER = 'disable-hover';


  /*
    @property [String] Private instance variable that maps to the
      target's **x** position property
   */

  ScrollProxy.prototype._targetX = 'scrollLeft';


  /*
    @property [String] Private instance variable that maps to the
    target's **y** position property
   */

  ScrollProxy.prototype._targetY = 'scrollTop';


  /*
    @property [HTMLElement] Private instance variable that indicates the target
      this ScrollProxy's instance is attached to
   */

  ScrollProxy.prototype._target = null;


  /*
    @property [Array<Object>] Private instance variable that holds the events
      this instance responds to
   */

  ScrollProxy.prototype._events = [];


  /*
    @property [Number] Private instance variable that holds the
      current delay for scroll throttling
   */

  ScrollProxy.prototype._scrollDelay = 250;


  /*
    @property [Number] Private instance variable that holds the
      current delay for enabling/disabling hover elements on scroll
   */

  ScrollProxy.prototype._hoverDelay = 250;


  /*
    @property [Number] Private instance variable that holds the
      current timeout used when blocking hover animations
   */

  ScrollProxy.prototype._hoverTimeout = null;


  /*
    @property [Number] Instance variable that holds the current x position of
      the scroll target
   */

  ScrollProxy.prototype.x = 0;


  /*
    @property [Number] Instance variable that holds the current y position of
    the scroll target
   */

  ScrollProxy.prototype.y = 0;


  /*
    @property [Number] Instance variable that holds the current width of
      the scroll target box
   */

  ScrollProxy.prototype.width = 0;


  /*
    @property [Number] Instance variable that holds the current height of
      the scroll target box
   */

  ScrollProxy.prototype.height = 0;


  /*
    @property [Number] scrollWidth Instance variable that holds the current
      width of the scroll target scroll area
   */

  ScrollProxy.prototype.scrollWidth = 0;


  /*
    @property [Number] Instance variable that holds the current
      height of the scroll target scroll area
   */

  ScrollProxy.prototype.scrollHeight = 0;


  /*
    @property [Object] Instance variable that holds the current
      scroll data (from last scroll action)
   */

  ScrollProxy.prototype.scrollData = {};


  /*
    Handles the scroll event when it fires
    @example Simulating the window firing an event passing the metadata:
      window.addEventListener('scroll', ScrollProxy.handleScroll, true)
    @param [Object] e scroll event data
    @return [Object] Null or the element that catched the event
    @since 0.1.0
    @private
   */

  ScrollProxy._handleScroll = function(e) {
    var len, ref, target;
    len = ScrollProxy._targetList.length;
    if (len === 0) {
      return null;
    }
    target = e.target.body || e.target;
    return (ref = ScrollProxy._getElement(target)) != null ? ref.proxy._performScroll(e) : void 0;
  };


  /*
    Retrieves the current target and proxy for the given HTMLElement
    @example Checking if the body tag is on _targetList:
      ScrollProxy._getElement(document.body)
    @param [HTMLElement] el The element to search for in **_targetList**
    @return [Object] Null or the target that matched the argument
    @since 0.1.0
    @private
   */

  ScrollProxy._getElement = function(el) {
    var item, j, len1, ref;
    ref = ScrollProxy._targetList;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      item = ref[j];
      if ((item != null) && item.target === el) {
        return item;
      }
    }
    return null;
  };


  /*
    Activates the ScrollProxy's functionality, registering the event listener
    that will listen for scroll events and proxy it to
    **ScrollProxy.handleScroll**
    @example Activating ScrollProxy manually, it's done automatically with new:
      ScrollProxy.activate()
    @return [Boolean] The current status of ScrollProxy
    @since 0.1.0
   */

  ScrollProxy.activate = function() {
    if (!ScrollProxy.active) {
      window.addEventListener(ScrollProxy.SCROLL, ScrollProxy._handleScroll, true);
      ScrollProxy.active = true;
    }
    return ScrollProxy.active;
  };


  /*
    Deactivates the ScrollProxy's functionality, removing the event listener and
    stopping any functionality
    @example Deactivating manually, it's done automatically when unregistering:
      ScrollProxy.deactivate()
    @return [Boolean] The current status of ScrollProxy
    @since 0.1.0
   */

  ScrollProxy.deactivate = function() {
    window.removeEventListener(ScrollProxy.SCROLL, ScrollProxy._handleScroll, true);
    return ScrollProxy.active = false;
  };


  /*
    Cleans the **_targetList**, removing all targets
    @example To assure ScrollProxy is shut down you could run **clean**:
      ScrollProxy.clean()
    @return [Array] Targets removed
    @since 0.1.0
   */

  ScrollProxy.clean = function() {
    ScrollProxy.deactivate();
    return ScrollProxy._targetList = [];
  };


  /*
    Update this instance rect information, updating x and y positions as well as
    width, height, scrollWidth and scrollHeight
    @example Most methods run this function when up-to-date data is required:
      s = new ScrollProxy()
      document.body.scrollTop = 20 # s.y continues 0
      s.updateViewportInfo() # s.y is 20 now
    @return [Null] Nothing useful is returned
    @since 0.1.0
    @private
   */

  ScrollProxy.prototype._updateViewportInfo = function() {
    this.x = this._target[this._targetX];
    this.y = this._target[this._targetY];
    this.width = this._target.offsetWidth;
    this.height = this._target.offsetHeight;
    this.scrollWidth = this._target.scrollWidth;
    this.scrollHeight = this._target.scrollHeight;
    return null;
  };


  /*
    Utility method that Throws error if element given is not child of the
    **_target**
    @example Checking a list item inside a ul:
      s = new ScrollProxy(ul)
      s._checkElement(li) # does not throw anything, so OK
    @param [HTMLElement] el The element to check
    @return [Null] Nothing useful is returned
    @since 0.1.0
    @private
   */

  ScrollProxy.prototype._checkElement = function(el) {
    if (indexOf.call(this._target.children, el) < 0) {
      throw new Error('Element must be child of the scroll element');
    }
    return null;
  };


  /*
    Remove an event from the list of events
    @example Don't want to receive scroll feedback anymore:
      s = new ScrollProxy()
      evt = s._createEvent('scroll', -> null)
      s._removeEvent(evt) # OK, event gone
    @param [Object] The event to remove
    @return [Array] The new array of events (**_events**)
    @since 0.1.0
    @private
   */

  ScrollProxy.prototype._removeEvent = function(event) {
    var arr, i, item, j, k, len1, len2, ref, ref1;
    ref = this._events;
    for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
      item = ref[i];
      if (event === item) {
        window.clearTimeout(event.timeout);
        delete event.fn;
        delete this._events[i];
        break;
      }
    }
    arr = [];
    ref1 = this._events;
    for (k = 0, len2 = ref1.length; k < len2; k++) {
      item = ref1[k];
      if (item != null) {
        arr.push(item);
      }
    }
    return this._events = arr;
  };


  /*
    Checks if the given virtual rect is visible on **_target** viewport
    @example Check if the rect (0, 0, 50, 50) is visible:
      s = new ScrollProxy()
      rect = {x: 0, y:0, w: 50, h: 50}
      s._isRectVisible(rect) # Visible?
    @param [Object] rect The rect object to check
    @option rect [Number] x The top-left x position
    @option rect [Number] y The top-left y position
    @option rect [Number] w The width of the rect
    @option rect [Number] h The height of the rect
    @return [Boolean] Indicates if visible or not
    @since 0.1.0
    @private
   */

  ScrollProxy.prototype._isRectVisible = function(rect) {
    var xVisible, yVisible;
    this._updateViewportInfo();
    xVisible = this.x < (rect.x + rect.w) && this.x > (rect.x - this.width);
    yVisible = this.y < (rect.y + rect.h) && this.y > (rect.y - this.height);
    return xVisible && yVisible;
  };


  /*
    Performs the scroll actions, firing the needed events internally
    @example The **_handleScroll** usually calls this method:
      s = new ScrollProxy()
      s._performScroll(scrollEvt) # OK, related events will be fired
    @param [Object] The scroll data passed with the event
    @return [HTMLElement] The current target
    @since 0.1.0
    @private
   */

  ScrollProxy.prototype._performScroll = function(e) {
    var event, j, len, len1, ref;
    len = this._events.length;
    if (len === 0) {
      return null;
    }
    this.scrollData = e;
    ref = this._events;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      event = ref[j];
      event.fn.call(this, event);
    }
    return this._target;
  };


  /*
    Function that performs the scroll throttling to achieve better performance
    @example One must pass a function to be throttled and a delay:
      s = new ScrollProxy()
      func = -> this
      newFunc = s._throttleScroll(func, 250)
      newFunc() # func will be called after 250ms, the scrollData will be passed
      newFunc() # func will not be called, because other call is waiting
    @param [Function] The function to throttle
    @param [Number] delay The time function should wait to fire
    @return [Function] The new throttled function
    @since 0.1.0
    @private
   */

  ScrollProxy.prototype._throttleScroll = function(func, delay) {
    var running;
    running = false;
    return (function(_this) {
      return function(data) {
        if (running) {
          return;
        }
        running = true;
        return data.timeout = window.setTimeout(function() {
          running = false;
          return SUtil.reportChange(func, _this, _this.scrollData);
        }, (delay != null ? delay : _this.getScrollDelay()));
      };
    })(this);
  };


  /*
    Creates a generic event and pushes it in the **_events** array
    @example Create event with name, callback and optional throttle delay:
      s = new ScrollProxy()
      s._createEvent('scroll', -> null, 250) # setting delay of 250ms
    @param [String] evt The event name to register
    @param [Function] callback the function to be called when event is fired
    @param [Function] origin the original function passed, `off` searches for it
    @param [Number] delay Time to wait in milliseconds
    @return [Object] The event just registered
    @since 0.2.0
    @private
   */

  ScrollProxy.prototype._createEvent = function(evt, callback, origin, delay) {
    var fn;
    fn = this._throttleScroll(callback, delay);
    return this._events.push({
      type: evt,
      fn: fn,
      origin: origin,
      timeout: null
    });
  };


  /*
    Creates a scroll event
    @example Create scroll event with callback and optional throttle delay:
      s = new ScrollProxy()
      s._createScrollEvent('scroll', -> null, 250) # setting delay of 250ms
    @param [String] evt The event name to register (**scroll**)
    @param [Function] callback the function to be called when event is fired
    @param [Function] origin the original function passed, `off` searches for it
    @param [Number] delay Time to wait in milliseconds
    @return [Object] The event just registered
    @since 0.2.0
    @private
   */

  ScrollProxy.prototype._createScrollEvent = function(evt, callback, origin, delay) {
    if (origin == null) {
      origin = callback;
    }
    return this._createEvent(evt, (function(_this) {
      return function() {
        _this._updateViewportInfo();
        return SUtil.reportChange(callback, _this, _this.scrollData);
      };
    })(this), origin, delay);
  };


  /*
    Creates a offset event
    @example Create offset event with callback and optional offset:
      s = new ScrollProxy()
      s._createOffsetEvent('offsetX', -> null, 250) # setting offset of 250px
    @param [String] evt The event name to register, **offsetX** or **offsetY**
    @param [Function] callback the function to be called when event is fired
    @param [Number] offset Offset to check for (0 is default)
    @return [Object] The event just registered
    @since 0.2.0
    @private
   */

  ScrollProxy.prototype._createOffsetEvent = function(evt, callback, offset) {
    if (offset == null) {
      offset = 0;
    }
    if (evt === ScrollProxy.OFFSET_X) {
      return this._createEvent(evt, (function(_this) {
        return function() {
          if (_this.x === _this._target[_this._targetX]) {
            return;
          } else {
            _this._updateViewportInfo();
          }
          if (SUtil.isPositiveNumber(offset) && _this.x < offset) {
            return;
          }
          if (SUtil.isNegativeNumber(offset) && _this.x > Math.abs(offset)) {
            return;
          }
          return SUtil.reportChange(callback, _this, _this.scrollData);
        };
      })(this), callback);
    } else {
      return this._createEvent(evt, (function(_this) {
        return function() {
          if (_this.y === _this._target[_this._targetY]) {
            return _this._updateViewportInfo();
          } else {
            _this._updateViewportInfo();
          }
          if (SUtil.isPositiveNumber(offset) && _this.y < offset) {
            return;
          }
          if (SUtil.isNegativeNumber(offset) && _this.y > Math.abs(offset)) {
            return;
          }
          return SUtil.reportChange(callback, _this, _this.scrollData);
        };
      })(this), callback);
    }
  };


  /*
    Creates a event to check for horizontal bound collision
    @example Create horizontal bound event with callback and optional offset:
      s = new ScrollProxy()
      s._createHorizontalBoundEvent('left', -> null)
       * One can also check with a offset inwards, useful for infinite scrolling
      s._createHorizontalBoundEvent('left', -> null, 250) # fire 250px to left
    @param [String] evt The event name to register, **left** or **right**
    @param [Function] callback the function to be called when event is fired
    @param [Number] offset Offset to check for (0 is defaut)
    @return [Object] The event just registered
    @since 0.2.0
    @private
   */

  ScrollProxy.prototype._createHorizontalBoundScrollEvent = function(evt, callback, offset) {
    if (offset == null) {
      offset = 0;
    }
    if (evt === ScrollProxy.LEFT) {
      return this._createScrollEvent(evt, (function(_this) {
        return function() {
          if (_this.x <= Math.abs(offset)) {
            return SUtil.reportChange(callback, _this, _this.scrollData);
          }
        };
      })(this), callback, 0);
    } else {
      return this._createScrollEvent(evt, (function(_this) {
        return function() {
          if ((_this.scrollWidth - _this.x) - _this.width <= Math.abs(offset)) {
            return SUtil.reportChange(callback, _this, _this.scrollData);
          }
        };
      })(this), callback, 0);
    }
  };


  /*
    Creates a event to check for vertical bound collision
    @example Create vertical bound event with callback and optional offset:
      s = new ScrollProxy()
      s._createVerticalBoundEvent('top', -> null)
       * One can also check with a offset inwards, useful for infinite scrolling
      s._createVerticalBoundEvent('top', -> null, 250) # fire 250px to top
    @param [String] evt The event name to register, **top** or **bottom**
    @param [Function] callback the function to be called when event is fired
    @param [Number] offset Offset to check for
    @return [Object] The event just registered
    @since 0.2.0
    @private
   */

  ScrollProxy.prototype._createVerticalBoundScrollEvent = function(evt, callback, offset) {
    if (offset == null) {
      offset = 0;
    }
    if (evt === ScrollProxy.TOP) {
      return this._createScrollEvent(evt, (function(_this) {
        return function() {
          if (_this.y <= Math.abs(offset)) {
            return SUtil.reportChange(callback, _this, _this.scrollData);
          }
        };
      })(this), callback, 0);
    } else {
      return this._createScrollEvent(evt, (function(_this) {
        return function() {
          if ((_this.scrollHeight - _this.y) - _this.height <= Math.abs(offset)) {
            return SUtil.reportChange(callback, _this, _this.scrollData);
          }
        };
      })(this), callback, 0);
    }
  };


  /*
    Creates a event to check for element visibility as one scrolls
    @example Create visibility scroll event with callback and optional offset:
      s = new ScrollProxy()
      ul = document.querySelector('.myBeautifulList')
      s._createVisibilityScrollEvent('visible', -> null, ul)
    @param [String] evt The event name to register, **visible** or **invisible**
    @param [Function] callback the function to be called when event is fired
    @param [Number] offset Offset to check for
    @return [Object] The event just registered
    @since 0.2.0
    @private
   */

  ScrollProxy.prototype._createVisibilityScrollEvent = function(evt, callback, el) {
    this._checkElement(el);
    if (evt === ScrollProxy.VISIBLE) {
      return this._createScrollEvent(evt, (function(_this) {
        return function() {
          if (_this.isElementVisible(el)) {
            return SUtil.reportChange(callback, _this, _this.scrollData);
          }
        };
      })(this), callback);
    } else {
      return this._createScrollEvent(evt, (function(_this) {
        return function() {
          if (!_this.isElementVisible(el)) {
            return SUtil.reportChange(callback, _this, _this.scrollData);
          }
        };
      })(this), callback);
    }
  };


  /*
    The ScrollProxy constructor, use it to create new instances
    @example Create a new ScrollProxy instance:
       * Creating a instance in the document.body
      s = new ScrollProxy() # it defaults to document.body
       * Creating on a div
      s = new ScrollProxy(myDiv) # or any HTMLEment
       * Creating on window
      s = new ScrollProxy(window) # Remaps to window.document.body
    @param [HTMLElement] target The element to attach ScrollProxy
    @return [ScrollProxy] This instance
    @since 0.2.0
   */

  function ScrollProxy(target) {
    if (target == null) {
      target = document;
    }
    if (target === document) {
      target = target.body;
    }
    if (target === window) {
      target = target.document.body;
    }
    if (target instanceof HTMLElement) {
      this._target = target;
    } else {
      throw new Error('Could not attach to a valid anchor');
    }
    this._events = [];
    this.register();
    this._updateViewportInfo();
    return this;
  }


  /*
    Sets the scroll delay, any event registered will respect the new value
    @example Changing the scroll delay mid-flight:
      s = new ScrollProxy()
       * Any call will the throttled with 250ms
      s.on('scroll', -> null) # defaults to 250ms delay
      s.setScrollDelay(300) # any call now throttles with 300ms
    @param [Number] ms The delay in milliseconds
    @return [ScrollProxy] This instance
    @since 0.1.0
   */

  ScrollProxy.prototype.setScrollDelay = function(ms) {
    if (SUtil.isPositiveNumber(ms)) {
      this._scrollDelay = Math.round(ms);
    }
    return this;
  };


  /*
    Returns the current scroll delay
    @example Getting the current delay:
      s = new ScrollProxy()
      s.setScrollDelay(300) # any call now throttles with 300ms
      s.getScrollDelay() # will be 300
    @return [Number] The current value of _scrollDelay
    @since 0.1.0
   */

  ScrollProxy.prototype.getScrollDelay = function() {
    return this._scrollDelay;
  };


  /*
    Sets the hover delay. The disable hover function will respect it
    @example Changing the hover delay mid-flight:
      s = new ScrollProxy()
       * Hover animations have 250ms delay on scroll end by default
      s.disableHoverOnScroll()
      s.setHoverDelay(300) # now hover delay is 300ms
    @param [Number] ms The delay in milliseconds
    @return [ScrollProxy] This instance
    @since 0.1.0
   */

  ScrollProxy.prototype.setHoverDelay = function(ms) {
    if (SUtil.isPositiveNumber(ms)) {
      this._hoverDelay = Math.round(ms);
    }
    return this;
  };


  /*
    Returns the current hover delay
    @example Getting the current delay:
      s = new ScrollProxy()
      s.setHoverDelay(300) # hover animations now have 300ms delay on scroll end
      s.getHoverDelay() # will be 300
    @return [Number] The current value of _hoverDelay
    @since 0.1.0
   */

  ScrollProxy.prototype.getHoverDelay = function() {
    return this._hoverDelay;
  };


  /*
    Returns the current target
    @example Getting the current target:
      s = new ScrollProxy(myDiv)
      s.getTarget() # will equal myDiv
    @return [HTMLElement] The current target
    @since 0.1.0
   */

  ScrollProxy.prototype.getTarget = function() {
    return this._target;
  };


  /*
    Returns the rect for an HTMLElement
    @example Getting body dimensions and position:
      s = new ScrollProxy(myDiv)
      s.getRect(document.body)
    @param [HTMLElement] el The element to get the rect from
    @return [Object] The rect
    @since 0.1.0
   */

  ScrollProxy.prototype.getRect = function(el) {
    return {
      x: el.offsetLeft,
      y: el.offsetTop,
      w: el.getBoundingClientRect().width,
      h: el.getBoundingClientRect().height
    };
  };


  /*
    Register events in ScrollProxy
    @example Registering a new scroll event on body:
      s = new ScrollProxy()
      s.on('scroll', -> 'Awesome scrolling!')
    @param [String] evt The event name to Register
    @param [Function] func The function to callback once event is fired
    @param [Object] option A wildcard argument that is passed to the event
    @event scroll The scroll event that is fired whenever one scrolls
    @event offsetX The offset event on the X axis that fires once one scrolls
      past the given horizontal offset
    @event offsetY The offset event on the Y axis that fires once one scrolls
      past the given vertical offset
    @event top The event that fires once one reaches the top of the scroll area
      or the given offset top
    @event bottom The event that fires once one reaches the bottom of the scroll
      area or the given offset bottom
    @event left The event that fires once one reaches the left bound of the
      scroll area of the given offset left
    @event right The event that fires once one reaches the right bound of the
      scroll area of the given offset right
    @event visible The event that fires once the given element is visible on the
      scroll area
    @event invisible The event that fires once the given element is not visible
      on the scroll area
    @return [ScrollProxy] This instance
    @since 0.1.0
   */

  ScrollProxy.prototype.on = function(evt, func, option) {
    if (!SUtil.isValidEventName(evt)) {
      return this;
    }
    if (!SUtil.isFunction(func)) {
      return this;
    }
    switch (evt) {
      case ScrollProxy.SCROLL:
        this._createScrollEvent(evt, func);
        break;
      case ScrollProxy.OFFSET_X:
      case ScrollProxy.OFFSET_Y:
        this._createOffsetEvent(evt, func, option);
        break;
      case ScrollProxy.TOP:
      case ScrollProxy.BOTTOM:
        this._createVerticalBoundScrollEvent(evt, func, option);
        break;
      case ScrollProxy.LEFT:
      case ScrollProxy.RIGHT:
        this._createHorizontalBoundScrollEvent(evt, func, option);
        break;
      case ScrollProxy.VISIBLE:
      case ScrollProxy.INVISIBLE:
        this._createVisibilityScrollEvent(evt, func, option);
    }
    return this;
  };


  /*
    Registers events with **on** but just fire the callback the first time
    @example Register an one time event:
      s = new ScrollProxy()
      s.once('top', -> 'I AM ON TOP!') # fires just one time
    @param [String] evt The event name to register
    @param [Function] func The function to callback
    @param [Object] option The wildcard argument that goes with events
    @return [ScrollProxy] This instance
    @since 0.2.0
   */

  ScrollProxy.prototype.once = function(evt, func, option) {
    var oneTimeFunction;
    oneTimeFunction = (function(_this) {
      return function() {
        SUtil.reportChange(func, _this, _this.scrollData);
        return _this.off(evt, oneTimeFunction);
      };
    })(this);
    return this.on(evt, oneTimeFunction, option);
  };


  /*
    Removes all events with the specified event name or name and function
    @example Removing all handlers for one event:
      s = new ScrollProxy()
      s.on('scroll', -> 'Free scrolling')
      s.off('scroll') # no more free scrolling
    @example Removing just the specific function handler for the event
      s = new ScrollProxy()
      func = -> 'Free scrolling'
      s.on('scroll', func)
      s.off('scroll', func)
    @param [String] evt The event name to register
    @return [ScrollProxy] This instance
    @since 0.2.0
   */

  ScrollProxy.prototype.off = function(evt, func) {
    var event, i, j, len1, ref;
    if (!SUtil.isValidEventName(evt)) {
      return this;
    }
    ref = this._events;
    for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
      event = ref[i];
      if ((func == null) && (event != null) && evt === event.type) {
        this._removeEvent(event);
      } else if ((func != null) && (event != null) && event.origin === func) {
        this._removeEvent(event);
      }
    }
    return this;
  };


  /*
    Register this target on ScrollProxy's **_targetList**
    @example Registering a target (constructor does it automatically):
      s = new ScrollProxy()
      s.register() # Throws error because constructor already registered it
    @example Unregistering first will work:
      s = new ScrollProxy()
      s.unregister() # Removing the target
      s.register() # OK. Target already removed, adding it again
    @return [ScrollProxy] This instance
    @since 0.1.0
   */

  ScrollProxy.prototype.register = function() {
    var matchingTarget;
    matchingTarget = ScrollProxy._getElement(this._target);
    if (matchingTarget != null) {
      throw new Error('Assign one proxy per target');
    }
    ScrollProxy._targetList.push({
      target: this._target,
      proxy: this
    });
    ScrollProxy.activate();
    return this;
  };


  /*
    Unregister this target and remove it from ScrollProxy's **_targetList**
    @example Unregistering target created automatically by the constructor:
      s = new ScrollProxy()
      s.unregister() # ScrollProxy now has no targets, so it deactivates
    @return [ScrollProxy] This instance
    @since 0.1.0
   */

  ScrollProxy.prototype.unregister = function() {
    var idx;
    idx = ScrollProxy._targetList.length;
    if (idx > 0) {
      while (idx--) {
        if (ScrollProxy._targetList[idx].proxy === this) {
          SUtil.removeItemFromArray(ScrollProxy._targetList, idx);
          break;
        }
      }
    }
    if (ScrollProxy._targetList.length === 0) {
      ScrollProxy.deactivate();
    }
    return this;
  };


  /*
    Checks if the element given is visible in the scroll area of the target
    @example Checking if li is visible within parent ul's scroll area:
      s = new ScrollProxy(ul)
      s.isElementVisible(li) # Visible? May be true or false
    @return [Boolean] Whether it's visible or not
    @since 0.1.0
   */

  ScrollProxy.prototype.isElementVisible = function(el) {
    this._checkElement(el);
    return this._isRectVisible(this.getRect(el));
  };


  /*
    Disables hover animations on scrolling to improve scroll performance
    @example It must be activated manually to avoid unexpected behavior:
      s = new ScrollProxy() # defaults to document.body
      s.disableHoverOnScroll() # Hover animations are now disabled on body
    @return [ScrollProxy] This instance
    @since 0.2.0
   */

  ScrollProxy.prototype.disableHoverOnScroll = function() {
    this._createScrollEvent(ScrollProxy.DISABLE_HOVER, (function(_this) {
      return function() {
        window.clearTimeout(_this._hoverTimeout);
        _this._target.style.pointerEvents = 'none';
        return _this._hoverTimeout = window.setTimeout(function() {
          return _this._target.style.pointerEvents = 'auto';
        }, _this.getHoverDelay());
      };
    })(this), null, 0);
    return this;
  };


  /*
    Re-enables hover animations on scrolling
    @example Once hover animations are disabled, you can re-enable with:
      s = new ScrollProxy() # defaults to document.body
      s.disableHoverOnScroll() # Hover animations on scrolling are now disabled
      s.enableHoverOnScroll() # Hover animations on scrolling are now restored
    @return [ScrollProxy] This instance
    @since 0.1.0
   */

  ScrollProxy.prototype.enableHoverOnScroll = function() {
    this.off(ScrollProxy.DISABLE_HOVER);
    this._target.style.pointerEvents = 'auto';
    return this;
  };

  return ScrollProxy;

})();
