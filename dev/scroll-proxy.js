(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.SUtil = require('../src/SUtil');

window.ScrollProxy = require('../src/ScrollProxy');


},{"../src/SUtil":2,"../src/ScrollProxy":3}],2:[function(require,module,exports){

/*
  Helper class for ScrollProxy
  @private
  @since 0.1.0
  @author Matheus Kautzmann - <kautzmann5@gmail.com>
 */
var SUtil,
  slice = [].slice;

module.exports = SUtil = (function() {
  function SUtil() {}


  /*
    Function that calls the callback with the given args and context
    @param [Function] callback function that will be called back
    @param [Object] context `this` context that will be applied to callback
    @param [Array] args (Optional )A splat with the arguments that will be
      passed along
    @return [Null] it will return null if can't call the callback, undefined
      otherwise
    @example Calling func with ctx as this and no arguments:
      SUtil.reportChange(func, ctx)
    @example Calling the func with ctx as this and two arguments:
      SUtil.reportChange(func, ctx, 1, 2)
    @since 0.1.0
   */

  SUtil.reportChange = function() {
    var args, callback, context;
    callback = arguments[0], context = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
    if (SUtil.isFunction(callback)) {
      return callback.apply(context, args);
    }
    return null;
  };


  /*
    Reliably gets the JS type of the given variable
    @see http://bonsaiden.github.io/JavaScript-Garden/#types.typeof
    @example Checking a string will return [object String]
      SUtil.getType('hello')
    @example Checking a number will return [object Number]
      SUtil.getType(1)
    @param [Object] target variable to be type tested
    @return [String] The type of the given variable
    @since 0.1.0
   */

  SUtil.getType = function(target) {
    return Object.prototype.toString.call(target);
  };


  /*
    Removes an item from an array, changing the array involved and returning
    the element removed
    @example Removing the first element of the array
      SUtil.removeItemFromArray([1, 2], 0)
    @param [Array] arr Array to remove the element from
    @param [Number] idx Index of the element to be removed
    @return [Any] the element removed
    @since 0.1.0
   */

  SUtil.removeItemFromArray = function(arr, idx) {
    return arr.splice(idx, 1)[0];
  };


  /*
    Checks if the suplied variable is a valid JS Function
    @example Checking a valid function will return true
      SUtil.isFunction(-> null)
    @example Checking a number will return false
      SUtil.isFunction(1)
    @param [Function] func Variable to be tested as function
    @return [Boolean] true if function and false if not
    @since 0.1.0
   */

  SUtil.isFunction = function(func) {
    return SUtil.getType(func) === '[object Function]';
  };


  /*
    Checks if the suplied variable is a valid JS Number
    @example Checking a number will return true
      SUtil.isNumber(1)
    @example Checking a bool will return false
      SUtil.isNumber(true)
    @param [Number] number Variable to be tested as number
    @return [Boolean] true if number and false if not
    @since 0.1.0
   */

  SUtil.isNumber = function(number) {
    return SUtil.getType(number) === '[object Number]';
  };


  /*
    Checks if the suplied variable is a valid JS String
    @example Checking a string will return true
      SUtil.isString('hello')
    @example Checking a number will return false
      SUtil.isString(1)
    @param [Number] number Variable to be tested as string
    @return [Boolean] true if string and false if not
    @since 0.1.0
   */

  SUtil.isString = function(string) {
    return SUtil.getType(string) === '[object String]';
  };


  /*
    Checks if the suplied variable can be used as event name for ScrollProxy
    @example Empty strings will return false
      SUtil.isValidEventName('')
    @example Non-string object will return false
      SUtil.isValidEventName(1)
    @example String with one or more chars will return true
      SUtil.isValidEventName('myEvent')
    @param [String name Variable to be tested as valid event name
    @return [Boolean] true if valid name and false if not
    @since 0.1.0
   */

  SUtil.isValidEventName = function(name) {
    return SUtil.isString(name) && name !== '';
  };


  /*
    Checks if the suplied variable is a positive number, it also considers 0
    a positive number
    @example Checking for numbers greater than zero will return true
      SUtil.isPositiveNumber(1)
    @example Checking for 0 itself will return true
      SUtil.isPositiveNumber(0)
    @example Checking for number lower than 0 will return false
      SUtil.isPositiveNumber(-1)
    @param [String name Variable to be tested as positive number
    @return [Boolean] true if positive number and false if not
    @since 0.1.0
   */

  SUtil.isPositiveNumber = function(number) {
    return SUtil.isNumber(number) && number >= 0;
  };


  /*
    Checks if the suplied variable is a negative number, it does not
    considers 0 a negative number
    @example Checking for anything larger than zero will return false
      SUtil.isNegativeNumber(1)
    @example Checking for 0 itself will return false since it is considered
    positive
      SUtil.isNegativeNumber(0)
    @example Numbers lower than zero will return true
      SUtil.isNegativeNumber(-1)
    @param [String name Variable to be tested as negative number
    @return [Boolean] true if negative number and false if not
    @since 0.1.0
   */

  SUtil.isNegativeNumber = function(number) {
    return SUtil.isNumber(number) && number < 0;
  };

  return SUtil;

})();


},{}],3:[function(require,module,exports){
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
    var len, target;
    len = ScrollProxy._targetList.length;
    if (len === 0) {
      return null;
    }
    target = e.target.body || e.target;
    return ScrollProxy._getElement(target).proxy._performScroll(e);
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
    var item, j, len1, ref, results;
    ref = ScrollProxy._targetList;
    results = [];
    for (j = 0, len1 = ref.length; j < len1; j++) {
      item = ref[j];
      results.push(item.proxy.unregister());
    }
    return results;
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
    @param [Number] delay Time to wait in milliseconds
    @return [Object] The event just registered
    @since 0.1.0
    @private
   */

  ScrollProxy.prototype._createEvent = function(evt, callback, delay) {
    var fn;
    fn = this._throttleScroll(callback, delay);
    return this._events.push({
      type: evt,
      fn: fn.bind(this),
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
    @param [Number] delay Time to wait in milliseconds
    @return [Object] The event just registered
    @since 0.1.0
    @private
   */

  ScrollProxy.prototype._createScrollEvent = function(evt, callback, delay) {
    return this._createEvent(evt, (function(_this) {
      return function() {
        _this._updateViewportInfo();
        return SUtil.reportChange(callback, _this, _this.scrollData);
      };
    })(this), delay);
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
    @since 0.1.0
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
            return _this._updateViewportInfo();
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
      })(this));
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
      })(this));
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
    @since 0.1.0
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
      })(this), 0);
    } else {
      return this._createScrollEvent(evt, (function(_this) {
        return function() {
          if ((_this.scrollWidth - _this.x) - _this.width <= Math.abs(offset)) {
            return SUtil.reportChange(callback, _this, _this.scrollData);
          }
        };
      })(this), 0);
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
    @since 0.1.0
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
      })(this), 0);
    } else {
      return this._createScrollEvent(evt, (function(_this) {
        return function() {
          if ((_this.scrollHeight - _this.y) - _this.height <= Math.abs(offset)) {
            return SUtil.reportChange(callback, _this, _this.scrollData);
          }
        };
      })(this), 0);
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
    @since 0.1.0
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
      })(this));
    } else {
      return this._createScrollEvent(evt, (function(_this) {
        return function() {
          if (!_this.isElementVisible(el)) {
            return SUtil.reportChange(callback, _this, _this.scrollData);
          }
        };
      })(this));
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
    @since 0.1.0
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
   */

  ScrollProxy.prototype.once = function(evt, func, option) {
    var oneTimeFunction;
    oneTimeFunction = (function(_this) {
      return function() {
        SUtil.reportChange(func, _this, _this.scrollData);
        return _this.off(evt);
      };
    })(this);
    return this.on(evt, oneTimeFunction, option);
  };


  /*
    Removes all events with the specified event name
    @example Removing one event:
      s = new ScrollProxy()
      s.on('scroll', -> 'Free scrolling')
      s.off('scroll') # no more free scrolling
    @param [String] evt The event name to register
    @return [ScrollProxy] This instance
   */

  ScrollProxy.prototype.off = function(evt) {
    var event, i, j, len1, ref;
    if (!SUtil.isValidEventName(evt)) {
      return this;
    }
    ref = this._events;
    for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
      event = ref[i];
      if ((event != null) && evt === event.type) {
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
   */

  ScrollProxy.prototype.unregister = function() {
    var i, item, j, len1, ref;
    ref = ScrollProxy._targetList;
    for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
      item = ref[i];
      if ((item != null) && item.target === this._target) {
        SUtil.removeItemFromArray(ScrollProxy._targetList, i);
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
    })(this), 0);
    return this;
  };


  /*
    Re-enables hover animations on scrolling
    @example Once hover animations are disabled, you can re-enable with:
      s = new ScrollProxy() # defaults to document.body
      s.disableHoverOnScroll() # Hover animations on scrolling are now disabled
      s.enableHoverOnScroll() # Hover animations on scrolling are now restored
    @return [ScrollProxy] This instance
   */

  ScrollProxy.prototype.enableHoverOnScroll = function() {
    this.off(ScrollProxy.DISABLE_HOVER);
    this._target.style.pointerEvents = 'auto';
    return this;
  };

  return ScrollProxy;

})();


},{"./SUtil":2}]},{},[2,3,1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbWF0aGV1cy9Ecm9wYm94L3Njcm9sbC1wcm94eS9kZXYvZGV2U2NyaXB0LmNvZmZlZSIsIi9Vc2Vycy9tYXRoZXVzL0Ryb3Bib3gvc2Nyb2xsLXByb3h5L3NyYy9TVXRpbC5jb2ZmZWUiLCIvVXNlcnMvbWF0aGV1cy9Ecm9wYm94L3Njcm9sbC1wcm94eS9zcmMvU2Nyb2xsUHJveHkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDRUEsTUFBTSxDQUFDLEtBQVAsR0FBZSxPQUFBLENBQVEsY0FBUjs7QUFDZixNQUFNLENBQUMsV0FBUCxHQUFxQixPQUFBLENBQVEsb0JBQVI7Ozs7O0FDSHJCOzs7Ozs7QUFBQSxJQUFBLEtBQUE7RUFBQTs7QUFNQSxNQUFNLENBQUMsT0FBUCxHQUF1Qjs7OztBQUVyQjs7Ozs7Ozs7Ozs7Ozs7O0VBY0EsS0FBQyxDQUFBLFlBQUQsR0FBZSxTQUFBO0FBQ2IsUUFBQTtJQURjLHlCQUFVLHdCQUFTO0lBQ2pDLElBQUcsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsUUFBakIsQ0FBSDtBQUNFLGFBQU8sUUFBUSxDQUFDLEtBQVQsQ0FBZSxPQUFmLEVBQXdCLElBQXhCLEVBRFQ7O0FBRUEsV0FBTztFQUhNOzs7QUFLZjs7Ozs7Ozs7Ozs7O0VBV0EsS0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLE1BQUQ7V0FBWSxNQUFNLENBQUEsU0FBRSxDQUFBLFFBQVEsQ0FBQyxJQUFqQixDQUFzQixNQUF0QjtFQUFaOzs7QUFFVjs7Ozs7Ozs7Ozs7RUFVQSxLQUFDLENBQUEsbUJBQUQsR0FBc0IsU0FBQyxHQUFELEVBQU0sR0FBTjtXQUFjLEdBQUcsQ0FBQyxNQUFKLENBQVcsR0FBWCxFQUFnQixDQUFoQixDQUFtQixDQUFBLENBQUE7RUFBakM7OztBQUV0Qjs7Ozs7Ozs7Ozs7RUFVQSxLQUFDLENBQUEs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QUEsSUFBQSxDQUEvQyxFQU1FLENBTkY7QUFPQSxXQUFPO0VBUmE7OztBQVV0Qjs7Ozs7Ozs7O3dCQVFBLG1CQUFBLEdBQXFCLFNBQUE7SUFDbkIsSUFBQyxDQUFBLEdBQUQsQ0FBSyxXQUFXLENBQUMsYUFBakI7SUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFmLEdBQStCO0FBQy9CLFdBQU87RUFIWSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIFB1dCBib3RoIG1vZHVsZXMgYXMgZ2xvYmFscyBmb3IgZWFzaWVyIGluc3BlY3RvciBkZWJ1Z2dpbmdcblxud2luZG93LlNVdGlsID0gcmVxdWlyZSgnLi4vc3JjL1NVdGlsJylcbndpbmRvdy5TY3JvbGxQcm94eSA9IHJlcXVpcmUoJy4uL3NyYy9TY3JvbGxQcm94eScpXG4iLCIjIyNcbiAgSGVscGVyIGNsYXNzIGZvciBTY3JvbGxQcm94eVxuICBAcHJpdmF0ZVxuICBAc2luY2UgMC4xLjBcbiAgQGF1dGhvciBNYXRoZXVzIEthdXR6bWFubiAtIDxrYXV0em1hbm41QGdtYWlsLmNvbT5cbiMjI1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBTVXRpbFxuXG4gICMjI1xuICAgIEZ1bmN0aW9uIHRoYXQgY2FsbHMgdGhlIGNhbGxiYWNrIHdpdGggdGhlIGdpdmVuIGFyZ3MgYW5kIGNvbnRleHRcbiAgICBAcGFyYW0gW0Z1bmN0aW9uXSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIGJhY2tcbiAgICBAcGFyYW0gW09iamVjdF0gY29udGV4dCBgdGhpc2AgY29udGV4dCB0aGF0IHdpbGwgYmUgYXBwbGllZCB0byBjYWxsYmFja1xuICAgIEBwYXJhbSBbQXJyYXldIGFyZ3MgKE9wdGlvbmFsIClBIHNwbGF0IHdpdGggdGhlIGFyZ3VtZW50cyB0aGF0IHdpbGwgYmVcbiAgICAgIHBhc3NlZCBhbG9uZ1xuICAgIEByZXR1cm4gW051bGxdIGl0IHdpbGwgcmV0dXJuIG51bGwgaWYgY2FuJ3QgY2FsbCB0aGUgY2FsbGJhY2ssIHVuZGVmaW5lZFxuICAgICAgb3RoZXJ3aXNlXG4gICAgQGV4YW1wbGUgQ2FsbGluZyBmdW5jIHdpdGggY3R4IGFzIHRoaXMgYW5kIG5vIGFyZ3VtZW50czpcbiAgICAgIFNVdGlsLnJlcG9ydENoYW5nZShmdW5jLCBjdHgpXG4gICAgQGV4YW1wbGUgQ2FsbGluZyB0aGUgZnVuYyB3aXRoIGN0eCBhcyB0aGlzIGFuZCB0d28gYXJndW1lbnRzOlxuICAgICAgU1V0aWwucmVwb3J0Q2hhbmdlKGZ1bmMsIGN0eCwgMSwgMilcbiAgICBAc2luY2UgMC4xLjBcbiAgIyMjXG4gIEByZXBvcnRDaGFuZ2U6IChjYWxsYmFjaywgY29udGV4dCwgYXJncy4uLikgLT5cbiAgICBpZiBTVXRpbC5pc0Z1bmN0aW9uKGNhbGxiYWNrKVxuICAgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KGNvbnRleHQsIGFyZ3MpXG4gICAgcmV0dXJuIG51bGxcblxuICAjIyNcbiAgICBSZWxpYWJseSBnZXRzIHRoZSBKUyB0eXBlIG9mIHRoZSBnaXZlbiB2YXJpYWJsZVxuICAgIEBzZWUgaHR0cDovL2JvbnNhaWRlbi5naXRodWIuaW8vSmF2YVNjcmlwdC1HYXJkZW4vI3R5cGVzLnR5cGVvZlxuICAgIEBleGFtcGxlIENoZWNraW5nIGEgc3RyaW5nIHdpbGwgcmV0dXJuIFtvYmplY3QgU3RyaW5nXVxuICAgICAgU1V0aWwuZ2V0VHlwZSgnaGVsbG8nKVxuICAgIEBleGFtcGxlIENoZWNraW5nIGEgbnVtYmVyIHdpbGwgcmV0dXJuIFtvYmplY3QgTnVtYmVyXVxuICAgICAgU1V0aWwuZ2V0VHlwZSgxKVxuICAgIEBwYXJhbSBbT2JqZWN0XSB0YXJnZXQgdmFyaWFibGUgdG8gYmUgdHlwZSB0ZXN0ZWRcbiAgICBAcmV0dXJuIFtTdHJpbmddIFRoZSB0eXBlIG9mIHRoZSBnaXZlbiB2YXJpYWJsZVxuICAgIEBzaW5jZSAwLjEuMFxuICAjIyNcbiAgQGdldFR5cGU6ICh0YXJnZXQpIC0+IE9iamVjdDo6dG9TdHJpbmcuY2FsbCh0YXJnZXQpXG5cbiAgIyMjXG4gICAgUmVtb3ZlcyBhbiBpdGVtIGZyb20gYW4gYXJyYXksIGNoYW5naW5nIHRoZSBhcnJheSBpbnZvbHZlZCBhbmQgcmV0dXJuaW5nXG4gICAgdGhlIGVsZW1lbnQgcmVtb3ZlZFxuICAgIEBleGFtcGxlIFJlbW92aW5nIHRoZSBmaXJzdCBlbGVtZW50IG9mIHRoZSBhcnJheVxuICAgICAgU1V0aWwucmVtb3ZlSXRlbUZyb21BcnJheShbMSwgMl0sIDApXG4gICAgQHBhcmFtIFtBcnJheV0gYXJyIEFycmF5IHRvIHJlbW92ZSB0aGUgZWxlbWVudCBmcm9tXG4gICAgQHBhcmFtIFtOdW1iZXJdIGlkeCBJbmRleCBvZiB0aGUgZWxlbWVudCB0byBiZSByZW1vdmVkXG4gICAgQHJldHVybiBbQW55XSB0aGUgZWxlbWVudCByZW1vdmVkXG4gICAgQHNpbmNlIDAuMS4wXG4gICMjI1xuICBAcmVtb3ZlSXRlbUZyb21BcnJheTogKGFyciwgaWR4KSAtPiBhcnIuc3BsaWNlKGlkeCwgMSlbMF1cblxuICAjIyNcbiAgICBDaGVja3MgaWYgdGhlIHN1cGxpZWQgdmFyaWFibGUgaXMgYSB2YWxpZCBKUyBGdW5jdGlvblxuICAgIEBleGFtcGxlIENoZWNraW5nIGEgdmFsaWQgZnVuY3Rpb24gd2lsbCByZXR1cm4gdHJ1ZVxuICAgICAgU1V0aWwuaXNGdW5jdGlvbigtPiBudWxsKVxuICAgIEBleGFtcGxlIENoZWNraW5nIGEgbnVtYmVyIHdpbGwgcmV0dXJuIGZhbHNlXG4gICAgICBTVXRpbC5pc0Z1bmN0aW9uKDEpXG4gICAgQHBhcmFtIFtGdW5jdGlvbl0gZnVuYyBWYXJpYWJsZSB0byBiZSB0ZXN0ZWQgYXMgZnVuY3Rpb25cbiAgICBAcmV0dXJuIFtCb29sZWFuXSB0cnVlIGlmIGZ1bmN0aW9uIGFuZCBmYWxzZSBpZiBub3RcbiAgICBAc2luY2UgMC4xLjBcbiAgIyMjXG4gIEBpc0Z1bmN0aW9uOiAoZnVuYykgLT4gU1V0aWwuZ2V0VHlwZShmdW5jKSBpcyAnW29iamVjdCBGdW5jdGlvbl0nXG5cbiAgIyMjXG4gICAgQ2hlY2tzIGlmIHRoZSBzdXBsaWVkIHZhcmlhYmxlIGlzIGEgdmFsaWQgSlMgTnVtYmVyXG4gICAgQGV4YW1wbGUgQ2hlY2tpbmcgYSBudW1iZXIgd2lsbCByZXR1cm4gdHJ1ZVxuICAgICAgU1V0aWwuaXNOdW1iZXIoMSlcbiAgICBAZXhhbXBsZSBDaGVja2luZyBhIGJvb2wgd2lsbCByZXR1cm4gZmFsc2VcbiAgICAgIFNVdGlsLmlzTnVtYmVyKHRydWUpXG4gICAgQHBhcmFtIFtOdW1iZXJdIG51bWJlciBWYXJpYWJsZSB0byBiZSB0ZXN0ZWQgYXMgbnVtYmVyXG4gICAgQHJldHVybiBbQm9vbGVhbl0gdHJ1ZSBpZiBudW1iZXIgYW5kIGZhbHNlIGlmIG5vdFxuICAgIEBzaW5jZSAwLjEuMFxuICAjIyNcbiAgQGlzTnVtYmVyOiAobnVtYmVyKSAtPiBTVXRpbC5nZXRUeXBlKG51bWJlcikgaXMgJ1tvYmplY3QgTnVtYmVyXSdcblxuICAjIyNcbiAgICBDaGVja3MgaWYgdGhlIHN1cGxpZWQgdmFyaWFibGUgaXMgYSB2YWxpZCBKUyBTdHJpbmdcbiAgICBAZXhhbXBsZSBDaGVja2luZyBhIHN0cmluZyB3aWxsIHJldHVybiB0cnVlXG4gICAgICBTVXRpbC5pc1N0cmluZygnaGVsbG8nKVxuICAgIEBleGFtcGxlIENoZWNraW5nIGEgbnVtYmVyIHdpbGwgcmV0dXJuIGZhbHNlXG4gICAgICBTVXRpbC5pc1N0cmluZygxKVxuICAgIEBwYXJhbSBbTnVtYmVyXSBudW1iZXIgVmFyaWFibGUgdG8gYmUgdGVzdGVkIGFzIHN0cmluZ1xuICAgIEByZXR1cm4gW0Jvb2xlYW5dIHRydWUgaWYgc3RyaW5nIGFuZCBmYWxzZSBpZiBub3RcbiAgICBAc2luY2UgMC4xLjBcbiAgIyMjXG4gIEBpc1N0cmluZzogKHN0cmluZykgLT4gU1V0aWwuZ2V0VHlwZShzdHJpbmcpIGlzICdbb2JqZWN0IFN0cmluZ10nXG5cbiAgIyMjXG4gICAgQ2hlY2tzIGlmIHRoZSBzdXBsaWVkIHZhcmlhYmxlIGNhbiBiZSB1c2VkIGFzIGV2ZW50IG5hbWUgZm9yIFNjcm9sbFByb3h5XG4gICAgQGV4YW1wbGUgRW1wdHkgc3RyaW5ncyB3aWxsIHJldHVybiBmYWxzZVxuICAgICAgU1V0aWwuaXNWYWxpZEV2ZW50TmFtZSgnJylcbiAgICBAZXhhbXBsZSBOb24tc3RyaW5nIG9iamVjdCB3aWxsIHJldHVybiBmYWxzZVxuICAgICAgU1V0aWwuaXNWYWxpZEV2ZW50TmFtZSgxKVxuICAgIEBleGFtcGxlIFN0cmluZyB3aXRoIG9uZSBvciBtb3JlIGNoYXJzIHdpbGwgcmV0dXJuIHRydWVcbiAgICAgIFNVdGlsLmlzVmFsaWRFdmVudE5hbWUoJ215RXZlbnQnKVxuICAgIEBwYXJhbSBbU3RyaW5nIG5hbWUgVmFyaWFibGUgdG8gYmUgdGVzdGVkIGFzIHZhbGlkIGV2ZW50IG5hbWVcbiAgICBAcmV0dXJuIFtCb29sZWFuXSB0cnVlIGlmIHZhbGlkIG5hbWUgYW5kIGZhbHNlIGlmIG5vdFxuICAgIEBzaW5jZSAwLjEuMFxuICAjIyNcbiAgQGlzVmFsaWRFdmVudE5hbWU6IChuYW1lKSAtPiBTVXRpbC5pc1N0cmluZyhuYW1lKSBhbmQgbmFtZSBpc250ICcnXG5cbiAgIyMjXG4gICAgQ2hlY2tzIGlmIHRoZSBzdXBsaWVkIHZhcmlhYmxlIGlzIGEgcG9zaXRpdmUgbnVtYmVyLCBpdCBhbHNvIGNvbnNpZGVycyAwXG4gICAgYSBwb3NpdGl2ZSBudW1iZXJcbiAgICBAZXhhbXBsZSBDaGVja2luZyBmb3IgbnVtYmVycyBncmVhdGVyIHRoYW4gemVybyB3aWxsIHJldHVybiB0cnVlXG4gICAgICBTVXRpbC5pc1Bvc2l0aXZlTnVtYmVyKDEpXG4gICAgQGV4YW1wbGUgQ2hlY2tpbmcgZm9yIDAgaXRzZWxmIHdpbGwgcmV0dXJuIHRydWVcbiAgICAgIFNVdGlsLmlzUG9zaXRpdmVOdW1iZXIoMClcbiAgICBAZXhhbXBsZSBDaGVja2luZyBmb3IgbnVtYmVyIGxvd2VyIHRoYW4gMCB3aWxsIHJldHVybiBmYWxzZVxuICAgICAgU1V0aWwuaXNQb3NpdGl2ZU51bWJlcigtMSlcbiAgICBAcGFyYW0gW1N0cmluZyBuYW1lIFZhcmlhYmxlIHRvIGJlIHRlc3RlZCBhcyBwb3NpdGl2ZSBudW1iZXJcbiAgICBAcmV0dXJuIFtCb29sZWFuXSB0cnVlIGlmIHBvc2l0aXZlIG51bWJlciBhbmQgZmFsc2UgaWYgbm90XG4gICAgQHNpbmNlIDAuMS4wXG4gICMjI1xuICBAaXNQb3NpdGl2ZU51bWJlcjogKG51bWJlcikgLT4gU1V0aWwuaXNOdW1iZXIobnVtYmVyKSBhbmQgbnVtYmVyID49IDBcblxuICAjIyNcbiAgICBDaGVja3MgaWYgdGhlIHN1cGxpZWQgdmFyaWFibGUgaXMgYSBuZWdhdGl2ZSBudW1iZXIsIGl0IGRvZXMgbm90XG4gICAgY29uc2lkZXJzIDAgYSBuZWdhdGl2ZSBudW1iZXJcbiAgICBAZXhhbXBsZSBDaGVja2luZyBmb3IgYW55dGhpbmcgbGFyZ2VyIHRoYW4gemVybyB3aWxsIHJldHVybiBmYWxzZVxuICAgICAgU1V0aWwuaXNOZWdhdGl2ZU51bWJlcigxKVxuICAgIEBleGFtcGxlIENoZWNraW5nIGZvciAwIGl0c2VsZiB3aWxsIHJldHVybiBmYWxzZSBzaW5jZSBpdCBpcyBjb25zaWRlcmVkXG4gICAgcG9zaXRpdmVcbiAgICAgIFNVdGlsLmlzTmVnYXRpdmVOdW1iZXIoMClcbiAgICBAZXhhbXBsZSBOdW1iZXJzIGxvd2VyIHRoYW4gemVybyB3aWxsIHJldHVybiB0cnVlXG4gICAgICBTVXRpbC5pc05lZ2F0aXZlTnVtYmVyKC0xKVxuICAgIEBwYXJhbSBbU3RyaW5nIG5hbWUgVmFyaWFibGUgdG8gYmUgdGVzdGVkIGFzIG5lZ2F0aXZlIG51bWJlclxuICAgIEByZXR1cm4gW0Jvb2xlYW5dIHRydWUgaWYgbmVnYXRpdmUgbnVtYmVyIGFuZCBmYWxzZSBpZiBub3RcbiAgICBAc2luY2UgMC4xLjBcbiAgIyMjXG4gIEBpc05lZ2F0aXZlTnVtYmVyOiAobnVtYmVyKSAtPiBTVXRpbC5pc051bWJlcihudW1iZXIpIGFuZCBudW1iZXIgPCAwXG4iLCIjIFJlcXVpcmUgU1V0aWxcblNVdGlsID0gcmVxdWlyZSgnLi9TVXRpbCcpXG5cbiMjI1xuICBNYWluIGNsYXNzLCBjb250YWluaW5nIHRoZSBzY3JvbGxpbmcgcmVsYXRlZCBldmVudHMgYW5kIEFQSVxuXG4gIEBvcHRpb24gX3RhcmdldExpc3QgW0hUTUxFbGVtZW50XSB0YXJnZXQgVGhlIGFuY2hvciBvZiB0aGUgU2Nyb2xsUHJveHlcbiAgICBpbnN0YW5jZVxuICBAb3B0aW9uIF90YXJnZXRMaXN0IFtTY3JvbGxQcm94eV0gcHJveHkgVGhlIGluc3RhbmNlIG9mIFNjcm9sbFByb3h5XG5cbiAgQG9wdGlvbiBfZXZlbnRzIFtTdHJpbmddIHR5cGUgVGhlIGV2ZW50IG5hbWUgb2YgdGhlIGV2ZW50XG4gIEBvcHRpb24gX2V2ZW50cyBbRnVuY3Rpb25dIGZuIFRoZSBmdW5jdGlvbiB0aGF0IHdpbGwgaGFuZGxlIHRoZSBjYWxsYmFja1xuICBAb3B0aW9uIF9ldmVudHMgW051bWJlcl0gdGltZW91dCBUaGUgdGltZW91dCBpZCBvZiB0aGUgdGhyb3R0bGVkICoqZm4qKlxuXG4gIEBzaW5jZSAwLjEuMFxuICBAYXV0aG9yIE1hdGhldXMgS2F1dHptYW5uIC0gPGthdXR6bWFubjVAZ21haWwuY29tPlxuIyMjXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFNjcm9sbFByb3h5XG4gICMjI1xuICAgIEBwcm9wZXJ0eSBbQm9vbGVhbl0gQ2xhc3MgdmFyaWFibGUgdGhhdCBpbmRpY2F0ZXMgaWYgU2Nyb2xsUHJveHkgaXNcbiAgICAgIGN1cnJlbnRseSBlbmFibGVkXG4gICMjI1xuICBAYWN0aXZlOiBub1xuXG4gICMjI1xuICAgIEBwcm9wZXJ0eSBbQXJyYXk8T2JqZWN0Pl0gUHJpdmF0ZSBDbGFzcyB2YXJpYWJsZSB0aGF0IGhvbGRzXG4gICAgICBhbGwgdGhlIGVsZW1lbnRzIGN1cnJlbnRseSB0cmFja2VkIGJ5IFNjcm9sbFByb3h5XG4gICMjI1xuICBAX3RhcmdldExpc3Q6IFtdXG5cbiAgIyMjXG4gICAgQHByb3BlcnR5IFtTdHJpbmddIENsYXNzIGNvbnN0YW50IHRoYXQgbWFwcyB0byB0aGUgKipzY3JvbGwqKiBldmVudFxuICAgICAgbmFtZVxuICAjIyNcbiAgQFNDUk9MTDogJ3Njcm9sbCdcblxuICAjIyNcbiAgICBAcHJvcGVydHkgW1N0cmluZ10gQ2xhc3MgY29uc3RhbnQgdGhhdCBtYXBzIHRvIHRoZSAqKm9mZnNldFgqKlxuICAgICAgZXZlbnQgbmFtZVxuICAjIyNcbiAgQE9GRlNFVF9YOiAnb2Zmc2V0WCdcblxuICAjIyNcbiAgICBAcHJvcGVydHkgW1N0cmluZ10gQ2xhc3MgY29uc3RhbnQgdGhhdCBtYXBzIHRvIHRoZSAqKm9mZnNldFkqKlxuICAgICAgZXZlbnQgbmFtZVxuICAjIyNcbiAgQE9GRlNFVF9ZOiAnb2Zmc2V0WSdcblxuICAjIyNcbiAgICBAcHJvcGVydHkgW1N0cmluZ10gQ2xhc3MgY29uc3RhbnQgdGhhdCBtYXBzIHRvIHRoZSAqKnRvcCoqXG4gICAgICBldmVudCBuYW1lXG4gICMjI1xuICBAVE9QOiAndG9wJ1xuXG4gICMjI1xuICAgIEBwcm9wZXJ0eSBbU3RyaW5nXSBDbGFzcyBjb25zdGFudCB0aGF0IG1hcHMgdG8gdGhlICoqYm90dG9tKipcbiAgICAgIGV2ZW50IG5hbWVcbiAgIyMjXG4gIEBCT1RUT006ICdib3R0b20nXG5cbiAgIyMjXG4gICAgQHByb3BlcnR5IFtTdHJpbmddIENsYXNzIGNvbnN0YW50IHRoYXQgbWFwcyB0byB0aGUgKipsZWZ0KipcbiAgICAgIGV2ZW50IG5hbWVcbiAgIyMjXG4gIEBMRUZUOiAnbGVmdCdcblxuICAjIyNcbiAgICBAcHJvcGVydHkgW1N0cmluZ10gQ2xhc3MgY29uc3RhbnQgdGhhdCBtYXBzIHRvIHRoZSAqKnJpZ2h0KipcbiAgICAgIGV2ZW50IG5hbWVcbiAgIyMjXG4gIEBSSUdIVDogJ3JpZ2h0J1xuXG4gICMjI1xuICAgIEBwcm9wZXJ0eSBbU3RyaW5nXSBDbGFzcyBjb25zdGFudCB0aGF0IG1hcHMgdG8gdGhlICoqdmlzaWJsZSoqXG4gICAgICBldmVudCBuYW1lXG4gICMjI1xuICBAVklTSUJMRTogJ3Zpc2libGUnXG5cbiAgIyMjXG4gICAgQHByb3BlcnR5IFtTdHJpbmddIENsYXNzIGNvbnN0YW50IHRoYXQgbWFwcyB0byB0aGUgKippbnZpc2libGUqKlxuICAgICAgZXZlbnQgbmFtZVxuICAjIyNcbiAgQElOVklTSUJMRTogJ2ludmlzaWJsZSdcblxuICAjIyNcbiAgICBAcHJvcGVydHkgW1N0cmluZ10gQ2xhc3MgY29uc3RhbnQgdGhhdCBtYXBzIHRvIHRoZSAqKmRpc2FibGUtaG92ZXIqKlxuICAgICAgZXZlbnQgbmFtZVxuICAjIyNcbiAgQERJU0FCTEVfSE9WRVI6ICdkaXNhYmxlLWhvdmVyJ1xuXG4gICMjI1xuICAgIEBwcm9wZXJ0eSBbU3RyaW5nXSBQcml2YXRlIGluc3RhbmNlIHZhcmlhYmxlIHRoYXQgbWFwcyB0byB0aGVcbiAgICAgIHRhcmdldCdzICoqeCoqIHBvc2l0aW9uIHByb3BlcnR5XG4gICMjI1xuICBfdGFyZ2V0WDogJ3Njcm9sbExlZnQnXG5cbiAgIyMjXG4gICAgQHByb3BlcnR5IFtTdHJpbmddIFByaXZhdGUgaW5zdGFuY2UgdmFyaWFibGUgdGhhdCBtYXBzIHRvIHRoZVxuICAgIHRhcmdldCdzICoqeSoqIHBvc2l0aW9uIHByb3BlcnR5XG4gICMjI1xuICBfdGFyZ2V0WTogJ3Njcm9sbFRvcCdcblxuICAjIyNcbiAgICBAcHJvcGVydHkgW0hUTUxFbGVtZW50XSBQcml2YXRlIGluc3RhbmNlIHZhcmlhYmxlIHRoYXQgaW5kaWNhdGVzIHRoZSB0YXJnZXRcbiAgICAgIHRoaXMgU2Nyb2xsUHJveHkncyBpbnN0YW5jZSBpcyBhdHRhY2hlZCB0b1xuICAjIyNcbiAgX3RhcmdldDogbnVsbFxuXG4gICMjI1xuICAgIEBwcm9wZXJ0eSBbQXJyYXk8T2JqZWN0Pl0gUHJpdmF0ZSBpbnN0YW5jZSB2YXJpYWJsZSB0aGF0IGhvbGRzIHRoZSBldmVudHNcbiAgICAgIHRoaXMgaW5zdGFuY2UgcmVzcG9uZHMgdG9cbiAgIyMjXG4gIF9ldmVudHM6IFtdXG5cbiAgIyMjXG4gICAgQHByb3BlcnR5IFtOdW1iZXJdIFByaXZhdGUgaW5zdGFuY2UgdmFyaWFibGUgdGhhdCBob2xkcyB0aGVcbiAgICAgIGN1cnJlbnQgZGVsYXkgZm9yIHNjcm9sbCB0aHJvdHRsaW5nXG4gICMjI1xuICBfc2Nyb2xsRGVsYXk6IDI1MFxuXG4gICMjI1xuICAgIEBwcm9wZXJ0eSBbTnVtYmVyXSBQcml2YXRlIGluc3RhbmNlIHZhcmlhYmxlIHRoYXQgaG9sZHMgdGhlXG4gICAgICBjdXJyZW50IGRlbGF5IGZvciBlbmFibGluZy9kaXNhYmxpbmcgaG92ZXIgZWxlbWVudHMgb24gc2Nyb2xsXG4gICMjI1xuICBfaG92ZXJEZWxheTogMjUwXG5cbiAgIyMjXG4gICAgQHByb3BlcnR5IFtOdW1iZXJdIFByaXZhdGUgaW5zdGFuY2UgdmFyaWFibGUgdGhhdCBob2xkcyB0aGVcbiAgICAgIGN1cnJlbnQgdGltZW91dCB1c2VkIHdoZW4gYmxvY2tpbmcgaG92ZXIgYW5pbWF0aW9uc1xuICAjIyNcbiAgX2hvdmVyVGltZW91dDogbnVsbFxuXG4gICMjI1xuICAgIEBwcm9wZXJ0eSBbTnVtYmVyXSBJbnN0YW5jZSB2YXJpYWJsZSB0aGF0IGhvbGRzIHRoZSBjdXJyZW50IHggcG9zaXRpb24gb2ZcbiAgICAgIHRoZSBzY3JvbGwgdGFyZ2V0XG4gICMjI1xuICB4OiAwXG5cbiAgIyMjXG4gICAgQHByb3BlcnR5IFtOdW1iZXJdIEluc3RhbmNlIHZhcmlhYmxlIHRoYXQgaG9sZHMgdGhlIGN1cnJlbnQgeSBwb3NpdGlvbiBvZlxuICAgIHRoZSBzY3JvbGwgdGFyZ2V0XG4gICMjI1xuICB5OiAwXG5cbiAgIyMjXG4gICAgQHByb3BlcnR5IFtOdW1iZXJdIEluc3RhbmNlIHZhcmlhYmxlIHRoYXQgaG9sZHMgdGhlIGN1cnJlbnQgd2lkdGggb2ZcbiAgICAgIHRoZSBzY3JvbGwgdGFyZ2V0IGJveFxuICAjIyNcbiAgd2lkdGg6IDBcblxuICAjIyNcbiAgICBAcHJvcGVydHkgW051bWJlcl0gSW5zdGFuY2UgdmFyaWFibGUgdGhhdCBob2xkcyB0aGUgY3VycmVudCBoZWlnaHQgb2ZcbiAgICAgIHRoZSBzY3JvbGwgdGFyZ2V0IGJveFxuICAjIyNcbiAgaGVpZ2h0OiAwXG5cbiAgIyMjXG4gICAgQHByb3BlcnR5IFtOdW1iZXJdIHNjcm9sbFdpZHRoIEluc3RhbmNlIHZhcmlhYmxlIHRoYXQgaG9sZHMgdGhlIGN1cnJlbnRcbiAgICAgIHdpZHRoIG9mIHRoZSBzY3JvbGwgdGFyZ2V0IHNjcm9sbCBhcmVhXG4gICMjI1xuICBzY3JvbGxXaWR0aDogMFxuXG4gICMjI1xuICAgIEBwcm9wZXJ0eSBbTnVtYmVyXSBJbnN0YW5jZSB2YXJpYWJsZSB0aGF0IGhvbGRzIHRoZSBjdXJyZW50XG4gICAgICBoZWlnaHQgb2YgdGhlIHNjcm9sbCB0YXJnZXQgc2Nyb2xsIGFyZWFcbiAgIyMjXG4gIHNjcm9sbEhlaWdodDogMFxuXG4gICMjI1xuICAgIEBwcm9wZXJ0eSBbT2JqZWN0XSBJbnN0YW5jZSB2YXJpYWJsZSB0aGF0IGhvbGRzIHRoZSBjdXJyZW50XG4gICAgICBzY3JvbGwgZGF0YSAoZnJvbSBsYXN0IHNjcm9sbCBhY3Rpb24pXG4gICMjI1xuICBzY3JvbGxEYXRhOiB7fVxuXG4gICMjI1xuICAgIEhhbmRsZXMgdGhlIHNjcm9sbCBldmVudCB3aGVuIGl0IGZpcmVzXG4gICAgQGV4YW1wbGUgU2ltdWxhdGluZyB0aGUgd2luZG93IGZpcmluZyBhbiBldmVudCBwYXNzaW5nIHRoZSBtZXRhZGF0YTpcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBTY3JvbGxQcm94eS5oYW5kbGVTY3JvbGwsIHRydWUpXG4gICAgQHBhcmFtIFtPYmplY3RdIGUgc2Nyb2xsIGV2ZW50IGRhdGFcbiAgICBAcmV0dXJuIFtPYmplY3RdIE51bGwgb3IgdGhlIGVsZW1lbnQgdGhhdCBjYXRjaGVkIHRoZSBldmVudFxuICAgIEBzaW5jZSAwLjEuMFxuICAgIEBwcml2YXRlXG4gICMjI1xuICBAX2hhbmRsZVNjcm9sbDogKGUpIC0+XG4gICAgbGVuID0gU2Nyb2xsUHJveHkuX3RhcmdldExpc3QubGVuZ3RoXG4gICAgaWYgbGVuIGlzIDAgdGhlbiByZXR1cm4gbnVsbFxuICAgICMgR2V0IHRoZSBjb3JyZWN0IHRhcmdldCBhbmNob3IgKEhUTUwgZWxlbWVudClcbiAgICB0YXJnZXQgPSBlLnRhcmdldC5ib2R5IG9yIGUudGFyZ2V0XG4gICAgcmV0dXJuIFNjcm9sbFByb3h5Ll9nZXRFbGVtZW50KHRhcmdldCkucHJveHkuX3BlcmZvcm1TY3JvbGwoZSlcblxuICAjIyNcbiAgICBSZXRyaWV2ZXMgdGhlIGN1cnJlbnQgdGFyZ2V0IGFuZCBwcm94eSBmb3IgdGhlIGdpdmVuIEhUTUxFbGVtZW50XG4gICAgQGV4YW1wbGUgQ2hlY2tpbmcgaWYgdGhlIGJvZHkgdGFnIGlzIG9uIF90YXJnZXRMaXN0OlxuICAgICAgU2Nyb2xsUHJveHkuX2dldEVsZW1lbnQoZG9jdW1lbnQuYm9keSlcbiAgICBAcGFyYW0gW0hUTUxFbGVtZW50XSBlbCBUaGUgZWxlbWVudCB0byBzZWFyY2ggZm9yIGluICoqX3RhcmdldExpc3QqKlxuICAgIEByZXR1cm4gW09iamVjdF0gTnVsbCBvciB0aGUgdGFyZ2V0IHRoYXQgbWF0Y2hlZCB0aGUgYXJndW1lbnRcbiAgICBAc2luY2UgMC4xLjBcbiAgICBAcHJpdmF0ZVxuICAjIyNcbiAgQF9nZXRFbGVtZW50OiAoZWwpIC0+XG4gICAgZm9yIGl0ZW0gaW4gU2Nyb2xsUHJveHkuX3RhcmdldExpc3RcbiAgICAgIGlmIGl0ZW0/IGFuZCBpdGVtLnRhcmdldCBpcyBlbFxuICAgICAgICByZXR1cm4gaXRlbVxuICAgIHJldHVybiBudWxsXG5cbiAgIyMjXG4gICAgQWN0aXZhdGVzIHRoZSBTY3JvbGxQcm94eSdzIGZ1bmN0aW9uYWxpdHksIHJlZ2lzdGVyaW5nIHRoZSBldmVudCBsaXN0ZW5lclxuICAgIHRoYXQgd2lsbCBsaXN0ZW4gZm9yIHNjcm9sbCBldmVudHMgYW5kIHByb3h5IGl0IHRvXG4gICAgKipTY3JvbGxQcm94eS5oYW5kbGVTY3JvbGwqKlxuICAgIEBleGFtcGxlIEFjdGl2YXRpbmcgU2Nyb2xsUHJveHkgbWFudWFsbHksIGl0J3MgZG9uZSBhdXRvbWF0aWNhbGx5IHdpdGggbmV3OlxuICAgICAgU2Nyb2xsUHJveHkuYWN0aXZhdGUoKVxuICAgIEByZXR1cm4gW0Jvb2xlYW5dIFRoZSBjdXJyZW50IHN0YXR1cyBvZiBTY3JvbGxQcm94eVxuICAgIEBzaW5jZSAwLjEuMFxuICAjIyNcbiAgQGFjdGl2YXRlOiAtPlxuICAgIGlmIG5vdCBTY3JvbGxQcm94eS5hY3RpdmVcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICBTY3JvbGxQcm94eS5TQ1JPTEwsXG4gICAgICAgIFNjcm9sbFByb3h5Ll9oYW5kbGVTY3JvbGwsXG4gICAgICAgIHRydWVcbiAgICAgIClcbiAgICAgIFNjcm9sbFByb3h5LmFjdGl2ZSA9IHllc1xuICAgIHJldHVybiBTY3JvbGxQcm94eS5hY3RpdmVcblxuICAjIyNcbiAgICBEZWFjdGl2YXRlcyB0aGUgU2Nyb2xsUHJveHkncyBmdW5jdGlvbmFsaXR5LCByZW1vdmluZyB0aGUgZXZlbnQgbGlzdGVuZXIgYW5kXG4gICAgc3RvcHBpbmcgYW55IGZ1bmN0aW9uYWxpdHlcbiAgICBAZXhhbXBsZSBEZWFjdGl2YXRpbmcgbWFudWFsbHksIGl0J3MgZG9uZSBhdXRvbWF0aWNhbGx5IHdoZW4gdW5yZWdpc3RlcmluZzpcbiAgICAgIFNjcm9sbFByb3h5LmRlYWN0aXZhdGUoKVxuICAgIEByZXR1cm4gW0Jvb2xlYW5dIFRoZSBjdXJyZW50IHN0YXR1cyBvZiBTY3JvbGxQcm94eVxuICAgIEBzaW5jZSAwLjEuMFxuICAjIyNcbiAgQGRlYWN0aXZhdGU6IC0+XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICBTY3JvbGxQcm94eS5TQ1JPTEwsXG4gICAgICBTY3JvbGxQcm94eS5faGFuZGxlU2Nyb2xsLFxuICAgICAgdHJ1ZVxuICAgIClcbiAgICByZXR1cm4gU2Nyb2xsUHJveHkuYWN0aXZlID0gbm9cblxuICAjIyNcbiAgICBDbGVhbnMgdGhlICoqX3RhcmdldExpc3QqKiwgcmVtb3ZpbmcgYWxsIHRhcmdldHNcbiAgICBAZXhhbXBsZSBUbyBhc3N1cmUgU2Nyb2xsUHJveHkgaXMgc2h1dCBkb3duIHlvdSBjb3VsZCBydW4gKipjbGVhbioqOlxuICAgICAgU2Nyb2xsUHJveHkuY2xlYW4oKVxuICAgIEByZXR1cm4gW0FycmF5XSBUYXJnZXRzIHJlbW92ZWRcbiAgICBAc2luY2UgMC4xLjBcbiAgIyMjXG4gIEBjbGVhbjogLT4gaXRlbS5wcm94eS51bnJlZ2lzdGVyKCkgZm9yIGl0ZW0gaW4gU2Nyb2xsUHJveHkuX3RhcmdldExpc3RcblxuICAjIyNcbiAgICBVcGRhdGUgdGhpcyBpbnN0YW5jZSByZWN0IGluZm9ybWF0aW9uLCB1cGRhdGluZyB4IGFuZCB5IHBvc2l0aW9ucyBhcyB3ZWxsIGFzXG4gICAgd2lkdGgsIGhlaWdodCwgc2Nyb2xsV2lkdGggYW5kIHNjcm9sbEhlaWdodFxuICAgIEBleGFtcGxlIE1vc3QgbWV0aG9kcyBydW4gdGhpcyBmdW5jdGlvbiB3aGVuIHVwLXRvLWRhdGUgZGF0YSBpcyByZXF1aXJlZDpcbiAgICAgIHMgPSBuZXcgU2Nyb2xsUHJveHkoKVxuICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSAyMCAjIHMueSBjb250aW51ZXMgMFxuICAgICAgcy51cGRhdGVWaWV3cG9ydEluZm8oKSAjIHMueSBpcyAyMCBub3dcbiAgICBAcmV0dXJuIFtOdWxsXSBOb3RoaW5nIHVzZWZ1bCBpcyByZXR1cm5lZFxuICAgIEBzaW5jZSAwLjEuMFxuICAgIEBwcml2YXRlXG4gICMjI1xuICBfdXBkYXRlVmlld3BvcnRJbmZvOiAtPlxuICAgIEB4ID0gQF90YXJnZXRbQF90YXJnZXRYXVxuICAgIEB5ID0gQF90YXJnZXRbQF90YXJnZXRZXVxuICAgIEB3aWR0aCA9IEBfdGFyZ2V0Lm9mZnNldFdpZHRoXG4gICAgQGhlaWdodCA9IEBfdGFyZ2V0Lm9mZnNldEhlaWdodFxuICAgIEBzY3JvbGxXaWR0aCA9IEBfdGFyZ2V0LnNjcm9sbFdpZHRoXG4gICAgQHNjcm9sbEhlaWdodCA9IEBfdGFyZ2V0LnNjcm9sbEhlaWdodFxuICAgIHJldHVybiBudWxsXG5cbiAgIyMjXG4gICAgVXRpbGl0eSBtZXRob2QgdGhhdCBUaHJvd3MgZXJyb3IgaWYgZWxlbWVudCBnaXZlbiBpcyBub3QgY2hpbGQgb2YgdGhlXG4gICAgKipfdGFyZ2V0KipcbiAgICBAZXhhbXBsZSBDaGVja2luZyBhIGxpc3QgaXRlbSBpbnNpZGUgYSB1bDpcbiAgICAgIHMgPSBuZXcgU2Nyb2xsUHJveHkodWwpXG4gICAgICBzLl9jaGVja0VsZW1lbnQobGkpICMgZG9lcyBub3QgdGhyb3cgYW55dGhpbmcsIHNvIE9LXG4gICAgQHBhcmFtIFtIVE1MRWxlbWVudF0gZWwgVGhlIGVsZW1lbnQgdG8gY2hlY2tcbiAgICBAcmV0dXJuIFtOdWxsXSBOb3RoaW5nIHVzZWZ1bCBpcyByZXR1cm5lZFxuICAgIEBzaW5jZSAwLjEuMFxuICAgIEBwcml2YXRlXG4gICMjI1xuICBfY2hlY2tFbGVtZW50OiAoZWwpIC0+XG4gICAgaWYgZWwgbm90IGluIEBfdGFyZ2V0LmNoaWxkcmVuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgbXVzdCBiZSBjaGlsZCBvZiB0aGUgc2Nyb2xsIGVsZW1lbnQnKVxuICAgIHJldHVybiBudWxsXG5cbiAgIyMjXG4gICAgUmVtb3ZlIGFuIGV2ZW50IGZyb20gdGhlIGxpc3Qgb2YgZXZlbnRzXG4gICAgQGV4YW1wbGUgRG9uJ3Qgd2FudCB0byByZWNlaXZlIHNjcm9sbCBmZWVkYmFjayBhbnltb3JlOlxuICAgICAgcyA9IG5ldyBTY3JvbGxQcm94eSgpXG4gICAgICBldnQgPSBzLl9jcmVhdGVFdmVudCgnc2Nyb2xsJywgLT4gbnVsbClcbiAgICAgIHMuX3JlbW92ZUV2ZW50KGV2dCkgIyBPSywgZXZlbnQgZ29uZVxuICAgIEBwYXJhbSBbT2JqZWN0XSBUaGUgZXZlbnQgdG8gcmVtb3ZlXG4gICAgQHJldHVybiBbQXJyYXldIFRoZSBuZXcgYXJyYXkgb2YgZXZlbnRzICgqKl9ldmVudHMqKilcbiAgICBAc2luY2UgMC4xLjBcbiAgICBAcHJpdmF0ZVxuICAjIyNcbiAgX3JlbW92ZUV2ZW50OiAoZXZlbnQpIC0+XG4gICAgZm9yIGl0ZW0sIGkgaW4gQF9ldmVudHNcbiAgICAgIGlmIGV2ZW50IGlzIGl0ZW1cbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dChldmVudC50aW1lb3V0KVxuICAgICAgICBkZWxldGUgZXZlbnQuZm5cbiAgICAgICAgZGVsZXRlIEBfZXZlbnRzW2ldXG4gICAgICAgIGJyZWFrXG4gICAgYXJyID0gW11cbiAgICBhcnIucHVzaChpdGVtKSBmb3IgaXRlbSBpbiBAX2V2ZW50cyB3aGVuIGl0ZW0/XG4gICAgcmV0dXJuIEBfZXZlbnRzID0gYXJyXG5cbiAgIyMjXG4gICAgQ2hlY2tzIGlmIHRoZSBnaXZlbiB2aXJ0dWFsIHJlY3QgaXMgdmlzaWJsZSBvbiAqKl90YXJnZXQqKiB2aWV3cG9ydFxuICAgIEBleGFtcGxlIENoZWNrIGlmIHRoZSByZWN0ICgwLCAwLCA1MCwgNTApIGlzIHZpc2libGU6XG4gICAgICBzID0gbmV3IFNjcm9sbFByb3h5KClcbiAgICAgIHJlY3QgPSB7eDogMCwgeTowLCB3OiA1MCwgaDogNTB9XG4gICAgICBzLl9pc1JlY3RWaXNpYmxlKHJlY3QpICMgVmlzaWJsZT9cbiAgICBAcGFyYW0gW09iamVjdF0gcmVjdCBUaGUgcmVjdCBvYmplY3QgdG8gY2hlY2tcbiAgICBAb3B0aW9uIHJlY3QgW051bWJlcl0geCBUaGUgdG9wLWxlZnQgeCBwb3NpdGlvblxuICAgIEBvcHRpb24gcmVjdCBbTnVtYmVyXSB5IFRoZSB0b3AtbGVmdCB5IHBvc2l0aW9uXG4gICAgQG9wdGlvbiByZWN0IFtOdW1iZXJdIHcgVGhlIHdpZHRoIG9mIHRoZSByZWN0XG4gICAgQG9wdGlvbiByZWN0IFtOdW1iZXJdIGggVGhlIGhlaWdodCBvZiB0aGUgcmVjdFxuICAgIEByZXR1cm4gW0Jvb2xlYW5dIEluZGljYXRlcyBpZiB2aXNpYmxlIG9yIG5vdFxuICAgIEBzaW5jZSAwLjEuMFxuICAgIEBwcml2YXRlXG4gICMjI1xuICBfaXNSZWN0VmlzaWJsZTogKHJlY3QpIC0+XG4gICAgQF91cGRhdGVWaWV3cG9ydEluZm8oKVxuICAgIHhWaXNpYmxlID0gQHggPCAocmVjdC54ICsgcmVjdC53KSBhbmQgQHggPiAocmVjdC54IC0gQHdpZHRoKVxuICAgIHlWaXNpYmxlID0gQHkgPCAocmVjdC55ICsgcmVjdC5oKSBhbmQgQHkgPiAocmVjdC55IC0gQGhlaWdodClcbiAgICByZXR1cm4geFZpc2libGUgYW5kIHlWaXNpYmxlXG5cbiAgIyMjXG4gICAgUGVyZm9ybXMgdGhlIHNjcm9sbCBhY3Rpb25zLCBmaXJpbmcgdGhlIG5lZWRlZCBldmVudHMgaW50ZXJuYWxseVxuICAgIEBleGFtcGxlIFRoZSAqKl9oYW5kbGVTY3JvbGwqKiB1c3VhbGx5IGNhbGxzIHRoaXMgbWV0aG9kOlxuICAgICAgcyA9IG5ldyBTY3JvbGxQcm94eSgpXG4gICAgICBzLl9wZXJmb3JtU2Nyb2xsKHNjcm9sbEV2dCkgIyBPSywgcmVsYXRlZCBldmVudHMgd2lsbCBiZSBmaXJlZFxuICAgIEBwYXJhbSBbT2JqZWN0XSBUaGUgc2Nyb2xsIGRhdGEgcGFzc2VkIHdpdGggdGhlIGV2ZW50XG4gICAgQHJldHVybiBbSFRNTEVsZW1lbnRdIFRoZSBjdXJyZW50IHRhcmdldFxuICAgIEBzaW5jZSAwLjEuMFxuICAgIEBwcml2YXRlXG4gICMjI1xuICBfcGVyZm9ybVNjcm9sbDogKGUpIC0+XG4gICAgbGVuID0gQF9ldmVudHMubGVuZ3RoXG4gICAgaWYgbGVuIGlzIDAgdGhlbiByZXR1cm4gbnVsbFxuICAgIEBzY3JvbGxEYXRhID0gZVxuICAgIGV2ZW50LmZuLmNhbGwodGhpcywgZXZlbnQpIGZvciBldmVudCBpbiBAX2V2ZW50c1xuICAgIHJldHVybiBAX3RhcmdldFxuXG4gICMjI1xuICAgIEZ1bmN0aW9uIHRoYXQgcGVyZm9ybXMgdGhlIHNjcm9sbCB0aHJvdHRsaW5nIHRvIGFjaGlldmUgYmV0dGVyIHBlcmZvcm1hbmNlXG4gICAgQGV4YW1wbGUgT25lIG11c3QgcGFzcyBhIGZ1bmN0aW9uIHRvIGJlIHRocm90dGxlZCBhbmQgYSBkZWxheTpcbiAgICAgIHMgPSBuZXcgU2Nyb2xsUHJveHkoKVxuICAgICAgZnVuYyA9IC0+IHRoaXNcbiAgICAgIG5ld0Z1bmMgPSBzLl90aHJvdHRsZVNjcm9sbChmdW5jLCAyNTApXG4gICAgICBuZXdGdW5jKCkgIyBmdW5jIHdpbGwgYmUgY2FsbGVkIGFmdGVyIDI1MG1zLCB0aGUgc2Nyb2xsRGF0YSB3aWxsIGJlIHBhc3NlZFxuICAgICAgbmV3RnVuYygpICMgZnVuYyB3aWxsIG5vdCBiZSBjYWxsZWQsIGJlY2F1c2Ugb3RoZXIgY2FsbCBpcyB3YWl0aW5nXG4gICAgQHBhcmFtIFtGdW5jdGlvbl0gVGhlIGZ1bmN0aW9uIHRvIHRocm90dGxlXG4gICAgQHBhcmFtIFtOdW1iZXJdIGRlbGF5IFRoZSB0aW1lIGZ1bmN0aW9uIHNob3VsZCB3YWl0IHRvIGZpcmVcbiAgICBAcmV0dXJuIFtGdW5jdGlvbl0gVGhlIG5ldyB0aHJvdHRsZWQgZnVuY3Rpb25cbiAgICBAc2luY2UgMC4xLjBcbiAgICBAcHJpdmF0ZVxuICAjIyNcbiAgX3Rocm90dGxlU2Nyb2xsOiAoZnVuYywgZGVsYXkpIC0+XG4gICAgcnVubmluZyA9IG5vXG4gICAgcmV0dXJuIChkYXRhKSA9PlxuICAgICAgaWYgcnVubmluZyB0aGVuIHJldHVyblxuICAgICAgcnVubmluZyA9IHllc1xuICAgICAgZGF0YS50aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoPT5cbiAgICAgICAgcnVubmluZyA9IG5vXG4gICAgICAgIHJldHVybiBTVXRpbC5yZXBvcnRDaGFuZ2UoZnVuYywgdGhpcywgQHNjcm9sbERhdGEpXG4gICAgICAsIChpZiBkZWxheT8gdGhlbiBkZWxheSBlbHNlIEBnZXRTY3JvbGxEZWxheSgpKSlcblxuICAjIyNcbiAgICBDcmVhdGVzIGEgZ2VuZXJpYyBldmVudCBhbmQgcHVzaGVzIGl0IGluIHRoZSAqKl9ldmVudHMqKiBhcnJheVxuICAgIEBleGFtcGxlIENyZWF0ZSBldmVudCB3aXRoIG5hbWUsIGNhbGxiYWNrIGFuZCBvcHRpb25hbCB0aHJvdHRsZSBkZWxheTpcbiAgICAgIHMgPSBuZXcgU2Nyb2xsUHJveHkoKVxuICAgICAgcy5fY3JlYXRlRXZlbnQoJ3Njcm9sbCcsIC0+IG51bGwsIDI1MCkgIyBzZXR0aW5nIGRlbGF5IG9mIDI1MG1zXG4gICAgQHBhcmFtIFtTdHJpbmddIGV2dCBUaGUgZXZlbnQgbmFtZSB0byByZWdpc3RlclxuICAgIEBwYXJhbSBbRnVuY3Rpb25dIGNhbGxiYWNrIHRoZSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiBldmVudCBpcyBmaXJlZFxuICAgIEBwYXJhbSBbTnVtYmVyXSBkZWxheSBUaW1lIHRvIHdhaXQgaW4gbWlsbGlzZWNvbmRzXG4gICAgQHJldHVybiBbT2JqZWN0XSBUaGUgZXZlbnQganVzdCByZWdpc3RlcmVkXG4gICAgQHNpbmNlIDAuMS4wXG4gICAgQHByaXZhdGVcbiAgIyMjXG4gIF9jcmVhdGVFdmVudDogKGV2dCwgY2FsbGJhY2ssIGRlbGF5KSAtPlxuICAgIGZuID0gQF90aHJvdHRsZVNjcm9sbChjYWxsYmFjaywgZGVsYXkpXG4gICAgcmV0dXJuIEBfZXZlbnRzLnB1c2goe3R5cGU6IGV2dCwgZm46IGZuLmJpbmQodGhpcyksIHRpbWVvdXQ6IG51bGx9KVxuXG4gICMjI1xuICAgIENyZWF0ZXMgYSBzY3JvbGwgZXZlbnRcbiAgICBAZXhhbXBsZSBDcmVhdGUgc2Nyb2xsIGV2ZW50IHdpdGggY2FsbGJhY2sgYW5kIG9wdGlvbmFsIHRocm90dGxlIGRlbGF5OlxuICAgICAgcyA9IG5ldyBTY3JvbGxQcm94eSgpXG4gICAgICBzLl9jcmVhdGVTY3JvbGxFdmVudCgnc2Nyb2xsJywgLT4gbnVsbCwgMjUwKSAjIHNldHRpbmcgZGVsYXkgb2YgMjUwbXNcbiAgICBAcGFyYW0gW1N0cmluZ10gZXZ0IFRoZSBldmVudCBuYW1lIHRvIHJlZ2lzdGVyICgqKnNjcm9sbCoqKVxuICAgIEBwYXJhbSBbRnVuY3Rpb25dIGNhbGxiYWNrIHRoZSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiBldmVudCBpcyBmaXJlZFxuICAgIEBwYXJhbSBbTnVtYmVyXSBkZWxheSBUaW1lIHRvIHdhaXQgaW4gbWlsbGlzZWNvbmRzXG4gICAgQHJldHVybiBbT2JqZWN0XSBUaGUgZXZlbnQganVzdCByZWdpc3RlcmVkXG4gICAgQHNpbmNlIDAuMS4wXG4gICAgQHByaXZhdGVcbiAgIyMjXG4gIF9jcmVhdGVTY3JvbGxFdmVudDogKGV2dCwgY2FsbGJhY2ssIGRlbGF5KSAtPlxuICAgIHJldHVybiBAX2NyZWF0ZUV2ZW50KGV2dCwgPT5cbiAgICAgIEBfdXBkYXRlVmlld3BvcnRJbmZvKClcbiAgICAgIHJldHVybiBTVXRpbC5yZXBvcnRDaGFuZ2UoY2FsbGJhY2ssIHRoaXMsIEBzY3JvbGxEYXRhKVxuICAgICwgZGVsYXkpXG5cbiAgIyMjXG4gICAgQ3JlYXRlcyBhIG9mZnNldCBldmVudFxuICAgIEBleGFtcGxlIENyZWF0ZSBvZmZzZXQgZXZlbnQgd2l0aCBjYWxsYmFjayBhbmQgb3B0aW9uYWwgb2Zmc2V0OlxuICAgICAgcyA9IG5ldyBTY3JvbGxQcm94eSgpXG4gICAgICBzLl9jcmVhdGVPZmZzZXRFdmVudCgnb2Zmc2V0WCcsIC0+IG51bGwsIDI1MCkgIyBzZXR0aW5nIG9mZnNldCBvZiAyNTBweFxuICAgIEBwYXJhbSBbU3RyaW5nXSBldnQgVGhlIGV2ZW50IG5hbWUgdG8gcmVnaXN0ZXIsICoqb2Zmc2V0WCoqIG9yICoqb2Zmc2V0WSoqXG4gICAgQHBhcmFtIFtGdW5jdGlvbl0gY2FsbGJhY2sgdGhlIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIGV2ZW50IGlzIGZpcmVkXG4gICAgQHBhcmFtIFtOdW1iZXJdIG9mZnNldCBPZmZzZXQgdG8gY2hlY2sgZm9yICgwIGlzIGRlZmF1bHQpXG4gICAgQHJldHVybiBbT2JqZWN0XSBUaGUgZXZlbnQganVzdCByZWdpc3RlcmVkXG4gICAgQHNpbmNlIDAuMS4wXG4gICAgQHByaXZhdGVcbiAgIyMjXG4gIF9jcmVhdGVPZmZzZXRFdmVudDogKGV2dCwgY2FsbGJhY2ssIG9mZnNldCA9IDApIC0+XG4gICAgaWYgZXZ0IGlzIFNjcm9sbFByb3h5Lk9GRlNFVF9YXG4gICAgICByZXR1cm4gQF9jcmVhdGVFdmVudChldnQsID0+XG4gICAgICAgIGlmIEB4IGlzIEBfdGFyZ2V0W0BfdGFyZ2V0WF1cbiAgICAgICAgICByZXR1cm4gQF91cGRhdGVWaWV3cG9ydEluZm8oKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQF91cGRhdGVWaWV3cG9ydEluZm8oKVxuICAgICAgICBpZiBTVXRpbC5pc1Bvc2l0aXZlTnVtYmVyKG9mZnNldCkgYW5kIEB4IDwgb2Zmc2V0IHRoZW4gcmV0dXJuXG4gICAgICAgIGlmIFNVdGlsLmlzTmVnYXRpdmVOdW1iZXIob2Zmc2V0KSBhbmQgQHggPiBNYXRoLmFicyhvZmZzZXQpIHRoZW4gcmV0dXJuXG4gICAgICAgIHJldHVybiBTVXRpbC5yZXBvcnRDaGFuZ2UoY2FsbGJhY2ssIHRoaXMsIEBzY3JvbGxEYXRhKVxuICAgICAgKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBAX2NyZWF0ZUV2ZW50KGV2dCwgPT5cbiAgICAgICAgaWYgQHkgaXMgQF90YXJnZXRbQF90YXJnZXRZXVxuICAgICAgICAgIHJldHVybiBAX3VwZGF0ZVZpZXdwb3J0SW5mbygpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAX3VwZGF0ZVZpZXdwb3J0SW5mbygpXG4gICAgICAgIGlmIFNVdGlsLmlzUG9zaXRpdmVOdW1iZXIob2Zmc2V0KSBhbmQgQHkgPCBvZmZzZXQgdGhlbiByZXR1cm5cbiAgICAgICAgaWYgU1V0aWwuaXNOZWdhdGl2ZU51bWJlcihvZmZzZXQpIGFuZCBAeSA+IE1hdGguYWJzKG9mZnNldCkgdGhlbiByZXR1cm5cbiAgICAgICAgcmV0dXJuIFNVdGlsLnJlcG9ydENoYW5nZShjYWxsYmFjaywgdGhpcywgQHNjcm9sbERhdGEpXG4gICAgICApXG5cbiAgIyMjXG4gICAgQ3JlYXRlcyBhIGV2ZW50IHRvIGNoZWNrIGZvciBob3Jpem9udGFsIGJvdW5kIGNvbGxpc2lvblxuICAgIEBleGFtcGxlIENyZWF0ZSBob3Jpem9udGFsIGJvdW5kIGV2ZW50IHdpdGggY2FsbGJhY2sgYW5kIG9wdGlvbmFsIG9mZnNldDpcbiAgICAgIHMgPSBuZXcgU2Nyb2xsUHJveHkoKVxuICAgICAgcy5fY3JlYXRlSG9yaXpvbnRhbEJvdW5kRXZlbnQoJ2xlZnQnLCAtPiBudWxsKVxuICAgICAgIyBPbmUgY2FuIGFsc28gY2hlY2sgd2l0aCBhIG9mZnNldCBpbndhcmRzLCB1c2VmdWwgZm9yIGluZmluaXRlIHNjcm9sbGluZ1xuICAgICAgcy5fY3JlYXRlSG9yaXpvbnRhbEJvdW5kRXZlbnQoJ2xlZnQnLCAtPiBudWxsLCAyNTApICMgZmlyZSAyNTBweCB0byBsZWZ0XG4gICAgQHBhcmFtIFtTdHJpbmddIGV2dCBUaGUgZXZlbnQgbmFtZSB0byByZWdpc3RlciwgKipsZWZ0Kiogb3IgKipyaWdodCoqXG4gICAgQHBhcmFtIFtGdW5jdGlvbl0gY2FsbGJhY2sgdGhlIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIGV2ZW50IGlzIGZpcmVkXG4gICAgQHBhcmFtIFtOdW1iZXJdIG9mZnNldCBPZmZzZXQgdG8gY2hlY2sgZm9yICgwIGlzIGRlZmF1dClcbiAgICBAcmV0dXJuIFtPYmplY3RdIFRoZSBldmVudCBqdXN0IHJlZ2lzdGVyZWRcbiAgICBAc2luY2UgMC4xLjBcbiAgICBAcHJpdmF0ZVxuICAjIyNcbiAgX2NyZWF0ZUhvcml6b250YWxCb3VuZFNjcm9sbEV2ZW50OiAoZXZ0LCBjYWxsYmFjaywgb2Zmc2V0ID0gMCkgLT5cbiAgICBpZiBldnQgaXMgU2Nyb2xsUHJveHkuTEVGVFxuICAgICAgcmV0dXJuIEBfY3JlYXRlU2Nyb2xsRXZlbnQoZXZ0LCA9PlxuICAgICAgICBpZiBAeCA8PSBNYXRoLmFicyhvZmZzZXQpXG4gICAgICAgICAgcmV0dXJuIFNVdGlsLnJlcG9ydENoYW5nZShjYWxsYmFjaywgdGhpcywgQHNjcm9sbERhdGEpXG4gICAgICAsIDApXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIEBfY3JlYXRlU2Nyb2xsRXZlbnQoZXZ0LCA9PlxuICAgICAgICBpZiAoQHNjcm9sbFdpZHRoIC0gQHgpIC0gQHdpZHRoIDw9IE1hdGguYWJzKG9mZnNldClcbiAgICAgICAgICByZXR1cm4gU1V0aWwucmVwb3J0Q2hhbmdlKGNhbGxiYWNrLCB0aGlzLCBAc2Nyb2xsRGF0YSlcbiAgICAgICwgMClcblxuICAjIyNcbiAgICBDcmVhdGVzIGEgZXZlbnQgdG8gY2hlY2sgZm9yIHZlcnRpY2FsIGJvdW5kIGNvbGxpc2lvblxuICAgIEBleGFtcGxlIENyZWF0ZSB2ZXJ0aWNhbCBib3VuZCBldmVudCB3aXRoIGNhbGxiYWNrIGFuZCBvcHRpb25hbCBvZmZzZXQ6XG4gICAgICBzID0gbmV3IFNjcm9sbFByb3h5KClcbiAgICAgIHMuX2NyZWF0ZVZlcnRpY2FsQm91bmRFdmVudCgndG9wJywgLT4gbnVsbClcbiAgICAgICMgT25lIGNhbiBhbHNvIGNoZWNrIHdpdGggYSBvZmZzZXQgaW53YXJkcywgdXNlZnVsIGZvciBpbmZpbml0ZSBzY3JvbGxpbmdcbiAgICAgIHMuX2NyZWF0ZVZlcnRpY2FsQm91bmRFdmVudCgndG9wJywgLT4gbnVsbCwgMjUwKSAjIGZpcmUgMjUwcHggdG8gdG9wXG4gICAgQHBhcmFtIFtTdHJpbmddIGV2dCBUaGUgZXZlbnQgbmFtZSB0byByZWdpc3RlciwgKip0b3AqKiBvciAqKmJvdHRvbSoqXG4gICAgQHBhcmFtIFtGdW5jdGlvbl0gY2FsbGJhY2sgdGhlIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIGV2ZW50IGlzIGZpcmVkXG4gICAgQHBhcmFtIFtOdW1iZXJdIG9mZnNldCBPZmZzZXQgdG8gY2hlY2sgZm9yXG4gICAgQHJldHVybiBbT2JqZWN0XSBUaGUgZXZlbnQganVzdCByZWdpc3RlcmVkXG4gICAgQHNpbmNlIDAuMS4wXG4gICAgQHByaXZhdGVcbiAgIyMjXG4gIF9jcmVhdGVWZXJ0aWNhbEJvdW5kU2Nyb2xsRXZlbnQ6IChldnQsIGNhbGxiYWNrLCBvZmZzZXQgPSAwKSAtPlxuICAgIGlmIGV2dCBpcyBTY3JvbGxQcm94eS5UT1BcbiAgICAgIHJldHVybiBAX2NyZWF0ZVNjcm9sbEV2ZW50KGV2dCwgPT5cbiAgICAgICAgaWYgQHkgPD0gTWF0aC5hYnMob2Zmc2V0KVxuICAgICAgICAgIHJldHVybiBTVXRpbC5yZXBvcnRDaGFuZ2UoY2FsbGJhY2ssIHRoaXMsIEBzY3JvbGxEYXRhKVxuICAgICAgLCAwKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBAX2NyZWF0ZVNjcm9sbEV2ZW50KGV2dCwgPT5cbiAgICAgICAgaWYgKEBzY3JvbGxIZWlnaHQgLSBAeSkgLSBAaGVpZ2h0IDw9IE1hdGguYWJzKG9mZnNldClcbiAgICAgICAgICByZXR1cm4gU1V0aWwucmVwb3J0Q2hhbmdlKGNhbGxiYWNrLCB0aGlzLCBAc2Nyb2xsRGF0YSlcbiAgICAgICwgMClcblxuICAjIyNcbiAgICBDcmVhdGVzIGEgZXZlbnQgdG8gY2hlY2sgZm9yIGVsZW1lbnQgdmlzaWJpbGl0eSBhcyBvbmUgc2Nyb2xsc1xuICAgIEBleGFtcGxlIENyZWF0ZSB2aXNpYmlsaXR5IHNjcm9sbCBldmVudCB3aXRoIGNhbGxiYWNrIGFuZCBvcHRpb25hbCBvZmZzZXQ6XG4gICAgICBzID0gbmV3IFNjcm9sbFByb3h5KClcbiAgICAgIHVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm15QmVhdXRpZnVsTGlzdCcpXG4gICAgICBzLl9jcmVhdGVWaXNpYmlsaXR5U2Nyb2xsRXZlbnQoJ3Zpc2libGUnLCAtPiBudWxsLCB1bClcbiAgICBAcGFyYW0gW1N0cmluZ10gZXZ0IFRoZSBldmVudCBuYW1lIHRvIHJlZ2lzdGVyLCAqKnZpc2libGUqKiBvciAqKmludmlzaWJsZSoqXG4gICAgQHBhcmFtIFtGdW5jdGlvbl0gY2FsbGJhY2sgdGhlIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIGV2ZW50IGlzIGZpcmVkXG4gICAgQHBhcmFtIFtOdW1iZXJdIG9mZnNldCBPZmZzZXQgdG8gY2hlY2sgZm9yXG4gICAgQHJldHVybiBbT2JqZWN0XSBUaGUgZXZlbnQganVzdCByZWdpc3RlcmVkXG4gICAgQHNpbmNlIDAuMS4wXG4gICAgQHByaXZhdGVcbiAgIyMjXG4gIF9jcmVhdGVWaXNpYmlsaXR5U2Nyb2xsRXZlbnQ6IChldnQsIGNhbGxiYWNrLCBlbCkgLT5cbiAgICBAX2NoZWNrRWxlbWVudChlbClcbiAgICBpZiBldnQgaXMgU2Nyb2xsUHJveHkuVklTSUJMRVxuICAgICAgcmV0dXJuIEBfY3JlYXRlU2Nyb2xsRXZlbnQoZXZ0LCA9PlxuICAgICAgICBpZiBAaXNFbGVtZW50VmlzaWJsZShlbClcbiAgICAgICAgICByZXR1cm4gU1V0aWwucmVwb3J0Q2hhbmdlKGNhbGxiYWNrLCB0aGlzLCBAc2Nyb2xsRGF0YSlcbiAgICAgIClcbiAgICBlbHNlXG4gICAgICByZXR1cm4gQF9jcmVhdGVTY3JvbGxFdmVudChldnQsID0+XG4gICAgICAgIGlmIG5vdCBAaXNFbGVtZW50VmlzaWJsZShlbClcbiAgICAgICAgICByZXR1cm4gU1V0aWwucmVwb3J0Q2hhbmdlKGNhbGxiYWNrLCB0aGlzLCBAc2Nyb2xsRGF0YSlcbiAgICAgIClcblxuICAjIyNcbiAgICBUaGUgU2Nyb2xsUHJveHkgY29uc3RydWN0b3IsIHVzZSBpdCB0byBjcmVhdGUgbmV3IGluc3RhbmNlc1xuICAgIEBleGFtcGxlIENyZWF0ZSBhIG5ldyBTY3JvbGxQcm94eSBpbnN0YW5jZTpcbiAgICAgICMgQ3JlYXRpbmcgYSBpbnN0YW5jZSBpbiB0aGUgZG9jdW1lbnQuYm9keVxuICAgICAgcyA9IG5ldyBTY3JvbGxQcm94eSgpICMgaXQgZGVmYXVsdHMgdG8gZG9jdW1lbnQuYm9keVxuICAgICAgIyBDcmVhdGluZyBvbiBhIGRpdlxuICAgICAgcyA9IG5ldyBTY3JvbGxQcm94eShteURpdikgIyBvciBhbnkgSFRNTEVtZW50XG4gICAgICAjIENyZWF0aW5nIG9uIHdpbmRvd1xuICAgICAgcyA9IG5ldyBTY3JvbGxQcm94eSh3aW5kb3cpICMgUmVtYXBzIHRvIHdpbmRvdy5kb2N1bWVudC5ib2R5XG4gICAgQHBhcmFtIFtIVE1MRWxlbWVudF0gdGFyZ2V0IFRoZSBlbGVtZW50IHRvIGF0dGFjaCBTY3JvbGxQcm94eVxuICAgIEByZXR1cm4gW1Njcm9sbFByb3h5XSBUaGlzIGluc3RhbmNlXG4gICAgQHNpbmNlIDAuMS4wXG4gICMjI1xuICBjb25zdHJ1Y3RvcjogKHRhcmdldCA9IGRvY3VtZW50KSAtPlxuICAgIGlmIHRhcmdldCBpcyBkb2N1bWVudFxuICAgICAgdGFyZ2V0ID0gdGFyZ2V0LmJvZHlcbiAgICBpZiB0YXJnZXQgaXMgd2luZG93XG4gICAgICB0YXJnZXQgPSB0YXJnZXQuZG9jdW1lbnQuYm9keVxuICAgIGlmIHRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XG4gICAgICBAX3RhcmdldCA9IHRhcmdldFxuICAgIGVsc2VcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGF0dGFjaCB0byBhIHZhbGlkIGFuY2hvcicpXG4gICAgQF9ldmVudHMgPSBbXVxuICAgIEByZWdpc3RlcigpXG4gICAgQF91cGRhdGVWaWV3cG9ydEluZm8oKVxuICAgIHJldHVybiB0aGlzXG5cbiAgIyMjXG4gICAgU2V0cyB0aGUgc2Nyb2xsIGRlbGF5LCBhbnkgZXZlbnQgcmVnaXN0ZXJlZCB3aWxsIHJlc3BlY3QgdGhlIG5ldyB2YWx1ZVxuICAgIEBleGFtcGxlIENoYW5naW5nIHRoZSBzY3JvbGwgZGVsYXkgbWlkLWZsaWdodDpcbiAgICAgIHMgPSBuZXcgU2Nyb2xsUHJveHkoKVxuICAgICAgIyBBbnkgY2FsbCB3aWxsIHRoZSB0aHJvdHRsZWQgd2l0aCAyNTBtc1xuICAgICAgcy5vbignc2Nyb2xsJywgLT4gbnVsbCkgIyBkZWZhdWx0cyB0byAyNTBtcyBkZWxheVxuICAgICAgcy5zZXRTY3JvbGxEZWxheSgzMDApICMgYW55IGNhbGwgbm93IHRocm90dGxlcyB3aXRoIDMwMG1zXG4gICAgQHBhcmFtIFtOdW1iZXJdIG1zIFRoZSBkZWxheSBpbiBtaWxsaXNlY29uZHNcbiAgICBAcmV0dXJuIFtTY3JvbGxQcm94eV0gVGhpcyBpbnN0YW5jZVxuICAgIEBzaW5jZSAwLjEuMFxuICAjIyNcbiAgc2V0U2Nyb2xsRGVsYXk6IChtcykgLT5cbiAgICBpZiBTVXRpbC5pc1Bvc2l0aXZlTnVtYmVyKG1zKVxuICAgICAgQF9zY3JvbGxEZWxheSA9IE1hdGgucm91bmQobXMpXG4gICAgcmV0dXJuIHRoaXNcblxuICAjIyNcbiAgICBSZXR1cm5zIHRoZSBjdXJyZW50IHNjcm9sbCBkZWxheVxuICAgIEBleGFtcGxlIEdldHRpbmcgdGhlIGN1cnJlbnQgZGVsYXk6XG4gICAgICBzID0gbmV3IFNjcm9sbFByb3h5KClcbiAgICAgIHMuc2V0U2Nyb2xsRGVsYXkoMzAwKSAjIGFueSBjYWxsIG5vdyB0aHJvdHRsZXMgd2l0aCAzMDBtc1xuICAgICAgcy5nZXRTY3JvbGxEZWxheSgpICMgd2lsbCBiZSAzMDBcbiAgICBAcmV0dXJuIFtOdW1iZXJdIFRoZSBjdXJyZW50IHZhbHVlIG9mIF9zY3JvbGxEZWxheVxuICAgIEBzaW5jZSAwLjEuMFxuICAjIyNcbiAgZ2V0U2Nyb2xsRGVsYXk6IC0+IEBfc2Nyb2xsRGVsYXlcblxuICAjIyNcbiAgICBTZXRzIHRoZSBob3ZlciBkZWxheS4gVGhlIGRpc2FibGUgaG92ZXIgZnVuY3Rpb24gd2lsbCByZXNwZWN0IGl0XG4gICAgQGV4YW1wbGUgQ2hhbmdpbmcgdGhlIGhvdmVyIGRlbGF5IG1pZC1mbGlnaHQ6XG4gICAgICBzID0gbmV3IFNjcm9sbFByb3h5KClcbiAgICAgICMgSG92ZXIgYW5pbWF0aW9ucyBoYXZlIDI1MG1zIGRlbGF5IG9uIHNjcm9sbCBlbmQgYnkgZGVmYXVsdFxuICAgICAgcy5kaXNhYmxlSG92ZXJPblNjcm9sbCgpXG4gICAgICBzLnNldEhvdmVyRGVsYXkoMzAwKSAjIG5vdyBob3ZlciBkZWxheSBpcyAzMDBtc1xuICAgIEBwYXJhbSBbTnVtYmVyXSBtcyBUaGUgZGVsYXkgaW4gbWlsbGlzZWNvbmRzXG4gICAgQHJldHVybiBbU2Nyb2xsUHJveHldIFRoaXMgaW5zdGFuY2VcbiAgICBAc2luY2UgMC4xLjBcbiAgIyMjXG4gIHNldEhvdmVyRGVsYXk6IChtcykgLT5cbiAgICBpZiBTVXRpbC5pc1Bvc2l0aXZlTnVtYmVyKG1zKVxuICAgICAgQF9ob3ZlckRlbGF5ID0gTWF0aC5yb3VuZChtcylcbiAgICByZXR1cm4gdGhpc1xuXG4gICMjI1xuICAgIFJldHVybnMgdGhlIGN1cnJlbnQgaG92ZXIgZGVsYXlcbiAgICBAZXhhbXBsZSBHZXR0aW5nIHRoZSBjdXJyZW50IGRlbGF5OlxuICAgICAgcyA9IG5ldyBTY3JvbGxQcm94eSgpXG4gICAgICBzLnNldEhvdmVyRGVsYXkoMzAwKSAjIGhvdmVyIGFuaW1hdGlvbnMgbm93IGhhdmUgMzAwbXMgZGVsYXkgb24gc2Nyb2xsIGVuZFxuICAgICAgcy5nZXRIb3ZlckRlbGF5KCkgIyB3aWxsIGJlIDMwMFxuICAgIEByZXR1cm4gW051bWJlcl0gVGhlIGN1cnJlbnQgdmFsdWUgb2YgX2hvdmVyRGVsYXlcbiAgICBAc2luY2UgMC4xLjBcbiAgIyMjXG4gIGdldEhvdmVyRGVsYXk6IC0+IEBfaG92ZXJEZWxheVxuXG4gICMjI1xuICAgIFJldHVybnMgdGhlIGN1cnJlbnQgdGFyZ2V0XG4gICAgQGV4YW1wbGUgR2V0dGluZyB0aGUgY3VycmVudCB0YXJnZXQ6XG4gICAgICBzID0gbmV3IFNjcm9sbFByb3h5KG15RGl2KVxuICAgICAgcy5nZXRUYXJnZXQoKSAjIHdpbGwgZXF1YWwgbXlEaXZcbiAgICBAcmV0dXJuIFtIVE1MRWxlbWVudF0gVGhlIGN1cnJlbnQgdGFyZ2V0XG4gICAgQHNpbmNlIDAuMS4wXG4gICMjI1xuICBnZXRUYXJnZXQ6IC0+IEBfdGFyZ2V0XG5cbiAgIyMjXG4gICAgUmV0dXJucyB0aGUgcmVjdCBmb3IgYW4gSFRNTEVsZW1lbnRcbiAgICBAZXhhbXBsZSBHZXR0aW5nIGJvZHkgZGltZW5zaW9ucyBhbmQgcG9zaXRpb246XG4gICAgICBzID0gbmV3IFNjcm9sbFByb3h5KG15RGl2KVxuICAgICAgcy5nZXRSZWN0KGRvY3VtZW50LmJvZHkpXG4gICAgQHBhcmFtIFtIVE1MRWxlbWVudF0gZWwgVGhlIGVsZW1lbnQgdG8gZ2V0IHRoZSByZWN0IGZyb21cbiAgICBAcmV0dXJuIFtPYmplY3RdIFRoZSByZWN0XG4gICAgQHNpbmNlIDAuMS4wXG4gICMjI1xuICBnZXRSZWN0OiAoZWwpIC0+XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IGVsLm9mZnNldExlZnRcbiAgICAgIHk6IGVsLm9mZnNldFRvcFxuICAgICAgdzogZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGhcbiAgICAgIGg6IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodFxuICAgIH1cblxuICAjIyNcbiAgICBSZWdpc3RlciBldmVudHMgaW4gU2Nyb2xsUHJveHlcbiAgICBAZXhhbXBsZSBSZWdpc3RlcmluZyBhIG5ldyBzY3JvbGwgZXZlbnQgb24gYm9keTpcbiAgICAgIHMgPSBuZXcgU2Nyb2xsUHJveHkoKVxuICAgICAgcy5vbignc2Nyb2xsJywgLT4gJ0F3ZXNvbWUgc2Nyb2xsaW5nIScpXG4gICAgQHBhcmFtIFtTdHJpbmddIGV2dCBUaGUgZXZlbnQgbmFtZSB0byBSZWdpc3RlclxuICAgIEBwYXJhbSBbRnVuY3Rpb25dIGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhbGxiYWNrIG9uY2UgZXZlbnQgaXMgZmlyZWRcbiAgICBAcGFyYW0gW09iamVjdF0gb3B0aW9uIEEgd2lsZGNhcmQgYXJndW1lbnQgdGhhdCBpcyBwYXNzZWQgdG8gdGhlIGV2ZW50XG4gICAgQGV2ZW50IHNjcm9sbCBUaGUgc2Nyb2xsIGV2ZW50IHRoYXQgaXMgZmlyZWQgd2hlbmV2ZXIgb25lIHNjcm9sbHNcbiAgICBAZXZlbnQgb2Zmc2V0WCBUaGUgb2Zmc2V0IGV2ZW50IG9uIHRoZSBYIGF4aXMgdGhhdCBmaXJlcyBvbmNlIG9uZSBzY3JvbGxzXG4gICAgICBwYXN0IHRoZSBnaXZlbiBob3Jpem9udGFsIG9mZnNldFxuICAgIEBldmVudCBvZmZzZXRZIFRoZSBvZmZzZXQgZXZlbnQgb24gdGhlIFkgYXhpcyB0aGF0IGZpcmVzIG9uY2Ugb25lIHNjcm9sbHNcbiAgICAgIHBhc3QgdGhlIGdpdmVuIHZlcnRpY2FsIG9mZnNldFxuICAgIEBldmVudCB0b3AgVGhlIGV2ZW50IHRoYXQgZmlyZXMgb25jZSBvbmUgcmVhY2hlcyB0aGUgdG9wIG9mIHRoZSBzY3JvbGwgYXJlYVxuICAgICAgb3IgdGhlIGdpdmVuIG9mZnNldCB0b3BcbiAgICBAZXZlbnQgYm90dG9tIFRoZSBldmVudCB0aGF0IGZpcmVzIG9uY2Ugb25lIHJlYWNoZXMgdGhlIGJvdHRvbSBvZiB0aGUgc2Nyb2xsXG4gICAgICBhcmVhIG9yIHRoZSBnaXZlbiBvZmZzZXQgYm90dG9tXG4gICAgQGV2ZW50IGxlZnQgVGhlIGV2ZW50IHRoYXQgZmlyZXMgb25jZSBvbmUgcmVhY2hlcyB0aGUgbGVmdCBib3VuZCBvZiB0aGVcbiAgICAgIHNjcm9sbCBhcmVhIG9mIHRoZSBnaXZlbiBvZmZzZXQgbGVmdFxuICAgIEBldmVudCByaWdodCBUaGUgZXZlbnQgdGhhdCBmaXJlcyBvbmNlIG9uZSByZWFjaGVzIHRoZSByaWdodCBib3VuZCBvZiB0aGVcbiAgICAgIHNjcm9sbCBhcmVhIG9mIHRoZSBnaXZlbiBvZmZzZXQgcmlnaHRcbiAgICBAZXZlbnQgdmlzaWJsZSBUaGUgZXZlbnQgdGhhdCBmaXJlcyBvbmNlIHRoZSBnaXZlbiBlbGVtZW50IGlzIHZpc2libGUgb24gdGhlXG4gICAgICBzY3JvbGwgYXJlYVxuICAgIEBldmVudCBpbnZpc2libGUgVGhlIGV2ZW50IHRoYXQgZmlyZXMgb25jZSB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBub3QgdmlzaWJsZVxuICAgICAgb24gdGhlIHNjcm9sbCBhcmVhXG4gICAgQHJldHVybiBbU2Nyb2xsUHJveHldIFRoaXMgaW5zdGFuY2VcbiAgICBAc2luY2UgMC4xLjBcbiAgIyMjXG4gIG9uOiAoZXZ0LCBmdW5jLCBvcHRpb24pIC0+XG4gICAgaWYgbm90IFNVdGlsLmlzVmFsaWRFdmVudE5hbWUoZXZ0KVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICBpZiBub3QgU1V0aWwuaXNGdW5jdGlvbihmdW5jKVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICBzd2l0Y2ggZXZ0XG4gICAgICB3aGVuIFNjcm9sbFByb3h5LlNDUk9MTFxuICAgICAgICBAX2NyZWF0ZVNjcm9sbEV2ZW50KGV2dCwgZnVuYylcbiAgICAgIHdoZW4gU2Nyb2xsUHJveHkuT0ZGU0VUX1gsIFNjcm9sbFByb3h5Lk9GRlNFVF9ZXG4gICAgICAgIEBfY3JlYXRlT2Zmc2V0RXZlbnQoZXZ0LCBmdW5jLCBvcHRpb24pXG4gICAgICB3aGVuIFNjcm9sbFByb3h5LlRPUCwgU2Nyb2xsUHJveHkuQk9UVE9NXG4gICAgICAgIEBfY3JlYXRlVmVydGljYWxCb3VuZFNjcm9sbEV2ZW50KGV2dCwgZnVuYywgb3B0aW9uKVxuICAgICAgd2hlbiBTY3JvbGxQcm94eS5MRUZULCBTY3JvbGxQcm94eS5SSUdIVFxuICAgICAgICBAX2NyZWF0ZUhvcml6b250YWxCb3VuZFNjcm9sbEV2ZW50KGV2dCwgZnVuYywgb3B0aW9uKVxuICAgICAgd2hlbiBTY3JvbGxQcm94eS5WSVNJQkxFLCBTY3JvbGxQcm94eS5JTlZJU0lCTEVcbiAgICAgICAgQF9jcmVhdGVWaXNpYmlsaXR5U2Nyb2xsRXZlbnQoZXZ0LCBmdW5jLCBvcHRpb24pXG4gICAgcmV0dXJuIHRoaXNcblxuICAjIyNcbiAgICBSZWdpc3RlcnMgZXZlbnRzIHdpdGggKipvbioqIGJ1dCBqdXN0IGZpcmUgdGhlIGNhbGxiYWNrIHRoZSBmaXJzdCB0aW1lXG4gICAgQGV4YW1wbGUgUmVnaXN0ZXIgYW4gb25lIHRpbWUgZXZlbnQ6XG4gICAgICBzID0gbmV3IFNjcm9sbFByb3h5KClcbiAgICAgIHMub25jZSgndG9wJywgLT4gJ0kgQU0gT04gVE9QIScpICMgZmlyZXMganVzdCBvbmUgdGltZVxuICAgIEBwYXJhbSBbU3RyaW5nXSBldnQgVGhlIGV2ZW50IG5hbWUgdG8gcmVnaXN0ZXJcbiAgICBAcGFyYW0gW0Z1bmN0aW9uXSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYWxsYmFja1xuICAgIEBwYXJhbSBbT2JqZWN0XSBvcHRpb24gVGhlIHdpbGRjYXJkIGFyZ3VtZW50IHRoYXQgZ29lcyB3aXRoIGV2ZW50c1xuICAgIEByZXR1cm4gW1Njcm9sbFByb3h5XSBUaGlzIGluc3RhbmNlXG4gICMjI1xuICBvbmNlOiAoZXZ0LCBmdW5jLCBvcHRpb24pIC0+XG4gICAgb25lVGltZUZ1bmN0aW9uID0gPT5cbiAgICAgIFNVdGlsLnJlcG9ydENoYW5nZShmdW5jLCB0aGlzLCBAc2Nyb2xsRGF0YSlcbiAgICAgIEBvZmYoZXZ0KVxuICAgIHJldHVybiBAb24oZXZ0LCBvbmVUaW1lRnVuY3Rpb24sIG9wdGlvbilcblxuICAjIyNcbiAgICBSZW1vdmVzIGFsbCBldmVudHMgd2l0aCB0aGUgc3BlY2lmaWVkIGV2ZW50IG5hbWVcbiAgICBAZXhhbXBsZSBSZW1vdmluZyBvbmUgZXZlbnQ6XG4gICAgICBzID0gbmV3IFNjcm9sbFByb3h5KClcbiAgICAgIHMub24oJ3Njcm9sbCcsIC0+ICdGcmVlIHNjcm9sbGluZycpXG4gICAgICBzLm9mZignc2Nyb2xsJykgIyBubyBtb3JlIGZyZWUgc2Nyb2xsaW5nXG4gICAgQHBhcmFtIFtTdHJpbmddIGV2dCBUaGUgZXZlbnQgbmFtZSB0byByZWdpc3RlclxuICAgIEByZXR1cm4gW1Njcm9sbFByb3h5XSBUaGlzIGluc3RhbmNlXG4gICMjI1xuICBvZmY6IChldnQpIC0+XG4gICAgaWYgbm90IFNVdGlsLmlzVmFsaWRFdmVudE5hbWUoZXZ0KSB0aGVuIHJldHVybiB0aGlzXG4gICAgZm9yIGV2ZW50LCBpIGluIEBfZXZlbnRzXG4gICAgICBpZiBldmVudD8gYW5kIGV2dCBpcyBldmVudC50eXBlXG4gICAgICAgIEBfcmVtb3ZlRXZlbnQoZXZlbnQpXG4gICAgcmV0dXJuIHRoaXNcblxuICAjIyNcbiAgICBSZWdpc3RlciB0aGlzIHRhcmdldCBvbiBTY3JvbGxQcm94eSdzICoqX3RhcmdldExpc3QqKlxuICAgIEBleGFtcGxlIFJlZ2lzdGVyaW5nIGEgdGFyZ2V0IChjb25zdHJ1Y3RvciBkb2VzIGl0IGF1dG9tYXRpY2FsbHkpOlxuICAgICAgcyA9IG5ldyBTY3JvbGxQcm94eSgpXG4gICAgICBzLnJlZ2lzdGVyKCkgIyBUaHJvd3MgZXJyb3IgYmVjYXVzZSBjb25zdHJ1Y3RvciBhbHJlYWR5IHJlZ2lzdGVyZWQgaXRcbiAgICBAZXhhbXBsZSBVbnJlZ2lzdGVyaW5nIGZpcnN0IHdpbGwgd29yazpcbiAgICAgIHMgPSBuZXcgU2Nyb2xsUHJveHkoKVxuICAgICAgcy51bnJlZ2lzdGVyKCkgIyBSZW1vdmluZyB0aGUgdGFyZ2V0XG4gICAgICBzLnJlZ2lzdGVyKCkgIyBPSy4gVGFyZ2V0IGFscmVhZHkgcmVtb3ZlZCwgYWRkaW5nIGl0IGFnYWluXG4gICAgQHJldHVybiBbU2Nyb2xsUHJveHldIFRoaXMgaW5zdGFuY2VcbiAgIyMjXG4gIHJlZ2lzdGVyOiAtPlxuICAgIG1hdGNoaW5nVGFyZ2V0ID0gU2Nyb2xsUHJveHkuX2dldEVsZW1lbnQoQF90YXJnZXQpXG4gICAgaWYgbWF0Y2hpbmdUYXJnZXQ/IHRoZW4gdGhyb3cgbmV3IEVycm9yKCdBc3NpZ24gb25lIHByb3h5IHBlciB0YXJnZXQnKVxuICAgIFNjcm9sbFByb3h5Ll90YXJnZXRMaXN0LnB1c2goe3RhcmdldDogQF90YXJnZXQsIHByb3h5OiB0aGlzfSlcbiAgICBTY3JvbGxQcm94eS5hY3RpdmF0ZSgpXG4gICAgcmV0dXJuIHRoaXNcblxuICAjIyNcbiAgICBVbnJlZ2lzdGVyIHRoaXMgdGFyZ2V0IGFuZCByZW1vdmUgaXQgZnJvbSBTY3JvbGxQcm94eSdzICoqX3RhcmdldExpc3QqKlxuICAgIEBleGFtcGxlIFVucmVnaXN0ZXJpbmcgdGFyZ2V0IGNyZWF0ZWQgYXV0b21hdGljYWxseSBieSB0aGUgY29uc3RydWN0b3I6XG4gICAgICBzID0gbmV3IFNjcm9sbFByb3h5KClcbiAgICAgIHMudW5yZWdpc3RlcigpICMgU2Nyb2xsUHJveHkgbm93IGhhcyBubyB0YXJnZXRzLCBzbyBpdCBkZWFjdGl2YXRlc1xuICAgIEByZXR1cm4gW1Njcm9sbFByb3h5XSBUaGlzIGluc3RhbmNlXG4gICMjI1xuICB1bnJlZ2lzdGVyOiAtPlxuICAgIGZvciBpdGVtLCBpIGluIFNjcm9sbFByb3h5Ll90YXJnZXRMaXN0XG4gICAgICBpZiBpdGVtPyBhbmQgaXRlbS50YXJnZXQgaXMgQF90YXJnZXRcbiAgICAgICAgU1V0aWwucmVtb3ZlSXRlbUZyb21BcnJheShTY3JvbGxQcm94eS5fdGFyZ2V0TGlzdCwgaSlcbiAgICBpZiBTY3JvbGxQcm94eS5fdGFyZ2V0TGlzdC5sZW5ndGggaXMgMCB0aGVuIFNjcm9sbFByb3h5LmRlYWN0aXZhdGUoKVxuICAgIHJldHVybiB0aGlzXG5cbiAgIyMjXG4gICAgQ2hlY2tzIGlmIHRoZSBlbGVtZW50IGdpdmVuIGlzIHZpc2libGUgaW4gdGhlIHNjcm9sbCBhcmVhIG9mIHRoZSB0YXJnZXRcbiAgICBAZXhhbXBsZSBDaGVja2luZyBpZiBsaSBpcyB2aXNpYmxlIHdpdGhpbiBwYXJlbnQgdWwncyBzY3JvbGwgYXJlYTpcbiAgICAgIHMgPSBuZXcgU2Nyb2xsUHJveHkodWwpXG4gICAgICBzLmlzRWxlbWVudFZpc2libGUobGkpICMgVmlzaWJsZT8gTWF5IGJlIHRydWUgb3IgZmFsc2VcbiAgICBAcmV0dXJuIFtCb29sZWFuXSBXaGV0aGVyIGl0J3MgdmlzaWJsZSBvciBub3RcbiAgIyMjXG4gIGlzRWxlbWVudFZpc2libGU6IChlbCkgLT5cbiAgICBAX2NoZWNrRWxlbWVudChlbClcbiAgICByZXR1cm4gQF9pc1JlY3RWaXNpYmxlKEBnZXRSZWN0KGVsKSlcblxuICAjIyNcbiAgICBEaXNhYmxlcyBob3ZlciBhbmltYXRpb25zIG9uIHNjcm9sbGluZyB0byBpbXByb3ZlIHNjcm9sbCBwZXJmb3JtYW5jZVxuICAgIEBleGFtcGxlIEl0IG11c3QgYmUgYWN0aXZhdGVkIG1hbnVhbGx5IHRvIGF2b2lkIHVuZXhwZWN0ZWQgYmVoYXZpb3I6XG4gICAgICBzID0gbmV3IFNjcm9sbFByb3h5KCkgIyBkZWZhdWx0cyB0byBkb2N1bWVudC5ib2R5XG4gICAgICBzLmRpc2FibGVIb3Zlck9uU2Nyb2xsKCkgIyBIb3ZlciBhbmltYXRpb25zIGFyZSBub3cgZGlzYWJsZWQgb24gYm9keVxuICAgIEByZXR1cm4gW1Njcm9sbFByb3h5XSBUaGlzIGluc3RhbmNlXG4gICMjI1xuICBkaXNhYmxlSG92ZXJPblNjcm9sbDogLT5cbiAgICBAX2NyZWF0ZVNjcm9sbEV2ZW50KFNjcm9sbFByb3h5LkRJU0FCTEVfSE9WRVIsID0+XG4gICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KEBfaG92ZXJUaW1lb3V0KVxuICAgICAgQF90YXJnZXQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJ1xuICAgICAgQF9ob3ZlclRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dCg9PlxuICAgICAgICBAX3RhcmdldC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ2F1dG8nXG4gICAgICAsIEBnZXRIb3ZlckRlbGF5KCkpXG4gICAgLCAwKVxuICAgIHJldHVybiB0aGlzXG5cbiAgIyMjXG4gICAgUmUtZW5hYmxlcyBob3ZlciBhbmltYXRpb25zIG9uIHNjcm9sbGluZ1xuICAgIEBleGFtcGxlIE9uY2UgaG92ZXIgYW5pbWF0aW9ucyBhcmUgZGlzYWJsZWQsIHlvdSBjYW4gcmUtZW5hYmxlIHdpdGg6XG4gICAgICBzID0gbmV3IFNjcm9sbFByb3h5KCkgIyBkZWZhdWx0cyB0byBkb2N1bWVudC5ib2R5XG4gICAgICBzLmRpc2FibGVIb3Zlck9uU2Nyb2xsKCkgIyBIb3ZlciBhbmltYXRpb25zIG9uIHNjcm9sbGluZyBhcmUgbm93IGRpc2FibGVkXG4gICAgICBzLmVuYWJsZUhvdmVyT25TY3JvbGwoKSAjIEhvdmVyIGFuaW1hdGlvbnMgb24gc2Nyb2xsaW5nIGFyZSBub3cgcmVzdG9yZWRcbiAgICBAcmV0dXJuIFtTY3JvbGxQcm94eV0gVGhpcyBpbnN0YW5jZVxuICAjIyNcbiAgZW5hYmxlSG92ZXJPblNjcm9sbDogLT5cbiAgICBAb2ZmKFNjcm9sbFByb3h5LkRJU0FCTEVfSE9WRVIpXG4gICAgQF90YXJnZXQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdhdXRvJ1xuICAgIHJldHVybiB0aGlzXG4iXX0=
