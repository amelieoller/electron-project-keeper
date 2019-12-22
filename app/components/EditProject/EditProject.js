import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { firestore } from '../../firebase';
import { collectIdsAndData } from '../../utils/utilities';
import Form from '../Form';
import Loading from '../../atoms/Loading';
import withUser from '../../hocs/withUser';

const StyledEditProject = styled.div``;

const EditProject = ({ match, user }) => {
  const { projectId } = match.params;
  const [project, setProject] = useState();

  useEffect(() => {
    async function fetchData() {
      const snapshot = await firestore
        .collection('users')
        .doc(user.uid)
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
      {project ? (
        <Form existingProject={project} titleText={`Edit ${project.title}`} />
      ) : (
        <Loading />
      )}
    </StyledEditProject>
  );
};

export default withUser(EditProject);
