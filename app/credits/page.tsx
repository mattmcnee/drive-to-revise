import React from "react";
import Navbar from "@/components/ui/Navbar";

const CreditsPage = () => {
  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h3>
          This application was developed by <a href="https://github.com/mattmcnee">Matt McNee</a> and is available under the <a href="https://opensource.org/license/mit">MIT License</a>.
        </h3>
        <p>The following 3D models are licensed under <a href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution</a>:</p>
        <ul>
          <li><a href="https://skfb.ly/6Usqo">Classic Muscle car</a> by Lexyc16</li>
          <li><a href="https://fab.com/s/42bbd2ff7173">Peugeot 504 break</a> by Mohamed Fsili</li>
          <li><a href="https://skfb.ly/oGWTL">Stylised low poly Car</a> by Poly Elina</li>
          <li><a href="https://skfb.ly/6qFuZ">Low poly tree</a> by Kotzuo</li>
        </ul>
      </div>
    </>
  );
};

export default CreditsPage;