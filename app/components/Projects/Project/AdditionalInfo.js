import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Markdown from 'markdown-to-jsx';
import Carousel, { Modal, ModalGateway } from 'react-images';

import { twoFlatArraysAreEqual } from '../../../utils/utilities';
import Button from '../../Button';

const fs = require('fs');

const MoreInfo = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: auto;

  grid-column: span 2;

  img {
    width: 100%;
  }
`;

const AdditionalImages = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  height: 200px;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }

  .image-wrap {
    flex: 0 0 auto;
    margin-right: 1rem;
    border: ${props => props.theme.border};
    height: 200px;

    img {
      height: 100%;
      width: auto;
    }
  }
`;

const AdditionalInfo = ({
  project,
  projectNotes,
  setProjectNotes,
  additionalImages,
  setAdditionalImages
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    if (project.folder) {
      getNoteContents();
      getImages();
    }
  }, []);

  const getNoteContents = () => {
    const notesFileName = 'NOTES.md';

    fs.readdir(project.folder, (err, files) => {
      if (files) {
        if (!files.includes(notesFileName)) {
          setProjectNotes('no notes');
          return;
        }

        const notesPath = `${project.folder}/${notesFileName}`;
        let content = fs.readFileSync(notesPath).toString();

        // Only update note if it has changed
        if (content !== projectNotes) {
          if (content === '') {
            content = 'No content in this NOTES.md file yet.';
          }

          setProjectNotes(content);
        }
      }
    });
  };

  const getImages = () => {
    const imageFolder = 'images';

    fs.readdir(`${project.folder}/${imageFolder}`, (err, files) => {
      if (files) {
        const filteredImages = files.filter(
          file => file.includes('.gif') || file.includes('.png') || file.includes('.jpg')
        );

        // If new and previous arrays are equal don't set images
        if (!twoFlatArraysAreEqual(additionalImages, filteredImages)) {
          setAdditionalImages(filteredImages);
        }
      } else {
        setAdditionalImages(null);
      }
    });
  };

  const createNewFile = () => {
    const notesPath = `${project.folder}/NOTES.md`;

    fs.writeFile(notesPath, '', err => {
      if (err) return console.log(err);

      const content = '# NOTES \n Enter Some notes here...';
      writeToFile(notesPath, content);
      setProjectNotes(content);
    });
  };

  const writeToFile = (path, content) => {
    fs.writeFile(path, content, err => {
      if (err) return console.log(err);
      console.log('saved');
    });
  };

  return (
    <MoreInfo>
      {additionalImages && (
        <>
          <hr />
          <AdditionalImages>
            {additionalImages.map(image => (
              <div
                key={image}
                className="image-wrap"
                onClick={() => setModalIsOpen(!modalIsOpen)}
              >
                <img src={`${project.folder}/images/${image}`} alt="" />
              </div>
            ))}
          </AdditionalImages>

          <ModalGateway>
            {modalIsOpen ? (
              <Modal onClose={() => setModalIsOpen(!modalIsOpen)}>
                <Carousel
                  views={additionalImages.map(image => {
                    return {
                      src: `${project.folder}/images/${image}`
                    };
                  })}
                />
              </Modal>
            ) : null}
          </ModalGateway>
        </>
      )}

      {projectNotes && (
        <>
          <hr />
          <div className="notes">
            {projectNotes !== 'no notes' ? (
              <Markdown>{projectNotes}</Markdown>
            ) : (
              <div>
                No NOTES.md file found, would you like to create one?{' '}
                <Button onClick={createNewFile}>Create NOTES.md File</Button>
              </div>
            )}
          </div>
        </>
      )}
    </MoreInfo>
  );
};

AdditionalInfo.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    folder: PropTypes.string.isRequired,
    github: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
  })
};

export default AdditionalInfo;
