import React from 'react';
import styled from 'styled-components';

import MyDropdown from '../../atoms/MyDropdown';
import Search from './Search';

const StyledFilter = styled.div`
  margin-bottom: 1.4rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  grid-gap: 5rem;
  position: relative;

  .pre-tag-text {
    font-size: 1.7rem;
    text-transform: uppercase;
    font-weight: 300;
  }

  .tag {
    margin-right: 1rem;
    margin-bottom: 1rem;
  }

  .sort {
    min-width: 12rem;
    position: absolute;
    right: 0;
  }

  @media (max-width: 550px) {
    margin: 3rem;
    display: block;

    .sort {
      position: relative;
    }
  }
`;

const Filter = () => {
  return (
    <StyledFilter>
      <Search />
      <MyDropdown className="sort" dropdownText="Sort By" />
    </StyledFilter>
  );
};

export default Filter;
