###
  ScrollProxy class, containing the scrolling related events and API
  @since 0.1.0
  @author Matheus Kautzmann <kautzmann5@gmail.com>
###
module.exports = class ScrollProxy

  @_targetList = []

  _debounceScroll = no

  _debounceTimeout = null

  _debounceFunction: null

  _offsetHandler: null

  # TODO: CHECK IF SCROLL SCHEDULING IMPROVES PERF
  _scrollQueue = []

  _scrollPointer = -1

  _reportChange: (callback, args...) -> callback.apply(this, args)

  _getType: (target) ->
    return Object::toString.call(target)

  _handleScroll: (e) ->
    if _debounceScroll then @_debounceFunction?()

  _debounce: (callback = null, duration = 250) ->
    if @_getType(callback) isnt '[object Function]'
      throw new Error('Please inform a valid callback!')
    @_debounceScroll = yes
    if _getType(duration) is '[object Number]' and duration >= 0
      window.clearTimeout(@_debounceTimeout)
      debounceFunction = =>
        @_debounceTimeout = window.setTimeout(=>
          @_reportChange(callback)
        , Math.round(duration))
      return @_debounceFunction = debounceFunction
    else
      throw new Error("Given duration (#{duration}) is invalid")

  _onOffset: (callback, offset, direction = 'vertical') ->
    if @_getType(eventName) isnt '[object String]' or eventName is ''
      throw new Error('Inform a valid custom event name')
    # FIXME: IMPLEMENT THE REST OF THIS FUNCTION

  constructor: (target) ->
    if target instanceof Document or target instanceof HTMLElement
      @target = target
    else if target instanceof Window
      console.warn('ScrollProxy shouldn\'t be attached to the window object,
                    use document instead')
    else
      throw new Error('ScrollProxy attached to an invalid element or undefined')

    if @_targetInList(target)
      console.log('ScrollProxy already attached to target, ignoring attachment')
      return

    target.addEventListener('scroll', @_handleScroll, true)

    @_targetList.push(target)

  on: ->
    return
    # TODO: FUNCTION THAT IMPLEMENTS THE EVENT HANDLING
  once: ->
    return
    # TODO: SAME AS THE ON FUNCTION BUT FOR ONE TIME ONLY EVENTS
  disableHover: ->
    return
    # TODO: FUNCTION THAT DISABLES HOVER ANIMATIONS WHEN SCROLLING

  enableHover: ->
    return
    # TODO: TO REENABLE HOVER ANIMATIONS

  destroy: ->
    return
    # TODO: DESTROY EVERY LISTENER AND FREE MEMORY
