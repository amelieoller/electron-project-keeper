import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { firestore } from '../../firebase';
import { ReactComponent as Star } from '../../assets/icons/star.svg';
import Footer from './Footer';
import AdditionalInfo from './AdditionalInfo';
import { createAbsolutePath } from '../../utils/utilities';
import withUser from '../../hocs/withUser';
import withImages from '../../hocs/withImages';

const exec = require('child_process').exec;
const fixPath = require('fix-path');

const StyledProject = styled.div`
  background: ${({ theme }) => theme.transparentWhite};
  color: ${({ theme }) => theme.text};
  border: ${({ theme }) => theme.border};
  transition: all 0.8s ease;
  border-radius: ${({ theme }) => theme.sizes.borderRadius};
  position: relative;
  overflow-x: auto;
  padding: 2.5rem 0;

  hr {
    margin: 2.5rem;
  }
`;

const StyledStar = styled.span`
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  cursor: pointer;

  path {
    color: ${({ theme }) => theme.primaryLight};
    color: ${props => props.starred && props.theme.primaryLight} !important;
    fill: ${props => (props.starred ? props.theme.primaryLight : 'transparent')};
  }

  &:hover path {
    transition: all ${({ theme }) => theme.transitions.ease};
    fill: ${({ theme }) => theme.primaryLight};
    color: ${({ theme }) => theme.primaryLight} !important;
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
  margin-right: ${props => props.starred && '2rem'};

  @media (max-width: 870px) {
    margin-right: 0;
  }
`;

const ProjectBody = styled.div`
  padding-top: 1.9rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: ${props => (props.starred ? '100%' : 'calc(100% - 270px)')};
  border-left: ${props => (props.starred ? props.theme.border : 'none')};
  padding-left: ${props => props.starred && '2rem'};

  /* Create better fix for tall neighbor */
  max-height: 28rem;

  @media (max-width: 870px) {
    border-left: none;
    padding-left: 0;
  }
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

const StyledTopSection = styled.span`
  padding: 0 2.5rem;
  position: relative;
  display: ${props => (props.starred ? 'grid' : 'block')};
  overflow-x: auto;

  grid-template-columns: 40% auto;
  grid-column-gap: 4rem;

  @media (max-width: 870px) {
    display: block;
  }

  @media (max-width: 550px) {
    border: none;
    border-radius: 0;
  }
`;

const Project = ({
  project,
  projectOpenId,
  setProjectOpenId,
  selectedSort,
  user,
  images
}) => {
  const [projectNotes, setProjectNotes] = useState(null);
  const [additionalImages, setAdditionalImages] = useState(null);

  const handleDelete = id => {
    firestore.doc(`users/${user.uid}/projects/${id}`).delete();
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
    // Fix path for production environment
    fixPath();
    // console.log(process.env.PATH);

    // open window in VSCOde
    executeCommand(`code ${createAbsolutePath(project.folder)}`, output => {
      console.log(output);
      // node --inspect-brk
    });
  };

  const expandCard = () => {
    if (project.id === projectOpenId) {
      setProjectOpenId(null);
    } else {
      setProjectOpenId(project.id);
    }
  };

  const handleStarClick = () => {
    const updated = new Date();

    firestore
      .doc(`users/${user.uid}/projects/${project.id}`)
      .update({ starred: !project.starred, updated });
  };

  const isStarred = project.starred && selectedSort === 'starred';

  return (
    <StyledProject starred={isStarred}>
      <StyledTopSection starred={isStarred}>
        <StyledStar starred={isStarred} className="star-container">
          <Star onClick={handleStarClick} />
        </StyledStar>

        <ProjectImageTop
          image={
            project.image && images[project.image]
              ? images[project.image]
              : images['default.svg']
          }
          starred={isStarred}
          onClick={expandCard}
        />
        <ProjectBody starred={isStarred}>
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
              showExtraInfo={projectOpenId === project.id}
            />
          </WithoutExtraContent>
        </ProjectBody>
      </StyledTopSection>
      {projectOpenId === project.id && (
        <AdditionalInfo
          project={project}
          projectNotes={projectNotes}
          setProjectNotes={setProjectNotes}
          additionalImages={additionalImages}
          setAdditionalImages={setAdditionalImages}
        />
      )}
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

export default withUser(withImages(Project));
