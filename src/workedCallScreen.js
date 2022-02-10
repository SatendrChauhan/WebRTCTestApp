import React, {useEffect, useState, useCallback, useRef} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Text} from 'react-native-paper';
import {Button} from 'react-native-paper';
import {CheckBox} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TextInput} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import Modal from 'react-native-modal';

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';
// import {acc} from 'react-native-reanimated';

const STUN_SERVER = 'stun:stun.l.google.com:19302';
const SOCKET_URL = 'wss://webrtc.nirbheek.in:8443';

export default function CallScreen({navigation, ...props}) {
  const [userId, setUserId] = useState('');
  const [socketActive, setSocketActive] = useState(false);
  const [calling, setCalling] = useState(false);
  const [localStream, setLocalStream] = useState({toURL: () => null});
  const [remoteStream, setRemoteStream] = useState({toURL: () => null});
  const [connectStatus, setConnectStaus] = useState('Disconnect');
  const [status, setStatus] = useState('');
  const [checked, setChecked] = useState(false);

  const conn = useRef(new WebSocket(SOCKET_URL));

  const yourConn = useRef(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: STUN_SERVER,
        },
      ],
    }),
  );

  const showStatus = (text) => {
    console.log(text);
    setStatus(text)
  }

  const [callActive, setCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [otherId, setOtherId] = useState('');
  const [callToUsername, setCallToUsername] = useState('');
  const connectedUser = useRef(null);
  const offerRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('userId').then(id => {
        console.log(id);
        if (id) {
          setUserId(id);
        } else {
          setUserId('');
          navigation.push('Login');
        }
      });
    }, [userId]),
  );

  useEffect(() => {
    navigation.setOptions({
      title: 'Your ID - ' + userId,
      headerRight: () => (
        <Button mode="text" onPress={onLogout} style={{paddingRight: 10}}>
          Logout
        </Button>
      ),
    });
  }, [userId]);

  /**
   *
   * Calling Stuff
   */
  useEffect(() => {
    if (socketActive && userId.length > 0) {
      try {
        // InCallManager.start({media: 'audio'});
        // InCallManager.setForceSpeakerphoneOn(true);
        // InCallManager.setSpeakerphoneOn(true);
      } catch (err) {
        console.log('InApp Caller ---------------------->', err);
      }
      console.log('Current Peer ID: ' + userId);
      send('HELLO ' + userId);
    }
  }, [socketActive, userId]);

  const onLogin = () => {};

  useEffect(() => {
    /**
     * Sockets Signalling
     */
    conn.current.onopen = () => {
      setConnectStaus('Connected to the signaling server');
      console.log('Connected to the signaling server');
      setSocketActive(true);
    };
    //when we got a message from a signaling server
    conn.current.onmessage = msg => {
      console.log('Message from WebRTC server --------------------->', msg);
      let data = {};
      try {
        data = JSON.parse(msg.data);
      } catch (e) {
        if (typeof msg === 'object') {
          data.type = msg.data;
        } else {
          data.type = msg;
        }
      }
      console.log('Processed Data --------------------->', data);
      switch (data.type) {
        case 'HELLO':
          showStatus('Registered with server, waiting for call');
          console.log('Registered with server, waiting for call');
          break;
        case 'SESSION_OK':
          console.log('Session OK, Now have to send SDP Offer peer');
          showStatus('Session OK, Now have to send SDP Offer peer');
          sendSDPOffer();
          // send("OFFER_REQUEST");
          // handleOffer(data.offer, data.name);
          // console.log('Offer');
          break;
        case 'OFFER_REQUEST':
          console.log('The peer wants us to set up and then send an offer');
          break;
        case 'login':
          console.log('Login');
          break;
        //when somebody wants to call us
        case 'offer':
          handleOffer(data.offer, data.name);
          console.log('Offer');
          break;
        case 'answer':
          handleAnswer(data.answer);
          break;
        //when a remote peer sends an ice candidate to us
        case 'candidate':
          handleCandidate(data.candidate);
          console.log('Candidate');
          break;
        case 'leave':
          handleLeave();
          console.log('Leave');
          break;
        default:
          if (data && data.sdp && data.sdp.type === 'answer') {
            console.log('Handle SDP from here --------------->>>>>>>>');
            handleAnswer(data.sdp);
          } else if (data && data.ice) {
            console.log('Answer ICE from here --------------->>>>>>>>');
            handleCandidate(data.ice.candidate);
          } else {
            console.log('Unknown Incoming Data: ', data);
          }
          break;
      }
    };
    conn.current.onerror = function (err) {
      console.log('Got error', err);
    };
    initLocalVideo();
    registerPeerEvents();
  }, []);

  useEffect(() => {
    if (!callActive) {
      // InCallManager.stop();
    } else {
      // InCallManager.setSpeakerphoneOn(true);
    }
  }, [callActive]);

  const registerPeerEvents = () => {
    yourConn.current.onaddstream = event => {
      console.log('On Add Remote Stream');
      setRemoteStream(event.stream);
    };

    // Setup ice handling
    yourConn.current.onicecandidate = event => {
      console.log('Sending ICE Candidate........');
      if (event.candidate) {
        send({
          // type: 'candidate',
          ice: event.candidate,
        });
      }
    };
  };

  const send = message => {
    //attach the other peer username to our messages
    if (connectedUser.current) {
      // message.name = connectedUser.current;
      //   console.log('Connected user in end----------', message);
    }
    console.log('SEND Message to WebSocket Connection: ', message);
    // conn.current.send(message);
    if (typeof message === 'object') {
      conn.current.send(JSON.stringify(message));
    } else {
      conn.current.send(message);
    }
  };

  const onCall = () => {
    sendCall(callToUsername);
    // console.log(callToUsername);
    // setTimeout(() => {
    //     sendCall(callToUsername);
    // }, 5000);
  };

  const sendCall = receiverId => {
    setCalling(true);
    setCallToUsername(receiverId);
    const otherUser = receiverId;
    connectedUser.current = otherUser;
    console.log('Caling to', otherUser);
    send('SESSION ' + receiverId);
  };

  const sendSDPOffer = () => {
    setCalling(true);
    console.log('Sending SDP Offer to', connectedUser.current);
    // create an offer
    yourConn.current.createOffer().then(offer => {
      yourConn.current.setLocalDescription(offer).then(() => {
        console.log(
          'Sending SDP Offer to Peer ===================>' +
            connectedUser.current,
        );
        send({
          sdp: offer,
        });
      });
    });
  };

  //when somebody sends us an offer
  const handleOffer = async (offer, name) => {
    console.log(name + ' is calling you.');
    connectedUser.current = name;
    offerRef.current = {name, offer};
    setIncomingCall(true);
    setOtherId(name);
    // acceptCall();
    if (callActive) acceptCall();
  };

  const acceptCall = async () => {
    const name = offerRef.current.name;
    const offer = offerRef.current.offer;
    setIncomingCall(false);
    setCallActive(true);
    console.log('Accepting CALL', name, offer);
    yourConn.current
      .setRemoteDescription(offer)
      .then(function () {
        connectedUser.current = name;
        return yourConn.current.createAnswer();
      })
      .then(function (answer) {
        yourConn.current.setLocalDescription(answer);
        send({
          type: 'answer',
          answer: answer,
        });
      })
      .then(function () {
        // Send the answer to the remote peer using the signaling server
      })
      .catch(err => {
        console.log('Error acessing camera', err);
      });
  };

  //when we got an answer from a remote user
  const handleAnswer = answer => {
    setCalling(false);
    setCallActive(true);
    console.log('SDP Answer from remote ----------------->', answer);
    yourConn.current.setRemoteDescription(new RTCSessionDescription(answer));
  };

  //when we got an ice candidate from a remote user
  const handleCandidate = candidate => {
    setCalling(false);
    console.log('ICE Candidate ----------------->', candidate);
    yourConn.current.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const onLogout = () => {
    // hangUp();
    handleLeave();
    AsyncStorage.removeItem('userId').then(res => {
      navigation.push('Login');
    });
  };

  const rejectCall = async () => {
    send({
      type: 'leave',
    });
  };

  const handleLeave = () => {
    send({
      name: userId,
      otherName: otherId,
      type: 'leave',
    });
    setCalling(false);
    setIncomingCall(false);
    setCallActive(false);
    offerRef.current = null;
    connectedUser.current = null;
    setRemoteStream(null);
    setLocalStream(null);
    yourConn.current.onicecandidate = null;
    yourConn.current.ontrack = null;
    resetPeer();
    // initLocalVideo();
    // console.log("Onleave");
  };

  const resetPeer = () => {
    yourConn.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: STUN_SERVER,
        },
      ],
    });

    registerPeerEvents();
  };

  /**
   * Calling Stuff Ends
   */
  const initLocalVideo = () => {
    mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          mandatory: {
            minWidth: 500,
            minHeight: 300,
            minFrameRate: 30,
          },
          facingMode: 'user',
          // optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
        },
      })
      .then(stream => {
        // Got stream!
        setLocalStream(stream);
        // setup stream listening
        yourConn.current.addStream(stream);
      })
      .catch(error => {
        // Log error
      });
    // });
  };

  return (
    <View style={styles.root}>
      <View style={styles.inputField}>
        <TextInput
          label="Enter Peer Id"
          mode="outlined"
          style={{marginBottom: 7}}
          onChangeText={text => setCallToUsername(text)}
        />
        <Text style={styles.status}>
          Cooonection : <Text style={styles.STxt}>{connectStatus}</Text>
        </Text>
        <Text style={styles.status}>
          Status : <Text style={styles.STxt}>{status}</Text>
        </Text>
        {/* <View style={{marginLeft: -12}}>
          <CheckBox
            title="Remote Offer"
            style={styles.checkbox}
            checked={checked}
            onPress={() => setChecked(!checked)}
          />
        </View> */}
        <Text style={styles.sockeTxt}>
          SOCKET ACTIVE:{' '}
          <Text style={{color: 'green'}}>
            {socketActive ? 'TRUE' : 'FASLE'}
          </Text>
          ,{'    '}
          PEER ID:{' '}
          <Text style={{color: 'green'}}>{callToUsername || otherId}</Text>
        </Text>
        <View style={styles.btnBox}>
          <Button
            mode="contained"
            onPress={onCall}
            loading={calling}
            //   style={styles.btn}
            contentStyle={styles.btnContent}
            disabled={!socketActive || callToUsername === '' || callActive}>
            Call
          </Button>
          <Button
            mode="contained"
            onPress={handleLeave}
            contentStyle={styles.btnContent}
            disabled={!callActive}>
            End Call
          </Button>
        </View>
      </View>
      <View style={styles.videoContainer}>
        <View style={[styles.videos, styles.localVideos]}>
          <Text style={styles.heading}>Local Camera Video Stream</Text>
          <RTCView
            streamURL={localStream ? localStream.toURL() : ''}
            style={styles.localVideo}
          /> 
          <View style={styles.localDemo}>
            <Text style={{color: 'blue'}}>
              Local Camera Working for Streaming{' '}
            </Text>
          </View>
        </View>
        <View style={[styles.videos, styles.remoteVideos]}>
          <Text style={styles.heading}>Remote Video Stream</Text>
          <RTCView
            streamURL={remoteStream ? remoteStream.toURL() : ''}
            style={styles.remoteVideo}
          />
        </View>
      </View>

      <Modal isVisible={incomingCall && !callActive}>
        <View style={styles.popup}>
          <Text style={{color: 'green', fontSize: 20}}>
            {'Peer ID ' + otherId + ' is calling you'}
          </Text>
          <Button onPress={acceptCall} style={{marginVertical:10}}>Accept Call</Button> 
          <Button title="Reject Call" onPress={handleLeave} style={{marginVertical:10}}>Reject Call</Button>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  inputField: {
    // marginBottom: 10,
    flexDirection: 'column',
  },
  status: {
    color: 'black',
    fontWeight: 'bold',
  },
  STxt: {
    color: 'green',
    fontWeight: 'bold',
  },
  checkbox: {
    alignSelf: 'flex-start',
  },
  sockeTxt: {
    color: 'red',
    textAlign: 'center',
    marginTop:10
  },
  btnBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  btnContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 180,
    lineHeight: 30,
    // marginVertical:10,
  },
  localDemo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    color: 'green',
    textAlign: 'center',
  },
  videoContainer: {
    flex: 1,
    minHeight: 450,
  },
  videos: {
    width: '100%',
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'green',
    borderRadius: 6,
  },
  localVideos: {
    height: 100,
    marginBottom: 10,
  },
  remoteVideos: {
    height: 400,
  },
  localVideo: {
    backgroundColor: '#f2f2f2',
    height: '100%',
    width: '100%',
  },
  remoteVideo: {
    backgroundColor: '#f2f2f2',
    height: '100%',
    width: '100%',
  },
  popup: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});

/* 
let data = {}
let type = null
if (typeof msg === 'object') {
    console.log("This is object")
    // msgPayload = JSON.parse(msg)
    data.type = msg.data
}
else {
    console.log("This is string")
    data.type = msg
}
*/
