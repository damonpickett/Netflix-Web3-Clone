let fs = require("fs");
let axios = require("axios");

let media = ["secretVideo.mp4"];
let ipfsArray = [];
let promises = [];

// this code reads through my media array above...
// it then pushes the array items to the promises array...
// It looks like for every item pushed to the promises array...
// there is an ipfs array containing an object with the keys 'path' and 'content
for (let i = 0; i < media.length; i++) {
  promises.push(
    new Promise((res, rej) => {
      fs.readFile(`${__dirname}/export/${media[i]}`, (err, data) => {
        if (err) rej();
        ipfsArray.push({
          path: `media/${i}`,
          content: data.toString("base64"),
        });
        res();
      });
    })
  );
}

// Once all promises above are resolved, the below code pushes to IPFS
Promise.all(promises).then(() => {
  axios.post(
    "https://deep-index.moralis.io/api/v2/ipfs/uploadFolder",
    ipfsArray,
    {
      headers: {
        "X-API-KEY":
          "5caIjtjr5No0LM7vs2Tm0IO5dE2Ngu1qsvpQk7VO8ZhdVGukxTuc5E70eiscu6Av",
        "Content-Type": "application/json",
        accept: "application/json",
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    }
  ).then((res) => {
    console.log(res.data);
  })
  .catch((error) => {
    console.log(error);
  });
});
