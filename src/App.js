import "./App.css";
import SnackbarProvider from 'react-simple-snackbar'
import AppRouter from "./components/AppRouter";

function App() {
  return (
    <SnackbarProvider>
      <AppRouter />
    </SnackbarProvider>
  );
}

export default App;
