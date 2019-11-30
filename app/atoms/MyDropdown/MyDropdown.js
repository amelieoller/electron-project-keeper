import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Dropdown from 'react-dropdown';

import { ProjectsContext } from '../../providers/ProjectsProvider';
import { ReactComponent as ChevronDown } from '../../assets/icons/chevron-down.svg';
import { ReactComponent as ChevronUp } from '../../assets/icons/chevron-up.svg';

const StyledDropdown = styled.span`
  display: flex;
  align-items: center;

  .root {
    position: relative;
    font-size: 1.4rem;
  }

  .control {
    position: relative;
    overflow: hidden;
    border: 1px solid ${({ theme }) => theme.primary};
    border-radius: ${({ theme }) => theme.sizes.borderRadius};
    box-sizing: border-box;
    color: ${({ theme }) => theme.darkerGrey};
    outline: none;
    transition: all 200ms ease;
    padding: 0.2rem 3.5rem 0.2rem 1rem;
    background: ${({ theme }) => theme.lightestGrey};
    cursor: pointer;
  }

  .menu {
    background-color: white;
    border: 1px solid ${({ theme }) => theme.borderColor};
    box-sizing: border-box;
    margin-top: 3px;
    border-radius: ${({ theme }) => theme.sizes.borderRadius};
    max-height: 200px;
    overflow-y: auto;
    position: absolute;
    top: 100%;
    width: 100%;
    z-index: 1000;
    -webkit-overflow-scrolling: touch;

    > div:not(:last-child) {
      border-bottom: ${({ theme }) => theme.border};
    }

    > div {
      box-sizing: border-box;
      color: ${({ theme }) => theme.text};
      cursor: pointer;
      display: block;
      padding: 0.5rem 1rem;

      &:hover {
        background: ${({ theme }) => theme.primary};
        color: white;
      }
    }
  }

  .arrow {
    position: absolute;
    right: 5px;
    top: 0;
  }
`;

const MyDropdown = ({ dropdownText, className }) => {
  const { updateSort, selectedSort } = useContext(ProjectsContext);

  const handleSelect = selectedItem => {
    !!selectedItem.value && updateSort(selectedItem.value);
  };

  const options = [
    { value: 'starred', label: 'Starred' },
    { value: 'name', label: 'Name' },
    { value: 'updated', label: 'Updated' }
  ];

  return (
    <StyledDropdown className={className}>
      <span className="pre-tag-text">SORT BY:</span>
      <Dropdown
        options={options}
        onChange={handleSelect}
        placeholder={dropdownText}
        value={selectedSort}
        arrowClosed={<ChevronUp className="arrow" />}
        arrowOpen={<ChevronDown className="arrow" />}
        className="root"
        controlClassName="control"
        menuClassName="menu"
        // arrowClassName="arrow"
      />
    </StyledDropdown>
  );
};

MyDropdown.propTypes = {
  dropdownText: PropTypes.string.isRequired
};

export default MyDropdown;
