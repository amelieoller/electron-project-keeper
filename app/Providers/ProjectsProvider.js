import React, { Component, createContext } from "react";
import { firestore } from "../firebase";
import { collectIdsAndData } from "../utils/utilities";

export const ProjectsContext = createContext();

class ProjectsProvider extends Component {
  state = { projects: [], filter: { tags: [] } };

  unsubscribe = null;

  componentDidMount = () => {
    this.unsubscribe = firestore.collection("projects").orderBy("updated", "desc").onSnapshot(snapshot => {
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

  static applyFilter(projects, filter) {
    let filteredProjects;

    if (filter.tags.length === 0) {
      filteredProjects = projects;
    } else {
      filteredProjects = projects.filter(
        r => filter.tags.every(tag => -1 !== r.tags.indexOf(tag))
      );
    }

    return filteredProjects;
  }

  render() {
    const { projects, filter } = this.state;
    const { children } = this.props;

    const filteredProjects = ProjectsProvider.applyFilter(projects, filter);

    return (
      <ProjectsContext.Provider
        value={{
          projects: filteredProjects,
          updateFilter: this.updateFilter,
          filter
        }}
      >
        {children}
      </ProjectsContext.Provider>
    );
  }
}

export default ProjectsProvider;
