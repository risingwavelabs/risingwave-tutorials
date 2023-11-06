import React from "react";
import clsx from "clsx";
import LeftImage from "@site/static/img/ease-of-use.png";
import MiddleImage from "@site/static/img/efficient.png";
import RightImage from "@site/static/img/open.png";
import styles from "./styles.module.css";

// const MidImage = () => {
//   return (
//     <img
//       style={{ height: "200px", padding: "20px" }}
//       src={require("../../../static/img/efficient.png").default}
//       alt="mid"
//     />
//   );
// };

// const RightImage = () => {
//   return (
//     <img
//       style={{ height: "200px" }}
//       src={require("../../../static/img/open.png").default}
//       alt="right"
//     />
//   );
// };

const FeatureList = [
  {
    title: "Easy to Use",
    Image: <img style={{ height: "200px" }} src={LeftImage} alt="left" />,
    description: (
      <>
        RisingWave was designed from the ground up to be easily used and managed
        to get your stream processing running quickly.
      </>
    ),
  },
  {
    title: "Focus on What Matters",
    Image: (
      <img
        style={{ height: "200px", padding: "20px" }}
        src={MiddleImage}
        alt="middle"
      />
    ),
    description: (
      <>
        RisingWave lets you focus on your stream processing logic, without
        worrying about the system performance, efficiency, and reliability.
      </>
    ),
  },
  {
    title: "Open and Transparent",
    Image: <img style={{ height: "200px" }} src={RightImage} alt="right" />,
    description: (
      <>
        Open-sourced under Apache 2.0, RisingWave integrates well with modern
        data systems, simplifying real-time data stack development.
      </>
    ),
  },
];

function Feature({ Image, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">{Image}</div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
