import { useEffect, useRef } from 'react';
import { initViewer } from '../services/viewer';

function Viewer({ onViewerInitialized }) {
  const viewerRef = useRef(null);
  
  useEffect(() => {
    if (viewerRef.current) {
      const initializeViewer = async () => {
        try {
          const viewer = await initViewer(viewerRef.current);
          if (onViewerInitialized) {
            onViewerInitialized(viewer);
          }
        } catch (error) {
          console.error('Error initializing viewer:', error);
        }
      };
      
      initializeViewer();
    }
  }, [onViewerInitialized]);

  return <div ref={viewerRef} className="viewer-container" style={{ width: '100%', height: '100%' }}></div>;
}

export default Viewer;