const puppeteer = require('puppeteer');
const prompt = require('prompt-sync')({ sigint: true });
const fs = require('fs');
const https = require('https');
const path = require('path');
require('dotenv').config();

const basePath = process.env.basepath

async function main(){
  const urlToGoTo = prompt("Enter URL you want to scrape: ").trim();
  const folderName = prompt("Enter the folder name where you want to download these images to: ").trim();
  if(!urlToGoTo) process.exit();
  
  // Initialize browser stuff
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(urlToGoTo);

  // Get all image srcs on a page and store them
  const images = await page.evaluate(() => Array.from(document.images, e => {
    if(e.src.startsWith("http")) return e.src
    if(e.dataset.src && e.dataset.src.startsWith('http')) return e.dataset.src
      return null;
    }).filter(val => val)
  );

  const uniqueImages = [
    ...new Set(images)
  ]

  await browser.close();

  // Create folder if we have images
  if(!Array.isArray(images)) process.exit();

  if (!fs.existsSync(`${basePath}/${folderName}`)){
    fs.mkdirSync(`${basePath}/${folderName}`);
  }

  async function downloadImage(imgSource, name){
    https.get(imgSource, (res) => {
      const extension = path.extname(imgSource);
      const finalExtension = extension.split('?')[0];
      const filename = name || path.basename(imgSource);

      const filePath = `${basePath}/${folderName}/${filename}${finalExtension}`;
      const writeStream = fs.createWriteStream(filePath);
   
      res.pipe(writeStream);
   
      writeStream.on("finish", () => {
         writeStream.close();
      })
   })
  }

  // For every image sourcec, we have to download it.
  for(let i = 0; i < uniqueImages.length; i ++) {
    const randomStringPart = (Math.random() + 1).toString(36).substring(7);
    await downloadImage(uniqueImages[i], `image-${i}-${randomStringPart}`);
  }
}

main();