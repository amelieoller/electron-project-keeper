import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import Markdown from 'markdown-to-jsx';

import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-github';

import TextNotificationWithButton from '../../molecules/TextNotificationWithButton';

const fs = require('fs');

const SyledNotesWindow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));

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

  .ul {
    font-size: 1.4rem;
  }
`;

const NotesWindow = ({ projectNotes, createNewFile, project }) => {
  const [noteContent, setNoteContent] = useState(projectNotes);

  useEffect(() => {
    setNoteContent(projectNotes);
  }, [projectNotes]);

  const onChange = newValue => {
    if (newValue !== projectNotes) {
      setNoteContent(newValue);
    }
  };

  const saveFile = () => {
    if (projectNotes !== noteContent) {
      const filePath = `${project.folder}/NOTES.md`;

      fs.writeFile(filePath, noteContent, err => {
        if (err) return console.log(err);
        console.log('saved');
      });
    }
  };

  return (
    <SyledNotesWindow>
      <AceEditor
        placeholder="Placeholder Text"
        mode="markdown"
        theme="github"
        onChange={onChange}
        name="markdown-window"
        fontSize={14}
        showPrintMargin={true}
        showGutter={false}
        highlightActiveLine={true}
        value={noteContent ? noteContent : 'Loading...'}
        onBlur={saveFile}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: true,
          showLineNumbers: false,
          tabSize: 2
        }}
      />

      <div className="notes">
        {!!noteContent ? (
          <Markdown
            options={{
              overrides: {
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
        ) : (
          <TextNotificationWithButton
            text="You Have No Notes File for This Project."
            buttonText="Add NOTES.md File"
            onButtonClick={createNewFile}
          />
        )}
      </div>
    </SyledNotesWindow>
  );
};

NotesWindow.propTypes = {};

export default NotesWindow;
