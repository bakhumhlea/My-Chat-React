import React, { Component } from 'react';
import './MessageDisplay.css';

class MessageDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageslist : [],
      newMessage : '',
      displayName : this.props.displayName,
    };
    this.messagesRef = this.props.firebase.database().ref('messageStorage');
  }

  componentWillReceiveProps(nextProps) {
    var roomIdUpdate = this.state.activeRoomId === nextProps.activeRoom;
    console.log(this.props.userId);
    if(roomIdUpdate) {
      return
    } else {
      this.setState({activeRoomId : nextProps.activeRoom});
      console.log('You have change the active room to '+nextProps.activeRoom);
    }
  }
  componentDidMount() {
    this.messagesRef.orderByChild('roomId').on('child_added', snapshot => {
      const messages = snapshot.val();
      console.log(messages.content);
      this.setState({messageslist: this.state.messageslist.concat( messages )});
      //console.log(this.state.messageslist);
    });
    this.messagesRef.orderByChild('roomId').on('child_removed', snapshot=> {
      const deletedMessages = snapshot.val();
      this.setState({messageslist: this.state.messageslist.filter( message=> message.content !== deletedMessages.content)});
    });
    this.messagesRef.orderByChild('readStatus').on('child_changed', snapshot => {
      this.setState({ messageslist: this.state.messageslist.filter(message => {
          if (message.readStatus===false) {
            message.readStatus = true;
          }
          return message;
        })
      });
    });
  }

  handleMessage(e) {
    this.setState({newMessage:e.target.value});
  }
  getLocalTime()  {
    let h = new Date().getHours();
    let m = new Date().getMinutes();
    return h+':'+m;
  }
  sendMessage(e,message) {
    e.preventDefault();
    if(message===''|| this.props.activeRoom ==='') {
      return
    } else {
      const TimeStamp = this.getLocalTime();
      this.messagesRef.push({
        content : message,
        roomId : this.props.activeRoom,
        sender : this.props.userId,
        timeSent : TimeStamp,
        readStatus : false
      });
      this.setState({newMessage:''});
    }
  }

  render() {
    let displayMessages= this.state.messageslist.filter(message=>message.roomId===this.state.activeRoomId);
    if (this.state.activeRoomId==='') {
      return (
        <div className="message-list">
            <div className='bloc-chat-logo'>
                <div className='ion-android-send'></div>
                <div className='bloc-chat-logo-text'>MY CHAT</div>
            </div>
            <div className="chat-box">
                <input type="text" value={this.state.newMessage} onChange={(e)=>this.handleMessage(e)} />
                <button type="button" onClick={(e)=>this.sendMessage(e,this.state.newMessage)} placeholder=' . . .'>Send</button>
            </div>
        </div>
      );
    } else {
      return (
        <div className="message-list">
        {displayMessages.map((message,index) =>
          <div className="message-frame" key={index}>
          <div className={message.sender===this.props.userId? 'hidden-thumbnail' : 'profile-thumbnail-participant'}>
            <span className="sender-initail">{message.sender==='qw7KPRGhoWXaWZFoL0OZsfKMXOj1'?'M':'JD'}</span>
          </div>
          <div className={message.sender===this.props.userId? 'message-dialog-sent':'message-dialog-recieve'}>
            <span className="message-content">{message.content}</span>
            <span className="message-senttime">{message.timeSent}</span>
          </div>
          <span className={message.sender===this.props.userId && message.readStatus? 'message-read' : 'message-unread'}>Read</span>
          </div>
        )}
          <div className="chat-box">
            <input type="text" value={this.state.newMessage} onChange={(e)=>this.handleMessage(e)} />
            <button type="button" onClick={(e)=>this.sendMessage(e,this.state.newMessage)} placeholder=' . . .'>Send</button>
          </div>
        </div>
      );
    }
  }
}

export default MessageDisplay;
