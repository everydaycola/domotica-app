import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {Verdieping} from "./pages/Verdieping.tsx";
import GenralContextProvider from "./context/GeneralContextProvider.tsx";

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
            <CssBaseline/>
            <GenralContextProvider>
                <BrowserRouter>

                    <Routes>
                        <Route path="/verdieping/:id" element={<Verdieping/>}/>
                        <Route path="/verdieping" element={<Navigate to="/verdieping/1"/>}/>
                        <Route path="/" element={<Navigate to="/verdieping/1"/>}/>
                    </Routes>
                </BrowserRouter>
        </GenralContextProvider>
        </ThemeProvider>
    )
}

export default App
