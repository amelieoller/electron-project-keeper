import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AceEditor from 'react-ace';
import Markdown from 'markdown-to-jsx';

import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/webpack-resolver';

import TextNotificationWithButton from '../../molecules/TextNotificationWithButton';
import Button from '../../atoms/Button';
import { createAbsolutePath } from '../../utils/utilities';

const fs = require('fs');

const SyledNotesWindow = styled.div`
  position: relative;
  min-height: 7rem;
  margin: 0 2.5rem;

  .markdown-window > *:first-child {
    margin-top: 0;
  }

  .h1,
  .h2,
  .h3,
  .h4,
  .h5,
  .h6 {
    font-weight: 600;
  }

  .h1 {
    font-size: 2.8rem;
  }

  .h2 {
    font-size: 2.5rem;
  }

  .h3 {
    font-size: 2.2rem;
  }

  .h4 {
    font-size: 2rem;
  }

  .h5 {
    font-size: 1.8rem;
  }

  .h6 {
    font-size: 1.6rem;
  }

  .p {
    font-size: 1.4rem;
  }

  .a {
    color: rgba(0, 0, 0, 0.5);
    transition: color 200ms ease 0s;

    &:hover {
      color: rgba(0, 0, 0, 0.75);
    }
  }

  .ace-github.ace_focus .ace_marker-layer .ace_active-line {
    background: ${({ theme }) => theme.primaryBackground};
  }

  .ul {
    font-size: 1.4rem;
  }

  .info-button {
    position: absolute;
    top: 0;
    right: 0;
    max-width: min-content;

    button {
      float: right;
      margin-bottom: 0.3rem;
    }

    .info {
      color: ${({ theme }) => theme.darkerGrey};
    }
  }
`;

const NotesWindow = ({ projectNotes, createNewFile, project }) => {
  const [updatedNoteContent, setUpdatedNoteContent] = useState(projectNotes);
  const [noteContent, setNoteContent] = useState(projectNotes);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    setNoteContent(projectNotes);
    setUpdatedNoteContent(projectNotes);
  }, [projectNotes]);

  let checkboxCounter = 0;

  const InputCheckbox = ({ checked }) => {
    checkboxCounter += 1;

    return (
      <input
        readOnly
        type="checkbox"
        checked={checked}
        id={checkboxCounter}
        onClick={e => checkBox(e)}
      />
    );
  };

  const onChange = newValue => {
    if (newValue !== updatedNoteContent) {
      setNoteContent(newValue);
    }
  };

  const saveFile = content => {
    const filePath = `${createAbsolutePath(project.folder)}/NOTES.md`;
    setUpdatedNoteContent(content);

    fs.writeFile(filePath, content, err => {
      if (err) return console.log(err);
      console.log('saved');
    });
  };

  const checkBox = e => {
    const { tagName, id, type } = e.target;

    if (tagName.toLowerCase() === 'input' && type.toLowerCase() === 'checkbox') {
      toggleCheckbox(parseInt(id, 10));
    }
  };

  const toggleCheckbox = id => {
    let counter = 0;

    const newNoteContent = noteContent
      .split('\n')
      .map(input => {
        if (input.includes('[ ]')) {
          counter += 1;
          if (counter === id) {
            return input.replace('[ ]', '[x]');
          }
        } else if (input.includes('[x]')) {
          counter += 1;
          if (counter === id) {
            return input.replace('[x]', '[ ]');
          }
        }

        return input;
      })
      .join('\n');

    setNoteContent(newNoteContent);
    saveFile(newNoteContent);
  };

  return (
    <SyledNotesWindow>
      {!!noteContent ? (
        !showEdit ? (
          <>
            <Markdown
              onDoubleClick={() => setShowEdit(true)}
              className="markdown-window"
              options={{
                overrides: {
                  input: InputCheckbox,
                  h1: {
                    props: {
                      className: 'h1'
                    }
                  },
                  h2: {
                    props: {
                      className: 'h2'
                    }
                  },
                  h3: {
                    props: {
                      className: 'h3'
                    }
                  },
                  h4: {
                    props: {
                      className: 'h4'
                    }
                  },
                  h5: {
                    props: {
                      className: 'h5'
                    }
                  },
                  h6: {
                    props: {
                      className: 'h6'
                    }
                  },
                  p: {
                    props: {
                      className: 'p'
                    }
                  },
                  a: {
                    props: {
                      className: 'a'
                    }
                  },
                  ul: {
                    props: {
                      className: 'ul'
                    }
                  }
                }
              }}
            >
              {noteContent}
            </Markdown>
            <span className="info-button">
              <Button
                type="button"
                onClick={() => {
                  setShowEdit(true);
                }}
              >
                Edit
              </Button>
              <span className="info">*or double click on note</span>
            </span>
          </>
        ) : (
          <>
            <AceEditor
              placeholder="Placeholder Text"
              mode="markdown"
              theme="github"
              onChange={onChange}
              name="markdown-window"
              fontSize={14}
              focus={true}
              wrapEnabled={true}
              showPrintMargin={false}
              showGutter={false}
              highlightActiveLine={true}
              value={noteContent}
              width="100%"
              onBlur={() => {
                updatedNoteContent !== noteContent && saveFile(noteContent);
                setShowEdit(false);
              }}
              setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: false,
                tabSize: 2
              }}
            />
            {updatedNoteContent !== noteContent ? (
              <span className="info-button">
                <Button
                  type="button"
                  onClick={() => {
                    saveFile(noteContent);
                  }}
                >
                  Save
                </Button>
                <span className="info">*or click outside note</span>
              </span>
            ) : (
              <Button
                type="button"
                className="info-button"
                onClick={() => {
                  setShowEdit(false);
                }}
              >
                Back
              </Button>
            )}
          </>
        )
      ) : (
        <TextNotificationWithButton
          text="You Have No Notes File for This Project."
          buttonText="Add NOTES.md File"
          onButtonClick={createNewFile}
        />
      )}
    </SyledNotesWindow>
  );
};

NotesWindow.propTypes = {};

export default NotesWindow;
