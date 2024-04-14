
import "bootstrap/dist/css/bootstrap.min.css"

import { BrowserRouter, Routes, Route } from "react-router-dom"
import  ChatComponent from "./components/chat";
// import ConversationComponent from "./components/ConversationComponents";
import HomePage from "./components/HomePage"
import "./style/app.css"
import Signin from "./components/signin";
import Signup from "./components/signup";



// function HomeComponent() {
//   return (
//     <div className="mainof">
//       <ContactListComponent />
//       <ConversationComponent />
//     </div>
//   );
// }
// function Homes() {
//   return (
//     <div >
//       <HomePage />
//     </div>
//   );
//  }

function App() {
  return (
    
    
    <BrowserRouter>
      <Routes>
        < Route path="/" element={<HomePage />} />
        < Route path="/signin" element={<Signin />} />
        < Route path="/signup" element={<Signup />} />
        < Route path="/chat/:username" element={< ChatComponent />} />
        
      </Routes>
    </BrowserRouter>
    
  )
}

export default App