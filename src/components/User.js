import React, {Component} from 'react';
import './User.css';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName : '',
      InputUserPassword : '',
      InputUserEmail : '',
      InputDisplayName : '',
      SignInEmail : '',
      SignInPassword : '',
      signInOptions : true,
      haveAccount : false
    };
  }
  componentDidMount() {
    /**@desc Get User Profile method*/
    this.props.firebase.auth().onAuthStateChanged( user => {
      if (user) {
          console.log('state change');
          console.log(user);
          console.log(user.email);
          console.log(user.uid);
          console.log(user.displayName);
          console.log(user.emailVerified);
          console.log(user.photoURL);
          this.props.getUID(user.uid);
          this.props.handlePageState(false);
        } else {
          console.log('Please Sign In');
          this.props.handlePageState(true);
        }
    });
  }
  /**@desc Manual Sign In Method*/
  BlocChatCreateUser(e, displayname, email, password) {
    e.preventDefault();
    console.log('Submit');
    /**@desc default displayname and profile picture*/
    const displayName = displayname===''? email : displayname;
    const defaultProfilePicture = 'URL';
    /**@desc Intial set User Profile */
    this.props.firebase.auth().createUserWithEmailAndPassword(email, password).then(result=>{
      console.log('Create User Successful');
      var uid = result.uid;
      this.props.setUser(displayName, email, defaultProfilePicture, uid);
      this.props.handlePageState(false);
    }).catch(error=> {
      console.log('error')
      //var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
  }
  /**@desc Manual Sign In Method**/
  BlocChatSignIn(e, email, password) {
    e.preventDefault();
    console.log('Log In successful!');
    this.props.firebase.auth().signInWithEmailAndPassword(email, password).then(result=> {
      console.log(result.uid);
      this.props.getUID(result.uid);
      this.props.handlePageState(false);
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode+''+errorMessage);
    });
  }
  GoogleSignIn() {
    const provider = new this.props.firebase.auth.GoogleAuthProvider();
    this.props.firebase.auth().signInWithPopup(provider).then(result => {
      var user = result.user;
      if (result.credential) {
        var token = result.credential.accessToken;
        console.log(token);
        console.log(result);
        console.log(result.credential);
      } else {
        console.log('Push User to database');
        this.props.setUser(user.displayName, user.email, user.photoURL, user.uid);
      }
      this.props.getUID(user.uid);
      this.props.handlePageState(false);;
    }).catch(function(error) {
      //var errorCode = error.code;
      //var errorMessage = error.message;
      //var email = error.email;
      //var credential = error.credential;
    });
  }
  handleChoices(e) {
    e.preventDefault();
    if (e.target.className==='have-acc') {
      this.setState({
        signInOptions : false,
        haveAccount : true
      });
    } else {
      this.setState({
        signInOptions : false,
        haveAccount : false
      });
    }
  }
  handleGoBack() {
    this.setState({signInOptions:true});
  }
  handleEmail(e) {
    e.preventDefault();
    this.setState({InputUserEmail:e.target.value});
  }
  handlePassword(e) {
    e.preventDefault();
    this.setState({InputUserPassword:e.target.value});
  }
  handleDisplayName(e) {
    e.preventDefault();
    this.setState({InputDisplayName:e.target.value});
  }
  handleSignInEmail(e) {
    e.preventDefault();
    this.setState({SignInEmail:e.target.value});
  }
  handleSignInPassword(e) {
    e.preventDefault();
    this.setState({SignInPassword:e.target.value});
  }

  render() {
    return (
      <div className='user-signIn'>
        <div className='bloc-chat-logo'>
          <div className='ion-android-send'></div>
          <div className='bloc-chat-logo-text'>MY CHAT</div>
        </div>
        <div className='signIn-body'>
          <div className={this.state.signInOptions? 'signIn-Opt':'hidden'}>
            <div className='label'>Sign In with <strong>My Chat</strong> Account</div>
            <span className='have-acc' onClick={(e)=>this.handleChoices(e)}>My Chat User</span>
            <span className='have-not-acc' onClick={(e)=>this.handleChoices(e)}>New User?</span>
          </div>
          <div className={this.state.signInOptions? 'hidden':'signIn-opt'}>
            <div className={this.state.haveAccount? 'hidden' : 'create-acc'}>
              <div className='label'>Create Your Account Here</div>
              <form onSubmit={(e)=>this.BlocChatCreateUser(e, this.state.InputDisplayName, this.state.InputUserEmail, this.state.InputUserPassword)}>
                <input className='textInput-box' type="text" value={this.state.InputUserEmail} onChange={(e)=>this.handleEmail(e)} placeholder="example@mail.com"/>
                <input className='textInput-box' type="text" value={this.state.InputUserPassword} onChange={(e)=>this.handlePassword(e)} placeholder="Your Password"/>
                <input className='textInput-box' type="text" value={this.state.InputDisplayName} onChange={(e)=>this.handleDisplayName(e)} placeholder="Your Display Name (Optional)"/>
                <span className="ion-android-arrow-back" onClick={()=>this.handleGoBack()}></span>
                <button className='btn-signIn' type="submit">Create Account</button>
              </form>
            </div>
            <div className={this.state.haveAccount? 'signIn-acc' : 'hidden'}>
              <div className='label'>Sign In with your My Chat Account</div>
              <form onSubmit={(e)=>this.BlocChatSignIn(e,this.state.SignInEmail, this.state.SignInPassword)}>
                <input className='textInput-box' type="text"  onChange={(e)=>this.handleSignInEmail(e)} placeholder="Please Enter Your Email"/>
                <input className='textInput-box' type="text"  onChange={(e)=>this.handleSignInPassword(e)} placeholder="Please Enter Your Password"/>
                <span className="ion-android-arrow-back" onClick={()=>this.handleGoBack()}></span>
                <button className='btn-signIn' type="submit">Sign In</button>
              </form>
            </div>
          </div>
          <p className='label'>have Google Account?</p>
          <div className='btn-gg-signIn' onClick={()=> this.GoogleSignIn()}>
            <span className='ion-social-google'></span><span>Sign In with Google Account</span>
          </div>
        </div>
        <p className='footer'>&copy;2018, Create by Tatuu</p>
      </div>
    );
  }
}

export default User;
