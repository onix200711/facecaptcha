export let result = null;
document.addEventListener("DOMContentLoaded", function() {
    // Create elements for the captcha
    const container = document.createElement('div');
    let checkbox = document.createElement('img');
    let checkboxState = "open";
    const text = document.createElement('span');
    const logo = document.createElement('img');
    // Set styles for container
    container.style.cssText = 'font-family: Arial, Helvetica, sans-serif;display: flex; align-items: center; border: 1px solid #ddd; padding: 13px; border-radius: 5px; width: fit-content;';

    // Set attributes and styles for checkbox
    checkbox.style.cssText = 'width: 20px; height: 20px; margin-right: 10px;';
    checkbox.src = "https://www.svgrepo.com/show/309415/checkbox-unchecked.svg"
    // Set attributes and styles for logo
    logo.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABrUlEQVR4nO1bWw6DMAyDaUfZ/U/EXbqvThNqIS/HIOJvktrug6aFdUlE25YmeW79LCuay68tdANS0TOgzYAl9wrfA2UEJGm0+A6ECeEJUeI7ok0ITYYW3xFpQliiLPEdUSaEJMkW3xFhgjsBS3yH1wRXsFX8EWlLTo8Jb2ugBRKi/Zm0BdUaqCVo6SVNG9ZR8LIEaWEll1ETwA1wL1JXrAUYVZ2kTUt7KVPgyoAZEL5nB02FGgGWoLPeyDzR8cI8Au4k8giuKTAy4W7GuLfCdxO8Ry2CbAJslAFsAmxAS9Rpo+DSWNOWmAjigEJiBPpmSTQFUKczZ3kzToUevwacGoDuhVn+rDPBGgFsAmyUAWwCbNANmL2ns6pMugFsUA24wtFa6t1gh0YY+q4w1ABkj41yR5hSawCbABtlAJsAG2UAmwAbZQCbABtlAJsAG483ILQWaNvSpPXAaB/vibUCdjExE+P52gvxGS1sCozISgV4YrV4/BoANeC/17Q96InVoEYAmwAbZQCbABvQjcf+Hez5AQL1K02NAOmDUb/IZO0Epdvq8I+V2LWA9m7iC+wvmhFEkZEHAAAAAElFTkSuQmCC'; // Replace with your logo URL
    logo.alt = 'Logo';
    logo.style.cssText = 'width: 22px; height: 22px; margin-left: 19px;';
    const logoandtext = document.createElement('div');
    logoandtext.style.cssText = 'margin-left: 10px;position:relative;bottom:3px'
    const name = document.createElement('span');
    name.innerText = "FaceCaptcha";
    name.style.cssText = 'font-size:9px; margin-left:3px;font-family: Arial, Helvetica, sans-serif;font-weight:700;color:#BBBBBB; position:relative; top:4px'
    logoandtext.appendChild(logo);
    logoandtext.appendChild(document.createElement('br'))
    logoandtext.appendChild(name);
    // Set text content
    text.innerText = "I'm not a robot";

    // Append elements to container
    container.appendChild(checkbox);
    container.appendChild(text);
    container.appendChild(logoandtext);

    // Append container to the target div
    const placeholder = document.getElementById('facecaptcha-widget');
    const apiKey = placeholder.getAttribute('data-api-key');
    placeholder.innerHTML = '';  // Clear existing content
    placeholder.appendChild(container);

    const containthetext = document.createElement('div');
    containthetext.innerHTML = 'We need to take a photo to insure that you are not a robot. Your photo will not be stored or used';
    containthetext.style.cssText = 'font-family: Arial, Helvetica, sans-serif;background-color:rgb(248, 220, 62); border-radius:10px;width:100%; padding:10px; height:auto; margin-bottom:5%'
    // Function to create and display the modal
    function showModal() {
        // Create modal elements
        checkbox.src = "https://global.discourse-cdn.com/sitepoint/original/3X/e/3/e352b26bbfa8b233050087d6cb32667da3ff809c.gif";
        const event = new Event("captcha-end");
        const modalOverlay = document.createElement('div');
        const modalContent = document.createElement('div');
        const closeButton = document.createElement('span');
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const timeOut = document.createElement('div');
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'width:90%; height:90%; position:relative; top:5%; left:5%';
        let showOverlay = true;
        timeOut.style = "position: absolute;top: 0; left:0; width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;font-size: 500%; opacity: 0.75; color: white;";
        video.autoplay = "true";
        // Set styles for close button
        closeButton.innerHTML = '&times;';
        closeButton.style.cssText = 'position: absolute; top: 10px; right: 10px; cursor: pointer; font-size: 20px;';
        wrapper.appendChild(containthetext);
        wrapper.appendChild(canvas);
        wrapper.appendChild(video);
        modalContent.appendChild(wrapper);
        modalContent.appendChild(timeOut);
        // Add event listener to close the modal
        closeButton.addEventListener('click', function() {
            showOverlay = false;
            document.body.removeChild(modalOverlay);
            checkbox.src = "https://www.svgrepo.com/show/309415/checkbox-unchecked.svg"
        });

        // Append close button to modal content
        modalContent.appendChild(closeButton);
        
        canvas.style = "position: absolute, display: none; visibility: hidden;";
        video.style = "position: absolute;width: 100%;max-width: 100%;max-height:80%;aspect-ratio:1; min-width: 100%;min-height:80%;object-fit: cover;left:0; transform: scaleX(-1) ;"
         if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
            timeOut.textContent = 3;
            setTimeout(function(){
                timeOut.textContent = 2;
                setTimeout(function(){
                    timeOut.textContent = 1;
                    setTimeout(function(){
                        timeOut.textContent = 0;
                    }, 1000)
                }, 1000)
            }, 1000)
            video.srcObject = stream;
            setTimeout(function(){
                const context = canvas.getContext("2d");
                const width = video.videoWidth;
                const height = video.videoHeight;
                canvas.width = width;
                canvas.height = height;
                context.drawImage(video, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
                const data = canvas.toDataURL("image/png");
                function getCookie(name) {
                    let cookieValue = null;
                    if (document.cookie && document.cookie !== '') {
                        const cookies = document.cookie.split(';');
                        for (let i = 0; i < cookies.length; i++) {
                            const cookie = cookies[i].trim();
                            // Does this cookie string begin with the name we want?
                            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                break;
                            }
                        }
                    }
                    return cookieValue;
                }
                const csrftoken = getCookie('csrftoken');
                let headers = new Headers();
                headers.append('X-CSRFToken', csrftoken);
                headers.append("Content-Type", "application/json");
                if(showOverlay == true){
                    modalContent.innerHTML = '';
                    modalContent.appendChild(closeButton);
                    const loading = document.createElement('img');
                    loading.src = "https://global.discourse-cdn.com/sitepoint/original/3X/e/3/e352b26bbfa8b233050087d6cb32667da3ff809c.gif";
                    loading.style = "position:absolute; left:50%; top:50%; transform:translate(-50%, -50%);width:50px; height:50px";
                    modalContent.appendChild(loading);
                    stream.getTracks().forEach(function(track) {
                        track.stop();
                      });
                      console.log(Date.now());
                fetch('https://facecaptcha.vercel.app/add/',{
                    method: "POST",
                    body: JSON.stringify({image:data.substring(22, data.length), apikey: apiKey}),
                    headers: headers,
                })
                .then((response) => response.json())
                  .then((data) => {
                    console.log(data);
                    console.log(Date.now());
                    result = data;
                    if(data.result == true){
                        document.body.removeChild(modalOverlay);
                        checkbox.src = "https://www.svgrepo.com/show/309414/checkbox-checked.svg"
                        console.log(video.srcObject);
                        checkbox.removeEventListener('change', null);
                        checkboxState = "close";
                    } else {
                        
                        showOverlay = false;
                        document.body.removeChild(modalOverlay);
                        checkbox.src = 'https://static.thenounproject.com/png/1921206-200.png';
                    }
                    window.dispatchEvent(event);
                    console.log(data);
                  });
                } else {
                    stream.getTracks().forEach(function(track) {
                        track.stop();
                      });
                }
            }, 4000)
            })
            .catch(function () {
            console.log("Something went wrong!");
            });
        }
        // Set styles for modal overlay
        modalOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;';

        // Set styles for modal content
        modalContent.style.cssText = 'position: relative; background-color: #fff; border-radius: 10px; padding: 20px; width: 500px; height: 600px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);';

        // Append modal content to modal overlay
        modalOverlay.appendChild(modalContent);

        // Append modal overlay to body
        document.body.appendChild(modalOverlay);
    }

    // Add event listener to checkbox
    checkbox.addEventListener('click', function() {
        if (checkboxState == "open") {
            showModal();
        }
    });
});
