import React from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';

import IconWithTooltip from '../../molecules/IconWithTooltip';

const StyledFooter = styled.div`
  text-align: right;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;

  & > :first-child {
    a,
    svg {
      margin: 0;
    }
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
    {showExtraInfo ? (
      <IconWithTooltip
        tooltipText="Less Info"
        iconName="chevronup"
        onClickFunc={expandCard}
        className="active"
      />
    ) : (
      <IconWithTooltip
        tooltipText="More Info"
        iconName="chevrondown"
        onClickFunc={expandCard}
      />
    )}
    <div>
      {github && (
        <IconWithTooltip
          tooltipText="Open in GitHub"
          iconName="github"
          linkTo={github}
          external
        />
      )}
      {live && (
        <IconWithTooltip
          tooltipText="Open Live Server"
          iconName="monitor"
          linkTo={live}
          external
        />
      )}
      <IconWithTooltip
        tooltipText="Edit Project"
        iconName="edit"
        linkTo={`/projects/${id}/edit`}
      />
      {folder && (
        <IconWithTooltip
          tooltipText="Open Folder"
          iconName="code"
          onClickFunc={openFolderInEditor}
        />
      )}
      <IconWithTooltip
        tooltipText="Delete"
        iconName="trash"
        onClickFunc={() => {
          if (window.confirm('Are you sure?')) handleDelete(id);
        }}
      />
    </div>
    <ReactTooltip place="bottom" type="dark" effect="solid" />
  </StyledFooter>
);

export default Footer;
