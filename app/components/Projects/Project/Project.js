import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';

import { firestore } from '../../../firebase';
import Footer from './Footer';

const fs = require('fs');
const exec = require('child_process').exec;

const StyledProject = styled.div`
  background: white;
  color: ${props => props.theme.text};
  display: grid;
  grid-template-rows: 270px auto;
  border: 1px solid #c5c5c5;
  transition: all 0.8s ease;

  @media (max-width: 750px) {
    border: none;
  }
`;

const ProjectImageTop = styled.div`
  margin: 3.5rem 3.5rem 0 3.5rem;
  background-image: ${props => `url(${props.image})`};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  border-radius: 0.6rem 0.6rem 0px 0px;
`;

const ProjectBody = styled.div`
  padding-top: 1.9rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TopContent = styled.div`
  margin: 0 3.5rem 1rem 3.5rem;

  h3 {
    margin: 0;
    margin-bottom: 0.5rem;
    line-height: 3rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

    &.more-info-link {
      text-decoration: underline;
      cursor: pointer;

      &:hover {
        color: ${props => props.theme.primary};
      }
    }
  }

  p {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    margin: 1rem 0;
  }

  h3 {
    margin-bottom: 0.2rem;
    a {
      color: inherit;
    }
  }

  .tags {
    color: #aeaeae;
    font-style: italic;
  }
`;

const MoreInfo = styled.div`
  display: flex;
  flex-direction: column;

  img {
    border-top: 1px solid #c5c5c5;
    border-bottom: 1px solid #c5c5c5;
    width: 100%;
  }

  .notes {
    border-top: 1px solid #c5c5c5;
    border-bottom: 1px solid #c5c5c5;
    padding: 1.5rem 3.5rem 0 3.5rem;
    background: #c5c5c5;
    position: relative;

    .notes-title {
      transform: rotate(-90deg);
      margin-left: -1.5rem;
      position: absolute;
      bottom: 0;
      left: 0;
      color: white;
    }
  }
`;

const Project = ({ project, selectProject, selectedProject }) => {
  const [projectNotes, setProjectNotes] = useState(null);
  const [showExtraInfo, setShowExtraInfo] = useState(false);

  const handleDelete = id => {
    firestore.doc(`projects/${id}`).delete();
  };

  const getNoteContents = () => {
    const noteFileName = 'NOTES';
    fs.readdir(project.folder, (err, files) => {
      if (!files.includes(`${noteFileName}.md`)) {
        setProjectNotes('No NOTES.md file found.');
        return;
      }

      const notesPath = `${project.folder}/${noteFileName}.md`;
      const content = fs.readFileSync(notesPath).toString();

      if (content !== projectNotes) {
        setProjectNotes(content);
      }
    });
  };

  const showNotesDiv = () => {
    setShowExtraInfo(!showExtraInfo);
    if (!projectNotes) {
      getNoteContents();
    }
  };

  const executeCommand = (command, callback) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        callback(error);

        return;
      }
      callback(stdout);
    });
  };

  const openServer = () => {
    // open window in VSCOde as well as open server in terminal that starts the application
    executeCommand(`code ${project.folder}`, output => {
      console.log(output);
    });
  };

  return (
    <StyledProject>
      <ProjectImageTop
        image={
          project.image
            ? project.image
            : 'https://res.cloudinary.com/dpekucrvb/image/upload/v1573953781/undraw_insert_block_efyb.svg'
        }
      />
      <ProjectBody>
        <div>
          <TopContent>
            <h3
              className={project.additionalImage ? 'more-info-link' : ''}
              onClick={() => project.additionalImage && selectProject(project)}
            >
              {project.title}
            </h3>
            <p>{project.description}</p>

            <div className="tags">
              {project.tags.map(tag => (
                <span key={tag}>{tag} · </span>
              ))}
            </div>
          </TopContent>

          <MoreInfo>
            {selectedProject && selectedProject.id === project.id && (
              <img src={project.additionalImage} alt="" />
            )}

            {showExtraInfo && projectNotes && (
              <div className="notes">
                <p className="notes-title">NOTES</p>
                <Markdown>{projectNotes}</Markdown>
              </div>
            )}
          </MoreInfo>
        </div>

        <Footer
          project={project}
          showNotesDiv={showNotesDiv}
          openServer={openServer}
          handleDelete={handleDelete}
        />
      </ProjectBody>
    </StyledProject>
  );
};

Project.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    folder: PropTypes.string.isRequired,
    github: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
  }),
  selectProject: PropTypes.func
};

export default Project;
