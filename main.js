async function init() {
  let localizationData;
  await loadData();

  const elements = getElements();
  let clickCounter = 0;

  const animationConfig = [
    {
      character: "translateX(-70px) rotate(-10deg)",
      button: "translateY(-230px) translateX(70px) scale(0.5) rotate(180deg)",
      ball: "translateX(90px)",
      progressBar: "110px",
    },
    {
      character: "translateX(70px) rotate(10deg)",
      button: "translateY(-210px) translateX(-60px) scale(0.5) rotate(45deg)",
      ball: "translateX(190px)",
      progressBar: "210px",
    },
  ];

  document.body.addEventListener("click", startAnimation);
  elements.popupButton.addEventListener("click", handlePopupButtonClick);

  function getElements() {
    return {
      progress: document.querySelector(".progress-bar"),
      ball: document.querySelector(".progress-bar__ball-image"),
      progressBar: document.querySelector(".progress-bar__inner"),
      button: document.querySelector(".soccer__ball-image"),
      character: document.querySelector(".soccer__character"),
      popup: document.querySelector(".popup"),
      popupContent: document.querySelector(".popup__content"),
      popupButton: document.querySelector(".popup__button"),
    };
  }

  function setTextContentToElements() {
    document.querySelector(".header__text").textContent =
      localizationData.ctaText;
    const progressTexts = document.querySelector(
      ".progress-bar__bottom-texts"
    ).children;
    progressTexts[0].textContent = localizationData.progressTextFreespins;
    progressTexts[1].textContent = localizationData.progressTextBonus;

    const popupTexts = {
      ".popup__congratulation-text": localizationData.firstPopupTextCongratz,
      ".popup__won-text": localizationData.firstPopupTextWon,
      ".popup__value-text": localizationData.firstPopupTextValue,
      ".popup__freespins-text": localizationData.firstPopupTextFreespins,
      ".popup__button": localizationData.firstPopupTextButton,
    };

    for (const [selector, text] of Object.entries(popupTexts)) {
      document.querySelector(selector).textContent = text;
    }
  }

  function startAnimation() {
    elements.button.classList.remove("soccer__ball-image_animated");
    elements.button.offsetWidth;
    document.body.removeEventListener("click", startAnimation);

    const config = animationConfig[clickCounter];
    elements.character.style.transform = config.character;
    elements.button.style.transform = config.button;

    setTimeout(() => {
      elements.ball.style.transform = config.ball;
      elements.progressBar.style.width = config.progressBar;

      setTimeout(showPopup, 500);
    }, 500);
  }

  function showPopup() {
    elements.popup.style.display = "flex";
    setTimeout(() => {
      elements.popup.style.opacity = 1;
    }, 30);
  }

  function closePopup() {
    elements.popup.style.display = "none";
    elements.popup.style.opacity = 0;
    updatePopupContent();
  }

  function handlePopupButtonClick() {
    if (clickCounter === 0) {
      clickCounter++;
      closePopup();
      resetPositions();
      setTimeout(startAnimation, 500);
    } else {
      setCookie("penalty", "1613");
      redirectToIfCookie();
    }
  }

  function resetPositions() {
    elements.character.style.transform = "";
    elements.button.style.transform = "";
  }

  async function loadData() {
    const response = await fetch("localization.json");
    localizationData = await response.json();
  }

  function updatePopupContent() {
    const valueText = elements.popupContent.children[2];
    valueText.textContent = localizationData.secondPopupTextValue;
    valueText.classList.add("gradient", "stroke-large");

    const freespinsText = elements.popupContent.children[3];
    freespinsText.textContent = localizationData.secondPopupTextFreespins;
    freespinsText.classList.add("gradient", "stroke-small");

    const depositText = document.createElement("p");
    depositText.textContent = localizationData.secondPopupTextDeposit;
    depositText.classList.add("deposit");
    freespinsText.after(depositText);

    elements.popupButton.textContent = localizationData.secondPopupTextButton;
  }

  function setCookie(name, value, options = {}) {
    options = {
      path: "/",
      ...options,
    };

    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }

    let updatedCookie = `${encodeURIComponent(name)}=${encodeURIComponent(
      value
    )}`;
    for (let optionKey in options) {
      updatedCookie += `; ${optionKey}`;
      if (options[optionKey] !== true) {
        updatedCookie += `=${options[optionKey]}`;
      }
    }
    document.cookie = updatedCookie;
  }

  function getCookie(name) {
    const matches = document.cookie.match(
      new RegExp(
        `(?:^|; )${name.replace(/([.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1")}=([^;]*)`
      )
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  function genUrl() {
    return window.location.href.split("r=")[1];
  }

  function redirectToIfCookie() {
    if (getCookie("penalty")) {
      window.location.href = genUrl();
    }
  }

  redirectToIfCookie();
  setTextContentToElements();
}

init();
