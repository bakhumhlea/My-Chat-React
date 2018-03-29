import React, { Component } from 'react';
import MessageDisplay from './MessageDisplay';
import './RoomList.css';
import './NewRoomForm.css';

class RoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: this.props.displayName,
      profilePicture: this.props.profilePicture,
      roomlist : [],
      onRoomId: '',
      activeRoom: '',
      newRoomModalClass : false,
      newRoomName : '',
      invalidInput : false
    };
    this.roomsRef = this.props.firebase.database().ref('chatroom');
    this.messagesRef = this.props.firebase.database().ref('messageStorage');
  }

  componentDidMount() {
    this.roomsRef.on('child_added', snapshot => {
      //console.log(snapshot.val());
      //console.log(snapshot.key);
      const room = snapshot.val();
      this.setState({ roomlist: this.state.roomlist.concat( room ) });
    });
    this.roomsRef.on('child_removed', snapshot => {
      //console.log(snapshot.val());
      const deletedRoom = snapshot.val();
      this.setState({ roomlist: this.state.roomlist.filter(room => room.name !== deletedRoom.name) });
    });
    this.messagesRef.orderByChild('readStatus').on('child_changed', snapshot => {
      console.log(snapshot.val());
    });
  }
  openRoom(e, roomname, index) {
    //console.log(roomname);
    e.preventDefault();
    this.roomsRef.on('child_added', snapshot => {
      if (snapshot.val().name === roomname) {
        var roomKeyToOpen = snapshot.key;
        console.log('open ' +roomKeyToOpen);
        this.setState({onRoomId: roomKeyToOpen});
        this.setState({activeRoom: index});
      }
    });
    this.messagesRef.orderByChild('readStatus').on('child_added', snapshot => {
      var isRead = snapshot.val().readStatus;
      var isSender = snapshot.val().sender === this.props.userId;
      if (isRead===false && !isSender) {
        console.log(snapshot.val().readStatus);
        this.props.firebase.database().ref('messageStorage').child(snapshot.key).update(
          {readStatus : true}
        );
      }
    });
  }
  modalCtrl() {
    this.setState({newRoomModalClass:this.state.newRoomModalClass? false : true});
  }
  handleInput(e) {
    if (e.target.value > 20) {
      this.setState( {invalidInput: true} );
    } else {
      this.setState( {invalidInput: false} );
      this.setState( {newRoomName : e.target.value} );
    }
  }
  createRoom(e , newRoomName) {
    e.preventDefault();
    const roomInput = newRoomName;
    if (roomInput===null || roomInput==='') {
      this.setState( {invalidInput: true} );
      return
    } else if (roomInput.length > 20) {
      return
    } else {
      this.roomsRef.push(
        {
            name : newRoomName,
            creatorId : this.props.userId
        }
      ).then(data=>{
        console.log(data.key);
        });
      this.setState({newRoomName: ''});
      this.setState({newRoomModalClass:false});
    }
  }
  deleteRoom(e, deleteRoomName) {
    e.preventDefault();
    this.roomsRef.on('child_added', snapshot => {
      if (snapshot.val().name === deleteRoomName) {
        if (window.confirm('Do you want to delete '+deleteRoomName+' ?')===true) {
          var roomKeyToDelete = snapshot.key;
          console.log('Delete ' +roomKeyToDelete+'!');
          this.props.firebase.database().ref('chatroom/'+roomKeyToDelete).remove();
        }
      } else {
        return
      }
    });
  }
  dismiss(e) {
    e.preventDefault();
    this.setState({newRoomModalClass: false,invalidInput:false});
  }

  render() {
    let newRoomName = this.state.newRoomName;
    return (
      <section className="body-part">
      <div className="side-bar">
        <div className="nav-chatroom"><h3>Chat Room</h3></div>
        {this.state.roomlist.map((room ,index) =>
            <div className={this.state.activeRoom===index? 'chat-room active' : 'chat-room'} key={index} onClick={(e) => this.openRoom(e, room.name, index)}>
              <div className='chat-room-name'>
                {room.name}
              </div>
              <button className='btn-delete ion-close' title={room.name} onClick={(e) => this.deleteRoom(e, room.name)}></button>
            </div>
        )}

        <button className={this.state.newRoomModalClass? 'modal-close ion-plus-round':'modal-open ion-plus-round'} title='Create Room' onClick={()=>this.modalCtrl()}></button>

        <div className={this.state.newRoomModalClass? 'modal-open':'modal-close'}>
        <form onSubmit={(e)=>this.createRoom(e , newRoomName)}>
          <label className='form-label'>Create a New Room</label>
          <input className='form-input'
            type="text"
            value={this.state.newRoomName}
            onChange={(e)=>this.handleInput(e)}
            placeholder="Enter Room Name"
          />
          <p className={this.state.invalidInput? 'text-show':'text-hide'} id='invalid-text' >Invalid Input</p>
          <button
            className='btn-ok'
            title="Click to Create Room"
            type="submit"
          >
            add
          </button>
          <button className='btn-dissmiss' title="Cancel!" onClick={(e)=>this.dismiss(e)}>Cancel</button>
        </form>
        </div>
      </div>
      <MessageDisplay
        firebase={this.props.firebase}
        activeRoom={this.state.onRoomId}
        displayName={this.state.displayName}
        profilePicture={this.state.profilePicture}
        userId={this.props.userId}
      />
      </section>
    );
  }
}

export default RoomList;
