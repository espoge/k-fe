import React, { createContext, useCallback, useEffect, useReducer } from 'react'

export const AlertContext = createContext(null)

const SET_ALERT_DATA_ACTION = 'SET_ALERT_DATA'
const SET_VISIBILITY_ACTION = 'SET_VISIBILITY'
const RESET_ALERT_ACTION = 'RESET_ALERT'
const TRIGGER_ALERT_ACTION = 'TRIGGER_ALERT'
const ADD_TOAST = 'ADD_TOAST'
const DELETE_TOAST = 'DELETE_TOAST'

const alertReducer = (state, action) => {
    switch (action.type) {
        case SET_ALERT_DATA_ACTION:
            return {
                ...state,
                data: action.payload.data, // data: { severity: 'success', title: 'my title', description: 'my desc'}
            }
        case SET_VISIBILITY_ACTION:
            return {
                ...state,
                isOpen: action.payload.isOpen,
            }
        case RESET_ALERT_ACTION:
            return {
                ...state,
                isOpen: false,
                data: {},
            }
        case TRIGGER_ALERT_ACTION:
            return {
                ...state,
                isOpen: true,
                data: action.payload,
            }
        case ADD_TOAST:
                return {
                  ...state,
                  toasts: [...state.toasts, action.payload],
                };
        case DELETE_TOAST:
                const updatedToasts = state.toasts.filter(
                  (toast) => toast.id !== action.payload
                );
                return {
                  ...state,
                  toasts: updatedToasts,
                };            
        default:
            return state
    }
}

const AlertProvider = ({ children }) => {
    const initialState = {
        toasts:[]
    }
    const [alert, dispatch] = useReducer(alertReducer, initialState)

    const closeAlert = useCallback(() => {
        dispatch({ type: SET_VISIBILITY_ACTION, payload: { isOpen: false } })
    }, [])

    const showAlert = useCallback(() => {
        dispatch({ type: SET_VISIBILITY_ACTION, payload: { isOpen: true } })
    }, [])

    const setAlertData = useCallback(payload => {
        dispatch({ type: SET_ALERT_DATA_ACTION, payload })
    }, [])

    const triggerAlert = useCallback(payload => {
        dispatch({ type: TRIGGER_ALERT_ACTION, payload })
    }, [])

    const addToast = (type, message) => {
        console.log(type, message)
        const id = Math.floor(Math.random() * 10000000);
        dispatch({ type: "ADD_TOAST", payload: { id, message, type } });
      };
      const success = (message) => {
        addToast("success", message);
      };

      const error = (message) => {
        addToast("error", message);
      };

      const warning = (message) => {
        addToast("warning", message);
      };

      const info = (message) => {
        addToast("info", message);
      };


      const remove = (id) => {
        dispatch({ type: "DELETE_TOAST", payload: id });
      };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            closeAlert()
        }, 5000)
        return () => {
            clearTimeout(timeoutId)
        }
    }, [alert.isOpen])

    return (
        <AlertContext.Provider
            value={{
                dispatchAlert: dispatch,
                isAlertOpen: alert.isOpen,
                alertData: alert,
                closeAlert,
                showAlert,
                setAlertData,
                triggerAlert,
                success,
                error,
                warning,
                info,
                remove
            }}
        >
            {children}
        </AlertContext.Provider>
    )
}

export default AlertProvider
