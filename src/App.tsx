import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {Floor} from "./pages/Floor.tsx";
import GeneralContextProvider from "./context/GeneralContextProvider.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:3000'
const queryClient = new QueryClient()

const theme = createTheme({
        colorSchemes: {
            dark: true,
            light: true
        }
    }
);

function App() {
    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <CssBaseline/>
                <GeneralContextProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/floor/:id" element={<Floor/>}/>
                            <Route path="/floor" element={<Navigate to="/floor/0"/>}/>
                            <Route path="/" element={<Navigate to="/floor/0"/>}/>
                        </Routes>
                    </BrowserRouter>
                </GeneralContextProvider>
            </QueryClientProvider>
        </ThemeProvider>
    )
}

export default App
