import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {FloorPage} from "./pages/FloorPage.tsx";
import GeneralContextProvider from "./context/GeneralContextProvider.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import axios from "axios";
import {theme} from "./components/theme/theme.ts";
import CustomAppBar from "./components/appBar/AppBar.tsx";

axios.defaults.baseURL = 'http://localhost:3000'
const queryClient = new QueryClient()



function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <GeneralContextProvider>
            <CssBaseline/>
            <CustomAppBar title={`app name`} />
            <Routes>
              <Route path="/floor/:id" element={<FloorPage/>}/>
              <Route path="/floor" element={<Navigate to="/floor/0"/>}/>
              <Route path="/" element={<Navigate to="/floor/0"/>}/>
            </Routes>
          </GeneralContextProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
