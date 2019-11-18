/* eslint-disable new-cap */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import fillUnit from './fillUnit';

const main = () => {
  let matrix = 1;

  console.log(matrix);
  let mode;
  let prevColor;
  let currentColor;
  // let matrix = 4;

  const canv = document.getElementsByClassName('myCanvas')[0];
  const ctx = canv.getContext('2d');
  console.log('canvas size', canv.height, canv.width);

  // Clear Canvas/////////////////
  const clear = document.getElementsByClassName('clear')[0];
  const clearCanvas = () => {
    ctx.clearRect(0, 0, canv.width, canv.height);
  };
  clear.addEventListener('click', clearCanvas);

  // //////////////Work with tools//////////////
  const paintBtn = document.getElementsByClassName('paint-btn')[0];
  const pickBtn = document.getElementsByClassName('pick-btn')[0];
  const penBtn = document.getElementsByClassName('pen-btn')[0];

  if (localStorage.getItem('mode')) {
    mode = localStorage.getItem('mode');
    if (localStorage.getItem('selected')) {
      const cl = localStorage.getItem('selected');
      document.getElementsByClassName('clicked')[0].classList.toggle('clicked');
      document.getElementsByClassName(cl)[0].parentElement.classList.toggle('clicked');
    }
  } else {
    mode = 'pen';
    penBtn.classList.add('clicked');
  }
  /*   if (localStorage.getItem('canvas')) { // get Canvas image from local Storage
    const dataURL = localStorage.getItem('canvas');
    const img = new Image();
    img.src = dataURL;
    console.log('url', dataURL);
    img.onload = function load() {
      ctx.drawImage(img, 0, 0, canv.width, canv.height);
    };
  } */

  const resizePhoto = (randomImg) => {
    let wImg = randomImg.width;
    let hImg = randomImg.height;
    const ratio = wImg / hImg;
    console.log('w', wImg);
    console.log('h', hImg);
    if (ratio > 1) {
      wImg = canv.width;
      hImg = wImg / ratio;
      ctx.drawImage(randomImg, 0, (canv.height - hImg) / 2, canv.width, hImg);
    } else if (ratio < 1) {
      hImg = canv.height;
      wImg = ratio * hImg;
      ctx.drawImage(randomImg, (canv.width - wImg) / 2, 0, wImg, canv.height);
    } else if (ratio === 1) {
      ctx.drawImage(randomImg, 0, 0, canv.width, canv.height);
    }
  };

  const getCanvas = () => {
    if (localStorage.getItem('canvas')) { // get Canvas image from local Storage
      const dataURL = localStorage.getItem('canvas');
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function load() {
        resizePhoto(img);
      };
      img.src = dataURL;
      console.log('url', dataURL);
    }
  };

  getCanvas();


  const paintMode = () => {
    mode = 'paint';
    document.getElementsByClassName('clicked')[0].classList.toggle('clicked');
    paintBtn.parentElement.classList.add('clicked');
    localStorage.setItem('mode', 'paint');
    localStorage.setItem('selected', 'paint-btn');
  };

  const colPickerMode = (event) => {
    mode = 'colPicker';
    document.getElementsByClassName('clicked')[0].classList.toggle('clicked');
    pickBtn.parentElement.classList.add('clicked');
    event.stopPropagation(); // for correct displaying current color
    localStorage.setItem('mode', 'colPicker');
    localStorage.setItem('selected', 'pick-btn');
  };

  const penMode = () => {
    mode = 'pen';
    document.getElementsByClassName('clicked')[0].classList.toggle('clicked');
    penBtn.parentElement.classList.add('clicked');
    localStorage.setItem('mode', 'pen');
    localStorage.setItem('selected', 'pen-btn');
  };


  pickBtn.addEventListener('click', colPickerMode);
  penBtn.addEventListener('click', penMode);
  paintBtn.addEventListener('click', paintMode);

  // ///////////Colors////////////////////////
  const curColorBtn = document.getElementsByClassName('cur-col-btn')[0];

  if (localStorage.getItem('currentColor')) { // take current color from Local storage
    currentColor = localStorage.getItem('currentColor');
    curColorBtn.style.backgroundColor = currentColor;
  } else {
    currentColor = getComputedStyle(curColorBtn).backgroundColor;
  }


  const prevColorBtn = document.getElementsByClassName('prev-col-btn')[0];


  function getColor() {
    const temp = currentColor;
    currentColor = this.value;
    curColorBtn.style.backgroundColor = currentColor;
    prevColorBtn.style.backgroundColor = temp;
    prevColor = temp;
    localStorage.setItem('currentColor', currentColor);
    localStorage.setItem('prevColor', prevColor);
  }

  curColorBtn.addEventListener('input', getColor);

  if (localStorage.getItem('prevColor')) { // take prev color from Local storage
    prevColor = localStorage.getItem('prevColor');
    prevColorBtn.style.backgroundColor = prevColor;
  } else {
    prevColor = getComputedStyle(prevColorBtn).backgroundColor;
  }

  const redBtn = document.getElementsByClassName('red-btn')[0];
  const getRed = () => {
    if (mode === 'colPicker') { return; }
    const temp = currentColor;
    currentColor = '#ff0000';
    curColorBtn.style.backgroundColor = currentColor;
    prevColor = temp;
    prevColorBtn.style.backgroundColor = temp;
    localStorage.setItem('currentColor', currentColor);
    localStorage.setItem('prevColor', prevColor);
  };
  redBtn.addEventListener('click', getRed);


  const blueBtn = document.getElementsByClassName('blue-btn')[0];
  const getBlue = () => {
    if (mode === 'colPicker') { return; }
    const temp = currentColor;
    currentColor = '#41b6f7';
    curColorBtn.style.backgroundColor = currentColor;
    prevColorBtn.style.backgroundColor = temp;
    prevColor = temp;
    localStorage.setItem('currentColor', currentColor);
    localStorage.setItem('prevColor', prevColor);
  };
  blueBtn.addEventListener('click', getBlue);


  // /Pick color from canvas//////

  function pickColor(event) {
    const temp = currentColor;
    if (mode === 'colPicker') {
      const x0 = Math.ceil((event.pageX - canv.offsetLeft) / matrix);
      const y0 = Math.ceil((event.pageY - canv.offsetTop) / matrix);
      const imageData = ctx.getImageData(x0, y0, 1, 1);
      const pixel = imageData.data;
      const red = pixel[0];
      const green = pixel[1];
      const blue = pixel[2];
      if (pixel[3] === 0) { // define pixel color from not-colored area
        currentColor = 'RGBA(245,245,220,1)'; // canvas.backgroundColor
        curColorBtn.style.backgroundColor = currentColor;
        prevColorBtn.style.backgroundColor = temp;
        prevColor = temp;
        localStorage.setItem('currentColor', currentColor);
        localStorage.setItem('prevColor', prevColor);
      } else {
        currentColor = `RGB(${red},${green},${blue})`;
        curColorBtn.style.backgroundColor = currentColor;
        prevColorBtn.style.backgroundColor = temp;
        prevColor = temp;
        localStorage.setItem('currentColor', currentColor);
        localStorage.setItem('prevColor', prevColor);
      }
    }
  }

  // / Pick color from all Document except Canvas  ///////////////////////
  const clickEvent = (event) => {
    if (mode === 'colPicker' && event.target !== canv) {
      const temp = currentColor;
      const computedStyle = window.getComputedStyle(event.target);
      currentColor = computedStyle.backgroundColor;
      curColorBtn.style.backgroundColor = currentColor;
      prevColorBtn.style.backgroundColor = temp;
      prevColor = temp;
      localStorage.setItem('currentColor', currentColor);
      localStorage.setItem('prevColor', prevColor);
    }
  };

  document.addEventListener('click', clickEvent);

  // ///////////Matrix//////////////////////
  const mat128Btn = document.getElementsByClassName('matrix128')[0];
  const mat256Btn = document.getElementsByClassName('matrix256')[0];
  const mat512Btn = document.getElementsByClassName('matrix512')[0];

  // eslint-disable-next-line no-unused-vars
  const setMatrix = (event) => {
    if (event.target === mat128Btn) {
      matrix = 4;
      document.getElementsByClassName('selected')[0].classList.toggle('selected');
      mat128Btn.classList.add('selected');
      canv.height = 128;
      canv.width = 128;
      /*  let data =  */getCanvas();
      // resizePhoto(data);
    }
    if (event.target === mat256Btn) {
      matrix = 2;
      document.getElementsByClassName('selected')[0].classList.toggle('selected');
      mat256Btn.classList.add('selected');
      canv.height = 256;
      canv.width = 256;
      /* let data = */ getCanvas();
      //  resizePhoto(data);
    }
    if (event.target === mat512Btn) {
      matrix = 1;
      document.getElementsByClassName('selected')[0].classList.toggle('selected');
      mat512Btn.classList.add('selected');
      canv.height = 512;
      canv.width = 512;
      /* let data =  */getCanvas();
    /*   resizePhoto(data); */
    }
    console.log('canvas size', canv.height, canv.width);
  };

  mat128Btn.addEventListener('click', setMatrix);

  mat256Btn.addEventListener('click', setMatrix);

  mat512Btn.addEventListener('click', setMatrix);


  // ///////////Drawing////////////////////////////
  let drawing = false;
  let userUnitX;
  let userUnitY;
  let x0;
  let y0;
  let x1;
  let y1;
  const startDrawing = () => {
    ctx.fillStyle = currentColor;
    if (mode === 'paint') {
      drawing = true;
      ctx.fillRect(0, 0, canv.width, canv.height);
    }

    if (mode === 'pen') {
      drawing = true;
      x0 = undefined;
      y0 = undefined;
    }
  };

  const defineUserUnit = (x, y, mat) => { // define part matrix in according to cursor position
  // eslint-disable-next-line no-param-reassign
    if (x > canv.width) { x = canv.width; }
    // eslint-disable-next-line no-param-reassign
    if (y > canv.height) { y = canv.height; }
    userUnitX = Math.ceil(x / mat);
    userUnitY = Math.ceil(y / mat);
    /*     if (mat === 4) {
      userUnitX = Math.ceil(x / 128);
      userUnitY = Math.ceil(y / 128);
    }
    if (mat === 32) {
      userUnitX = Math.ceil(x / 16);
      userUnitY = Math.ceil(y / 16);
    } */
  };


  /*  function debounce(f, ms) {
    let isCooldown = false;
    // eslint-disable-next-line func-names
    return function () {
      if (isCooldown) return;
      // eslint-disable-next-line prefer-rest-params
      f.apply(this, arguments);
      isCooldown = true;
      // eslint-disable-next-line no-return-assign
      setTimeout(() => isCooldown = false, ms);
    };
  }

  const f = () => {
    localStorage.setItem('canvas', canv.toDataURL());
  }; */

  function stopDrawing() {
    if (mode === 'pen') {
      drawing = false;
      x0 = undefined;
      x1 = undefined;
      y0 = undefined;
      y1 = undefined;
      // debounce(f, 50);
      localStorage.setItem('canvas', canv.toDataURL());
    }
  }


  // BrezAlg/////////////////////

  function BrezAlg(startx, endx, starty, endy, canvas) {
    const deltax = Math.abs(endx - startx);
    const deltay = Math.abs(endy - starty);
    let error = 0;
    let deltaerr = deltay / deltax;
    let missedY = starty;
    let diry = endy - starty;
    if (diry > 0) { diry = 1; }
    if (diry < 0) { diry = -1; }
    if (startx < endx) {
      for (let missedX = startx; missedX <= endx; missedX += 1) {
      //  defineUserUnit(missedX, missedY, matrix);
        fillUnit(missedX, missedY, canvas);
        error += deltaerr;
        if (error >= 0.5) {
          missedY += diry;
          error -= 1;
        }
      }
    } else if (startx > endx) {
      for (let missedX = startx; missedX >= endx; missedX -= 1) {
        // defineUserUnit(missedX, missedY, matrix);
        fillUnit(missedX, missedY, canvas);
        error += deltaerr;
        if (error >= 0.5) {
          missedY += diry;
          error -= 1;
        }
      }
    }

    if (deltay > deltax) {
      deltaerr = deltax / deltay;
      let missedX = startx;
      let dirx = endx - startx;
      if (dirx > 0) { dirx = 1; }
      if (dirx < 0) { dirx = -1; }
      if (starty < endy) {
        for (missedY = starty; missedY <= endy; missedY += 1) {
          // defineUserUnit(missedX, missedY, matrix);
          fillUnit(missedX, missedY, canvas);
          error += deltaerr;
          if (error >= 0.5) {
            missedX += dirx;
            error -= 1;
          }
        }
      } else if (starty > endy) {
        for (missedY = starty; missedY >= endy; missedY -= 1) {
          // defineUserUnit(missedX, missedY, matrix);
          fillUnit(missedX, missedY, canvas);
          error += deltaerr;
          if (error >= 0.5) {
            missedX += dirx;
            error -= 1;
          }
        }
      }
    }
  }

  const drawingProcess = (event) => {
    if (mode === 'pen' && drawing === true) {
      x1 = Math.ceil((event.pageX - canv.offsetLeft) / matrix);
      y1 = Math.ceil((event.pageY - canv.offsetTop) / matrix);
      console.log('pixel', x1, y1);
      // defineUserUnit(x1, y1, matrix);
      fillUnit(x1, y1, ctx);
      if ((x0) && (y0)) { BrezAlg(x0, x1, y0, y1, ctx); }
      x0 = x1;
      y0 = y1;
    }
  };

  canv.addEventListener('mousedown', startDrawing);
  canv.addEventListener('mouseup', stopDrawing);
  canv.addEventListener('mousemove', drawingProcess);
  canv.addEventListener('mousedown', pickColor);


  // / Hot keys///////////////

  const hotKeys = (event) => {
    if (event.key === 'b') {
      paintMode();
    }
    if (event.key === 'p') {
      penMode();
    }
    if (event.key === 'c') {
      colPickerMode();
    }
  };

  const body = document.getElementById('body');
  body.addEventListener('keyup', hotKeys);

  const randomBtn = document.getElementsByClassName('random-btn')[0];

  const randomPhoto = () => {
    ctx.clearRect(0, 0, canv.width, canv.height);
    const searchText = document.getElementsByClassName('search-input')[0].value;
    console.log('parametr', searchText);
    const url = `https://api.unsplash.com/photos/random?query=town,${searchText}&client_id=73861cdf71d6b882af3a2077382d2a4c5b54a586b96db6ed530ac9640386e185`;
    fetch(url)
      .then(res => res.json())
      .then((data) => {
        console.log(data.urls.small);
        console.log(url);
        const randomImg = new Image();
        randomImg.crossOrigin = 'Anonymous';
        randomImg.onload = function load() {
          resizePhoto(randomImg);
        };
        randomImg.src = data.urls.small;
        localStorage.setItem('canvas', data.urls.small);
        console.log('put in LS', data.urls.small);
      });
  };

  randomBtn.addEventListener('click', randomPhoto);

  // Grayscale //////
  const wbBtn = document.getElementsByClassName('wb-btn')[0];
  const grayscale = () => {
    const imageData = ctx.getImageData(0, 0, canv.width, canv.height);
    const { data } = imageData;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg; // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
    }
    ctx.putImageData(imageData, 0, 0);
  };
  wbBtn.addEventListener('click', grayscale);

  //    ////////////////////////
  let myData;


  getLogin = (token) => {
    fetch('https://api.github.com/user',
      {
      /*     method: 'GET',
      withCredentials: true,
      credentials: 'include', */
        headers: {
          Authorization: `token ${token}`,
        },
      })
      .then(res => res.json())
      .then((data) => {
        console.log('Data from github');
        console.log(data);
      });
  };

  const anchorTag = document.getElementById('login');
  const outputText = document.getElementById('output');
  anchorTag.addEventListener('click', (e) => {
    e.preventDefault();
    const authenticator = new netlify.default({});
    authenticator.authenticate({ provider: 'github', scope: 'user' }, (err, data) => {
      // eslint-disable-next-line no-unused-expressions
      err ? outputText.innerText = `Error Authenticating with GitHub: ${err}`
        : /* outputText.innerText */ myData = data.token;
      console.log(data);
      console.log(myData);
      getLogin(myData);
    });
  });

  // /////////////////////////////////////////
  /*   fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "same-origin"
  }).then(function(response) {
    response.status     //=> number 100–599
    response.statusText //=> String
    response.headers    //=> Headers
    response.url        //=> String

    return response.text()
  }, function(error) {
    error.message //=> String
  }) */


  // ///////


  //  /////////////////////////////////
};

main();
