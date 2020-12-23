// import './main.css';
import StyleGan from '../../components/Stylegan';


function StyleGanPage() {
  return (
    
    <div className="background" style={{'color':'black'}}>
      
      <div style={{height:'10vh'}}></div>
      {/* <Greeting text={instruction1}/> */}
      <StyleGan/>
      <div style={{height:'10vh'}}></div>

    </div>
    
  );
}

export default StyleGanPage;

// https://www.freecodecamp.org/news/portfolio-app-using-react-618814e35843/
