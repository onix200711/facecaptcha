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

  
  function yes()
  {
    /* fetch('http://127.0.0.1:8000/',{
        method: "POST",
        body: JSON.stringify({plan:'starter'}),
        headers: headers,
    credentials: 'include'
    }) */ 
    window.location.href = 'https://facecaptcha.vercel.app/signup/';
  }
  function f1(){window.scrollTo(0, 0);};
  function f2(){window.scrollTo(0, 700);};
  function f3(){window.scrollTo(0, 1250);};
  function f4(){window.scrollTo(0, 1850);};
  function f5(){window.scrollTo(0, 2610);};
