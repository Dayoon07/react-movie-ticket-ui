import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import MovieList from "./pages/MovieList";
import ReservationTicket from "./pages/ReservationTicket";
import Refund from "./pages/Refund";
import SeatSelect from "./pages/SeatSelect";

import NotFound from "./pages/NotFound";
import AiChatPage from "./pages/AiChatPage";

export default function App() {
    return (
        <div>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <header>
                    <Header />      
                </header>
                <main className="max-w-6xl mx-auto">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/movie-list" element={<MovieList />} />
                        <Route path="/reservation-ticket-print" element={<ReservationTicket />} />
                        <Route path="/refund" element={<Refund />} />
                        <Route path="/seat-select" element={<SeatSelect />} />
                        <Route path="/ai/chat" element={<AiChatPage />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </BrowserRouter>
        </div>
    );
}
