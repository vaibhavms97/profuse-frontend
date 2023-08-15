import { ThemeProvider } from "@mui/material/styles";
import theme from "./muiTheme/customTheme";
import "material-react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "material-react-toastify";
import AppRoutes from "./routing/AppRoutes";


function App() {
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <AppRoutes /> 
    </ThemeProvider>
  );
}

export default App;
