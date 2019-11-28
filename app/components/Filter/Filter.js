import React, { useContext } from 'react';
import styled from 'styled-components';
import { TagsContext } from '../../providers/TagsProvider';
import { ProjectsContext } from '../../providers/ProjectsProvider';
import Badge from '../Badge/Badge';
import MyDropdown from '../MyDropdown';

const StyledFilter = styled.div`
  margin-bottom: 1.4rem;

  .pre-tag-text {
    font-size: 1.7rem;
    text-transform: uppercase;
    margin-right: 1rem;
    font-weight: 300;
  }

  .tag {
    margin-right: 1rem;
    margin-bottom: 1rem;
  }

  .sort {
    float: right;
    position: relative;
  }

  @media (max-width: 750px) {
    margin: 3rem;
  }
`;

const Filter = () => {
  const { tags } = useContext(TagsContext);
  const { updateFilter, filter } = useContext(ProjectsContext);

  return (
    <StyledFilter>
      <span className="pre-tag-text">Tags:</span>
      {tags.map(tag => (
        <Badge
          className="tag"
          key={tag.id}
          badgeText={tag.name}
          handleSelect={() => updateFilter('tags', tag.name)}
          isSelected={filter.tags.includes(tag.name)}
        />
      ))}
      <MyDropdown className="sort" dropdownText="Sort By" />
    </StyledFilter>
  );
};

export default Filter;
