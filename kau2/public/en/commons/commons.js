String.prototype.firstToUpper = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
/*
Array.prototype.last = function(){
  return this[this.length - 1];
};
*/

function curry (fn, length, args, holes) {
  length = length || fn.length;
  args = args || [];
  holes = holes || [];
  return function(){
      var _args = args.slice(0),
          _holes = holes.slice(0),
          argStart = _args.length,
          holeStart = _holes.length,
          arg, i;
      for(i = 0; i < arguments.length; i++) {
          arg = arguments[i];
          if(arg === _ && holeStart) {
              holeStart--;
              _holes.push(_holes.shift()); // move hole from beginning to end
          } else if (arg === _) {
              _holes.push(argStart + i); // the position of the hole.
          } else if (holeStart) {
              holeStart--;
              _args.splice(_holes.shift(), 0, arg); // insert arg at index of hole
          } else {
              _args.push(arg);
          }
      }
      if(_args.length < length) {
          return curry.call(this, fn, length, _args, _holes);
      } else {
          return fn.apply(this, _args);
      }
  }
}