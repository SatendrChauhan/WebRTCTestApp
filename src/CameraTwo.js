import React, {useEffect, useState, useCallback, useRef, useContext} from 'react';
import {View, StyleSheet, Alert,TouchableWithoutFeedback} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {Text} from 'react-native-paper';
import {Button} from 'react-native-paper';
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

import { useNavigation } from '@react-navigation/native';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import { SuperContext } from './contextProvider';

const STUN_SERVER = 'stun:stun.l.google.com:19302';
const MOZ_STUN_SERVER = 'stun:stun.services.mozilla.com';
const SOCKET_URL = 'wss://webrtc.nirbheek.in:8443';

export default function CameraTwo({route}) {
   
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const {senderId,receiverId} = useContext(SuperContext);
    const [userId, setUserId] = useState(senderId.peerId);
    const [localStream, setLocalStream] = useState({toURL: () => null});
    const [remoteStream, setRemoteStream] = useState({toURL: () => null});
    const [callToUsername, setCallToUsername] = useState('hm9999');
    const [play, setPlay] = useState(false);
    const [paused, setPaused] = useState(false);
    const connectedUser = useRef(null);
    const offerRef = useRef(null);
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


    useEffect(() => {
      /**
       * Sockets Signalling
       */
      conn.current.onopen = () => {
        console.log('Connected to the signaling server');
        send('HELLO ' + userId);
        onCall(callToUsername);
        setLoading(true);
      };
      //when we got a message from a signaling server
      conn.current.onmessage = (msg) => {
          console.log("Message from WebRTC server --------------------->", msg);
          let data = {}
          try {
            data = JSON.parse(msg.data);
          } catch (e) {
            if (typeof msg === 'object') {
                data.type = msg.data
            }
            else {
                data.type = msg
            }
          }
          console.log('Processed Data --------------------->', data);
          switch (data.type) {
          case 'HELLO':
              console.log('Registered with server, waiting for call')
              break;
          case "SESSION_OK":
              console.log('Session OK, Now have to ask remote peer to send us a request')
              send("OFFER_REQUEST");
              break;
          case "OFFER_REQUEST":
              console.log('The peer wants us to set up and then send an offer. Sending SDP')
              sendSDPOffer();
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
                console.log("Handle SDP Answer from here --------------->>>>>>>>")
                handleAnswer(data.sdp)
              } else if (data && data.sdp && data.sdp.type === 'offer') {
                console.log("Handle SDP Offer from here --------------->>>>>>>>")
                handleOffer(data.sdp, 'Someone');
              } else if (data && data.ice) {
                console.log("Answer ICE from here --------------->>>>>>>>")
                handleCandidate(data.ice.candidate)
              } else {
                console.log("Unknown Incoming Data: ", data)
              }
              break;
          }
      };
      conn.current.onerror = function (err) {
          console.log('Got error', err);
      };
        initLocalVideo();
        registerPeerEvents();
        dataChannelEvents()
    }, []);


    const registerPeerEvents = () => {
        yourConn.current.onaddstream = event => {
            console.log('[REMOTE STREAM] On Add Remote Stream event triggered: ', event);
            setRemoteStream(event.stream);
        };

        yourConn.current.ontrack = event => {
          console.log('[ALTERNATE REMOTE STREAM] Incoming stream coming ------------------------>');
          console.log(event.streams)
          console.log("[END OF ALTERNATE REMOTE STREAM]")
        }

        // Setup ice handling
        yourConn.current.onicecandidate = event => {
          console.log("Sending ICE Candidate........")
          if (event.candidate) {
            send({
                // type: 'candidate',
                ice: event.candidate,
            });
          }
        };
    };

    const dataChannelEvents = () => {
      yourConn.current.onopen = handleDataChannelOpen;
      yourConn.current.onmessage = handleDataChannelMessageReceived;
      yourConn.current.onerror = handleDataChannelError;
      yourConn.current.onclose = handleDataChannelClose;
      yourConn.current.ondatachannel = event => {
        console.log('[DATA CHANNEL] Data channel created :::::::::::');
        let receiveChannel = event.channel;
        receiveChannel.onopen = handleDataChannelOpen;
        receiveChannel.onmessage = handleDataChannelMessageReceived;
        receiveChannel.onerror = handleDataChannelError;
        receiveChannel.onclose = handleDataChannelClose;
      }

    }

    const handleDataChannelOpen = (event) =>{
        console.log("[DATA CHANNEL] OnOpen", event);
    };
    const handleDataChannelMessageReceived = (event) =>{
        console.log("[DATA CHANNEL] OnMessage:", event, event.data.type);
        if (typeof event.data === 'string' || event.data instanceof String) {
            console.log('[DATA CHANNEL] Incoming string message: ' + event.data);
        } else {
            console.log('[DATA CHANNEL] Incoming data message');
        }
    };
  
    const handleDataChannelError = (error) =>{
        console.log("dataChannel.OnError:", error);
    };
    
    const handleDataChannelClose = (event) =>{
        console.log("dataChannel.OnClose", event);
    };
 
    const send = (message) => {
        //attach the other peer username to our messages
        if (connectedUser.current) {
          // message.name = connectedUser.current;
          // console.log('Connected user in end----------', message);
        }
        console.log('SEND Message to WebSocket Connection: ', message);
        // conn.current.send(message);
        if (typeof message === 'object') {
            const data = conn.current.send(JSON.stringify(message));
           
        } 
        else {
            conn.current.send(message);
        }
    };

    const sendCall = (receiverId) => {
        setCallToUsername(receiverId)
        const otherUser = receiverId;
        connectedUser.current = otherUser;
        console.log('Caling to', otherUser);
        send("SESSION " + receiverId);
    };

    const onCall = () => {
      sendCall(callToUsername);
    };

    const sendSDPOffer = () => {
      console.log('Sending SDP Offer to', connectedUser.current);
      // create an offer
      yourConn.current.createOffer().then((offer) => {
          yourConn.current.setLocalDescription(offer).then(() => {
          console.log('Sending SDP Offer to Peer ===================>'+connectedUser.current);
            send({
              sdp: offer,
            });
          });
      });
    }

    //when somebody sends us an offer
    const handleOffer = async (offer, name) => {
        console.log(name + ' is calling you.');
        connectedUser.current = name;
        offerRef.current = {name, offer};
        acceptCall();
    };

    const acceptCall = async () => {
        const name = offerRef.current.name;
        const offer = offerRef.current.offer;
        console.log('Accepting Call', name);
        yourConn.current
            .setRemoteDescription(offer)
            .then(function () {
                connectedUser.current = name;
                return yourConn.current.createAnswer();
            })
            .then(function (answer) {
                yourConn.current.setLocalDescription(answer);
                send({
                    sdp: answer,
                });
            })
            .then(function () {
            // Send the answer to the remote peer using the signaling server
            })
            .catch((err) => {
                console.log('Error acessing camera', err);
            });
    };

    //when we got an answer from a remote user
    const handleAnswer = (answer) => {
        console.log('SDP Answer from remote ----------------->', answer);
        yourConn.current.setRemoteDescription(new RTCSessionDescription(answer));
    };

    //when we got an ice candidate from a remote user
    const handleCandidate = (candidate) => {
        console.log('ICE Candidate ----------------->', candidate);
        yourConn.current.addIceCandidate(new RTCIceCandidate(candidate));
    };


    const onLogout = () => {
        handleLeave();
    };

    const rejectCall = async () => {
        send({
            type: 'leave',
        });
    };

    const handleLeave = () => {
        send({
            name: userId,
            type: 'leave',
        });
        offerRef.current = null;
        connectedUser.current = null;
        setRemoteStream(null);
        setLocalStream(null);
        yourConn.current.onicecandidate = null;
        yourConn.current.ontrack = null;
        resetPeer();
        
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
        .then((stream) => {
          // Got stream!
          setLocalStream(stream);
          // setup stream listening
          yourConn.current.addStream(stream);
        })
        .catch((error) => {
          // Log error
        });
      // });
    };
    const togglePaused = () => {
      setPaused(false);
    } 
    
    const togglePlay = () => {
      setPaused(true);
      setCallToUsername('')
      handleLeave();
      
    }

  /* 
  if(remoteStream && remoteStream.toURL() == null){
    return(
      <View style={{flex:1, alignItems:'center', marginTop:200}}>
        <Text style={{color:'rgba(1, 143, 106, 0.85)'}}>Loading Streaming...............</Text>
      </View>
    )
  } 
  */

  return (
    <View style={styles.root}>
      <ScrollView>
      <View style={styles.videoContainer}>
        <View style={[styles.videos, styles.remoteVideos]}>
          <RTCView
            streamURL={remoteStream ? remoteStream.toURL() : ''}
            style={styles.remoteVideo}
          />
        </View>
        <View style={styles.controller}>
          <TouchableHighlight
            onPress={paused === true ? togglePaused : togglePlay}
          >
            {paused===true?
            <EntypoIcon name="controller-play" size={30} color={'#fff'}  />
            :
            <EntypoIcon name="controller-paus" size={30} color={'#fff'}  />
            }
          </TouchableHighlight>
        </View>
        {/* <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
        <Button mode="text" onPress={() => navigation.navigate('CameraTwo')} style={{paddingRight: 10}}>{' '}</Button>
          {route.name === "CameraTwo" ?
          <Button mode="text" onPress={() => navigation.navigate('CameraOne')} style={{paddingRight: 10}}>Previous</Button>
          :
          <Button mode="text" onPress={() => navigation.navigate('CameraTwo')} style={{paddingRight: 10}}>Next</Button>
          }
        </View> */}
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    root: {
      backgroundColor: '#121212',
      width: '100%',
      marginTop:20,
      paddingHorizontal: 2,
    },
    videoContainer: {
      flex: 1,
    },
    videos: {
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      borderWidth: 0.5,
      borderColor: '#fff',
      borderRadius: 2,
    },
    remoteVideo: {
      backgroundColor: '#121212',
      height: 200,
      width: '100%',
    },
    btnContainer: {
      flex:1
    },
    controller:{
      flexDirection: 'row',
      alignItems:'center', 
      justifyContent:'space-between',
      position:'absolute',
      top:'33%',
      left:'45%'
    }
});
