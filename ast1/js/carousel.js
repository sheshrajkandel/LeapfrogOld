(function() {
  const EM = "16";
  const IMG_WIDTH = "800";
  const IMG_HEIGHT = "200";
  const SPEED = 5;

  function Carousel(WDTH, HEIGHT, carouselElement) {
    this.carousel = carouselElement;
    this.init = function() {
      // container
      this.carousel.style.width = WDTH / EM + "em";
      this.carousel.style.height = IMG_HEIGHT / EM + "em";
      this.carousel.style.position = "relative";
      this.carousel.style.overflow = "hidden";
      this.carousel.style.margin = "auto";
      return this;
    };

    this.getElement = function() {
      return this.carousel;
    };

    function getCarousel() {
      return this.carousel;
    }
  }

  function Wrapper(wrapperElement, sliderImages) {
    this.wrapper = wrapperElement;
    this.wrapperWidth = sliderImages.length * IMG_WIDTH;

    this.init = function() {
      // wrapper
      this.wrapper.style.position = "relative";

      this.leftPosition = 0;
      this.rightPosition = -(this.wrapperWidth - IMG_WIDTH);
      this.wrapper.style.width = this.wrapperWidth + "px";
      this.wrapper.style.left = this.leftPosition + "px";
      return this;
    };

    this.setRightPosition = function(rightPosition) {
      this.wrapper.style.right = rightPosition + "px";
      this.rightPosition = rightPosition;
    };

    this.setLeftPosition = function(leftPosition) {
      this.wrapper.style.left = leftPosition + "px";
      this.leftPosition = leftPosition;
    };

    this.getRightPosition = function() {
      return this.rightPosition;
    };

    this.getLeftPosition = function() {
      return this.leftPosition;
    };

    this.getElement = function() {
      return this.wrapper;
    };

    this.getWrapper = function() {
      return this.wrapper;
    };
  }

  // Indicator Function
  function Indicator(parentElement, indicatorCount) {
    this.parentElement = parentElement;
    this.indicatorCount = indicatorCount;
    this.indexList = [];
    this.init = function() {
      // Indicator
      this.indicator = document.createElement("ul");
      this.indicator.style.position = "absolute";
      this.indicator.style.bottom = "0px";
      this.indicator.style.textAlign = "center";
      this.indicator.style.width = "100%";

      this.currentIndex = 0;

      this.parentElement.appendChild(this.indicator);
      return this;
    };

    this.getElement = function() {
      return this.indicator;
    };

    this.checkActiveIndex = function(indicatorNode, pos) {
      if (pos === this.currentIndex) {
        indicatorNode.setAttribute("class", "fas fa-circle");
      } else {
        indicatorNode.setAttribute("class", "far fa-circle");
      }
    };

    this.initializeIndicators = function() {
      for (var pos = 0; pos < indicatorCount; pos++) {
        var indicatorList = document.createElement("li");
        indicatorList.style.width = "40px";
        indicatorList.style.height = "40px";
        indicatorList.style.color = "white";

        this.checkActiveIndex(indicatorList, pos);
        this.indicator.appendChild(indicatorList);
      }
    };

    this.updateIndicators = function() {
      var indicatorList = Array.from(this.indicator.children);

      for (var i = 0; i < this.indicatorCount; i++) {
        // sending the list at index i and ithe position
        this.checkActiveIndex(indicatorList[i], i);
      }
    };

    this.getIndicator = function() {
      return this.indicator;
    };

    this.incrementIndex = function() {
      this.currentIndex = this.currentIndex + 1;
      this.updateIndicators();
    };

    this.decrementIndex = function() {
      this.currentIndex = this.currentIndex - 1;
      this.updateIndicators();
    };

    this.getCurrentIndex = function() {
      return this.currentIndex;
    };

    this.setCurrentIndex = function(index) {
      this.currentIndex = index;
      this.updateIndicators();
    };
  }

  // side slider button
  function SideButton(parentElement) {
    this.parentElement = parentElement;
    this.isEnabled = true;

    this.init = function() {
      this.sideBtnElement = document.createElement("button");
      this.slideIcon = document.createElement("i");

      this.sideBtnElement.style.position = "absolute";
      this.sideBtnElement.style.lineHeight = "40px";
      this.sideBtnElement.style.width = "40px";
      this.sideBtnElement.style.textAlign = "center";
      this.sideBtnElement.style.top = "50%";

      this.slideIcon.style.fontSize = "20px";
      this.slideIcon.style.color = "#fcfcfc";

      this.sideBtnElement.appendChild(this.slideIcon);
      this.parentElement.appendChild(this.sideBtnElement);

      return this;
    };

    this.disableBtn = function() {
      if (this.isEnabled) {
        this.sideBtnElement.disabled = true;
        this.isEnabled = false;
      }
    };

    this.enableBtn = function() {
      if (!this.isEnabled) {
        this.sideBtnElement.disabled = false;
        this.isEnabled = true;
      }
    };

    this.getElement = function() {
      return this.sideBtnElement;
    };

    this.setIconPos = function(pos) {
      if (pos == "left") {
        this.slideIcon.appendChild(document.createTextNode("<"));
        this.sideBtnElement.style.left = 0;
      } else {
        this.slideIcon.appendChild(document.createTextNode(">"));
        this.sideBtnElement.style.right = 0;
      }
    };
  }

  function SliderController(carouselElement, intervalDuration) {
    this.carouselElement = carouselElement;
    this.wrapperElement = this.carouselElement.getElementsByClassName(
      "wrapper"
    )[0];
    this.sliderImages = this.wrapperElement.children;

    for (var i = 0; i < this.sliderImages.length; i++) {
      this.sliderImages[i].style.float = "left";
      this.sliderImages[i].style.width = IMG_WIDTH / EM + "em";
      this.sliderImages[i].style.height = IMG_HEIGHT / EM + "em";
    }

    this.carousel = new Carousel(
      IMG_WIDTH,
      IMG_HEIGHT,
      this.carouselElement
    ).init();
    this.wrapper = new Wrapper(this.wrapperElement, this.sliderImages).init();
    this.indicator = new Indicator(
      this.carousel.getElement(),
      this.sliderImages.length
    ).init();

    this.leftSideBtn = new SideButton(this.carousel.getElement()).init();
    this.rightSideBtn = new SideButton(this.carousel.getElement()).init();

    this.leftSideBtn.setIconPos("left");
    this.rightSideBtn.setIconPos("right");
    this.indicator.initializeIndicators();

    // Indicator Event Listener
    this.indicatorEvent = function(e) {
      var wrapperPosition = this.wrapper.getLeftPosition();

      var newIndex = Array.from(this.indicator.getElement().children).indexOf(
        e.target
      );
      var destinationPosition = -(newIndex * IMG_WIDTH);

      this.indicator.setCurrentIndex(newIndex);
      var anim = setInterval(
        function() {
          if (wrapperPosition != destinationPosition) {
            this.leftSideBtn.disableBtn();
            this.rightSideBtn.disableBtn();
            if (wrapperPosition < destinationPosition) {
              wrapperPosition = wrapperPosition + SPEED;
            } else {
              wrapperPosition = wrapperPosition - SPEED;
            }
            this.wrapper.setLeftPosition(wrapperPosition);
          } else {
            this.leftSideBtn.enableBtn();
            this.rightSideBtn.enableBtn();
            clearInterval(anim);
          }
        }.bind(this),
        SPEED
      );
    };

    // // Left button listener
    this.leftBtnEvent = function() {
      this.indicator.decrementIndex();
      this.leftSideBtn.disableBtn();
      this.rightSideBtn.disableBtn();

      var currentIndex = this.indicator.getCurrentIndex();
      var currentPosition = this.wrapper.getLeftPosition();
      var updatePosition = -(currentIndex * IMG_WIDTH);

      if (currentIndex < 0) {
        updatePosition = this.wrapper.getRightPosition();
        this.indicator.setCurrentIndex(this.sliderImages.length - 1);

        var sliderAnim = setInterval(
          function() {
            if (currentPosition !== updatePosition) {
              currentPosition = currentPosition - SPEED;

              this.wrapper.setLeftPosition(currentPosition);
            } else {
              this.leftSideBtn.enableBtn();
              this.rightSideBtn.enableBtn();
              clearInterval(sliderAnim);
            }
          }.bind(this),
          5
        );
      } else {
        var sliderAnim = setInterval(
          function() {
            if (currentPosition !== updatePosition) {
              currentPosition = currentPosition + SPEED;
              this.wrapper.setLeftPosition(currentPosition);
            } else {
              this.indicator.setCurrentIndex(-currentPosition / IMG_WIDTH);
              this.leftSideBtn.enableBtn();
              this.rightSideBtn.enableBtn();
              clearInterval(sliderAnim);
            }
          }.bind(this),
          5
        );
      }
    };

    // Right Index
    this.rightBtnEvent = function() {
      this.indicator.incrementIndex();
      this.leftSideBtn.disableBtn();
      this.rightSideBtn.disableBtn();

      var currentPosition = this.wrapper.getLeftPosition();
      var updatePosition = -(this.indicator.getCurrentIndex() * IMG_WIDTH);

      if (this.indicator.getCurrentIndex() >= this.sliderImages.length) {
        updatePosition = 0;
        this.indicator.setCurrentIndex(0);

        var sliderAnim = setInterval(
          function() {
            if (currentPosition !== updatePosition) {
              currentPosition = currentPosition + SPEED;
              this.wrapper.setLeftPosition(currentPosition);
            } else {
              this.leftSideBtn.enableBtn();
              this.rightSideBtn.enableBtn();
              clearInterval(sliderAnim);
            }
          }.bind(this),
          5
        );
      } else {
        var sliderAnim = setInterval(
          function() {
            if (currentPosition !== updatePosition) {
              currentPosition = currentPosition - SPEED;
              this.wrapper.setLeftPosition(currentPosition);
            } else {
              this.indicator.setCurrentIndex(-currentPosition / IMG_WIDTH);
              this.leftSideBtn.enableBtn();
              this.rightSideBtn.enableBtn();
              clearInterval(sliderAnim);
            }
          }.bind(this),
          5
        );
      }
    };

    this.startTransition = function(TRANSITION) {
      console.log("transition");
      setInterval(
        function() {
          var currentPosition = this.wrapper.getLeftPosition();

          this.indicator.incrementIndex();
          if (this.indicator.getCurrentIndex() >= this.sliderImages.length) {
            this.indicator.setCurrentIndex(0);
            this.wrapper.setLeftPosition(0);
          }

          var destination = -(this.indicator.getCurrentIndex() * IMG_WIDTH);
          if (currentPosition > destination) {
            while (currentPosition > destination) {
              currentPosition--;
              this.wrapper.setLeftPosition(currentPosition);
            }
          }
        }.bind(this),
        TRANSITION
      );
    };

    this.indicator.getElement().onclick = function(e) {
      return this.indicatorEvent(e);
    }.bind(this);

    this.leftSideBtn.getElement().onclick = function() {
      return this.leftBtnEvent();
    }.bind(this);

    this.rightSideBtn.getElement().onclick = function() {
      return this.rightBtnEvent();
    }.bind(this);
  }

  // Referencing the tags
  var carouselElementList = document.getElementsByClassName("carousel");
  for (var item = 0; item < carouselElementList.length; item++) {
    carouselElementList[item].style.float = "left";
    var sliderController = new SliderController(carouselElementList[item]);
    sliderController.startTransition((item + 1) * 1000);
  }
})();
