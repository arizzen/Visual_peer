import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Options from './components/Options';
import Notifications from './components/Notifications';
import VideoPlayer from './components/VideoPlayer';
import './App.css';

const App = () => {
  return (
    <div className='wrapper'>
        <div className='hh2'>
            <h2 >Video Chat</h2>
        </div>
        hello


        <VideoPlayer></VideoPlayer>
        <Options>
            <Notifications></Notifications>
        </Options>
        
      
    </div>
  )
}

export default App;
