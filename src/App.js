import React, { useState } from 'react';
import { useGeolocated } from "react-geolocated";
import { useLocalStorage } from "@uidotdev/usehooks";
import styled from 'styled-components';

import Details from "./Details";
import LoadingCamera from './LoadingCamera';

// thx to https://stackoverflow.com/a/37726654
function cloneAsObject(obj) {
  if (obj === null || !(obj instanceof Object)) {
    return obj;
  }
  var temp = (obj instanceof Array) ? [] : {};
  // ReSharper disable once MissingHasOwnPropertyInForeach
  for (var key in obj) {
    temp[key] = cloneAsObject(obj[key]);
  }
  return temp;
}

const App = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedFilm, setSelectedFilm] = useState(null);

  const [username, setUsername] = useLocalStorage("letterboxdUsername", "limbero");
  const geoLocated = cloneAsObject(
    useGeolocated({
      userDecisionTimeout: 10000,
    })
  );
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = geoLocated;
  console.log(JSON.stringify(geoLocated, null, 4));
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
          console.log(geoLocated);
          setError(JSON.stringify(geoLocated, null, 4))
          return res.json();
        } else {
          throw new Error(`${res.status}: ${res.statusText}`);
        }
      })
      .catch(e => {
        let errorString = `${e.name}: "${e.message}",\n`;
        errorString += `request URL: "${url}"\n`
        errorString += `${JSON.stringify(geoLocated, null, 4)}`
        console.error(errorString);
        setError(errorString);
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
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}>
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
      </div>
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
                <TitleText lang="en">
                  <p style={{
                    fontSize: film.title.length > 25 ? (film.title.length > 40 ? "25px" : "30px") : "40px",
                    lineHeight: film.title.length > 25 ? (film.title.length > 40 ? "30px" : "37px") : "50px",
                  }}>
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
        <ErrorMessage>
          {error}
        </ErrorMessage>
      ) : null}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  font-family: Helvetica;
  text-align: center;
  padding-bottom: 50px;
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

  border-radius: 0;
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
    grid-template-columns: repeat(auto-fill, 35vw);
    gap: 10vw 10vw;
    margin: 10vw 10vw;
  }

  opacity: ${props => props.$loading ? "50%" : "100%"};
  transition: opacity .25s;
`;

const FilmPoster = styled.div`
  width: 154px;
  height: 231px;
  
  @media (max-width: 500px) {
    width: 35vw;
    height: 52.5vw;
  }

  display: inline-block;
  border-radius: 5px;

  vertical-align: top;
  overflow: hidden;
  position: relative;
  cursor: pointer;
`;

const TitleText = styled.article`
  display: table;
  height: 100%;
  text-align: center;

  table-layout: fixed;
  width: 100%;
  
  & p {
    -webkit-hyphens: auto;
    -moz-hyphens: auto;
    -ms-hyphens: auto;
    hyphens: auto;

    text-transform: lowercase;
    letter-spacing: 1px;
    font-family: 'Reliable', impact, sans-serif;
    font-weight: 400;
    font-size: 40px;
    line-height: 50px;

    color: #FFF;
    display: table-cell;
    vertical-align: middle;
    padding: 10px;
  }
`;

const ErrorMessage = styled.pre`
  margin: 50px auto;
  text-align: left;
  font-family: andale mono, monospace;

  background-color: #FCC;
  color: #000;
  border: 1px solid #F88;

  overflow-x: scroll;

  max-width: 60vw;
  @media (max-width: 600px) {
    max-width: 80vw;
  }
  @media (max-width: 500px) {
    max-width: 95vw;
  }
`;

export default App;
