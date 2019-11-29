import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { firestore } from '../../../firebase';
import { collectIdsAndData } from '../../../utils/utilities';
import { ReactComponent as Home } from '../../../assets/icons/home.svg';
import Header from '../../Header';
import Form from '../Form';
import Loading from '../../Loading';

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
      <Header>
        <Link to="/">
          <Home />
        </Link>
      </Header>
      {project ? (
        <Form existingProject={project} titleText={`Edit ${project.title}`} />
      ) : (
        <Loading />
      )}
    </StyledEditProject>
  );
};

export default EditProject;
