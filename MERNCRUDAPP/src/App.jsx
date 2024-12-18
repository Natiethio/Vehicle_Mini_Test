import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Addvehicle from './Components/Addvehicle/AddVehicle'
import Protected from './Components/Protected/Protected'
import Dashboard from './Components/Dashboard/Dashboard';
import UpdateVehicle from './Components/Updatevehicle/UpdateVehicle';
import Nomatch from './Components/Nomatch/Nomatch';
import ReduxCount from './Components/TestCountRedux/ReduxCount';

function App() { 
  return (
           <Router>
              <Routes>
                 <Route path="/" element= {<Dashboard/>} />
                 {/* <Route path='/Admin' element={<Admin/>}/> */}
                 <Route path="/add_vehicle" element={<Addvehicle/>}/>
                 <Route path="/count" element={<ReduxCount/>}/>
                 <Route path="/updatevehicle/:id" element= {<UpdateVehicle/>}/>
                 {/* <Route path="/Register" element={<Register/>}/>
                 <Route path="/Login" element={<Login/>}/> */}
                 <Route path="*" element= {<Nomatch/>}/>
              </Routes>
           </Router>
  )
}

export default App
