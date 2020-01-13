import React, { useEffect, useRef, useState } from "react";
import SiriWave from "siriwave";

interface IProps {
  className?: string;
  width: number;
  height: number;
  type: "play" | "stop";
}

function SiriWaveForm(props: IProps) {
  const { className, width, height, type } = props;
  const siriRef = useRef(null);
  const siriWave = useRef<any>(null);

  useEffect(() => {
    siriWave.current = new SiriWave({
      container: siriRef.current!,
      style: "ios9",
      width,
      height,
      cover: true
    });
    siriWave.current.start();
  }, []);

  useEffect(() => {
    if (!siriWave.current) {
      return;
    }
    if (type === "play") {
      siriWave.current.setAmplitude(1);
    }
    if (type === "stop") {
      siriWave.current.setAmplitude(0);
    }
  }, [type]);

  return <div ref={siriRef} className={className} id="siri-container" />;
}

export default SiriWaveForm;
