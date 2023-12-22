import {createUseStyles } from 'react-jss'
import {forwardRef} from "react"

import cx from "classnames";

const useStyles = createUseStyles((theme) => ({
    container: ({size}) => ({
        margin: [0, "auto"],
        padding: [theme.spacing * 2, theme.spacing * 3],
        maxWidth: size,
        [theme.mediaQueries.s]: {
            padding: [theme.spacing * 2],
        },
    }),
}))

const Container = forwardRef (({size = 1320, children, className, ...rest}, ref)=>{
    const classes = useStyles({size})
    return <div ref={ref} className={cx(classes.container, className)} {...rest}>
        {children}
    </div> 
})

export default Container
