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
          <Title>{film.original_language == "sv" ? film.original_title : film.title}</Title>
          <p>
            <a href={film.url}>Read more on Letterboxd.</a>
          </p>
          <ShowtimeTable>
            <thead>
              <tr>
                <th>Datum</th>
                <th>Tid</th>
                <th>Biograf</th>
                <th>Boka</th>
              </tr>
            </thead>
            <tbody>
              {showtimes.map(showing => (
                <tr key={showing.id}>
                  <td>{showing.start_date.replaceAll("-", "\u2011")}</td>
                  <td>{showing.start_time}</td>
                  <td>{showing.cinema.name}</td>
                  <td><a href={showing.booking_link}>Boka&nbsp;här</a></td>
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

  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;

  border-spacing: 0;

  @media (max-width: 600px) {
    border-radius: 0 !important;
    table-layout: fixed;
    width: 100%;
  }

  & thead tr {
    position: sticky;
    top: 0px;

    background: #500;
    color: #FFF;
    & th {
      padding: 15px 20px;
      font-weight: 400;
      &:first-child {
        border-top-left-radius: 8px;
      }
      &:last-child {
        border-top-right-radius: 8px;
      }
    }
  }
  & tbody {
    overflow: auto;
    max-height: 50vh;
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
    overflow: hidden;
    @media (max-width: 600px) {
      padding: 15px 0;
    }
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
  bottom: 50px;
  left: 50%;
  transform: translate(-50%, 0);
  display: block;
  overflow-y: scroll;

  @media (max-width: 600px) {
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
`;

const Content = styled.div`
  box-sizing: border-box;
  padding: 50px;

  @media (max-width: 600px) {
    padding: 50px 0 0;
    height: 100vh;
  }
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
