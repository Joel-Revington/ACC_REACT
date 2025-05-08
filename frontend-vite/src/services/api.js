// src/services/api.js
// Handles API interactions with Autodesk Platform Services

/**
 * Fetches the hubs available to the authenticated user
 * @returns {Promise<Array>} Array of hub objects
 */
export async function fetchHubs() {
  try {
    const response = await fetch('/api/hubs');
    if (!response.ok) {
      throw new Error(`Failed to fetch hubs: ${response.statusText}`);
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching hubs:', error);
    throw error;
  }
}

/**
 * Fetches projects for a specific hub
 * @param {string} hubId - The ID of the hub
 * @returns {Promise<Array>} Array of project objects
 */
export async function fetchProjects(hubId) {
  try {
    const response = await fetch(`/api/hubs/${hubId}/projects`);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

/**
 * Fetches contents of a folder
 * @param {string} hubId - The ID of the hub
 * @param {string} projectId - The ID of the project
 * @param {string} folderId - The ID of the folder
 * @returns {Promise<Array>} Array of folder contents
 */
export async function fetchFolderContents(hubId, projectId, folderId) {
  try {
    const response = await fetch(`/api/hubs/${hubId}/projects/${projectId}/contents?folder_id=${folderId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch folder contents: ${response.statusText}`);
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching folder contents:', error);
    throw error;
  }
}

/**
 * Fetches versions of an item
 * @param {string} hubId - The ID of the hub
 * @param {string} projectId - The ID of the project
 * @param {string} itemId - The ID of the item
 * @returns {Promise<Array>} Array of version objects
 */
export async function fetchItemVersions(hubId, projectId, itemId) {
  try {
    const response = await fetch(`/api/hubs/${hubId}/projects/${projectId}/items/${itemId}/versions`);
    if (!response.ok) {
      throw new Error(`Failed to fetch versions: ${response.statusText}`);
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching versions:', error);
    throw error;
  }
}

/**
 * Initializes the sidebar tree with hubs, projects, folders, items, and versions
 * @param {HTMLElement} container - The DOM element to contain the tree
 * @param {Function} onModelSelect - Callback function when a model is selected
 */
export async function initSidebarTree(container, onModelSelect) {
  const rootList = document.createElement('ul');
  rootList.className = 'tree-list';
  container.appendChild(rootList);

  try {
    const hubs = await fetchHubs();

    if (hubs.length === 0) {
      const emptyMessage = document.createElement('li');
      emptyMessage.className = 'empty-message';
      emptyMessage.textContent = 'No hubs found';
      rootList.appendChild(emptyMessage);
      return;
    }

    for (const hub of hubs) {
      const hubNode = createTreeNode(hub.attributes.name, 'hub-icon', true);
      rootList.appendChild(hubNode);

      const projectsList = document.createElement('ul');
      projectsList.className = 'tree-list';
      projectsList.style.display = 'none';
      hubNode.appendChild(projectsList);

      const hubLabel = hubNode.querySelector('.tree-node-label');
      hubLabel.addEventListener('click', async () => {
        const isExpanded = hubLabel.classList.toggle('expanded');
        projectsList.style.display = isExpanded ? 'block' : 'none';

        if (isExpanded && projectsList.children.length === 0) {
          projectsList.innerHTML = '<li class="loading-item">Loading projects...</li>';
          try {
            const projects = await fetchProjects(hub.id);
            projectsList.innerHTML = '';

            for (const project of projects) {
              const projectNode = createTreeNode(project.attributes.name, 'project-icon', true);
              projectsList.appendChild(projectNode);

              const foldersList = document.createElement('ul');
              foldersList.className = 'tree-list';
              foldersList.style.display = 'none';
              projectNode.appendChild(foldersList);

              const projectLabel = projectNode.querySelector('.tree-node-label');
              projectLabel.addEventListener('click', async () => {
                const isExpanded = projectLabel.classList.toggle('expanded');
                foldersList.style.display = isExpanded ? 'block' : 'none';

                if (isExpanded && foldersList.children.length === 0) {
                  foldersList.innerHTML = '<li class="loading-item">Loading folders...</li>';
                  try {
                    const response = await fetch(`/api/hubs/${hub.id}/projects/${project.id}/contents`);
                    if (!response.ok) throw new Error(`Failed to fetch top folders: ${response.statusText}`);

                    const topFolders = await response.json();
                    foldersList.innerHTML = '';

                    for (const folder of topFolders) {
                      await createFolderNode(folder, foldersList, hub.id, project.id, onModelSelect);
                    }
                  } catch (error) {
                    console.error('Error loading top folders:', error);
                    foldersList.innerHTML = '<li class="error-item">Failed to load folders</li>';
                  }
                }
              });
            }
          } catch (error) {
            console.error('Error loading projects:', error);
            projectsList.innerHTML = '<li class="error-item">Failed to load projects</li>';
          }
        }
      });
    }
  } catch (error) {
    console.error('Error initializing sidebar tree:', error);
    rootList.innerHTML = '<li class="error-message">Failed to load hubs</li>';
  }
}

/**
 * Creates a folder node and its children recursively
 * @param {Object} folder - The folder object
 * @param {HTMLElement} parentElement - The parent DOM element
 * @param {string} hubId - The ID of the hub
 * @param {string} projectId - The ID of the project
 * @param {Function} onModelSelect - Callback function when a model is selected
 */
async function createFolderNode(folder, parentElement, hubId, projectId, onModelSelect) {
  const folderNode = createTreeNode(folder.attributes.displayName || folder.attributes.name, 'icon-my-folder', true);
  parentElement.appendChild(folderNode);

  const contentsList = document.createElement('ul');
  contentsList.className = 'tree-list';
  contentsList.style.display = 'none';
  folderNode.appendChild(contentsList);

  const folderLabel = folderNode.querySelector('.tree-node-label');
  folderLabel.addEventListener('click', async () => {
    const isExpanded = folderLabel.classList.toggle('expanded');
    contentsList.style.display = isExpanded ? 'block' : 'none';

    if (isExpanded && contentsList.children.length === 0) {
      contentsList.innerHTML = '<li class="loading-item">Loading contents...</li>';

      try {
        console.log("hubID",hubId,"projectId", projectId,"folder.id",folder.id);
        
        const contents = await fetchFolderContents(hubId, projectId, folder.id);
        contentsList.innerHTML = '';

        if (contents.length === 0) {
          const emptyItem = document.createElement('li');
          emptyItem.className = 'empty-item';
          emptyItem.textContent = 'Empty folder';
          contentsList.appendChild(emptyItem);
          return;
        }

        for (const item of contents) {
          if (item.type === 'folders') {
            await createFolderNode(item, contentsList, hubId, projectId, onModelSelect);
          } else if (item.type === 'items') {
            const itemNode = createTreeNode(item.attributes.displayName || item.attributes.name, 'icon-item', true);
            contentsList.appendChild(itemNode);

            const versionsList = document.createElement('ul');
            versionsList.className = 'tree-list';
            versionsList.style.display = 'none';
            itemNode.appendChild(versionsList);

            const itemLabel = itemNode.querySelector('.tree-node-label');
            itemLabel.addEventListener('click', async () => {
              const isExpanded = itemLabel.classList.toggle('expanded');
              versionsList.style.display = isExpanded ? 'block' : 'none';

              if (isExpanded && versionsList.children.length === 0) {
                versionsList.innerHTML = '<li class="loading-item">Loading versions...</li>';

                try {
                  const versions = await fetchItemVersions(hubId, projectId, item.id);
                  versionsList.innerHTML = '';

                  for (const version of versions) {
                    const versionNode = createTreeNode(
                      `v${version.attributes.versionNumber}: ${version.attributes.displayName || version.attributes.name}`,
                      'icon-version',
                      false
                    );
                    versionsList.appendChild(versionNode);

                    const versionLabel = versionNode.querySelector('.tree-node-label');
                    versionLabel.addEventListener('click', () => {
                      if (onModelSelect) {
                        onModelSelect(version);
                      }
                    });
                  }
                } catch (error) {
                  console.error('Error loading versions:', error);
                  versionsList.innerHTML = '<li class="error-item">Failed to load versions</li>';
                }
              }
            });
          }
        }
      } catch (error) {
        console.error('Error loading folder contents:', error);
        contentsList.innerHTML = '<li class="error-item">Failed to load contents</li>';
      }
    }
  });
}

/**
 * Creates a tree node HTML element
 * @param {string} name - Display name for the node
 * @param {string} iconClass - CSS class for the icon
 * @param {boolean} expandable - Whether the node can be expanded
 * @returns {HTMLElement} Tree node element
 */
function createTreeNode(name, iconClass, expandable) {
  const node = document.createElement('li');
  node.className = 'tree-node';

  const label = document.createElement('span');
  label.className = 'tree-node-label';
  if (expandable) label.classList.add('expandable');

  const icon = document.createElement('span');
  icon.className = `tree-node-icon ${iconClass}`;

  const text = document.createElement('span');
  text.className = 'tree-node-text';
  text.textContent = name;

  label.appendChild(icon);
  label.appendChild(text);
  node.appendChild(label);

  return node;
}
