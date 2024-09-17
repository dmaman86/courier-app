
interface State {
    toggle: boolean;
    show: string;
    isLoggingOut: boolean;
    showAlertDialog: boolean;
  }
  
  export const initialState: State = {
    toggle: false,
    show: '',
    isLoggingOut: false,
    showAlertDialog: false
  };
  
  type Action = 
  | { type: 'TOGGLE_MENU' } 
  | { type: 'START_LOGOUT' } 
  | { type: 'CANCEL_LOGOUT' } 
  | { type: 'SHOW_ALERT_DIALOG' };
  
  export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case 'TOGGLE_MENU':
        return { ...state, toggle: !state.toggle, show: !state.toggle ? 'show' : '' };
      case 'START_LOGOUT':
        return { ...state, isLoggingOut: true };
      case 'CANCEL_LOGOUT':
        return { ...state, showAlertDialog: false, isLoggingOut: false };
      case 'SHOW_ALERT_DIALOG':
        return { ...state, showAlertDialog: true };
      default:
        return state;
    }
  };