import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import { ProjectsContext } from '../../providers/ProjectsProvider';
import Project from '../Project';

const StyledProjects = styled.div`
  display: grid;
  grid-template-columns: ${props =>
    props.starred ? '1fr 1fr' : 'repeat(auto-fill, minmax(360px, 1fr))'};
  grid-gap: 5rem;
  margin-top: 4rem;

  @media (max-width: 1300px) {
    grid-template-columns: ${props => props.starred && '1fr'};
  }

  @media (max-width: 550px) {
    grid-template-columns: 1fr;
    grid-gap: 0;

    & > div {
      &:nth-child(odd) {
        background: ${({ theme }) => theme.primaryBackground};

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
  const { projects, selectedSort } = useContext(ProjectsContext);
  const [projectOpenId, setProjectOpenId] = useState(null);
  let otherProjects = projects;

  if (selectedSort === 'starred') {
    otherProjects = projects.filter(project => !project.starred);
  }

  return (
    <>
      {selectedSort === 'starred' && (
        <StyledProjects starred={true}>
          {projects
            .filter(project => project.starred)
            .map(project => (
              <Project
                key={project.id}
                project={project}
                projectOpenId={projectOpenId}
                setProjectOpenId={setProjectOpenId}
                selectedSort={selectedSort}
              />
            ))}
        </StyledProjects>
      )}

      <StyledProjects>
        {otherProjects.map(project => (
          <Project
            key={project.id}
            project={project}
            projectOpenId={projectOpenId}
            setProjectOpenId={setProjectOpenId}
            selectedSort={selectedSort}
          />
        ))}
      </StyledProjects>
    </>
  );
};

Projects.propTypes = {};

export default Projects;
