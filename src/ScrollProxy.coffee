# Require SUtil
SUtil = require('./SUtil')

###
  Main class, containing the scrolling related events and API

  @option _targetList [HTMLElement] target The anchor of the ScrollProxy
    instance
  @option _targetList [ScrollProxy] proxy The instance of ScrollProxy

  @option _events [String] type The event name of the event
  @option _events [Function] fn The function that will handle the callback
  @option _events [Number] timeout The timeout id of the throttled **fn**

  @since 0.1.0
  @author Matheus Kautzmann - <kautzmann5@gmail.com>
###
module.exports = class ScrollProxy
  ###
    @property [Boolean] Class variable that indicates if ScrollProxy is
      currently enabled
  ###
  @active: no

  ###
    @property [Array<Object>] Private Class variable that holds
      all the elements currently tracked by ScrollProxy
  ###
  @_targetList: []

  ###
    @property [String] Class constant that maps to the **scroll** event
      name
  ###
  @SCROLL: 'scroll'

  ###
    @property [String] Class constant that maps to the **offsetX**
      event name
  ###
  @OFFSET_X: 'offsetX'

  ###
    @property [String] Class constant that maps to the **offsetY**
      event name
  ###
  @OFFSET_Y: 'offsetY'

  ###
    @property [String] Class constant that maps to the **top**
      event name
  ###
  @TOP: 'top'

  ###
    @property [String] Class constant that maps to the **bottom**
      event name
  ###
  @BOTTOM: 'bottom'

  ###
    @property [String] Class constant that maps to the **left**
      event name
  ###
  @LEFT: 'left'

  ###
    @property [String] Class constant that maps to the **right**
      event name
  ###
  @RIGHT: 'right'

  ###
    @property [String] Class constant that maps to the **visible**
      event name
  ###
  @VISIBLE: 'visible'

  ###
    @property [String] Class constant that maps to the **invisible**
      event name
  ###
  @INVISIBLE: 'invisible'

  ###
    @property [String] Class constant that maps to the **disable-hover**
      event name
  ###
  @DISABLE_HOVER: 'disable-hover'

  ###
    @property [String] Private instance variable that maps to the
      target's **x** position property
  ###
  _targetX: 'scrollLeft'

  ###
    @property [String] Private instance variable that maps to the
    target's **y** position property
  ###
  _targetY: 'scrollTop'

  ###
    @property [HTMLElement] Private instance variable that indicates the target
      this ScrollProxy's instance is attached to
  ###
  _target: null

  ###
    @property [Array<Object>] Private instance variable that holds the events
      this instance responds to
  ###
  _events: []

  ###
    @property [Number] Private instance variable that holds the
      current delay for scroll throttling
  ###
  _scrollDelay: 250

  ###
    @property [Number] Private instance variable that holds the
      current delay for enabling/disabling hover elements on scroll
  ###
  _hoverDelay: 250

  ###
    @property [Number] Private instance variable that holds the
      current timeout used when blocking hover animations
  ###
  _hoverTimeout: null

  ###
    @property [Number] Instance variable that holds the current x position of
      the scroll target
  ###
  x: 0

  ###
    @property [Number] Instance variable that holds the current y position of
    the scroll target
  ###
  y: 0

  ###
    @property [Number] Instance variable that holds the current width of
      the scroll target box
  ###
  width: 0

  ###
    @property [Number] Instance variable that holds the current height of
      the scroll target box
  ###
  height: 0

  ###
    @property [Number] scrollWidth Instance variable that holds the current
      width of the scroll target scroll area
  ###
  scrollWidth: 0

  ###
    @property [Number] Instance variable that holds the current
      height of the scroll target scroll area
  ###
  scrollHeight: 0

  ###
    @property [Object] Instance variable that holds the current
      scroll data (from last scroll action)
  ###
  scrollData: {}

  ###
    Handles the scroll event when it fires
    @example Simulating the window firing an event passing the metadata:
      window.addEventListener('scroll', ScrollProxy.handleScroll, true)
    @param [Object] e scroll event data
    @return [Object] Null or the element that catched the event
    @since 0.1.0
    @private
  ###
  @_handleScroll: (e) ->
    len = ScrollProxy._targetList.length
    if len is 0 then return null
    # Get the correct target anchor (HTML element)
    target = e.target.body or e.target
    return ScrollProxy._getElement(target)?.proxy._performScroll(e)

  ###
    Retrieves the current target and proxy for the given HTMLElement
    @example Checking if the body tag is on _targetList:
      ScrollProxy._getElement(document.body)
    @param [HTMLElement] el The element to search for in **_targetList**
    @return [Object] Null or the target that matched the argument
    @since 0.1.0
    @private
  ###
  @_getElement: (el) ->
    for item in ScrollProxy._targetList
      if item? and item.target is el
        return item
    return null

  ###
    Activates the ScrollProxy's functionality, registering the event listener
    that will listen for scroll events and proxy it to
    **ScrollProxy.handleScroll**
    @example Activating ScrollProxy manually, it's done automatically with new:
      ScrollProxy.activate()
    @return [Boolean] The current status of ScrollProxy
    @since 0.1.0
  ###
  @activate: ->
    if not ScrollProxy.active
      window.addEventListener(
        ScrollProxy.SCROLL,
        ScrollProxy._handleScroll,
        true
      )
      ScrollProxy.active = yes
    return ScrollProxy.active

  ###
    Deactivates the ScrollProxy's functionality, removing the event listener and
    stopping any functionality
    @example Deactivating manually, it's done automatically when unregistering:
      ScrollProxy.deactivate()
    @return [Boolean] The current status of ScrollProxy
    @since 0.1.0
  ###
  @deactivate: ->
    window.removeEventListener(
      ScrollProxy.SCROLL,
      ScrollProxy._handleScroll,
      true
    )
    return ScrollProxy.active = no

  ###
    Cleans the **_targetList**, removing all targets
    @example To assure ScrollProxy is shut down you could run **clean**:
      ScrollProxy.clean()
    @return [Array] Targets removed
    @since 0.1.0
  ###
  @clean: ->
    ScrollProxy.deactivate()
    return ScrollProxy._targetList = []

  ###
    Update this instance rect information, updating x and y positions as well as
    width, height, scrollWidth and scrollHeight
    @example Most methods run this function when up-to-date data is required:
      s = new ScrollProxy()
      document.body.scrollTop = 20 # s.y continues 0
      s.updateViewportInfo() # s.y is 20 now
    @return [Null] Nothing useful is returned
    @since 0.1.0
    @private
  ###
  _updateViewportInfo: ->
    @x = @_target[@_targetX]
    @y = @_target[@_targetY]
    @width = @_target.offsetWidth
    @height = @_target.offsetHeight
    @scrollWidth = @_target.scrollWidth
    @scrollHeight = @_target.scrollHeight
    return null

  ###
    Utility method that Throws error if element given is not child of the
    **_target**
    @example Checking a list item inside a ul:
      s = new ScrollProxy(ul)
      s._checkElement(li) # does not throw anything, so OK
    @param [HTMLElement] el The element to check
    @return [Null] Nothing useful is returned
    @since 0.1.0
    @private
  ###
  _checkElement: (el) ->
    if el not in @_target.children
      throw new Error('Element must be child of the scroll element')
    return null

  ###
    Remove an event from the list of events
    @example Don't want to receive scroll feedback anymore:
      s = new ScrollProxy()
      evt = s._createEvent('scroll', -> null)
      s._removeEvent(evt) # OK, event gone
    @param [Object] The event to remove
    @return [Array] The new array of events (**_events**)
    @since 0.1.0
    @private
  ###
  _removeEvent: (event) ->
    for item, i in @_events
      if event is item
        window.clearTimeout(event.timeout)
        delete event.fn
        delete @_events[i]
        break
    arr = []
    arr.push(item) for item in @_events when item?
    return @_events = arr

  ###
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
  ###
  _isRectVisible: (rect) ->
    @_updateViewportInfo()
    xVisible = @x < (rect.x + rect.w) and @x > (rect.x - @width)
    yVisible = @y < (rect.y + rect.h) and @y > (rect.y - @height)
    return xVisible and yVisible

  ###
    Performs the scroll actions, firing the needed events internally
    @example The **_handleScroll** usually calls this method:
      s = new ScrollProxy()
      s._performScroll(scrollEvt) # OK, related events will be fired
    @param [Object] The scroll data passed with the event
    @return [HTMLElement] The current target
    @since 0.1.0
    @private
  ###
  _performScroll: (e) ->
    len = @_events.length
    if len is 0 then return null
    @scrollData = e
    event.fn.call(this, event) for event in @_events
    return @_target

  ###
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
  ###
  _throttleScroll: (func, delay) ->
    running = no
    return (data) =>
      if running then return
      running = yes
      data.timeout = window.setTimeout(=>
        running = no
        return SUtil.reportChange(func, this, @scrollData)
      , (if delay? then delay else @getScrollDelay()))

  ###
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
  ###
  _createEvent: (evt, callback, delay) ->
    fn = @_throttleScroll(callback, delay)
    return @_events.push({type: evt, fn: fn.bind(this), timeout: null})

  ###
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
  ###
  _createScrollEvent: (evt, callback, delay) ->
    return @_createEvent(evt, =>
      @_updateViewportInfo()
      return SUtil.reportChange(callback, this, @scrollData)
    , delay)

  ###
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
  ###
  _createOffsetEvent: (evt, callback, offset = 0) ->
    if evt is ScrollProxy.OFFSET_X
      return @_createEvent(evt, =>
        if @x is @_target[@_targetX]
          return @_updateViewportInfo()
        else
          @_updateViewportInfo()
        if SUtil.isPositiveNumber(offset) and @x < offset then return
        if SUtil.isNegativeNumber(offset) and @x > Math.abs(offset) then return
        return SUtil.reportChange(callback, this, @scrollData)
      )
    else
      return @_createEvent(evt, =>
        if @y is @_target[@_targetY]
          return @_updateViewportInfo()
        else
          @_updateViewportInfo()
        if SUtil.isPositiveNumber(offset) and @y < offset then return
        if SUtil.isNegativeNumber(offset) and @y > Math.abs(offset) then return
        return SUtil.reportChange(callback, this, @scrollData)
      )

  ###
    Creates a event to check for horizontal bound collision
    @example Create horizontal bound event with callback and optional offset:
      s = new ScrollProxy()
      s._createHorizontalBoundEvent('left', -> null)
      # One can also check with a offset inwards, useful for infinite scrolling
      s._createHorizontalBoundEvent('left', -> null, 250) # fire 250px to left
    @param [String] evt The event name to register, **left** or **right**
    @param [Function] callback the function to be called when event is fired
    @param [Number] offset Offset to check for (0 is defaut)
    @return [Object] The event just registered
    @since 0.1.0
    @private
  ###
  _createHorizontalBoundScrollEvent: (evt, callback, offset = 0) ->
    if evt is ScrollProxy.LEFT
      return @_createScrollEvent(evt, =>
        if @x <= Math.abs(offset)
          return SUtil.reportChange(callback, this, @scrollData)
      , 0)
    else
      return @_createScrollEvent(evt, =>
        if (@scrollWidth - @x) - @width <= Math.abs(offset)
          return SUtil.reportChange(callback, this, @scrollData)
      , 0)

  ###
    Creates a event to check for vertical bound collision
    @example Create vertical bound event with callback and optional offset:
      s = new ScrollProxy()
      s._createVerticalBoundEvent('top', -> null)
      # One can also check with a offset inwards, useful for infinite scrolling
      s._createVerticalBoundEvent('top', -> null, 250) # fire 250px to top
    @param [String] evt The event name to register, **top** or **bottom**
    @param [Function] callback the function to be called when event is fired
    @param [Number] offset Offset to check for
    @return [Object] The event just registered
    @since 0.1.0
    @private
  ###
  _createVerticalBoundScrollEvent: (evt, callback, offset = 0) ->
    if evt is ScrollProxy.TOP
      return @_createScrollEvent(evt, =>
        if @y <= Math.abs(offset)
          return SUtil.reportChange(callback, this, @scrollData)
      , 0)
    else
      return @_createScrollEvent(evt, =>
        if (@scrollHeight - @y) - @height <= Math.abs(offset)
          return SUtil.reportChange(callback, this, @scrollData)
      , 0)

  ###
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
  ###
  _createVisibilityScrollEvent: (evt, callback, el) ->
    @_checkElement(el)
    if evt is ScrollProxy.VISIBLE
      return @_createScrollEvent(evt, =>
        if @isElementVisible(el)
          return SUtil.reportChange(callback, this, @scrollData)
      )
    else
      return @_createScrollEvent(evt, =>
        if not @isElementVisible(el)
          return SUtil.reportChange(callback, this, @scrollData)
      )

  ###
    The ScrollProxy constructor, use it to create new instances
    @example Create a new ScrollProxy instance:
      # Creating a instance in the document.body
      s = new ScrollProxy() # it defaults to document.body
      # Creating on a div
      s = new ScrollProxy(myDiv) # or any HTMLEment
      # Creating on window
      s = new ScrollProxy(window) # Remaps to window.document.body
    @param [HTMLElement] target The element to attach ScrollProxy
    @return [ScrollProxy] This instance
    @since 0.1.0
  ###
  constructor: (target = document) ->
    if target is document
      target = target.body
    if target is window
      target = target.document.body
    if target instanceof HTMLElement
      @_target = target
    else
      throw new Error('Could not attach to a valid anchor')
    @_events = []
    @register()
    @_updateViewportInfo()
    return this

  ###
    Sets the scroll delay, any event registered will respect the new value
    @example Changing the scroll delay mid-flight:
      s = new ScrollProxy()
      # Any call will the throttled with 250ms
      s.on('scroll', -> null) # defaults to 250ms delay
      s.setScrollDelay(300) # any call now throttles with 300ms
    @param [Number] ms The delay in milliseconds
    @return [ScrollProxy] This instance
    @since 0.1.0
  ###
  setScrollDelay: (ms) ->
    if SUtil.isPositiveNumber(ms)
      @_scrollDelay = Math.round(ms)
    return this

  ###
    Returns the current scroll delay
    @example Getting the current delay:
      s = new ScrollProxy()
      s.setScrollDelay(300) # any call now throttles with 300ms
      s.getScrollDelay() # will be 300
    @return [Number] The current value of _scrollDelay
    @since 0.1.0
  ###
  getScrollDelay: -> @_scrollDelay

  ###
    Sets the hover delay. The disable hover function will respect it
    @example Changing the hover delay mid-flight:
      s = new ScrollProxy()
      # Hover animations have 250ms delay on scroll end by default
      s.disableHoverOnScroll()
      s.setHoverDelay(300) # now hover delay is 300ms
    @param [Number] ms The delay in milliseconds
    @return [ScrollProxy] This instance
    @since 0.1.0
  ###
  setHoverDelay: (ms) ->
    if SUtil.isPositiveNumber(ms)
      @_hoverDelay = Math.round(ms)
    return this

  ###
    Returns the current hover delay
    @example Getting the current delay:
      s = new ScrollProxy()
      s.setHoverDelay(300) # hover animations now have 300ms delay on scroll end
      s.getHoverDelay() # will be 300
    @return [Number] The current value of _hoverDelay
    @since 0.1.0
  ###
  getHoverDelay: -> @_hoverDelay

  ###
    Returns the current target
    @example Getting the current target:
      s = new ScrollProxy(myDiv)
      s.getTarget() # will equal myDiv
    @return [HTMLElement] The current target
    @since 0.1.0
  ###
  getTarget: -> @_target

  ###
    Returns the rect for an HTMLElement
    @example Getting body dimensions and position:
      s = new ScrollProxy(myDiv)
      s.getRect(document.body)
    @param [HTMLElement] el The element to get the rect from
    @return [Object] The rect
    @since 0.1.0
  ###
  getRect: (el) ->
    return {
      x: el.offsetLeft
      y: el.offsetTop
      w: el.getBoundingClientRect().width
      h: el.getBoundingClientRect().height
    }

  ###
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
  ###
  on: (evt, func, option) ->
    if not SUtil.isValidEventName(evt)
      return this
    if not SUtil.isFunction(func)
      return this
    switch evt
      when ScrollProxy.SCROLL
        @_createScrollEvent(evt, func)
      when ScrollProxy.OFFSET_X, ScrollProxy.OFFSET_Y
        @_createOffsetEvent(evt, func, option)
      when ScrollProxy.TOP, ScrollProxy.BOTTOM
        @_createVerticalBoundScrollEvent(evt, func, option)
      when ScrollProxy.LEFT, ScrollProxy.RIGHT
        @_createHorizontalBoundScrollEvent(evt, func, option)
      when ScrollProxy.VISIBLE, ScrollProxy.INVISIBLE
        @_createVisibilityScrollEvent(evt, func, option)
    return this

  ###
    Registers events with **on** but just fire the callback the first time
    @example Register an one time event:
      s = new ScrollProxy()
      s.once('top', -> 'I AM ON TOP!') # fires just one time
    @param [String] evt The event name to register
    @param [Function] func The function to callback
    @param [Object] option The wildcard argument that goes with events
    @return [ScrollProxy] This instance
  ###
  once: (evt, func, option) ->
    oneTimeFunction = =>
      SUtil.reportChange(func, this, @scrollData)
      @off(evt)
    return @on(evt, oneTimeFunction, option)

  ###
    Removes all events with the specified event name
    @example Removing one event:
      s = new ScrollProxy()
      s.on('scroll', -> 'Free scrolling')
      s.off('scroll') # no more free scrolling
    @param [String] evt The event name to register
    @return [ScrollProxy] This instance
  ###
  off: (evt) ->
    if not SUtil.isValidEventName(evt) then return this
    for event, i in @_events
      if event? and evt is event.type
        @_removeEvent(event)
    return this

  ###
    Register this target on ScrollProxy's **_targetList**
    @example Registering a target (constructor does it automatically):
      s = new ScrollProxy()
      s.register() # Throws error because constructor already registered it
    @example Unregistering first will work:
      s = new ScrollProxy()
      s.unregister() # Removing the target
      s.register() # OK. Target already removed, adding it again
    @return [ScrollProxy] This instance
  ###
  register: ->
    matchingTarget = ScrollProxy._getElement(@_target)
    if matchingTarget? then throw new Error('Assign one proxy per target')
    ScrollProxy._targetList.push({target: @_target, proxy: this})
    ScrollProxy.activate()
    return this

  ###
    Unregister this target and remove it from ScrollProxy's **_targetList**
    @example Unregistering target created automatically by the constructor:
      s = new ScrollProxy()
      s.unregister() # ScrollProxy now has no targets, so it deactivates
    @return [ScrollProxy] This instance
  ###
  unregister: ->
    idx = ScrollProxy._targetList.length
    if idx > 0
      # Reverse loop here to avoid messing with the length cache
      while idx--
        if ScrollProxy._targetList[idx].proxy is this
          SUtil.removeItemFromArray(ScrollProxy._targetList, idx)
          break
    if ScrollProxy._targetList.length is 0 then ScrollProxy.deactivate()
    return this

  ###
    Checks if the element given is visible in the scroll area of the target
    @example Checking if li is visible within parent ul's scroll area:
      s = new ScrollProxy(ul)
      s.isElementVisible(li) # Visible? May be true or false
    @return [Boolean] Whether it's visible or not
  ###
  isElementVisible: (el) ->
    @_checkElement(el)
    return @_isRectVisible(@getRect(el))

  ###
    Disables hover animations on scrolling to improve scroll performance
    @example It must be activated manually to avoid unexpected behavior:
      s = new ScrollProxy() # defaults to document.body
      s.disableHoverOnScroll() # Hover animations are now disabled on body
    @return [ScrollProxy] This instance
  ###
  disableHoverOnScroll: ->
    @_createScrollEvent(ScrollProxy.DISABLE_HOVER, =>
      window.clearTimeout(@_hoverTimeout)
      @_target.style.pointerEvents = 'none'
      @_hoverTimeout = window.setTimeout(=>
        @_target.style.pointerEvents = 'auto'
      , @getHoverDelay())
    , 0)
    return this

  ###
    Re-enables hover animations on scrolling
    @example Once hover animations are disabled, you can re-enable with:
      s = new ScrollProxy() # defaults to document.body
      s.disableHoverOnScroll() # Hover animations on scrolling are now disabled
      s.enableHoverOnScroll() # Hover animations on scrolling are now restored
    @return [ScrollProxy] This instance
  ###
  enableHoverOnScroll: ->
    @off(ScrollProxy.DISABLE_HOVER)
    @_target.style.pointerEvents = 'auto'
    return this
