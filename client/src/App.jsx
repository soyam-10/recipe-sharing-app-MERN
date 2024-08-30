import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import { Toaster } from "sonner";
import Navbar from "./components/navbar";
import Login from "./components/login";
import Footer from "./components/footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext } from "react";

export const AppContext = createContext();

function App() {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      },
    },
  });
  return (
    <>
      <QueryClientProvider client={client}>
        <AppContext.Provider value={{}}>
          <Toaster position="top-center" />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <Footer />
        </AppContext.Provider>
      </QueryClientProvider>
    </>
  );
}

export default App;
