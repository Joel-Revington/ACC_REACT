import { useState, useEffect } from 'react';
import { fetchHubs, fetchProjects } from '../services/api';

function BackupPanel({ setShowSpinner }) {
  const [hubs, setHubs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedHub, setSelectedHub] = useState('');
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => {
    const loadHubs = async () => {
      try {
        const hubsData = await fetchHubs();
        setHubs(hubsData);
      } catch (error) {
        console.error('Error loading hubs:', error);
      }
    };

    loadHubs();
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      if (selectedHub) {
        try {
          const projectsData = await fetchProjects(selectedHub);
          setProjects(projectsData);
        } catch (error) {
          console.error('Error loading projects:', error);
        }
      } else {
        setProjects([]);
      }
      setSelectedProject('');
    };

    loadProjects();
  }, [selectedHub]);

  const handleBackupAll = async () => {
    setShowSpinner(true);
    try {
      const response = await fetch('/api/aps/backup', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'backup.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const errorText = await response.text();
        console.error('Backup failed:', errorText);
        alert('Backup failed. See console for details.');
      }
    } catch (error) {
      console.error('Error during backup:', error);
      alert('Error during backup. See console for details.');
    } finally {
      setShowSpinner(false);
    }
  };

  const handleBackupSelected = async () => {
    if (!selectedHub || !selectedProject) {
      alert('Hub or Project not selected');
      return;
    }

    setShowSpinner(true);
    try {
      const response = await fetch(`/api/aps/backup?hub_id=${selectedHub}&project_id=${selectedProject}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'backup.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const errorText = await response.text();
        console.error('Backup failed:', errorText);
        alert('Backup failed. See console for details.');
      }
    } catch (error) {
      console.error('Error during backup:', error);
      alert('Error during backup. See console for details.');
    } finally {
      setShowSpinner(false);
    }
  };

  return (
    <div className="backup">
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          width: '100%', 
          height: '40%', 
          justifyContent: 'center', 
          gap: '10px' 
        }}>
          <div style={{ 
            fontSize: 'larger', 
            fontWeight: 'bold', 
            display: 'flex', 
            justifyContent: 'center' 
          }}>
            Backup All
          </div>
          <button 
            className="backup-button" 
            onClick={handleBackupAll}
          >
            Download
          </button>
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          width: '100%', 
          height: '60%', 
          gap: '10px' 
        }}>
          <div style={{ 
            fontSize: 'larger', 
            fontWeight: 'bold', 
            display: 'flex', 
            justifyContent: 'center' 
          }}>
            Backup Selected
          </div>
          
          <select 
            className="select-dropdown"
            value={selectedHub}
            onChange={(e) => setSelectedHub(e.target.value)}
          >
            <option value="">Select Hub</option>
            {hubs.map((hub) => (
              <option key={hub.id} value={hub.id}>
                {hub.attributes.name}
              </option>
            ))}
          </select>
          
          <select 
            className="select-dropdown"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            disabled={!selectedHub}
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.attributes.name}
              </option>
            ))}
          </select>
          
          <button 
            className="backup-button"
            onClick={handleBackupSelected}
            disabled={!selectedHub || !selectedProject}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default BackupPanel;