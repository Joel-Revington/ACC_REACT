import { useEffect, useRef } from 'react';
import { initSidebarTree } from '../services/api';
import './sidebar.css'

function Sidebar({ user, onModelSelect }) {
  const treeContainerRef = useRef(null);
  
  useEffect(() => {
    if (user && treeContainerRef.current) {
      // Initialize the tree when user is logged in
      const treeElement = treeContainerRef.current;
      
      // Clear any existing content
      while (treeElement.firstChild) {
        treeElement.removeChild(treeElement.firstChild);
      }
      
      // Initialize new tree
      initSidebarTree(treeElement, onModelSelect);
    }
  }, [user, onModelSelect]);

  return (
    <div className="sidebar">
      <div className="title">Hubs Browser</div>
      <div id="tree" ref={treeContainerRef}></div>
    </div>
  );
}

export default Sidebar;