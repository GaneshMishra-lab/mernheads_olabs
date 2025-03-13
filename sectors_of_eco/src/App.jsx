import './App.css'
import EconomicSectorsClassification from './pages/EconomicSectorsClassification'
import Level2 from './pages/Level2'
import SectorSimulation from './pages/SectorSimulation'
import EconomicSectorsGame from './pages/EconomicSectorsGame'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App () {
  return (
    
     <BrowserRouter>
     <Routes>
        <Route path="/" element={<EconomicSectorsClassification />} />
        <Route path="/level2" element={<Level2 />} />
        <Route path="/level3" element={<EconomicSectorsGame />} />
        <Route path="/level4" element={<SectorSimulation />} />
        
     </Routes>
     </BrowserRouter>
    
  )
}

export default App
