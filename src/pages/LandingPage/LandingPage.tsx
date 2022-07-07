import React, { useEffect, useState } from "react";
import styles from "./LandingPage.module.css";
import axios from "axios";

const LandingPage = () => {
  const [devices, setDevices] = useState([]);
  const [deviceData, setDeviceData] = useState({ cvmdata: "", videofiles: "" });
  const [trackData, setTrackData] = useState({});
  const [devicesError, setDevicesError] = useState(null);
  const [deviceDataError, setDeviceDataError] = useState(null);

  const getJSON = async (url: string) => {
    const response = await fetch(url);
    return response.json(); // get JSON from the response
  };

  const getDevices = () => {
    const payload = {
      userId: "100",
      orgId: "Lumi",
    };
    axios
      .get(
        `https://mockapi.lumi.systems/getdevices?userId=${payload.userId}&orgId=${payload.orgId}`
      )
      .then((response) => {
        setDevicesError(null);
        setDevices(response?.data?.output);
      })
      .catch((error) => {
        setDevicesError(error?.response?.data || "Error fetching devices");
      });
  };

  const getDeviceData = () => {
    const payload = { deviceId: "LabEye-dVr" };
    axios
      .get(
        `https://mockapi.lumi.systems/getdevicedata?deviceId=${payload.deviceId}`
      )
      .then((response) => {
        setDeviceDataError(null);
        setDeviceData(response?.data?.output);
        getJSON(response?.data?.output.cvmdata).then((data) =>
          setTrackData(data)
        );
      })
      .catch((error) => {
        setDeviceDataError(error.response.data || "Error fetching device data");
      });
  };

  useEffect(
    () => {
      getDevices();
      getDeviceData();
    },
    // eslint-disable-next-line
    []
  );

  const videoSrc = deviceData?.videofiles;

  // console.log("data", { devices, deviceData });
  // console.log("trackData", trackData);

  return (
    <div className={styles.page}>
      <video className={styles.page__video} controls src={videoSrc}>
        {/* <source src={videoSrc} type="video/mp4" />
        <track src={trackSrc} kind="track" /> */}
      </video>
      <div className={styles.page__error}>
        {devicesError && <p>{devicesError}</p>}
        {deviceDataError && <p>{deviceDataError}</p>}
      </div>
    </div>
  );
};

export default LandingPage;
