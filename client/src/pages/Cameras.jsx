import React, { useEffect, useRef,useState } from 'react';
import Hls from 'hls.js';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const Cameras = () => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null); // store HLS instance
  const streamUrl = 'http://192.168.8.109:8080/hls/stream.m3u8'; // replace with your IP
  const [connected, setConnected] = useState(false);

  const initStream = () => {
    const video = videoRef.current;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.muted = true;
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.FRAG_LOADED, () => {
        if (!connected) {
          setConnected(true);
          console.log('✅ Stream connected.');
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.warn('❌ Fatal HLS error, retrying in 2s...');
          setConnected(false);
          setTimeout(() => initStream(), 2000); // try again
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.muted = true;
      video.play().catch(() => {});
    }
  };

  useEffect(() => {
    initStream();
    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, []);



  return (
     <div style={{ backgroundColor: 'black', display: 'flex', alignItems: 'center' ,  justifyContent: 'center',width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Top Menu */}
      <div style={{
        position: 'absolute',
        top: 0,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        zIndex: 1
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '12px',
            height: '12px',
            backgroundColor: 'red',
            borderRadius: '50%',
          }} />
          <h4 style={{ margin: 0 }}>Live Camera</h4>
        </div>
        <Nav>
          <Nav.Link
            to="/"
            as={NavLink}
            className="btn btn-primary text-white px-3 py-2"
            style={{ borderRadius: '8px' }}
          >
            Exit
          </Nav.Link>
        </Nav>
      </div>
      <video
        ref={videoRef}
        controls
        autoPlay
        muted
        style={{ width: '99%',  height: '99%' ,backgroundColor: '#000' }}
      />
    </div>
  );
};

export default Cameras;
