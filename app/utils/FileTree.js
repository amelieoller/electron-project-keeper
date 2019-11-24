import React from 'react';
var remote = window.require('electron').remote;
var electronFs = remote.require('fs');
import fs from 'fs';

export default class FileTree {
  constructor(path, name = null) {
    this.path = path;
    this.name = name;
    this.items = [];
  }

  build = () => {
    this.items = FileTree.readDir(this.path);
  };

  renderUnorderedList = () => {
    return FileTree.renderUnorderedListHtml(this.items);
  };

  static readDir(path) {
    var fileArray = [];

    fs.readFile(`${path}/NOTES.md`, { encoding: 'utf-8' }, function(err, data) {
      if (!err) {
        var newArr = data.split('\n');
        newArr.forEach(function(item) {
          fileArray.push(item.replace('- ', ''));
        });
      } else {
        console.log(err);
      }
    });

    // electronFs.readdirSync(path).forEach(file => {
    //   var fileInfo = new FileTree(`${path}\\${file}`, file);
    //   var stat = electronFs.statSync(fileInfo.path);

    //   if (stat.isDirectory()) {
    //     fileInfo.items = FileTree.readDir(fileInfo.path);
    //   }

    //   fileArray.push(fileInfo);
    // });

    return fileArray;
  }

  static renderUnorderedListHtml(files) {
    return (
      <ul>
        {files.map((file, i) => {
          return (
            <li key={i}>
              <span>{file}</span>
            </li>
          );
        })}
      </ul>
    );
  }
}
