import React, { Component } from 'react';
import './Header.css';

class Header extends Component {
  signOut() {
    this.props.firebase.auth().signOut().then(() => {
      console.log('log out successful');
    }).catch(function(error) {
      console.log('error!');
    });
  }
  render() {
    var divStyle = {
      color: 'black',
      backgroundImage: 'url(' + this.props.profilePicture + ')',
    }
    return (
      <header className='chatApp-header'>
        <div className='user-profile'>
          <div className='profile-picture' style={divStyle}></div>
          <p className='username-display'>{this.props.displayName}</p>
        </div>
        <h1 className='chatApp-title'>MY CHAT <span className="ion-android-send"></span></h1>
        <div className='log-out'>
          <button className='btn-log-out ion-log-out' type='button' onClick={()=>this.signOut()}/>
        </div>
      </header>
    );
  }
}

export default Header;
