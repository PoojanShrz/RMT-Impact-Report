# The Conduit: Annual Report

Instructions provided below will help you to get up and running with this project.

---
## Requirements

For development, you will only need Node.js, a node global package manager npm/yarn and Gulp installed in your environment. Tested on Node version: 9 and 10


---

## Install

    $ Clone this repository
    $ cd PROJECT_TITLE
    $ yarn install
    
## Running the project

    $ gulp
    
--- 

## Folder Structure

![Folder Structure](https://storage.googleapis.com/pagevamp-misc/clients/misc/conduit-folder-structure.jpg)   


As seen above, all the development files are inside "dev" folder.
* Main file: dev/index.html
* Custom Script: dev/scripts/app.js
* All Images: dev/images
* SCSS files: dev/scss

## Content Editing

* You can find folders named as per category inside  "dev/includes" folder
* Files inside folders are named as per the URL anchor points.
Eg: https://ourstorysofar.theconduit.com/#conduit/identityglobal can be edited on dev/includes/identity/identityglobal.html

* You can update text/images as required but make sure "gulp" command is running on terminal. This will ensure, you can see the changes made on your local and all the files are compiled inside "dist/" folder.
* Once you are done with the changes, you can upload files those are inside "dist/" folder to server


