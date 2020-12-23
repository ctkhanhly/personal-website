import React, { useState, useEffect, useRef }from "react";
import './css.css';
import socketIOClient from "socket.io-client";
const server_url = 'http://' + document.domain + ':' + '5001';//'/bitmoji';


export default () => {

    const [bitmoji_img, setBitmoji_img] = useState("");
    const [upload_url, setUpload_url] = useState("");
    const [download_url, setDownload_url] = useState("");
    const [droppedFiles, setDroppedFiles] = useState("");
    const [dragFilesLabel, setDragFilesLabel] = useState('Drag your file right over here!');
    const formRef = useRef(null);

    var dummy_a_download = document.createElement("a"); //Create <a>
    // var form = document.getElementById("drag_files");
    
    var isAdvancedUpload = function () {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }();



    if(isAdvancedUpload){
        useEffect(() => {

            // needed for ajax upload
            var ajaxFlag = document.createElement('input');
            ajaxFlag.setAttribute('type', 'hidden');
            ajaxFlag.setAttribute('name', 'ajax');
            ajaxFlag.setAttribute('value', 1);
            formRef.current.appendChild(ajaxFlag);

            ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (event) {
                formRef.current.addEventListener(event, function (e) {
                    // preventing the unwanted behaviours
                    e.preventDefault();
                    e.stopPropagation();
                });
            });

            ['dragover', 'dragenter'].forEach(function (event) {
                formRef.current.addEventListener(event, function () {
                    formRef.current.classList.add('dragover');
                });
            });

            ['dragleave', 'dragend', 'drop'].forEach(function (event) {
                formRef.current.addEventListener(event, function () {
                    formRef.current.classList.remove('dragover');
                });
            });
        
            return () => {
              
            }
          });
        
        
    }
    

    const handleDrop = (e) => {
        setDroppedFiles(e.dataTransfer.files); // the files that were dropped

        if (droppedFiles.length > 0)
        {
            console.log('drop event', droppedFiles.length);
            setDragFilesLabel(droppedFiles[0].name);
            var event = document.createEvent('HTMLEvents');
            event.initEvent('submit', true, false);
            formRef.current.dispatchEvent(event);
            if(upload_url){
                URL.revokeObjectURL(upload_url);
            }
            setUpload_url(URL.createObjectURL(droppedFiles[0]));
            // form.querySelector(".drag-files-label").style.backgroundImage =   `url(${obj_url})`;
            formRef.current.style.backgroundImage = `url(${upload_url})`;
            console.log(upload_url);
        }
    }

    const handleSubmit = (e) => {
        if (formRef.current.classList.contains('uploading'))
            return false;

        formRef.current.classList.add('uploading');
        //form.classList.remove('is-error');

        if (isAdvancedUpload) // ajax file upload for modern browsers
        {
            e.preventDefault();

            // gathering the form data
            var ajaxData = new FormData(formRef.current);
            if (droppedFiles) {
                console.log(droppedFiles.length);
                Array.prototype.forEach.call(droppedFiles, function (file) {
                    // ajaxData.append(input.getAttribute('name'), file);
                    ajaxData.append('image', file);
                });
            }

            // ajax request
            var ajax = new XMLHttpRequest();
            ajax.open(formRef.current.getAttribute('method'), formRef.current.getAttribute('action'), true);

            ajax.onload = function () {
                console.log('ajax onload');
                formRef.current.classList.remove('uploading');
                if (ajax.status >= 200 && ajax.status < 400) {
                   
                }
                else {
                    console.log('whoops');
                    alert('Error. Please, contact the webmaster!');
                }
            };

            ajax.send(ajaxData);
        }
    }


    const handleDownloadImage = (e) => {
        if(download_url){
            dummy_a_download.href = download_url; 
            dummy_a_download.download = "bitmoji.jpg"; //File name Here
            dummy_a_download.click(); //Downloaded file
        }
    }

    

    useEffect(() => {
        const socket = socketIOClient(server_url + '/bitmoji');
        socket.on("new_face", data => {
            if(download_url){
                URL.revokeObjectURL(download_url);
            }
            setDownload_url(data);
            setBitmoji_img(data);
        });
        
    }, []);

    return (
        <div class="d-flex flex-row justify-content-center card" >

        {/* <!-- Drag and Drop Image --> */}

        <form id="drag_files" class="drag-drop p-2" 
            method="post" action={`${server_url}/image`}
            enctype="multipart/form-data" novalidate
            onSubmit={handleSubmit}
            onDrop={handleDrop}
            ref={formRef}>

            
            <div class="drag-files-label">
                {dragFilesLabel}
            </div>
        </form>

       

        {/* <!-- End drag and Drop Image --> */}
        <div style={{width:'3vw'}}></div>
        <div class="p-2" id="downloadImage" crossOrigin="anonymous" 
        data-base64-img=""
        style={{backgroundImage: `url(${bitmoji_img})`}}
        onClick={handleDownloadImage}></div>
       
    </div>
    )
}