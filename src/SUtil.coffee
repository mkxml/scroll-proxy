###
  Helper class for ScrollProxy
  @private
  @since 0.1.0
  @author Matheus Kautzmann - <kautzmann5@gmail.com>
###
module.exports = class SUtil

  ###
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
  ###
  @reportChange: (callback, context, args...) ->
    if SUtil.isFunction(callback)
      return callback.apply(context, args)
    return null

  ###
    Reliably gets the JS type of the given variable
    @see http://bonsaiden.github.io/JavaScript-Garden/#types.typeof
    @example Checking a string will return [object String]
      SUtil.getType('hello')
    @example Checking a number will return [object Number]
      SUtil.getType(1)
    @param [Object] target variable to be type tested
    @return [String] The type of the given variable
    @since 0.1.0
  ###
  @getType: (target) -> Object::toString.call(target)

  ###
    Removes an item from an array, changing the array involved and returning
    the element removed
    @example Removing the first element of the array
      SUtil.removeItemFromArray([1, 2], 0)
    @param [Array] arr Array to remove the element from
    @param [Number] idx Index of the element to be removed
    @return [Any] the element removed
    @since 0.1.0
  ###
  @removeItemFromArray: (arr, idx) -> arr.splice(idx, 1)[0]

  ###
    Checks if the suplied variable is a valid JS Function
    @example Checking a valid function will return true
      SUtil.isFunction(-> null)
    @example Checking a number will return false
      SUtil.isFunction(1)
    @param [Function] func Variable to be tested as function
    @return [Boolean] true if function and false if not
    @since 0.1.0
  ###
  @isFunction: (func) -> SUtil.getType(func) is '[object Function]'

  ###
    Checks if the suplied variable is a valid JS Number
    @example Checking a number will return true
      SUtil.isNumber(1)
    @example Checking a bool will return false
      SUtil.isNumber(true)
    @param [Number] number Variable to be tested as number
    @return [Boolean] true if number and false if not
    @since 0.1.0
  ###
  @isNumber: (number) -> SUtil.getType(number) is '[object Number]'

  ###
    Checks if the suplied variable is a valid JS String
    @example Checking a string will return true
      SUtil.isString('hello')
    @example Checking a number will return false
      SUtil.isString(1)
    @param [Number] number Variable to be tested as string
    @return [Boolean] true if string and false if not
    @since 0.1.0
  ###
  @isString: (string) -> SUtil.getType(string) is '[object String]'

  ###
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
  ###
  @isValidEventName: (name) -> SUtil.isString(name) and name isnt ''

  ###
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
  ###
  @isPositiveNumber: (number) -> SUtil.isNumber(number) and number >= 0

  ###
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
  ###
  @isNegativeNumber: (number) -> SUtil.isNumber(number) and number < 0
