import { ThemeProvider } from 'react-jss'
import { RouterProvider } from 'react-router-dom'
import { theme } from './theme'
import AlertProvider from "./context/AlertProvider";
import UserProvider from "./context/UserProvider";
import ToastList from './components/ToastList';
import router from "./routes";
const App = () => {
    return <ThemeProvider theme={theme({ name: 'light' })}>
        <AlertProvider>
            <ToastList />
            <UserProvider>
                <RouterProvider router={router} />
            </UserProvider>
        </AlertProvider>
    </ThemeProvider>
}

export default App
