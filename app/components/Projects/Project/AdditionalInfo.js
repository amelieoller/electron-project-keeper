import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Carousel, { Modal, ModalGateway } from 'react-images';

import { twoFlatArraysAreEqual } from '../../../utils/utilities';
import { ReactComponent as Plus } from '../../../assets/icons/plus.svg';
import TextNotificationWithButton from '../../TextNotificationWithButton';
import NotesWindow from './NotesWindow';

const fs = require('fs');
const remote = window.require('electron').remote;
const { dialog } = remote.require('electron');

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

  .add-image {
    flex: 0 0 auto;
    margin-right: 1rem;
    border: ${({ theme }) => theme.border};
    height: 200px;
    width: 8rem;
    cursor: pointer;

    &:hover {
      background: ${({ theme }) => theme.lightGrey};
      transition: all ${({ theme }) => theme.transitions.ease};

      svg path {
        fill: ${({ theme }) => theme.darkerGrey};
      }
    }

    svg {
      width: 30px;
      margin: 0 auto;
      display: block;
      height: 100%;

      path {
        fill: ${({ theme }) => theme.lightGrey};
      }
    }
  }

  .image-wrap {
    flex: 0 0 auto;
    margin-right: 1rem;
    border: ${({ theme }) => theme.border};
    height: 200px;

    img {
      height: 100%;
      width: auto;
      cursor: zoom-in;
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

  const handleAddImage = () => {
    const files = dialog.showOpenDialogSync({
      properties: ['openFile'],
      filters: [
        {
          name: 'Image',
          extensions: ['png', 'gif', 'jpg']
        }
      ]
    });

    // If no files
    if (!files) return;

    const oldPath = files[0];
    const index = oldPath.lastIndexOf('/');
    const fileName = oldPath.slice(index + 1);
    const newPath = `${project.folder}/images/${fileName}`;

    // Move file from original directory to new image directory
    fs.rename(oldPath, newPath, err => {
      if (err) throw err;
      getImages();
      console.log('Rename complete!');
    });
  };

  const addFolder = () => {
    const imageFolder = 'images';
    const projectPath = project.folder;
    const fullImageFolderPath = `${projectPath}/${imageFolder}`;

    if (!fs.existsSync(fullImageFolderPath)) {
      fs.mkdirSync(fullImageFolderPath);
      getImages();
    }
  };

  const renderImageSection = () => (
    <>
      <hr />
      {additionalImages ? (
        <>
          <AdditionalImages>
            <div className="add-image" onClick={handleAddImage}>
              <Plus />
            </div>
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
      ) : (
        <TextNotificationWithButton
          text="You Have No Image Folder for This Project."
          buttonText="Add Image Folder"
          onButtonClick={addFolder}
        />
      )}
    </>
  );

  const renderAddFolderNotification = () => (
    <>
      <hr />
      <TextNotificationWithButton
        text="You Have No Folder Selected for This Project."
        buttonText="Add Folder"
        onButtonClick={addFolder}
      />
    </>
  );

  return (
    <MoreInfo>
      {project.folder ? (
        <>
          {renderImageSection()}
          {
            <>
              <hr />
              <NotesWindow
                projectNotes={projectNotes}
                onChange={setProjectNotes}
                createNewFile={createNewFile}
                project={project}
              />
            </>
          }
        </>
      ) : (
        renderAddFolderNotification()
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
