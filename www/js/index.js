/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    HTML: '<html><head></head><body><h1>Page content.</h1></body></html>',

    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    openIAB: function() {

        this.createHtmlFile(function(url) {
            console.log('Success', url);

            var ref = cordova.InAppBrowser.open(url, '_blank', 'usewkwebview=yes');
        }, function(e) {
            console.error('Error creating HTML file', e);
        });

    },

    createHtmlFile: function(onSuccess, onError) {
        var self = this;

        window.resolveLocalFileSystemURL(cordova.file.documentsDirectory, function (dirEntry) {

            console.log('Got directory', dirEntry);

            // Check if the file already exists.
            dirEntry.getFile('file.html', { create: true, exclusive: false }, function(fileEntry) {
                // Already exists, finish.
                console.log('File created');

                self.writeFile(fileEntry, new Blob([self.HTML], { type: 'text/html' }), function() {
                    console.log('File written');
                    onSuccess(fileEntry.toURL());
                }, onError);
            }, onError);

        }, onError);
    },

    writeFile: function(fileEntry, dataObj, onSuccess, onError) {
        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter(function (fileWriter) {

            fileWriter.onwriteend = function() {
                onSuccess();
            };

            fileWriter.onerror = function (e) {
                console.error("Failed file write: ", e);
                onError(e);
            };

            // If data object is not passed in,
            // create a new Blob instead.
            if (!dataObj) {
                dataObj = new Blob(['some file data'], { type: 'text/plain' });
            }

            fileWriter.write(dataObj);
        });
    }
};

app.initialize();