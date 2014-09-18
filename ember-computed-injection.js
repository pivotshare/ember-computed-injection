/**
 * ember-computed-injection v0.1.0
 * (c) 2014 Jay Phelps
 * MIT Licensed
 * https://github.com/jayphelps/ember-computed-injection
 * @license
 */
(function (Ember) {
  var get = Ember.get,
      computed = Ember.computed,
      Container = Ember.Container;

  computed.injection = function (fullName, options) {
    return computed('container', function () {
      var container = get(this, 'container');
      
      Ember.assert('Ember.computed.injection requires instances to have an instance of Ember.Container at this.container but none was found. You\'re probably manually creating objects? Learn about containers: https://github.com/emberjs/website/pull/1293', container instanceof Container);

      var parsedName = parseName(this._debugContainerKey.split(':')[1], fullName);

      return container.lookup(parsedName.fullName, options);
    }).readOnly()
  };

  function parseName(rootName, fullName) {
    var nameParts = fullName.split(':'),
        type = nameParts[0],
        fullNameWithoutType = nameParts[1];

    var relativeParts = fullNameWithoutType.match(/^\.\.?(\/.+)/);

    if (relativeParts && relativeParts.length >= 2) {
      fullNameWithoutType = absolute(rootName, fullNameWithoutType);
    }

    return {
      fullName: type + ':' + fullNameWithoutType,
      type: type,
      fullNameWithoutType: fullNameWithoutType
    };
  }

  function absolute(base, relative) {
    var stack = base.split('/'),
        parts = relative.split('/');
    
    stack.pop();

    for (var i = 0, l = parts.length; i < l; i++) {
      switch (parts[i]) {
        case '.':
          continue;
          break;
        case '..':
          stack.pop();
          break;
        default:
          stack.push(parts[i]);
      }
    }

    return stack.join('/');
  }

  computed.instance = function (Klass, values) {
    return Ember.computed(function () {
        switch (Klass) {
            case Array:
                return Ember.A();
            case String:
                return '';
            case Number:
                return 0;
        }

        return (typeof Klass.create === 'function') ? Klass.create(values) : new Klass(values);
    }).cacheable();
  };

})(Ember);