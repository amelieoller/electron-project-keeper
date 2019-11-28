import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { ReactComponent as Trash } from '../../../assets/icons/trash.svg';
import { ReactComponent as Edit } from '../../../assets/icons/edit.svg';
import { ReactComponent as GitHub } from '../../../assets/icons/github.svg';
import { ReactComponent as Monitor } from '../../../assets/icons/monitor.svg';
import { ReactComponent as Code } from '../../../assets/icons/code.svg';
import { ReactComponent as ChevronDown } from '../../../assets/icons/chevron-down.svg';
import { ReactComponent as ChevronUp } from '../../../assets/icons/chevron-up.svg';

const StyledFooter = styled.div`
  text-align: right;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;

  a {
    color: inherit;
    margin-left: 0.8rem;

    svg {
      margin-left: 0.4rem;
    }
  }

  svg {
    cursor: pointer;
    color: ${props => props.theme.lightGrey};

    &.active,
    &:hover {
      transition: all ${props => props.theme.transitions.ease};
      color: ${props => props.theme.darkerGrey};
    }
  }

  .button {
    margin-right: 0.3rem;
  }
`;

const Footer = ({
  project: { github, live, folder, id },
  openFolderInEditor,
  handleDelete,
  expandCard,
  showExtraInfo
}) => (
  <StyledFooter className="footer">
    {folder ? (
      showExtraInfo ? (
        <ChevronUp className="active" onClick={expandCard} />
      ) : (
        <ChevronDown onClick={expandCard} />
      )
    ) : (
      <span></span>
    )}
    <div>
      {github && (
        <a target="_blank" rel="noopener noreferrer" href={github}>
          <GitHub />
        </a>
      )}
      {live && (
        <a target="_blank" rel="noopener noreferrer" href={live}>
          <Monitor />
        </a>
      )}
      <Link to={`/projects/${id}/edit`}>
        <Edit />
      </Link>
      {folder && (
        <a onClick={openFolderInEditor}>
          <Code />
        </a>
      )}
      <a
        onClick={() => {
          if (window.confirm('Are you sure?')) handleDelete(id);
        }}
      >
        <Trash />
      </a>
    </div>
  </StyledFooter>
);

export default Footer;
