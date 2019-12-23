import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import { firestore } from '../../firebase';
import { ReactComponent as Check } from '../../assets/icons/check.svg';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import TextNotificationWithButton from '../../molecules/TextNotificationWithButton';
import {
  createAbsolutePath,
  createRelativePath,
  moveArrayItem,
  twoFlatArraysAreEqual
} from '../../utils/utilities';
import Tags from './Tags';
import withUser from '../../hocs/withUser';
import withImages from '../../hocs/withImages';

const { remote } = window.require('electron');
const { dialog } = remote.require('electron');

const StyledForm = styled.div`
  position: relative;
  max-width: 95rem;
  margin: 0 auto;
  background: ${({ theme }) => theme.transparentWhite};
  width: 100%;
  padding: 6rem;
  border: ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.sizes.borderRadius};

  @media (max-width: 870px) {
    padding: 7rem 5rem;
  }

  @media (max-width: 550px) {
    padding: 5rem 3rem;
    margin: 0;
    border: none;
  }

  form {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-column-gap: 5rem;

    @media (max-width: 870px) {
      display: block;
    }
  }

  h2 {
    margin-top: 0;
    margin-bottom: 4rem;
    font-size: 2.4rem;
    text-align: center;
  }

  .input-label {
    font-size: 1.2rem;
    font-weight: 300;
    color: ${({ theme }) => theme.grey};
    text-transform: uppercase;
    margin-bottom: 0.4rem;
  }

  .footer {
    grid-column: span 2;

    .submit-button {
      display: flex;
      align-items: center;

      .messages {
        display: flex;
        flex-direction: column;
        margin-left: 2rem;
        font-size: 1.2rem;
        justify-content: space-around;
        height: 3.5rem;

        .discard-link {
          cursor: pointer;
          text-decoration: underline;
          color: ${({ theme }) => theme.primaryLight};

          &:hover {
            color: ${({ theme }) => theme.text};
          }
        }

        .error {
          color: ${({ theme }) => theme.primaryBackground};
          font-style: italic;
        }
      }
    }
  }
`;

const AdditionalImages = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  height: 200px;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 1rem;
  cursor: pointer;

  &::-webkit-scrollbar {
    display: none;
  }

  .image-wrap:last-child img {
    margin-right: 2.5rem;
  }

  .image-wrap {
    flex: 0 0 auto;
    margin-right: 1rem;
    height: 200px;

    img {
      border: ${({ theme }) => theme.border};

      height: 100%;
      width: auto;

      &.selected {
        border: 2px solid ${({ theme }) => theme.primaryBackground};
      }
    }
  }
`;

const LeftForm = styled.div`
  overflow-x: auto;
`;

const Form = ({ existingProject, history, titleText, user, images }) => {
  const initialProjectState = {
    title: '',
    description: '',
    github: '',
    folder: '',
    image: '',
    additionalImage: '',
    server: '',
    live: '',
    tags: [],
    updated: new Date(),
    userUid: user.uid
  };

  const [project, setProject] = useState(initialProjectState);
  const [error, setError] = useState(null);

  useEffect(() => {
    resetProject();
  }, [existingProject]);

  const resetProject = () => {
    !!existingProject
      ? setProject({ ...initialProjectState, ...existingProject })
      : setProject(initialProjectState);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (project.title) {
      if (!compareProjects()) {
        // if projects are different
        project.id ? handleUpdate() : handleCreate();
      }

      history.push('/');
    } else {
      // if project doesn't have a title
      setError('Project needs to have title.');
    }
  };
  const handleCreate = () => {
    firestore.collection(`users/${user.uid}/projects`).add(project);
  };

  const handleUpdate = () => {
    const updated = new Date();

    firestore
      .doc(`users/${user.uid}/projects/${project.id}`)
      .update({ ...project, updated });
  };

  const selectFolder = () => {
    const directory = dialog.showOpenDialogSync({
      properties: ['openDirectory'],
      buttonLabel: 'Select Folder',
      title: 'Select Folder'
    });

    if (directory.length === 0) return;

    setProject({
      ...project,
      folder: createRelativePath(directory[0])
    });
  };

  const compareProjects = () => {
    let initialProject = existingProject ? existingProject : initialProjectState;

    const attributes = [
      'title',
      'description',
      'github',
      'folder',
      'image',
      'server',
      'live'
    ];

    const attrCompare = attributes.every(attr => project[attr] === initialProject[attr]);
    return attrCompare && twoFlatArraysAreEqual(project.tags, initialProject.tags);
  };

  return (
    <StyledForm>
      <h2>{titleText}</h2>
      <form onSubmit={handleSubmit}>
        <LeftForm>
          <Input
            onChange={handleChange}
            value={project.title}
            name="title"
            placeholder="Title"
            type="text"
            title="Title"
          />
          <Input
            onChange={handleChange}
            value={project.description}
            name="description"
            placeholder="Description"
            type="textarea"
            title="Description"
          />
          <Input
            onChange={handleChange}
            value={project.github}
            name="github"
            placeholder="GitHub URL"
            title="GitHub URL"
            type="text"
          />
          <Input
            onChange={handleChange}
            value={project.image}
            name="image"
            placeholder="Image"
            title="Image"
            type="text"
          />
          <Input
            onChange={handleChange}
            value={project.live && project.live}
            name="live"
            placeholder="Live Site"
            title="Live Site"
            type="text"
          />
          <AdditionalImages>
            {images &&
              moveArrayItem(
                Object.keys(images),
                Object.keys(images).indexOf(project.image),
                0
              ).map(imageKey => (
                <div
                  key={imageKey}
                  className="image-wrap"
                  onClick={() => {
                    setProject({ ...project, image: imageKey });
                  }}
                >
                  <img
                    src={images[imageKey]}
                    className={imageKey === project.image ? 'selected' : ''}
                  />
                </div>
              ))}
          </AdditionalImages>
        </LeftForm>

        <Tags project={project} setProject={setProject} user={user} />

        <div className="footer">
          <hr />
          <TextNotificationWithButton
            text={
              project.folder
                ? `Selected Folder: ${createAbsolutePath(project.folder)}`
                : 'No Folder Selected'
            }
            buttonText={project.folder ? 'Change Folder' : 'Add Folder'}
            onButtonClick={selectFolder}
          />
          <hr />
          <div className="submit-button">
            <Button type="submit" full>
              <Check />
              Submit
            </Button>

            <div className="messages">
              {!compareProjects() && (
                <span
                  className="discard-link"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure? This will wipe out any changes you've made so far."
                      )
                    )
                      resetProject();
                  }}
                >
                  Discard Changes
                </span>
              )}

              {error && !project.title && <span className="error">{error}</span>}
            </div>
          </div>
        </div>
      </form>
    </StyledForm>
  );
};

export default withUser(withImages(withRouter(Form)));
