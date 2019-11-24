import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Project from './Project';
import { ProjectsContext } from '../../providers/ProjectsProvider';

const StyledProjects = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 5rem;
  margin-top: 4rem;

  @media (max-width: 750px) {
    grid-template-columns: 1fr;
    grid-gap: 0;

    & > div {
      padding: 2rem 0;

      &:nth-child(odd) {
        background: ${props => props.theme.primaryBackground};

        .tags > span {
          color: white;
        }
      }
    }
  }
`;

const Projects = () => {
  const { projects } = useContext(ProjectsContext);
  const [selectedProject, setSelectedProject] = useState(null);

  const selectProject = project => {
    if (project && (!selectedProject || selectedProject.id !== project.id)) {
      // If there is a project AND no selected project yet, or the newly selected project is different from the previous one, set the selected project
      setSelectedProject(project);
    } else {
      // If there is a selected project that needs to be removed
      setSelectedProject(null);
    }
  };

  return (
    <>
      <StyledProjects>
        {projects.map(project => (
          <Project
            key={project.id}
            project={project}
            selectProject={selectProject}
            selectedProject={selectedProject}
          />
        ))}
      </StyledProjects>
    </>
  );
};

Projects.propTypes = {};

export default Projects;
