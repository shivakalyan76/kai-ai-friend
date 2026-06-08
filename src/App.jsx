import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Chat from './pages/Chat.jsx'
import { useAppStore } from './store/appStore.js'

function ProtectedChat() {
  const hasProfile = useAppStore((s) => s.profile !== null)
  if (!hasProfile) return <Navigate to="/" replace />
  return <Chat />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/chat" element={<ProtectedChat />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
