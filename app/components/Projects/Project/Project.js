import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { firestore } from '../../../firebase';
import { ReactComponent as Star } from '../../../assets/icons/star.svg';
import Footer from './Footer';
import AdditionalInfo from './AdditionalInfo';

const exec = require('child_process').exec;

const StyledProject = styled.div`
  background: white;
  color: ${props => props.theme.text};
  border: ${props => props.theme.border};
  transition: all 0.8s ease;
  border-radius: ${props => props.theme.sizes.borderRadius};
  padding: 2.5rem;
  position: relative;
  display: block;

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
  height: 270px;
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

const Project = ({ project }) => {
  const [showExtraInfo, setShowExtraInfo] = useState(false);
  const [projectNotes, setProjectNotes] = useState(null);
  const [additionalImages, setAdditionalImages] = useState(null);

  const handleDelete = id => {
    firestore.doc(`projects/${id}`).delete();
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
    setShowExtraInfo(!showExtraInfo);
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
            showExtraInfo={showExtraInfo}
          />
        </WithoutExtraContent>
        {showExtraInfo && (
          <AdditionalInfo
            project={project}
            projectNotes={projectNotes}
            setProjectNotes={setProjectNotes}
            additionalImages={additionalImages}
            setAdditionalImages={setAdditionalImages}
          />
        )}
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
