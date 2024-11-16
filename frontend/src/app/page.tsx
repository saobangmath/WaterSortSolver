'use client';

import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Game from "./game"; 

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <BrowserRouter>
        <Routes>
          <Route path="/puzzle" element={<Game/>}>Craft your own</Route>
          <Route path="/puzzle" element={<Game/>}>Load existing config</Route>
        </Routes>
      </BrowserRouter>
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Home />);