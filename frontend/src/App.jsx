import {BrowserRouter as Router, Routes, Route} from 'react-router-dom' 
import HomePage from './pages/HomePage'
import ArtistDetailPage from './pages/ArtistDetailPage'


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/artist/:name/:spotify_id' element={<ArtistDetailPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
