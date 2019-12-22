import React, { createContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import { auth, createUserProfileDocument, firestore } from '../firebase';
import { collectIdsAndData } from '../utils/utilities';

export const ProjectsContext = createContext();

const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState(null);
  const [filter, setFilter] = useState({ tags: [] });
  const [sortBy, setSortBy] = useState('starred');
  const [user, setUser] = useState(null);
  const [tags, setTags] = useState(null);

  useEffect(() => {
    let unsubscribeFromAuth = null;

    unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      const user = await createUserProfileDocument(userAuth);

      setUser(user);
    });

    return () => {
      unsubscribeFromAuth && unsubscribeFromAuth();
    };
  }, []);

  useEffect(() => {
    let unsubscribeFromProjects = null;
    let unsubscribeFromTags = null;

    if (!!user) {
      // Get projects for this user
      unsubscribeFromProjects = firestore
        .collection('users')
        .doc(user.uid)
        .collection('projects')
        .onSnapshot(snapshot => {
          const projects = snapshot.docs.map(collectIdsAndData);
          setProjects(projects);
        });

      // Get tags for this user
      unsubscribeFromTags = firestore
        .collection('users')
        .doc(user.uid)
        .collection('tags')
        .orderBy('name', 'asc')
        .onSnapshot(snapshot => {
          const tags = snapshot.docs.map(collectIdsAndData);
          setTags(tags);
        });
    }

    return () => {
      unsubscribeFromProjects && unsubscribeFromProjects();
      unsubscribeFromTags && unsubscribeFromTags();
    };
  }, [user]);

  const updateFilter = (type, selectedItem) => {
    let newItems;

    if (filter[type].includes(selectedItem)) {
      const index = filter[type].indexOf(selectedItem);
      if (index !== -1) {
        newItems = filter[type].filter(t => t !== selectedItem);
      }
    } else {
      newItems = [...filter[type], selectedItem];
    }

    setFilter({ [type]: newItems });
  };

  const updateSort = toSortBy => {
    setSortBy(toSortBy);
  };

  const applyFilterAndSort = (projects, filter, sortBy) => {
    let filteredAndSortedProjects = projects;

    // Sort
    if (sortBy === 'name') {
      // sort by name
      filteredAndSortedProjects.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'updated') {
      // sort by date
      filteredAndSortedProjects.sort((a, b) => b.updated.seconds - a.updated.seconds);
    } else if (sortBy === 'starred') {
      // put starred first, then sort by last updated
      filteredAndSortedProjects.sort((a, b) => {
        if (a.starred) {
          return -1;
        } else if (b.starred) {
          return 1;
        } else {
          return b.updated.seconds - a.updated.seconds;
        }
      });
    }

    // Filter
    if (filter.tags.length !== 0) {
      filteredAndSortedProjects = projects.filter(r =>
        filter.tags.every(tag => -1 !== r.tags.indexOf(tag))
      );
    }

    return filteredAndSortedProjects;
  };

  const filteredProjects = projects && applyFilterAndSort(projects, filter, sortBy);

  return (
    <ProjectsContext.Provider
      value={{
        projects: filteredProjects,
        updateFilter: updateFilter,
        updateSort: updateSort,
        selectedSort: sortBy,
        user,
        filter,
        tags
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export default withRouter(ProjectsProvider);
