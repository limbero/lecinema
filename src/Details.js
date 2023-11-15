import React from 'react';
import styled from 'styled-components';

const Details = ({ film, close }) => {
  const showtimes = [...film.showtimes].sort(function (a, b) {
    return a.start_at.localeCompare(b.start_at);
  }).map(showing => ({
    ...showing,
    start_date: showing.start_at.split("T")[0],
    start_time: showing.start_at.slice(11, 16),
  }));
  return (
    <BackgroundCover onClick={close}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={close}>
          ✕
        </CloseButton>
        <Content>
          <Title>{film.title}</Title>
          <p>
            <a href={film.url}>Read more on Letterboxd.</a>
          </p>
          <ShowtimeTable>
            <thead>
              <tr>
                <td>Datum</td>
                <td>Tid</td>
                <td>Biograf</td>
                <td>Boka</td>
              </tr>
            </thead>
            <tbody>
              {showtimes.map(showing => (
                <tr key={showing.id}>
                  <td>{showing.start_date}</td>
                  <td>{showing.start_time}</td>
                  <td>{showing.cinema.name}</td>
                  <td><a href={showing.booking_link}>Boka här</a></td>
                </tr>
              ))}
            </tbody>
          </ShowtimeTable>
        </Content>
      </Modal>
    </BackgroundCover>
  );
};

const Title = styled.h1`
  font-weight: 900;
  letter-spacing: -0.09em;
  font-size: 4rem;

  margin-top: 0;
  margin-bottom: 10px;
`;

const ShowtimeTable = styled.table`
  margin: 30px auto 0;

  border-collapse: collapse;

  outline: 2px solid #500;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;

  @media (max-width: 500px) {
    border-radius: 0 !important;
    width: 100%;
  }

  & thead {
    display:block;
    background: #500;
    border-color: #500;
    color: #FFF;
    & td {
      &:first-child {
        border-top-left-radius: 8px;
      }
      &:last-child {
        border-top-right-radius: 8px;
      }
    }
  }
  & tbody {
    display: block;
    overflow: auto;
    max-height: 50vh;
    @media (max-width: 500px) {
      max-height: none;
    }
    & tr:nth-of-type(even) {
      background-color: #E5E5E5;
    }
    & tr:last-child {
      td {
        &:first-child {
          border-bottom-left-radius: 8px;
        }
        &:last-child {
          border-bottom-right-radius: 8px;
        }
      }
    }
  }
  & td {
    padding: 15px 20px;
  }
`;

const BackgroundCover = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;

  background: rgba(0,0,0, 0.5);
`;

const Modal = styled.div`
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translate(-50%, 0);
  display: block;

  @media (max-width: 500px) {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    max-height: none;
    transform: none;
  }

  box-sizing: border-box;
  max-width: 100vw;

  text-align: center;

  background: #FFF;
  border: 1px solid #BBB;
  border-radius: 5px;
  box-shadow: 0 0 20px 2px rgba(0,0,0, 0.5);

  overflow-y: hidden;
`;

const Content = styled.div`
  box-sizing: border-box;
  padding: 50px;

  @media (max-width: 500px) {
    padding: 50px 0 0;
    height: 100vh;
  }

  overflow-y: scroll;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;

  border: none;
  background: none;

  font-size: 25px;

  cursor: pointer;
`;

export default Details;
