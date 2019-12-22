import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import { firestore } from '../../firebase';
import { ReactComponent as Check } from '../../assets/icons/check.svg';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import TextNotificationWithButton from '../../molecules/TextNotificationWithButton';
import { createAbsolutePath, createRelativePath } from '../../utils/utilities';
import withUser from '../withUser';
import Tags from './Tags';

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
      text-align: center;
    }
  }
`;

const Form = ({ existingProject, history, titleText, user }) => {
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

  useEffect(() => {
    !!existingProject && setProject({ ...initialProjectState, ...existingProject });
  }, [existingProject, initialProjectState]);

  const handleChange = event => {
    const { name, value } = event.target;
    setProject({ ...project, [name]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (project.title) {
      history.push('/');

      project.id ? handleUpdate() : handleCreate();
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

  return (
    <StyledForm>
      <h2>{titleText}</h2>
      <form onSubmit={handleSubmit}>
        <div>
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
        </div>

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
          </div>
        </div>
      </form>
    </StyledForm>
  );
};

export default withUser(withRouter(Form));
