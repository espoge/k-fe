import {createUseStyles} from "react-jss";
import cx from "classnames";
import { useContext, useState } from 'react';
import { AlertContext } from '../context/AlertProvider.js';
import { set } from "react-hook-form";

const toastType={
    error: {bg:'#CD2B31', color:'#fff'},  
    success:{bg:'#28a745', color:'#fff'},
    warning: {bg:'#ffc107', text:'#000'}, 
    info: {bg:' #17a2b8', text:'#fff'}

}

const useStyles = createUseStyles(() => ({
    closeBtn: {
        position: 'absolute',
        right: '3%',
        top:'5%',
        cursor: 'pointer'
    },
    toast: ({type}) => ({
         width: '20rem',
         padding: '.8rem',
         borderRadius: '10px',
         transition: 'right .5s ease-in-out',
         borderRadius: '10px',
         background: toastType[type].bg,
         color: toastType[type].color,
         marginTop: '10px',
         position: 'relative',
    }),
    toastIn: {
      animation: '$toast-in 0.6s ease-in-out forwards;'

    },
    toastOut: {
      animation: '$toast-out 0.6s ease-in-out forwards'
    },

'@keyframes toast-in': {
        from: {
          opacity: '0',
          transform: 'translateX(100%)'
        },
        to: {
          opacity: '1',
          transform: 'translateX(0)'
        }
      },

      '@keyframes toast-out': {
        from: {
          opacity: '1',
          transform: 'translateX(0%)'
        },
        to: {
          opacity: '0',
          transform: 'translateX(100%)'
        }
      }


}))


const Toast = ({id, message, type, timeOut}) => { 
        const {remove} = useContext(AlertContext)
        const [discard, setDiscard] = useState(false)

        const classes = useStyles({type});

      const closeToast = (id) => {
        setDiscard(true)
        setTimeout(()=> remove(id), 400)
      }

      setTimeout(() => {
        setDiscard(true)
        setTimeout(()=>remove(id), timeOut+100)
      }, timeOut)
      

     return <div className={`${cx(classes.toast)} ${discard ? classes.toastOut : classes.toastIn}`}>
        {message} 
        <button className={classes.closeBtn} onClick={()=>closeToast(id)}>x</button>
     </div>

}


export default Toast