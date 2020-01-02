import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { ReactComponent as Trash } from '../../assets/icons/trash.svg';
import { ReactComponent as Edit } from '../../assets/icons/edit.svg';
import { ReactComponent as GitHub } from '../../assets/icons/github.svg';
import { ReactComponent as Monitor } from '../../assets/icons/monitor.svg';
import { ReactComponent as Code } from '../../assets/icons/code.svg';
import { ReactComponent as ChevronDown } from '../../assets/icons/chevron-down.svg';
import { ReactComponent as ChevronUp } from '../../assets/icons/chevron-up.svg';

const { shell } = require('electron');

const StyledIconWithTooltip = styled.span`
  a {
    color: inherit;
    margin-left: 0.8rem;

    svg {
      margin-left: 0.4rem;
    }
  }

  svg {
    cursor: pointer;
    color: ${({ theme }) => theme.primaryLight};

    &.active,
    &:hover {
      transition: all ${({ theme }) => theme.transitions.ease};
      color: ${({ theme }) => theme.primary};
    }
  }
`;

const icons = {
  trash: Trash,
  edit: Edit,
  github: GitHub,
  monitor: Monitor,
  code: Code,
  chevronup: ChevronUp,
  chevrondown: ChevronDown
};

const IconWithTooltip = ({
  tooltipText,
  iconName,
  linkTo,
  external,
  onClickFunc,
  ...iconProps
}) => {
  const IconComponent = icons[iconName];
  const icon = <IconComponent data-tip={tooltipText} {...iconProps} />;
  let iconWithLink;

  if (onClickFunc) {
    iconWithLink = <a onClick={onClickFunc}>{icon}</a>;
  } else if (external) {
    iconWithLink = (
      <a rel="noopener noreferrer" onClick={() => shell.openExternal(linkTo)}>
        {icon}
      </a>
    );
  } else {
    iconWithLink = <Link to={linkTo}>{icon}</Link>;
  }

  return <StyledIconWithTooltip>{iconWithLink}</StyledIconWithTooltip>;
  // return <StyledIconWithTooltip>{iconWithLink}</StyledIconWithTooltip>;
};

export default IconWithTooltip;
