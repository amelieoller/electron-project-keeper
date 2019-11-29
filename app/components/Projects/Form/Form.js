import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import { firestore } from '../../../firebase';
import { TagsContext } from '../../../providers/TagsProvider';
import { ReactComponent as Check } from '../../../assets/icons/check.svg';
import { ReactComponent as X } from '../../../assets/icons/x.svg';
import Checkbox from './Checkbox/Checkbox';
import Button from '../../Button';
import Input from './Input';
import TextNotificationWithButton from '../../TextNotificationWithButton';

const remote = window.require('electron').remote;
const { dialog } = remote.require('electron');

const StyledForm = styled.div`
  position: relative;
  max-width: 95rem;
  margin: 5em auto;
  background: ${({ theme }) => theme.transparentWhite};
  width: 100%;
  padding: 11rem 9rem;
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

  .tag-wrapper {
    display: inline-block;

    .delete-tag {
      width: 9px;
      position: relative;
      cursor: pointer;
      display: inline-block;

      svg {
        display: none;
        position: absolute;
        left: -10px;
        bottom: -5px;
        color: ${({ theme }) => theme.lightGrey};
      }

      &:hover svg {
        color: ${({ theme }) => theme.primaryBackground};
      }
    }

    &:hover .delete-tag svg {
      display: inline-block;
    }
  }

  .new-tag-form {
    display: grid;
    align-items: flex-end;
    grid-template-columns: 2fr 1fr;

    .new-tag-form-group {
      margin-right: 1.5rem;
      margin-bottom: 0;

      input {
        font-size: 1.3rem;
        padding: 0.7rem 1.1rem;
      }
    }

    button {
      font-size: 1.3rem;
      white-space: nowrap;
      padding: 0.7rem 1.4rem;
    }
  }

  .footer {
    grid-column: span 2;

    .submit-button {
      text-align: center;
    }
  }
`;

const Form = ({ existingProject, history, titleText }) => {
  const { tags } = useContext(TagsContext);
  const initialProjectState = {
    title: '',
    description: '',
    github: '',
    folder: '',
    image: '',
    live: '',
    tags: [],
    updated: new Date()
  };

  const [project, setProject] = useState(initialProjectState);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    !!existingProject && setProject({ ...initialProjectState, ...existingProject });
  }, [existingProject]);

  const handleTagSelect = e => {
    const { name } = e.target;
    let newTags;

    if (project.tags.includes(name)) {
      const index = project.tags.indexOf(name);
      if (index !== -1) {
        newTags = project.tags.filter(t => t !== name);
      }
    } else {
      newTags = [...project.tags, name];
    }

    setProject({
      ...project,
      tags: newTags
    });
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setProject({ ...project, [name]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    history.push('/');

    project.id ? handleUpdate() : handleCreate();
  };

  const handleCreate = () => {
    firestore.collection('projects').add(project);
  };

  const handleUpdate = () => {
    const updated = new Date();
    firestore.doc(`projects/${project.id}`).update({ ...project, updated });
  };

  const selectFolder = () => {
    const directory = dialog.showOpenDialogSync({
      properties: ['openDirectory'],
      buttonLabel: 'Open Folder',
      title: 'Open Folder'
    });

    if (directory.length === 0) return;

    setProject({
      ...project,
      folder: directory[0]
    });
  };

  const handleTagCreation = () => {
    firestore.collection('tags').add({ name: newTag });
    setNewTag('');
  };

  const handleDeleteTag = tagId => {
    firestore.doc(`tags/${tagId}`).delete();
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
        <div className="checkboxes">
          <div className="input-label">Tags</div>
          {tags &&
            tags.map(tag => (
              <div className="tag-wrapper" key={tag.id}>
                <Checkbox
                  label={tag.name}
                  checked={project.tags.includes(tag.name)}
                  onChange={handleTagSelect}
                  name={tag.name}
                />
                <span
                  className="delete-tag"
                  onClick={() => {
                    if (window.confirm('Are you sure?')) handleDeleteTag(tag.id);
                  }}
                >
                  <X />
                </span>
              </div>
            ))}

          <div className="new-tag-form">
            <Input
              onChange={e => setNewTag(e.target.value)}
              onKeyDown={e => e.keyCode === 13 && handleTagCreation}
              value={newTag}
              name="newTag"
              placeholder="Create A New Tag"
              title="New Tag"
              type="text"
              className="new-tag-form-group"
            />
            <Button type="button" onClick={handleTagCreation}>
              Create Tag
            </Button>
          </div>
        </div>

        <div className="footer">
          <hr />
          <TextNotificationWithButton
            text={
              project.folder ? `Selected Folder: ${project.folder}` : 'No Folder Selected'
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

export default withRouter(Form);
