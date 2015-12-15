import _ from 'underscore';
import esprima from 'esprima';
import Immutable from 'seamless-immutable';

export class ReduxReducer {
  constructor(){
    this.reducer = _.bind(this.reducer, this);
  }

  reducer(state, action){
    state = Immutable(_.defaults({}, state || {}, this.defaults));
    for(let actionFn of this._actions){
      if(action.type === actionFn.name){
        state = this.beforeAction(state);
        const result = this[action.type].apply(this, this._createParams(state, actionFn, action));
        return Immutable(this.afterAction(_.extend({}, state, result)));
      }
    }
    return state;
  }

  beforeAction(state){
    return state;
  }

  afterAction(state){
    return state;
  }

  _createParams(state, actionFn, actionObj){
    const params = [state];
    for(let param of actionFn.params){
      params.push(actionObj[param]);
    }
    return params;
  }
}


export function action(target, name, descriptor){
  if(!target._actions){
    target._actions = [];
  }
  const functionDeclaration = esprima.parse(descriptor.value.toString()).body[0];
  const paramNames = _.pluck(functionDeclaration.params, 'name');
  const otherArgs = paramNames.slice(1);
  target._actions.push({name, params: otherArgs});
  target.constructor[name] = function(){
    if(arguments.length !== otherArgs.length){
      throw "Incorrect number of arguments";
    }
    const action = {type: name};
    for(let i = 0; i < otherArgs.length; i++){
      action[otherArgs[i]] = arguments[i];
    }
    return action;
  };
}
