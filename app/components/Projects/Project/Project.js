import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { firestore } from '../../../firebase';
import { ReactComponent as Trash } from '../../../assets/icons/trash.svg';
import { ReactComponent as Edit } from '../../../assets/icons/edit.svg';
import { ReactComponent as GitHub } from '../../../assets/icons/github.svg';
import { ReactComponent as Monitor } from '../../../assets/icons/monitor.svg';
import { CSSTransitionGroup } from 'react-transition-group';
import { Link } from 'react-router-dom';

const StyledProject = styled.div`
  background: white;
  color: ${props => props.theme.text};
  display: grid;
  grid-template-rows: 270px auto;
  border: 1px solid #c5c5c5;
  transition: all 0.8s ease;

  .project-image {
    margin: 3.5rem 3.5rem 0 3.5rem;
    background-image: ${props => `url(${props.image})`};
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
    border-radius: 0.6rem 0.6rem 0px 0px;
  }

  .content {
    padding-top: 1.9rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .main {
      margin: 0 3.5rem;

      h3 {
        margin: 0;
        margin-bottom: 0.5rem;
        line-height: 3rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;

        &.more-info-link {
          text-decoration: underline;
          cursor: pointer;

          &:hover {
            color: ${props => props.theme.primary};
          }
        }
      }

      p {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        margin: 1rem 0;
      }

      h3 {
        margin-bottom: 0.2rem;
        a {
          color: inherit;
        }
      }

      .tags {
        color: #aeaeae;
        font-style: italic;
      }
    }

    .extra-information {
      margin: 3rem 0 1rem 0;

      img {
        border-top: 1px solid #c5c5c5;
        border-bottom: 1px solid #c5c5c5;
        width: 100%;
      }
    }

    .footer {
      text-align: right;
      margin: 2rem 3.5rem 3.5rem 3.5rem;

      a {
        color: inherit;
        margin-left: 0.8rem;
      }

      svg {
        margin-left: 0.5rem;
        cursor: pointer;

        &:hover {
          color: ${props => props.theme.primary};
        }
      }

      .button {
        margin-right: 0.3rem;
      }
    }
  }

  /* Addition image transition */
  .info-enter {
    opacity: 0.01;
  }

  .info-enter.info-enter-active {
    opacity: 1;
    transition: opacity 500ms ease-in;
  }

  .info-leave {
    opacity: 1;
  }

  .info-leave.info-leave-active {
    opacity: 0.01;
    transition: opacity 300ms ease-in;
  }

  @media (max-width: 750px) {
    border: none;
  }
`;

const Project = ({ project, selectProject, selectedProject }) => {
  const handleDelete = id => {
    firestore.doc(`projects/${id}`).delete();
  };

  return (
    <StyledProject
      image={
        project.image
          ? project.image
          : 'https://res.cloudinary.com/dpekucrvb/image/upload/v1573953781/undraw_insert_block_efyb.svg'
      }
    >
      <div className="project-image" />
      <div className="content">
        <div className="main">
          <h3
            className={project.additionalImage ? 'more-info-link' : ''}
            onClick={() => project.additionalImage && selectProject(project)}
          >
            {project.title}
          </h3>
          <p>{project.description}</p>

          <div className="tags">
            {project.tags.map(tag => (
              <span key={tag}>{tag} · </span>
            ))}
          </div>
        </div>

        {/* <CSSTransitionGroup
          transitionName="info"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        > */}
        {selectedProject && selectedProject.id === project.id && (
          <div className="extra-information">
            <img src={project.additionalImage} alt="" />
          </div>
        )}
        {/* </CSSTransitionGroup>  */}

        <div className="footer">
          {project.github && (
            <a target="_blank" rel="noopener noreferrer" href={project.github}>
              <GitHub />
            </a>
          )}
          {project.server && (
            <a target="_blank" rel="noopener noreferrer" href={project.live}>
              <Monitor />
            </a>
          )}
          <Link to={`/projects/${project.id}/edit`}>
            <Edit />
          </Link>

          <a
            onClick={() => {
              if (window.confirm('Are you sure?')) handleDelete(project.id);
            }}
          >
            <Trash />
          </a>
        </div>
      </div>
    </StyledProject>
  );
};

Project.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    folder: PropTypes.string.isRequired,
    github: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }),
  selectProject: PropTypes.func,
};

export default Project;
