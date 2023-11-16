import React from 'react';
import { keyframes, styled } from 'styled-components';

const LoadingCamera = ({ size=400 }) => {
  return (
    <MySvg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 1200 1200" fill="none">
      <defs>
        <mask id="rightborder">
          <rect width="100%" height="100%" fill="white" />
          <rect width="630" height="400" rx="45" x="260" y="560" fill="black" />
        </mask>
        <mask id="holesinreel1">
          <rect width="100%" height="100%" fill="white" />
          <circle r="10" cx="330" cy="530" fill="black" />
          <circle r="45" cx="260" cy="570" fill="black" />
          <circle r="45" cx="330" cy="450" fill="black" />
          <circle r="45" cx="400" cy="570" fill="black" />
        </mask>
        <mask id="holesinreel2">
          <rect width="100%" height="100%" fill="white" />
          <circle r="15" cx="720" cy="480" fill="black" />
          <circle r="65" cx="630" cy="420" fill="black" />
          <circle r="65" cx="720" cy="580" fill="black" />
          <circle r="65" cx="810" cy="420" fill="black" />
        </mask>
        <mask id="holesincamera">
          <rect width="100%" height="100%" fill="white" />
          <circle r="180" cx="330" cy="530" fill="black" />
          <circle r="230" cx="720" cy="480" fill="black" />
        </mask>
      </defs>
      <circle r="150" cx="330" cy="530" fill="black" mask="url(#holesinreel1)" transform="rotate(0)" transform-origin="330 530" id="reel1"/>
      <circle r="200" cx="720" cy="480" fill="black" mask="url(#holesinreel2)" transform="rotate(0)" transform-origin="720 480" id="reel2"/>
      <path
        d="M 1070,620 l -350,150 l 350,150 l 0,-300"
        stroke="black" strokeWidth="60" strokeLinecap="round" strokeLinejoin="round"
        fill="black" mask="url(#rightborder)"
      />
      <rect width="600" height="400" rx="45" x="260" y="560" fill="black" mask="url(#holesincamera)" />
    </MySvg>
  );
};

const rotateForwards = keyframes`
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
`;const rotateBackwards = keyframes`
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(-360deg);
}
`;
const MySvg = styled.svg`
  #reel1 {
    animation-name: ${rotateForwards};
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
  #reel2 {
    animation-name: ${rotateForwards};
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
`;

export default LoadingCamera;
