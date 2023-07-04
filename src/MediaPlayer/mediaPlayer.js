import TrackPlayer, {
    AppKilledPlaybackBehavior,
    Capability,
    RepeatMode,
    Event
  } from 'react-native-track-player';
  
  export async function setupPlayer(callback) {
    var isSetup = 0;
    try {
        console.log("TrackPlayer",1)
      await TrackPlayer.getCurrentTrack();
      console.log("TrackPlayer",2)
      isSetup = 1;
    }
    catch {
        console.log("TrackPlayer",3)
      await TrackPlayer.setupPlayer();
      console.log("TrackPlayer",4)
      await TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
        ],
        progressUpdateEventInterval: 2,
      });
      TrackPlayer.addEventListener('playback-state', (event) => {
        console.log("playback-state",JSON.stringify(event))
        callback(event)
        // other stuff
      } );
      console.log("TrackPlayer",5)
      isSetup = 2;
    }
    finally {
        console.log("TrackPlayer",6)
      return isSetup;
    }
  }
  
  export async function start(url,callback) {
   const playerSetup = await setupPlayer(callback)
   console.log("TrackPlayer",7)
   if(playerSetup ==  1)
   {
    await TrackPlayer.reset()
    await TrackPlayer.add([
        {
          id: url,
          url: url,
          title: url,
          artist: url,
        
        }
      ]);
      console.log("TrackPlayer",8)
      await TrackPlayer.play()
      console.log("TrackPlayer",9)
   }else{
    await TrackPlayer.add([
        {
            id: url,
            url: url,
            title: url,
            artist: url,
          
        }
      ]);
      console.log("TrackPlayer",10)
      await TrackPlayer.play()
      console.log("TrackPlayer",11)
   }
   
    
    
  }
  
  export async function stop() {
    await TrackPlayer.pause();
    await TrackPlayer.reset();
    // TODO: Attach remote event handlers
  }