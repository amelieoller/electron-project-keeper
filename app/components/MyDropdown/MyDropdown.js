import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ReactComponent as ChevronDown } from '../../assets/icons/chevron-down.svg';
import { ReactComponent as ChevronUp } from '../../assets/icons/chevron-up.svg';
import Dropdown from 'react-dropdown';
import { ProjectsContext } from '../../providers/ProjectsProvider';

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
    border: 1px solid ${props => props.theme.primary};
    border-radius: ${props => props.theme.sizes.borderRadius};
    box-sizing: border-box;
    color: ${props => props.theme.darkerGrey};
    cursor: default;
    outline: none;
    transition: all 200ms ease;
    padding: 0.2rem 3.5rem 0.2rem 1rem;
    background: ${props => props.theme.lightestGrey};
  }

  .menu {
    background-color: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
    margin-top: -1px;
    max-height: 200px;
    overflow-y: auto;
    position: absolute;
    top: 100%;
    width: 100%;
    z-index: 1000;
    -webkit-overflow-scrolling: touch;

    > div {
      box-sizing: border-box;
      color: rgba(51, 51, 51, 0.8);
      cursor: pointer;
      display: block;
      padding: 0.5rem 1rem;
    }
  }

  .arrow {
    border-color: #999 transparent transparent;
    border-style: solid;
    border-width: 5px 5px 0;
    content: ' ';
    display: block;
    height: 0;
    margin-top: -ceil(2.5);
    position: absolute;
    right: 10px;
    top: 10px;
    width: 0;
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
        // arrowClosed={<ChevronUp />}
        // arrowOpen={<ChevronDown />}
        className="root"
        controlClassName="control"
        menuClassName="menu"
        arrowClassName="arrow"
      />
    </StyledDropdown>
  );
};

MyDropdown.propTypes = {
  dropdownText: PropTypes.string.isRequired
};

export default MyDropdown;
