import React, { Component, createContext } from 'react';

import { firestore } from '../firebase';
import { collectIdsAndData } from '../utils/utilities';

export const ProjectsContext = createContext();

class ProjectsProvider extends Component {
  state = { projects: [], filter: { tags: [] }, sortBy: 'starred' };

  unsubscribe = null;

  componentDidMount = () => {
    this.unsubscribe = firestore.collection('projects').onSnapshot(snapshot => {
      const projects = snapshot.docs.map(collectIdsAndData);
      this.setState({ projects });
    });
  };

  componentWillUnmount = () => {
    this.unsubscribe();
  };

  updateFilter = (type, selectedItem) => {
    const { filter } = this.state;
    let newItems;

    if (filter[type].includes(selectedItem)) {
      const index = filter[type].indexOf(selectedItem);
      if (index !== -1) {
        newItems = filter[type].filter(t => t !== selectedItem);
      }
    } else {
      newItems = [...filter[type], selectedItem];
    }

    this.setState({
      filter: { [type]: newItems }
    });
  };

  updateSort = toSortBy => {
    this.setState({
      sortBy: toSortBy
    });
  };

  static applyFilterAndSort(projects, filter, sortBy) {
    let filteredAndSortedProjects;

    // Filter
    if (filter.tags.length === 0) {
      filteredAndSortedProjects = projects;
    } else {
      filteredAndSortedProjects = projects.filter(r =>
        filter.tags.every(tag => -1 !== r.tags.indexOf(tag))
      );
    }

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

    return filteredAndSortedProjects;
  }

  render() {
    const { projects, filter, sortBy } = this.state;
    const { children } = this.props;

    const filteredProjects = ProjectsProvider.applyFilterAndSort(
      projects,
      filter,
      sortBy
    );

    return (
      <ProjectsContext.Provider
        value={{
          projects: filteredProjects,
          updateFilter: this.updateFilter,
          updateSort: this.updateSort,
          selectedSort: sortBy,
          filter
        }}
      >
        {children}
      </ProjectsContext.Provider>
    );
  }
}

export default ProjectsProvider;
