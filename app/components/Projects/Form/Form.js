import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import Button from '../../Button';
import Input from './Input';
import { firestore } from '../../../firebase';
import { withRouter } from 'react-router-dom';
import Checkbox from './Checkbox/Checkbox';
import { TagsContext } from '../../../providers/TagsProvider';

const StyledForm = styled.div`
  position: relative;
  max-width: 50rem;
  margin: 5em auto;
  background: #fff;
  width: 100%;
  padding: 3.5rem;
  border: 1px solid #c5c5c5;

  .checkboxes {
    margin: 2.5rem 0;
  }
`;

const Form = ({ existingProject, history }) => {
  const { tags } = useContext(TagsContext);
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
    updated: new Date()
  };

  const [project, setProject] = useState(initialProjectState);
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

  return (
    <StyledForm>
      <form onSubmit={handleSubmit}>
        <Input
          handleChange={handleChange}
          value={project.title}
          name="title"
          placeholder="Title"
          type="text"
          title="Title"
        />
        <Input
          handleChange={handleChange}
          value={project.description}
          name="description"
          placeholder="Description"
          title="Description"
          type="text"
        />
        <Input
          handleChange={handleChange}
          value={project.github}
          name="github"
          placeholder="GitHub URL"
          title="GitHub URL"
          type="text"
        />
        <Input
          handleChange={handleChange}
          value={project.folder}
          name="folder"
          placeholder="Folder Name"
          title="Folder Name"
          type="text"
        />
        <Input
          handleChange={handleChange}
          value={project.image}
          name="image"
          placeholder="Image"
          title="Image"
          type="text"
        />
        <Input
          handleChange={handleChange}
          value={project.additionalImage}
          name="additionalImage"
          placeholder="Additional Image"
          title="Additional Image"
          type="text"
        />
        <Input
          handleChange={handleChange}
          value={project.server}
          name="server"
          placeholder="Server Command"
          title="Server Command"
          type="text"
        />
        <Input
          handleChange={handleChange}
          value={project.live && project.live}
          name="live"
          placeholder="Live Site"
          title="Live Site"
          type="text"
        />
        <div className="checkboxes">
          {tags &&
            tags.map(tag => (
              <Checkbox
                key={tag.id}
                label={tag.name}
                checked={project.tags.includes(tag.name)}
                onChange={handleTagSelect}
                name={tag.name}
              />
            ))}
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </StyledForm>
  );
};

export default withRouter(Form);
