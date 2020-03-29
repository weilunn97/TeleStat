import Modali, { useModali } from "modali";
import React from "react";
import step1 from "./guide/step1.png";
import step2 from "./guide/step2.png";
import step3 from "./guide/step3.png";
import step4 from "./guide/step4.png";
import step5 from "./guide/step5.png";

const HelpModal = props => {
  const toggleHelpModalOneTwo = () => {
    toggleHelpModalStepOne();
    toggleHelpModalStepTwo();
  };
  const toggleHelpModalTwoThree = () => {
    toggleHelpModalStepTwo();
    toggleHelpModalStepThree();
  };
  const toggleHelpModalThreeFour = () => {
    toggleHelpModalStepThree();
    toggleHelpModalStepFour();
  };
  const toggleHelpModalFourFive = () => {
    toggleHelpModalStepFour();
    toggleHelpModalStepFive();
  };

  const [helpModalStepOne, toggleHelpModalStepOne] = useModali({
    animated: true,
    centered: true,
    large: true,
    title: "1. 👋👋 Choose any ONE-ON-ONE 💬 on Telegram Desktop.",
    buttons: [
      <Modali.Button isStyleDefault label=">" onClick={toggleHelpModalOneTwo} />
    ]
  });

  const [helpModalStepTwo, toggleHelpModalStepTwo] = useModali({
    animated: true,
    centered: true,
    large: true,
    title: "2. None are important, so skip them. 😉",
    buttons: [
      <Modali.Button
        isStyleDefault
        label="<"
        onClick={toggleHelpModalOneTwo}
      />,
      <Modali.Button
        isStyleDefault
        label=">"
        onClick={toggleHelpModalTwoThree}
      />
    ]
  });

  const [helpModalStepThree, toggleHelpModalStepThree] = useModali({
    animated: true,
    centered: true,
    large: true,
    title: "3. Note your download 📂, and maximize the size limit.",
    buttons: [
      <Modali.Button
        isStyleDefault
        label="<"
        onClick={toggleHelpModalTwoThree}
      />,
      <Modali.Button
        isStyleDefault
        label=">"
        onClick={toggleHelpModalThreeFour}
      />
    ]
  });

  const [helpModalStepFour, toggleHelpModalStepFour] = useModali({
    animated: true,
    centered: true,
    large: true,
    title: "4. Well, click on it! 🤓",
    buttons: [
      <Modali.Button
        isStyleDefault
        label="<"
        onClick={toggleHelpModalThreeFour}
      />,
      <Modali.Button
        isStyleDefault
        label=">"
        onClick={toggleHelpModalFourFive}
      />
    ]
  });

  const [helpModalStepFive, toggleHelpModalStepFive] = useModali({
    animated: true,
    centered: true,
    large: true,
    title:
      "5. See your 'messages' file right there? Upload that and we're done! 😎",
    buttons: [
      <Modali.Button
        isStyleDefault
        label="<"
        onClick={toggleHelpModalFourFive}
      />,
      <Modali.Button
        isStyleDefault
        label="Upload"
        onClick={props.uploadOverlayClickHandler}
      />
    ]
  });

  return (
    <div className="app">
      <button id="Main-help-button" onClick={toggleHelpModalStepOne} />
      <Modali.Modal {...helpModalStepOne}>
        <img alt="Step 1" src={step1} />
      </Modali.Modal>
      <Modali.Modal {...helpModalStepTwo}>
        <img alt="Step 2" src={step2} />
      </Modali.Modal>
      <Modali.Modal {...helpModalStepThree}>
        <img alt="Step 3" src={step3} />
      </Modali.Modal>
      <Modali.Modal {...helpModalStepFour}>
        <img alt="Step 4" src={step4} />
      </Modali.Modal>
      <Modali.Modal {...helpModalStepFive}>
        <img alt="Step 5" src={step5} />
      </Modali.Modal>
    </div>
  );
};

export default HelpModal;
