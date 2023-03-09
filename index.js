

function addNewField(field) {
    let fields = '<div class="row" id="newRow"><div class="col newRow"><input type="text" class="form-control key" placeholder="Key"></div><div class="col"><input type="text" class="form-control value" placeholder="Value"></div></div>'
    const node = document.getElementById('fields').lastElementChild;
    node.insertAdjacentHTML('afterend', fields);
}



function handlekeyandvlaues(row) {
    // Adding key and value to an objjec and adding value and keys
    let obj = {};
    for (let i = 0; i < row.length; i++) {
        inputs = row[i].getElementsByTagName('INPUT');
        let key = ''
        for (let j = 0; j < inputs.length; j++) {
            if (j == 0) {
                key = inputs[j].value
                console.log(key)
            }else if (j == 1) {
                obj[key] = inputs[j].value
            }
        }
    }
    return obj
}

function showFile(blob){

    // It is necessary to create a new blob object with mime-type explicitly set
    // otherwise only Chrome works like it should
    var newBlob = new Blob([blob], {type: "application/pdf"})

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob);
      return;
    }

    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);
    var link = document.createElement('a');
    link.href = data;
    link.download="file.pdf";
    link.click();
    setTimeout(function(){
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
    }, 100);
  }

async function convertfile(datta, file) {
    var data = new FormData()
    loading = document.getElementById('loading')
    loading.style.display="block"
    data.append('docx', file)
    data.append('data', JSON.stringify(datta))
    fetch("https://converter-auto.herokuapp.com/app/convert/", {
        method: "POST",
        body: data,
      })
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error('Something went wrong');
      })
      .then((data) => {
        showFile(data)
        // var file = window.URL.createObjectURL(blob);
        // window.location.assign(file);
        // Do something with the response
        loading.style.display="none"
      })
      .catch((error) => {
        console.log(error)
      });

}


function logSubmit(event) {
    event.preventDefault();
    const row = document.getElementsByClassName("row");
    const file = document.getElementById("wordfile").files[0];
    let data = handlekeyandvlaues(row)
    convertfile(data, file)

}

let form = document.getElementById('userform')

form.addEventListener("submit", logSubmit)