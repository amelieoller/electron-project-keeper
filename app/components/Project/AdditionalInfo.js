import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Carousel, { Modal, ModalGateway } from 'react-images';
import withUser from '../../hocs/withUser';

import {
  twoFlatArraysAreEqual,
  createAbsolutePath,
  createRelativePath
} from '../../utils/utilities';
import { firestore } from '../../firebase';
import { ReactComponent as Plus } from '../../assets/icons/plus.svg';
import TextNotificationWithButton from '../../molecules/TextNotificationWithButton';
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

  .add-spacing {
    padding: 0 2.5rem;
  }

  .double-click-explanation {
    color: ${({ theme }) => theme.darkerGrey};
    text-align: end;
    margin-right: 2.5rem;
    margin-top: 0.3rem;
    margin-bottom: -1.6rem;
  }
`;

const AdditionalImages = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  height: 200px;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  cursor: ${props => props.imageIsDragging && 'grabbing'};

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
    margin-left: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .text {
      color: ${({ theme }) => theme.grey};
      margin-top: 0.5rem;
    }

    &:hover {
      background: ${({ theme }) => theme.lightGrey};
      transition: all ${({ theme }) => theme.transitions.ease};

      svg path {
        fill: ${({ theme }) => theme.darkerGrey};
      }

      .text {
        color: ${({ theme }) => theme.darkerGrey};
        margin-top: 0.5rem;
      }
    }

    svg {
      width: 30px;
      margin: 0 auto;
      display: block;

      path {
        fill: ${({ theme }) => theme.lightGrey};
      }
    }
  }

  .image-wrap:last-child img {
    margin-right: 2.5rem;
  }

  .image-wrap {
    flex: 0 0 auto;
    margin-right: 1rem;
    height: 200px;

    img {
      border: ${({ theme }) => theme.border};
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
  setAdditionalImages,
  user
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imageIsDragging, setImageIsDragging] = useState(false);
  const [startX, setStartX] = useState(null);
  const [scrollLeft, setScrollLeft] = useState(null);

  useEffect(() => {
    if (project.folder) {
      getNoteContents();
      getImages();
    }
  }, []);

  const getNoteContents = () => {
    const notesFileName = 'NOTES.md';
    const absolutePath = createAbsolutePath(project.folder);

    fs.readdir(absolutePath, (err, files) => {
      if (files) {
        if (!files.includes(notesFileName)) {
          return;
        }

        const notesPath = `${absolutePath}/${notesFileName}`;
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

    fs.readdir(`${createAbsolutePath(project.folder)}/${imageFolder}`, (err, files) => {
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
    const notesPath = `${createAbsolutePath(project.folder)}/NOTES.md`;

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
    const newPath = `${createAbsolutePath(project.folder)}/images/${fileName}`;

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
    const fullImageFolderPath = `${createAbsolutePath(projectPath)}/${imageFolder}`;

    if (!fs.existsSync(fullImageFolderPath)) {
      fs.mkdirSync(fullImageFolderPath);
      getImages();
    }
  };

  const handleUpdate = directory => {
    firestore
      .doc(`users/${user.uid}/projects/${project.id}`)
      .update({ ...project, folder: directory });
  };

  const selectFolder = () => {
    const directory = dialog.showOpenDialogSync({
      properties: ['openDirectory'],
      buttonLabel: 'Select Folder',
      title: 'Select Folder'
    });

    if (directory.length === 0) return;

    handleUpdate(createRelativePath(directory[0]));
  };

  const renderImageSection = () => (
    <>
      <hr />
      {additionalImages ? (
        <>
          <AdditionalImages
            imageIsDragging={imageIsDragging}
            onMouseDown={e => {
              setImageIsDragging(true);
              const imageWrapper = e.target.parentElement.parentElement;
              setStartX(e.pageX - imageWrapper.offsetLeft);
              setScrollLeft(imageWrapper.scrollLeft);
            }}
            onMouseUp={() => setImageIsDragging(false)}
            onMouseLeave={() => setImageIsDragging(false)}
            onMouseMove={e => {
              if (imageIsDragging) {
                e.preventDefault();
                const imageWrapper = e.target.parentElement.parentElement;
                const x = e.pageX - imageWrapper.offsetLeft;
                const walk = (x - startX) * 3;
                imageWrapper.scrollLeft = scrollLeft - walk;
              }
            }}
          >
            <div className="add-image" onClick={handleAddImage}>
              <Plus />
              <span className="text">Add Image</span>
            </div>
            {additionalImages.map(image => (
              <div
                key={image}
                className="image-wrap"
                onDoubleClick={() => setModalIsOpen(!modalIsOpen)}
              >
                <img
                  src={`${createAbsolutePath(project.folder)}/images/${image}`}
                  alt=""
                />
              </div>
            ))}
          </AdditionalImages>
          {additionalImages.length !== 0 && (
            <span className="double-click-explanation">
              * Double Click To Open Large View
            </span>
          )}
          <ModalGateway>
            {modalIsOpen ? (
              <Modal onClose={() => setModalIsOpen(!modalIsOpen)}>
                <Carousel
                  views={additionalImages.map(image => {
                    return {
                      src: `${createAbsolutePath(project.folder)}/images/${image}`
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
          className="add-spacing"
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
        onButtonClick={selectFolder}
        className="add-spacing"
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

export default withUser(AdditionalInfo);
