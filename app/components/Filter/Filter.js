import React, { useContext } from 'react';
import styled from 'styled-components';
import { TagsContext } from '../../providers/TagsProvider';
import { ProjectsContext } from '../../providers/ProjectsProvider';
import Badge from '../Badge/Badge';

const StyledFilter = styled.div`
  margin-bottom: 1.4rem;

  & > span {
    margin-right: 1rem;
    margin-bottom: 1rem;
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
      {tags.map(tag => (
        <Badge
          key={tag.id}
          badgeText={tag.name}
          handleSelect={() => updateFilter('tags', tag.name)}
          isSelected={filter.tags.includes(tag.name)}
        />
      ))}
    </StyledFilter>
  );
};

export default Filter;
