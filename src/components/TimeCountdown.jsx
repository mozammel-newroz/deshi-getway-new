import React from "react";
import Countdown from "react-countdown";

const TimeCountdown = ({ countDownValue, currentTime }) => {
  const Completionist = () => <span>Your time is over</span>;

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <span>
         This page will timed out in {minutes} minutes {seconds} seconds
        </span>
      );
    }
  };

  return (
    <div>
      <Countdown
        date={currentTime + countDownValue}
        renderer={renderer}
      ></Countdown>
    </div>
  );
};

export default TimeCountdown;
