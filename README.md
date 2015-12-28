# Redux Reducer
A small library for writing redux actions with less boilerplate. 

## Install
```
npm install redux-reducer
```

## Action Declarations

```es6
import {ReduxReducer, action} from 'redux-reducer';

class FooActions extends ReduxReducer {
  name = "foo"
  
  //default state
  defaults = {
    foo: 1,
    bar: 2
  }
  
  //modify the state before an action is called
  beforeAction(state){
    return state;
  }
  
  //modify the state after an action is called
  afterAction(state){
    return state;
  }
  
  @action
  addToBoth(state, a, b){
    return {
      foo: state.foo + a,
      bar: state.bar + b
    };
  }
  
  @action
  addToA(state){
    //the returned object will be merged into the final state
    return {
      foo: 0
    };
  }

}
```

## Setup
```es6
const actions = new FooActions();

const app = combineReducers({
  foo: actions.reducer
});

const store = createStore(app, () => {});
```

## Usage
```es6
 store.dispatch(FooActions.addToBoth(100,500));
```
