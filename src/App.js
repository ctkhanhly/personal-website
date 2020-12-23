import './App.css';
import StyleGan2 from './pages/StyleGan2';
import Home from './pages/Home';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


function App(){
  return (
    <Router>
    <div className="greeting">
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/stylegan2">StyleGan2</Link>
          </li>
        </ul>
      </nav>


      <Switch>
        <Route exact path="/">
          <Home />
          {/* <StyleGan2 /> */}
        </Route>
        <Route path="/stylegan2">
          <StyleGan2 />
        </Route>
        
      </Switch>
      </div>
    </Router>
  )
}


export default App;

// https://www.freecodecamp.org/news/portfolio-app-using-react-618814e35843/
