import React, { Component } from 'react';
import * as firebase from 'firebase';
import User from './components/User';
import Header from './components/Header';
import RoomList from './components/RoomList';
import './App.css';
  // Initialize Firebase
var config = {
  apiKey: "AIzaSyCyXk8LmEImNZmfsnD2ywkm4y7IA3w-zbo",
  authDomain: "bloc-chat-react-a63b3.firebaseapp.com",
  databaseURL: "https://bloc-chat-react-a63b3.firebaseio.com",
  projectId: "bloc-chat-react-a63b3",
  storageBucket: "bloc-chat-react-a63b3.appspot.com",
  messagingSenderId: "732247865297"
};
firebase.initializeApp(config);

class App extends Component {

  constructor(props) {
    super(props);
    this.state={
      displayName: 'Guest',
      email: null,
      profilePicture : '',
      currentUserId: null,
      signInModalActive : true
    };
    this.blocUserRef = firebase.database().ref('BlocUser');
  }
  /**@desc setUser in to firebase*/
  setUser(displayname, email, photoURL, uid) {
    console.log(displayname+' and '+email+uid);
    this.blocUserRef.push({
      displayName: displayname,
      emailVerified: email,
      profilePicture: photoURL,
      currentUserId: uid
    });
    this.setState({
      displayName : displayname,
      email: email,
      profilePicture: photoURL
    });
  }
  getUID(uid) {
    console.log("Recieved UID");
    this.blocUserRef.orderByChild('currentUserId').on('child_added', snapshot=>{
      if (uid === snapshot.val().uid) {
        let getDisplayName = snapshot.val().displayName;
        let getUserEmail = snapshot.val().emailVerified;
        let getPhotoURL = snapshot.val().profilePicture;
        this.setState({
          displayName : getDisplayName,
          email: getUserEmail,
          profilePicture: getPhotoURL,
          currentUserId: uid
        });
      }
    });
  }
  handlePageState(boolean) {
    this.setState({signInModalActive : boolean});
  }
  render() {
    const firebaseData = firebase;
    const bgImage = {backgroundImage:'url(/assets/user-bg01_blur.jpg)'}
    return (
      <div className="App">
        <div className={this.state.signInModalActive? 'modal-opened':'hidden'} style={bgImage}>
          <User
            firebase={firebaseData}
            setUser={(displayname, email, photoURL, uid) => this.setUser(displayname, email, photoURL, uid)}
            getUID={(uid)=>this.getUID(uid)}
            handlePageState={(boolean)=>this.handlePageState(boolean)}
          />
        </div>
        <div className={this.state.signInModalActive? 'hidden':'app-redndered'}>
          <Header
            firebase={firebaseData}
            displayName={this.state.displayName}
            profilePicture={this.state.profilePicture}
          />
          <RoomList
            firebase={firebaseData}
            displayName={this.state.displayName}
            profilePicture={this.state.profilePicture}
            userId={this.state.currentUserId}
          />
        </div>

      </div>
    );
  }
}

export default App;
