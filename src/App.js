import React, { useState } from 'react';
import { useGeolocated } from "react-geolocated";
import { useLocalStorage } from "@uidotdev/usehooks";
import styled from 'styled-components';

import Details from "./Details";
import LoadingCamera from './LoadingCamera';

const App = () => {
  const [films, setFilms] = useLocalStorage("leFilms", []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedFilm, setSelectedFilm] = useState(null);

  const [username, setUsername] = useLocalStorage("letterboxdUsername", "limbero");
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      userDecisionTimeout: 10000,
    });
  console.log(JSON.stringify({ coords, isGeolocationAvailable, isGeolocationEnabled }, null, 4));
  if (!error) {
    setError(JSON.stringify({ coords, isGeolocationAvailable, isGeolocationEnabled }, null, 4))
  }

  const getFilms = async () => {
    setError(null);
    setLoading(true);
    let url = `https://home.limbe.ro/lecinema/films-showtimes?username=${username}`;
    if (isGeolocationAvailable && isGeolocationEnabled && coords?.latitude && coords?.longitude) {
      url += `&coordinates=${coords?.latitude},${coords?.longitude}`;
    }
    const newFilms = await fetch(url)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(`${res.status}: ${res.statusText}`);
        }
      })
      .catch(e => {
        console.error(`${e.name}: "${e.message}"`);
        setError(`${e.name}: "${e.message}", ${JSON.stringify({ coords, isGeolocationAvailable, isGeolocationEnabled }, null, 4)}`)
        return [];
      });
    setLoading(false);
    console.log(newFilms);
    setFilms([...newFilms].sort(function (a, b) {
      return a.title.localeCompare(b.title);
    }));
  };
  return (
    <Wrapper>
      <SiteHeader>Le Cinema</SiteHeader>
      <UsernameInput
        value={username}
        disabled={loading}
        onChange={event => setUsername(event.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            getFilms();
          }
        }}
      />
      <SubmitButton onClick={() => getFilms()} disabled={loading}>
        Fetch
      </SubmitButton>
      <LoadingDiv $loading={loading}>
        <LoadingCamera size={300} />
      </LoadingDiv>
      <PostersContainer $loading={loading}>
        {
          films.map(film => (
            <FilmPoster key={film.letterboxd_id}
              style={{
                backgroundImage: `url(${film.poster_image}), radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)`,
                backgroundSize: "cover",
              }}
              onClick={() => setSelectedFilm(film)}
            >
              {!film.poster_image ? (
                <TitleText>
                  <p>
                    {film.title}
                  </p>
                </TitleText>
              ) : null}
            </FilmPoster>
          ))
        }
      </PostersContainer>
      {selectedFilm ? <Details film={selectedFilm} close={() => setSelectedFilm(null)} /> : null}
      {error ? (
        <p>
          {error}
        </p>
      ) : null}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  font-family: Helvetica;
  text-align: center;
`;

const SiteHeader = styled.h1`
  font-family: 'Condiment', cursive;
  font-size: 90px;
  text-align: center;

  margin-bottom: 0;
`;

const UsernameInput = styled.input.attrs({ type: 'text' })`
  box-sizing: border-box;
  border: 2px solid #700;
  border-right: none;
  height: 40px;
  padding: 10px 10px;

  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;

  font-size: 1.05em;

  outline: none;

  &:focus {
    border-color: #4287f5
  }
  &:disabled {
    border-color: #777;
  }
`;
const SubmitButton = styled.button`
  border: 0;
  background: none;
  
  display: inline-block;
  box-sizing: border-box;
  height: 40px;
  padding: 10px 20px;

  color: #FFF;
  background-color: #700;

  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;

  font-size: 1.05em;
  &:disabled {
    background-color: #777;
  }
`;

const LoadingDiv = styled.div`
  position: fixed;
  width: 100%;
  text-align: center;

  z-index: 1;
  pointer-events: none;

  opacity: ${props => props.$loading ? "100%" : "0%"};
  transition: opacity .25s;
`;

const PostersContainer = styled.div`
  margin: 50px;
  display: grid;
  justify-content: space-around;

  grid-template-columns: repeat(auto-fill, 154px);
  gap: 30px 20px;
  
  @media (max-width: 500px) {
    grid-template-columns: repeat(auto-fill, 130px);
    gap: 40px 40px;
    margin: 60px 40px;
  }

  opacity: ${props => props.$loading ? "50%" : "100%"};
  transition: opacity .25s;
`;

const FilmPoster = styled.div`
  width: 154px;
  height: 231px;
  
  @media (max-width: 500px) {
    width: 130px;
    height: 195px;
  }

  display: inline-block;
  border-radius: 5px;

  vertical-align: top;
  overflow: hidden;
  position: relative;
  cursor: pointer;
`;

const TitleText = styled.div`
  display: table;
  width: 100%;
  height: 100%;
  text-align: center;

  table-layout: fixed;
  width : 100%;
  
  & p {
    overflow-wrap: break-word;
    hyphens: auto;

    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: 'Londrina Solid', impact, sans-serif;
    font-weight: 400;
    font-size: 40px;
    line-height: 50px;

    color: #FFF;
    display: table-cell;
    vertical-align: middle;
  }
`;

export default App;
