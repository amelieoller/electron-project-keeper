import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ReactComponent as Home } from '../../../assets/icons/home.svg';
import Form from '../Form';
import Header from '../../Header';
import { firestore } from '../../../firebase';
import { collectIdsAndData } from '../../../utils/utilities';
import { Link } from 'react-router-dom';

const StyledEditProject = styled.div``;

const EditProject = ({ match }) => {
  const { projectId } = match.params;
  const [project, setProject] = useState();

  useEffect(() => {
    async function fetchData() {
      const snapshot = await firestore
        .collection('projects')
        .doc(projectId)
        .get();

      const project = await collectIdsAndData(snapshot);

      setProject(project);
    }
    fetchData();
  }, [projectId]);

  return (
    <StyledEditProject>
      <Header titleText="Edit Project">
        <Link to="/">
          <Home />
        </Link>
      </Header>
      <Form existingProject={project} />
    </StyledEditProject>
  );
};

export default EditProject;
