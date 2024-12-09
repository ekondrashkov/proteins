import { Action } from "redux"

declare module "redux" {
  import { ThunkAction } from "redux-thunk"

  /*
   * Overload to add thunk support to Redux's dispatch() function.
   * Useful for react-redux or any other library which could use this type.
   */
  export interface Dispatch<TBasicAction extends Action> {
    <TReturnType, TState, TExtraThunkArg>(
      thunkAction: ThunkAction<
        TReturnType,
        TState,
        TExtraThunkArg,
        TBasicAction
      >,
    ): TReturnType
  }

  /// override bindActionCreators
}
