import React, { Component } from 'react';
import Game from './Components/Game';
import NavBar from './Components/NavBar'
import PubNubReact from 'pubnub-react';
import Swal from "sweetalert2";  
import shortid  from 'shortid';
 
class App extends Component {
  constructor(props) {  
    super(props);
    this.pubnub = new PubNubReact({
      publishKey: "pub-c-77780716-6075-4645-836f-ccf90a63ae9f", 
      subscribeKey: "sub-c-9861a6ea-7e2d-11ea-9770-0a12e0cf0d6e"    
    });
    
    this.state = {
      piece: '',
      isPlaying: false,
      isRoomCreator: false,
      isDisabled: false,
      myTurn: false,
    };

    this.lobbyChannel = null;
    this.gameChannel = null;
    this.roomId = null;    
    this.pubnub.init(this);
  }  
  
  componentWillUnmount() {
    this.pubnub.unsubscribe({
      channels : [this.lobbyChannel, this.gameChannel]
    });
  }
  
  componentDidUpdate() {
    // Check that the player is connected to a channel
    if(this.lobbyChannel != null){
      this.pubnub.getMessage(this.lobbyChannel, (msg) => {
        // Start the game once an opponent joins the channel
        if(msg.message.notRoomCreator){
          // Create a different channel for the game
          this.gameChannel = 'tictactoegame--' + this.roomId;

          this.pubnub.subscribe({
            channels: [this.gameChannel]
          });

          this.setState({
            isPlaying: true
          });  

          // Close the modals if they are opened
          Swal.close();
        }
      }); 
    }
  }

  // Create a room channel
  onPressCreate = (e) => {
    // Create a random name for the channel
    this.roomId = shortid.generate().substring(0,5);
    this.lobbyChannel = 'tictactoelobby--' + this.roomId;

    this.pubnub.subscribe({
      channels: [this.lobbyChannel],
      withPresence: true
    });

  // Open the modal
  Swal.fire({
    position: 'top',
    allowOutsideClick: false,
    title: 'Copier le code d\'entrée',
    text: this.roomId,
    width: 275,
    padding: '0.7em',
    // Custom CSS
    customClass: {
        heightAuto: false,
        title: 'title-class',
        popup: 'popup-class',
        confirmButton: 'button-class'
    }
  })

    this.setState({
      piece: 'X',
      isRoomCreator: true,
      isDisabled: true, // Disable the 'Create' button
      myTurn: true, // Room creator makes the 1st move
    });   
  }
  
  // The 'Join' button was pressed
  onPressJoin = (e) => {
    Swal.fire({
      position: 'top',
      input: 'text',
      allowOutsideClick: false,
      inputPlaceholder: 'Coller ici',
      showCancelButton: true,
      confirmButtonColor: 'rgb(208,33,41)',
      confirmButtonText: 'OK',
      width: 275,
      padding: '0.7em',
      customClass: {
        heightAuto: false,
        popup: 'popup-class',
        confirmButton: 'join-button-class ',
        cancelButton: 'join-button-class'
      } 
    }).then((result) => {
      // Check if the user typed a value in the input field
      if(result.value){
        this.joinRoom(result.value);
      }
    })
  }

  // Join a room channel
  joinRoom = (value) => {
    this.roomId = value;
    this.lobbyChannel = 'tictactoelobby--' + this.roomId;
    console.log(this.lobbyChannel)

    // Check the number of people in the channel
    this.pubnub.hereNow({
      channels: [this.lobbyChannel], 
    }).then((response) => { 
        if(response.totalOccupancy < 4){
          this.pubnub.subscribe({
            channels: [this.lobbyChannel],
            withPresence: true
          });
          
          this.setState({
            piece: 'O',
          });  
          
          this.pubnub.publish({
            message: {
              notRoomCreator: true,
            },
            channel: this.lobbyChannel
          });
        } 
        else{
          // Game in progress
          Swal.fire({
            position: 'top',
            allowOutsideClick: false,
            title: 'Error',
            text: 'Game in progress. Try another room.',
            width: 275,
            padding: '0.7em',
            customClass: {
                heightAuto: false,
                title: 'title-class',
                popup: 'popup-class',
                confirmButton: 'button-class'
            }
          })
        }
    }).catch((error) => { 
      console.log(error);
    });
  }

  // Reset everything
  endGame = () => {
    this.setState({
      piece: '',
      isPlaying: false,
      isRoomCreator: false,
      isDisabled: false,
      myTurn: false,
    });

    this.lobbyChannel = null;
    this.gameChannel = null;
    this.roomId = null;  

    this.pubnub.unsubscribe({
      channels : [this.lobbyChannel, this.gameChannel]
    });
  }
  
  render() {  
    return (  
        <div>
          <NavBar/> 
          <div className="title">
            <h1>Code Names des Copains</h1>
          </div>
          {
            !this.state.isPlaying &&
            <div className="game">
              <div className="board">

                <div className="button-container">
                  <button 
                    className="btn btn-primary create-button "
                    disabled={this.state.isDisabled}
                    onClick={(e) => this.onPressCreate()}
                    > Créer une partie
                  </button>
                  &nbsp;
                  <button 
                    className="btn btn-primary join-button"
                    onClick={(e) => this.onPressJoin()}
                    > Rejoindre une partie
                  </button>
                </div>                        
          
              </div>
            </div>
          }

          {
            this.state.isPlaying &&
            <Game 
              pubnub={this.pubnub}
              gameChannel={this.gameChannel} 
              isRoomCreator={this.state.isRoomCreator}
              myTurn={this.state.myTurn}
              //limitCards={PropTypes.number}
            />
          }
        </div>
    );  
  } 
}

export default App;
