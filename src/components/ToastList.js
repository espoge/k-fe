import {createUseStyles} from "react-jss";
import cx from "classnames";
import { useContext } from 'react';
import { AlertContext } from '../context/AlertProvider.js';
import Toast from './Toast'

const useStyles = createUseStyles(() => ({
    toastContainer: {
        display: 'flex',
        flexDirection: 'column-reverse',
        position: 'fixed',
        zIndex: '9999',
        top: '16px',
        right: '16px',
        
    }
}))


const ToastList = () => { 
    const {alertData,closeAlert} = useContext(AlertContext)
    const classes = useStyles();
     return <div className={cx(classes.toastContainer)}>
       {alertData.toasts.map(toast=> <Toast key={toast.id} {...toast} timeOut={alertData.toasts.length > 2 ? 3000 : 5000}/>)}
     </div>

}


export default ToastList