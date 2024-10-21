import React, {createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

const socket = io("http://localhost:3000");

const ContextProvider = ({ children }) => {
    const [stream, setStream] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');

    const [call, setCall] = useState({});

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    const [me, setMe] = useState("");

    useEffect(() => {
        Navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(currentstream => {
                setStream(currentstream);

                myVideo.current.srcObject = currentstream;
            });

            socket.on("me", (id) => setImmediate(id));

            socket.on("callUser", ({ from, name: callerName, signal }) => {
                setCall({ isReceivedCall: true, from, name:callerName, signal });
            });
    }, []);
    

    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: call.from });
        });
        peer.on("stream", (currentstream) => {
            userVideo.current.srcObject = currentstream;
        });
        peer.signal(call.signal);

        connectionRef.current = peer;
    }
    const callUser = (id) => {

        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on("signal", (data) => {
            socket.emit("callUser", { userToCall: id, signalData: data, from: me , name });
        });
        peer.on("stream", (currentstream) => {
            userVideo.current.srcObject = currentstream;
        });
        socket.on("callAccepted", (signal) => {
            setCallAccepted(true);

            peer.signal(signal);
        })

        connectionRef.current = peer;
    }
    const leaveCall = () => {
        setCallEnded= (true);
        connectionRef.current.destroy();

        window.location.reload();
    }

    return(
        <SocketContext.Provider value={{
            me,
            call,
            myVideo,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            callAccepted,
            callUser,
            leaveCall,
            answerCall,
        }}>
            {children}
        </SocketContext.Provider>
    )
};

export { ContextProvider, SocketContext };