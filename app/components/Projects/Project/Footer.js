import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { ReactComponent as Trash } from '../../../assets/icons/trash.svg';
import { ReactComponent as Edit } from '../../../assets/icons/edit.svg';
import { ReactComponent as GitHub } from '../../../assets/icons/github.svg';
import { ReactComponent as Monitor } from '../../../assets/icons/monitor.svg';
import { ReactComponent as FileText } from '../../../assets/icons/file-text.svg';
import { ReactComponent as Server } from '../../../assets/icons/server.svg';

const StyledFooter = styled.div`
  text-align: right;
  margin: 1rem 3.5rem 3.5rem 3.5rem;

  a {
    color: inherit;
    margin-left: 0.8rem;
  }

  svg {
    margin-left: 0.5rem;
    cursor: pointer;

    &:hover {
      color: ${props => props.theme.primary};
    }
  }

  .button {
    margin-right: 0.3rem;
  }
`;

const Footer = ({
  project: { github, live, server, folder, id },
  showNotesDiv,
  openServer,
  handleDelete
}) => (
  <StyledFooter>
    {github && (
      <a target="_blank" rel="noopener noreferrer" href={github}>
        <GitHub />
      </a>
    )}
    {server && (
      <a target="_blank" rel="noopener noreferrer" href={live}>
        <Monitor />
      </a>
    )}
    <Link to={`/projects/${id}/edit`}>
      <Edit />
    </Link>
    {folder && (
      <a onClick={showNotesDiv}>
        <FileText />
      </a>
    )}
    {server && (
      <a onClick={openServer}>
        <Server />
      </a>
    )}
    <a
      onClick={() => {
        if (window.confirm('Are you sure?')) handleDelete(id);
      }}
    >
      <Trash />
    </a>
  </StyledFooter>
);

export default Footer;
