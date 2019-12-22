import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';

import Input from '../../atoms/Input';
import { ProjectsContext } from '../../providers/ProjectsProvider';
import Badge from '../../atoms/Badge';

const StyledSearch = styled.div`
  margin-bottom: 1.6rem;
  position: relative;

  @media (min-width: 550px) and (max-width: 810px) {
    max-width: 22rem;
  }

  .selected-tags {
    width: calc(100vw - 16rem);
    margin-top: 1.5rem;

    @media (max-width: 550px) {
      width: calc(100vw - 6rem);
    }
  }

  .input-wrapper {
    margin-bottom: 0;
    margin-top: 0.4rem;

    input {
      margin-top: 0;
    }
  }

  .no-suggestions {
    color: ${({ theme }) => theme.grey};
    padding-top: 0.5rem;
    position: absolute;
    top: 0;
    right: 0;
  }

  .suggestions {
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-top-width: 0;
    list-style: none;
    margin-top: 0;
    max-height: 143px;
    overflow-y: auto;
    padding-left: 0;
    width: 100%;
    background: white;
    position: absolute;
    z-index: 1;
  }

  .suggestions li {
    padding: 0.8rem 1.1rem;
    font-size: 1.3rem;
    font-weight: 300;
  }

  .suggestion-active,
  .suggestions li:hover {
    background-color: ${({ theme }) => theme.primary};
    color: white;
    cursor: pointer;
  }

  .suggestions li:not(:last-of-type) {
    border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  }
`;

const Search = () => {
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const { updateFilter, tags } = useContext(ProjectsContext);

  useEffect(() => {
    setFilteredSuggestions(tags);
  }, [tags]);

  const tagsLeftToFilter = selectedTags =>
    tags && tags.filter(tag => !selectedTags.includes(tag));

  const sortTags = tagsToSort => tagsToSort.sort((a, b) => (a.name > b.name ? 1 : -1));

  const onInputChange = e => {
    const input = e.currentTarget.value;
    const tagsToFilter = tagsLeftToFilter(selectedTags);

    // Filter our suggestions that don't contain the user's input
    const newFilteredSuggestions = tagsToFilter.filter(
      tag => tag.name.toLowerCase().indexOf(input.toLowerCase()) > -1
    );

    setActiveSuggestionIndex(0);
    setFilteredSuggestions(newFilteredSuggestions);
    setShowSuggestions(true);
    setUserInput(e.currentTarget.value);
  };

  const selectTag = selectedTag => {
    if (selectedTag) {
      const newSelectedTags = [...selectedTags, selectedTag];
      const newSuggestions = tagsLeftToFilter(newSelectedTags);

      setSelectedTags(newSelectedTags);
      updateFilter('tags', selectedTag.name);

      setFilteredSuggestions(sortTags(newSuggestions));
      reset();
    }
  };

  const deselectTag = deselectedTag => {
    const newSuggestions = [...filteredSuggestions, deselectedTag];
    const newSelectedTags = selectedTags.filter(t => t.id !== deselectedTag.id);

    updateFilter('tags', deselectedTag.name);

    setSelectedTags(newSelectedTags);
    setFilteredSuggestions(sortTags(newSuggestions));
    reset();
  };

  const reset = () => {
    setActiveSuggestionIndex(0);
    setShowSuggestions(false);
    setUserInput('');
  };

  const onClick = e => {
    const suggestionIndex = e.target.dataset.id;

    setActiveSuggestionIndex(suggestionIndex);
    selectTag(filteredSuggestions[suggestionIndex]);
  };

  const onKeyDown = e => {
    // User pressed the enter key
    if (e.keyCode === 13) {
      const selectedTag = filteredSuggestions[activeSuggestionIndex];

      selectTag(selectedTag);
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestionIndex === 0) {
        return;
      }

      setActiveSuggestionIndex(activeSuggestionIndex - 1);
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestionIndex - 1 === filteredSuggestions.length) {
        return;
      }

      setActiveSuggestionIndex(activeSuggestionIndex + 1);
    }
  };

  let suggestionsListComponent;

  if (showSuggestions) {
    if (filteredSuggestions && filteredSuggestions.length) {
      suggestionsListComponent = (
        <ul className="suggestions">
          {filteredSuggestions.map((suggestion, index) => {
            let className;

            // Flag the active suggestion with a class
            if (index === activeSuggestionIndex) {
              className = 'suggestion-active';
            }

            return (
              <li
                className={className}
                key={suggestion.name}
                data-id={index}
                onClick={onClick}
              >
                {suggestion.name}
              </li>
            );
          })}
        </ul>
      );
    } else {
      suggestionsListComponent = (
        <div className="no-suggestions">
          <em>No tags found.</em>
        </div>
      );
    }
  }

  return (
    <StyledSearch showSuggestions={showSuggestions}>
      <span className="pre-tag-text">Tags:</span>

      <Input
        type="text"
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        value={userInput}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() =>
          setTimeout(() => {
            setShowSuggestions(false);
          }, 100)
        }
        className="input-wrapper"
        placeholder="Search For Tags"
        name="tags"
        small={true}
      />

      {suggestionsListComponent}

      <div className="selected-tags">
        {selectedTags.length !== 0 &&
          selectedTags.map(tag => (
            <Badge
              className="tag"
              key={tag.id}
              badgeText={tag.name}
              handleClick={() => deselectTag(tag)}
              isSelected={true}
            />
          ))}
      </div>
    </StyledSearch>
  );
};

export default Search;
