import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from './components/Particles';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
//  https://samples.clarifai.com/face-det.jpg

const initialState = {
  input: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }


  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = JSON.parse(data).outputs[0].data.regions[0]
     .region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
    
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
    
  }


  onButtonSubmit = () => {
    
    const USER_ID = 'whitestjake';
    const PAT = '0b72755c9efe41b7a648297728c7bbd6';
    const APP_ID = 'face-detection';
    const MODEL_ID = 'face-detection';  
    const URL_INPUT = this.state.input


    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": URL_INPUT
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: 'Key ' + PAT
        },
        body: raw
    };

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions )
        .then(response => response.text())
        .then(result => { 
          if (result) {
            fetch("http://localhost:3690/image", {
              method: "put",
              headers: {"Content-Type" : "application/json"},
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, {entries: count}))
            })
          } 
          this.displayFaceBox(this.calculateFaceLocation(result))})
        .catch(error => console.log('error', error));
    
  };

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }


  render() { 
    const { isSignedIn, route, box, input } = this.state;
    return (
      <div className="App">
        <Particles />             
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home' 
          ? <div> 
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit} 
              />
              <FaceRecognition box={box} imageUrl={input} />
          </div>
        : (
            this.state.route === 'signin' 
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          ) 
        }
      </div>
    );
  };
}



export default App;
