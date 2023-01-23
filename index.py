import urllib.request
import os
from pathlib import Path
from datetime import datetime


def generate_folder_name():
  now = datetime.now()
  dt_string = now.strftime("%d-%m-%Y %H-%M-%S")
  return dt_string

# Get URL to get images from.
# urlToScrape = input("Please enter the URL you wish to scrape: ")

#Get the download path and set it as curent target for downloading.
downloads_path = str(Path.home() / "Downloads")

new_folder_name = input("Declare the name for the folder to which you want to download the images.") or generate_folder_name()
new_folder_path = os.path.join(downloads_path, new_folder_name)

os.mkdir(new_folder_path)
os.chdir(new_folder_path)

with urllib.request.urlopen('https://dpdk.com/assets/home/DSC09892.webp') as response:
  info = response.info()
  file_extension = info.get_content_subtype()

urllib.request.urlretrieve("https://dpdk.com/assets/home/DSC09892.webp", "test-image-file-name." + file_extension)

# print(urlToScrape)