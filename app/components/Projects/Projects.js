import React, { useContext } from 'react';
import styled from 'styled-components';

import { ProjectsContext } from '../../providers/ProjectsProvider';
import Project from './Project';

const StyledProjects = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  grid-gap: 5rem;
  margin-top: 4rem;

  @media (max-width: 750px) {
    grid-template-columns: 1fr;
    grid-gap: 0;

    & > div {
      &:nth-child(odd) {
        background: ${props => props.theme.primaryBackground};

        .star-container {
          path {
            color: white;
          }
        }

        .footer {
          svg {
            color: white;
          }
        }

        .tags > span {
          color: white;
        }
      }
    }
  }
`;

const Projects = () => {
  const { projects } = useContext(ProjectsContext);

  return (
    <>
      <StyledProjects>
        {projects.map(project => (
          <Project key={project.id} project={project} />
        ))}
      </StyledProjects>
    </>
  );
};

Projects.propTypes = {};

export default Projects;
