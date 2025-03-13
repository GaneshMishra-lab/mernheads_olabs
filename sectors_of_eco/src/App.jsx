import './App.css'
import EconomicSectorsClassification from './pages/EconomicSectorsClassification'
import Level2 from './pages/Level2'
import SectorSimulation from './pages/SectorSimulation'
import EconomicSectorsGame from './pages/EconomicSectorsGame'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import EconomicSectors from './pages/Info'
import EconomicIntro from './pages/Entrypage'

function App () {
  return (
    
     <BrowserRouter>
     <Routes>
        <Route path="/level1" element={<EconomicSectorsClassification />} />
        <Route path="/level2" element={<Level2 />} />
        <Route path="/level3" element={<EconomicSectorsGame />} />
        <Route path="/level4" element={<SectorSimulation />} />
        <Route path="/info" element={<EconomicSectors />} />
        <Route path="/" element={<EconomicIntro />} />
        
     </Routes>
     </BrowserRouter>
    
  )
}

export default App
