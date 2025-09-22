import React from 'react'
import Header from './components/header'
import './App.css'
import Sidebar from './components/sidebar'

const App = () => {
  return (
    <div className='app-container'>
      <Header />
      <Sidebar />
    </div>
  )
}

export default App