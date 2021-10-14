import React from "react";
import "./App.css";
import { MainContextProvider } from "./contexts/MainContext";
import { NoticeContextProvider } from "./contexts/NoticeContext";
import CalendarPage from "./pages/CalendarPage";

function App() {
    return (
        <MainContextProvider>
            <NoticeContextProvider>
                <CalendarPage />
            </NoticeContextProvider>
        </MainContextProvider>
    );
}

export default App;
