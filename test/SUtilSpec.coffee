SUtil = require('../src/SUtil')
expect = require('chai').expect
sinon = require('sinon')

describe('SUtil', ->
  describe('when calling back', ->
    it('it should call the functions passed to it', ->
      callback = sinon.spy()
      SUtil.reportChange(callback, this)
      expect(callback.called).to.be.true
    )

    it('it return null if it does not receive a function', ->
      result = SUtil.reportChange(1, this)
      expect(result).to.be.null
    )
  )

  describe('when testing for valid event names', ->
    it('should assert when asking for "test"', ->
      result = SUtil.isValidEventName('test')
      expect(result).to.be.true
    )

    it('should refuse when asking for 1', ->
      result = SUtil.isValidEventName(1)
      expect(result).to.be.false
    )

    it('should refuse when asking for empty strings', ->
      result = SUtil.isValidEventName('')
      expect(result).to.be.false
    )
  )

  describe('when testing for numbers', ->
    it('should assert when asking for 1', ->
      result = SUtil.isNumber(1)
      expect(result).to.be.true
    )

    it('should refuse when asking for "1"', ->
      result = SUtil.isNumber('1')
      expect(result).to.be.false
    )
  )

  describe('when testing for positive numbers', ->
    it('should assert when asking for 1', ->
      result = SUtil.isPositiveNumber(1)
      expect(result).to.be.true
    )

    it('should assert when asking for 0', ->
      result = SUtil.isPositiveNumber(0)
      expect(result).to.be.true
    )

    it('should refuse when asking for -1', ->
      result = SUtil.isPositiveNumber(-1)
      expect(result).to.be.false
    )
  )

  describe('when testing for negative numbers', ->
    it('should assert when asking for -1', ->
      result = SUtil.isNegativeNumber(-1)
      expect(result).to.be.true
    )

    it('should refuse when asking for 0', ->
      result = SUtil.isNegativeNumber(0)
      expect(result).to.be.false
    )

    it('should refuse when asking for 1', ->
      result = SUtil.isNegativeNumber(1)
      expect(result).to.be.false
    )
  )

  describe('when removing an item from an array', ->
    it('should remove be able to remove items', ->
      arr = [1, 2, 3]
      SUtil.removeItemFromArray(arr, 0)
      expect(arr).to.eql([2, 3])
    )

    it('should return the item removed', ->
      arr = [1, 2, 3]
      result = SUtil.removeItemFromArray(arr, 0)
      expect(result).to.eql(1)
    )
  )
)
