// src/services/viewer.js
// Handles Autodesk Forge Viewer functionality

/**
 * Loads the Autodesk Forge Viewer scripts
 * @returns {Promise<void>} Promise that resolves when scripts are loaded
 */
function loadViewerScripts() {
    return new Promise((resolve, reject) => {
      const scripts = [
        'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js',
        'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/extensions/Markup/Markup.min.js'
      ];
      
      const styles = [
        'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css'
      ];
      
      let scriptsLoaded = 0;
      let stylesLoaded = 0;
      
      // Load styles
      styles.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = href;
        link.onload = () => {
          stylesLoaded++;
          if (stylesLoaded === styles.length && scriptsLoaded === scripts.length) {
            resolve();
          }
        };
        link.onerror = () => reject(new Error(`Failed to load stylesheet: ${href}`));
        document.head.appendChild(link);
      });
      
      // Load scripts
      scripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => {
          scriptsLoaded++;
          if (stylesLoaded === styles.length && scriptsLoaded === scripts.length) {
            resolve();
          }
        };
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
      });
    });
  }
  
  /**
   * Initializes the Forge Viewer
   * @param {HTMLElement} container - DOM element to host the viewer
   * @returns {Promise<Object>} The viewer instance
   */
  export async function initViewer(container) {
    try {
      // Load the viewer scripts if not already loaded
      if (!window.Autodesk) {
        await loadViewerScripts();
      }
      
      // Check if Autodesk is available
      if (!window.Autodesk) {
        throw new Error('Autodesk viewer failed to load');
      }
      
      // Initialize the viewer
      const options = {
        env: 'AutodeskProduction',
        api: 'streamingV2',
        getAccessToken: async (callback) => {
          try {
            const response = await fetch('/api/auth/token');
            if (!response.ok) {
              throw new Error('Failed to get access token');
            }
            const json = await response.json();
            callback(json.access_token, json.expires_in);
          } catch (error) {
            console.error('Failed to get access token', error);
            callback(null, 0);
          }
        }
      };
      
      return new Promise((resolve, reject) => {
        Autodesk.Viewing.Initializer(options, () => {
          const config = {
            extensions: ['Autodesk.Viewing.MarkupsCore', 'Autodesk.Viewing.MarkupsGui']
          };
          const viewer = new Autodesk.Viewing.GuiViewer3D(container, config);
          const startedCode = viewer.start();
          if (startedCode > 0) {
            console.error('Failed to start the viewer');
            reject(new Error(`Failed to start the viewer, error code: ${startedCode}`));
            return;
          }
          
          // Set background color to light grey
          viewer.setBackgroundColor(245, 245, 245, 245, 245, 245);
          
          // Setup event listeners for the viewer
          viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, () => {
            console.log('Model geometry loaded');
          });
          
          resolve(viewer);
        });
      });
    } catch (error) {
      console.error('Error initializing viewer:', error);
      throw error;
    }
  }
  
  /**
   * Loads a specific model into the viewer
   * @param {Object} viewer - The viewer instance
   * @param {string} urn - The URN of the model to load (base64-encoded)
   * @returns {Promise<Object>} The loaded model
   */
  export async function loadModel(viewer, urn) {
    return new Promise((resolve, reject) => {
      function onDocumentLoadSuccess(doc) {
        // Get all 3D views
        const views = doc.getRoot().search({'type': 'geometry'});
        if (views.length === 0) {
          console.error('Document contains no viewables');
          reject(new Error('Document contains no viewables'));
          return;
        }
        
        // Load the default viewable
        const viewerDocument = doc;
        viewer.loadDocumentNode(viewerDocument, views[0]).then(model => {
          console.log('Model loaded successfully');
          resolve(model);
        }).catch(err => {
          console.error('Failed to load document node:', err);
          reject(err);
        });
      }
      
      function onDocumentLoadFailure(error) {
        console.error('Failed to load document:', error);
        reject(error);
      }
      
      // Check if a model is already loaded
      if (viewer.model) {
        // Unload current model before loading new one
        viewer.unloadModel(viewer.model);
      }
      
      // Show loading spinner
      viewer.showProgressBar(true);
      
      // Load the document
      Autodesk.Viewing.Document.load(
        `urn:${urn}`, 
        onDocumentLoadSuccess, 
        onDocumentLoadFailure
      );
    });
  }
  
  /**
   * Gets all available views for a model
   * @param {Object} doc - The document object
   * @returns {Array} Array of viewable objects
   */
  export function getAvailableViews(doc) {
    if (!doc) return [];
    
    const views = [];
    const viewables = doc.getRoot().search({'type': 'geometry'});
    
    viewables.forEach((viewable, index) => {
      views.push({
        id: viewable.data.id,
        name: viewable.data.name || `View ${index + 1}`
      });
    });
    
    return views;
  }
  
  /**
   * Switches to a specific view in the model
   * @param {Object} viewer - The viewer instance
   * @param {Object} doc - The document object
   * @param {string} viewId - The ID of the view to switch to
   * @returns {Promise<Object>} The loaded view
   */
  export async function switchView(viewer, doc, viewId) {
    return new Promise((resolve, reject) => {
      const viewable = doc.getRoot().findByGuid(viewId);
      if (!viewable) {
        reject(new Error(`View with ID ${viewId} not found`));
        return;
      }
      
      viewer.loadDocumentNode(doc, viewable).then(model => {
        resolve(model);
      }).catch(err => {
        reject(err);
      });
    });
  }
  
  /**
   * Toggles a specific extension on or off
   * @param {Object} viewer - The viewer instance
   * @param {string} extensionId - The ID of the extension
   * @param {boolean} enable - Whether to enable or disable the extension
   * @returns {Promise<boolean>} Whether the operation was successful
   */
  export async function toggleExtension(viewer, extensionId, enable) {
    return new Promise((resolve, reject) => {
      if (!viewer) {
        reject(new Error('Viewer is not initialized'));
        return;
      }
      
      if (enable) {
        viewer.loadExtension(extensionId)
          .then(() => resolve(true))
          .catch(err => {
            console.error(`Failed to load extension ${extensionId}:`, err);
            reject(err);
          });
      } else {
        viewer.unloadExtension(extensionId);
        resolve(true);
      }
    });
  }