import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Markdown from 'markdown-to-jsx';

import { firestore } from '../../../firebase';
import Footer from './Footer';
import { ReactComponent as Star } from '../../../assets/icons/star.svg';
import Button from '../../Button';

const fs = require('fs');
const exec = require('child_process').exec;

const StyledProject = styled.div`
  background: white;
  color: ${props => props.theme.text};
  display: grid;
  grid-template-rows: 270px auto;
  border: ${props => props.theme.border};
  transition: all 0.8s ease;
  border-radius: ${props => props.theme.sizes.borderRadius};
  padding: 2.5rem;
  position: relative;

  @media (max-width: 750px) {
    border: none;
  }
`;

const StyledStar = styled.span`
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  cursor: pointer;

  path {
    color: ${props => props.theme.lightGrey};
    color: ${props => props.starred && props.theme.primary} !important;
    fill: ${props => (props.starred ? props.theme.primary : 'transparent')};
  }

  &:hover path {
    transition: all ${props => props.theme.transitions.ease};
    fill: ${props => props.theme.primary};
    color: ${props => props.theme.primary} !important;
  }
`;

const ProjectImageTop = styled.div`
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
  height: 100%;
`;

const WithoutExtraContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const TopContent = styled.div`
  h3 {
    margin: 0;
    margin-bottom: 0.5rem;
    line-height: 3rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
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
    width: 100%;
  }
`;

const Project = ({ project }) => {
  const [projectNotes, setProjectNotes] = useState(null);
  const [extraInfo, setExtraInfo] = useState(false);

  const handleDelete = id => {
    firestore.doc(`projects/${id}`).delete();
  };

  const getNoteContents = () => {
    const notesFileName = 'NOTES.md';

    fs.readdir(project.folder, (err, files) => {
      if (!files.includes(notesFileName)) {
        setProjectNotes('no notes');
        return;
      }

      const notesPath = `${project.folder}/${notesFileName}`;
      let content = fs.readFileSync(notesPath).toString();

      if (content !== projectNotes) {
        if (content === '') {
          content = 'No content in this NOTES.md file yet.';
        }

        setProjectNotes(content);
      }
    });
  };

  const createNewFile = () => {
    const notesPath = `${project.folder}/NOTES.md`;

    fs.writeFile(notesPath, '', err => {
      if (err) return console.log(err);

      const content = '# NOTES \n Enter Some notes here...';
      writeToFile(notesPath, content);
      setProjectNotes(content);
    });
  };

  const writeToFile = (path, content) => {
    fs.writeFile(path, content, err => {
      if (err) return console.log(err);
      console.log('saved');
    });
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

  const openFolderInEditor = () => {
    // open window in VSCOde
    executeCommand(`code ${project.folder}`, output => {
      console.log(output);
    });
  };

  const expandCard = () => {
    setExtraInfo(!extraInfo);
  };

  const renderExtraInfo = () => {
    !projectNotes && project.folder && getNoteContents();

    if (project.additionalImage && projectNotes) {
      return (
        <>
          <hr />
          <img src={project.additionalImage} alt="" />

          <hr />
          <div className="notes">
            {projectNotes !== 'no notes' ? (
              <Markdown>{projectNotes}</Markdown>
            ) : (
              <div>
                No NOTES.md file found, would you like to create one?{' '}
                <Button onClick={createNewFile}>Create NOTES.md File</Button>
              </div>
            )}
          </div>
        </>
      );
    }

    if (project.additionalImage) {
      return (
        <>
          <hr />
          <img src={project.additionalImage} alt="" />
        </>
      );
    }

    if (projectNotes) {
      return (
        <div className="notes">
          <hr />
          <Markdown>{projectNotes}</Markdown>
        </div>
      );
    }
  };

  const handleStarClick = () => {
    const updated = new Date();

    firestore
      .doc(`projects/${project.id}`)
      .update({ starred: !project.starred, updated });
  };

  return (
    <StyledProject>
      <StyledStar starred={project.starred} className="star-container">
        <Star onClick={handleStarClick} />
      </StyledStar>

      <ProjectImageTop
        image={
          project.image
            ? project.image
            : 'https://res.cloudinary.com/dpekucrvb/image/upload/v1573953781/undraw_insert_block_efyb.svg'
        }
      />
      <ProjectBody>
        <WithoutExtraContent>
          <TopContent>
            <h3>{project.title}</h3>
            <p>{project.description}</p>

            <div className="tags">
              {project.tags.map(tag => (
                <span key={tag}>{tag} · </span>
              ))}
            </div>
          </TopContent>

          <Footer
            project={project}
            openFolderInEditor={openFolderInEditor}
            handleDelete={handleDelete}
            expandCard={expandCard}
            extraInfo={extraInfo}
          />
        </WithoutExtraContent>
        {extraInfo && <MoreInfo>{renderExtraInfo()}</MoreInfo>}
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
  })
};

export default Project;
