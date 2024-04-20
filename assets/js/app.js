let cl = console.log;

const postForm = document.getElementById("postForm");
const postContainer = document.getElementById("postContainer");
const addPostBtn = document.getElementById("addPostBtn");
const updatePostBtn = document.getElementById("updatePostBtn");
const title = document.getElementById("title");
const content = document.getElementById("content");
const userId = document.getElementById("userId");
const loader = document.getElementById("loader")


const baseUrl = `https://jsonplaceholder.typicode.com`;
const postUrl = `${baseUrl}/posts`;

// [fetching postUrl 
// here fetch returns promise so we have to consume it and res.sson() 
// also returns peomise indirectily .then returns peomise 
// therefore we have to consume .then with .then and .catch
// as shown bleow ]
 
// fetch(postUrl, {
//     method : "GET",
//     body : null
// })
//      .then(res => {
//        return res.json()
//      })
//      .then(data =>{
//         cl(data)
//         templating(data);
//      })
//       .catch(err => cl(err));

const snackbarMsg = (msg , icon , timer) => {
     swal.fire({
        title : msg,
        icon : icon,
        timer :  timer
     })
}

const templating = (arr) => {
    let result = ``;
    
    arr.forEach(obj => {
        result +=  `
        <div class="card mb-4" id=${obj.id}>
            <div class="card-header">
            <h3>${obj.title}</h3>
            </div>
            <div class="card-body">
                <p class="m-0">${obj.body}</p>
            </div>
            <div class="card-footer">
                <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
            </div>
        </div>
                   `
    });
   
     postContainer.innerHTML = result;         
}

// on edit 
const onEdit = (ele) => {
    // cl(ele)
    //  edit id 
    let editId = ele.closest(".card").id;
    localStorage.setItem("editId", editId);
    //  edit url 
    let editUrl = `${baseUrl}/posts/${editId}`
    // loader show 
    loader.classList.remove('d-none')
     // edit api 
    fetch(editUrl, {
        method : 'GET'
    })
    .then(res => {
       return  res.json()}
    )
    .then(data => {
        cl(data)
        snackbarMsg(`post with ${editId} is ready to edit !!!`, 'success' , 1500)
        title.value = data.title;
        content.value = data.body;
        userId.value = data.userId;
        addPostBtn.classList.add('d-none')
        updatePostBtn.classList.remove('d-none')
    })
    .catch(err => cl(err))
    .finally(() => {
     // loader.classList.remove("d-none")
    loader.classList.add('d-none')
})
}

const onDelete = (ele) => {
    Swal.fire({
        title: "Are you sure? Do you want to delete it",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          //  delete id 
         let deleteId = ele.closest('.card').id;
         // delete url 
         let deleteUrl = `${baseUrl}/posts/${deleteId}`
         //  delete api call 
         loader.classList.remove('d-none')
             fetch(deleteUrl , {
                method : 'DELETE',
                body : null, 
                header : {
                    'Content-type' : 'Application/json',
                    'Authtoken' : 'JWT Token From Local Storage '
                }
             })
             .then(res => res.json())
             .then(data => { 
                cl(data)
                document.getElementById(deleteId).remove();
            })
            .catch(err => snackbarMsg('something went wrong ','error',1000))
            .finally(() => {
                loader.classList.add('d-none')
            })
         // after success remove card feom UI 

         Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });
}

const prependPost = (obj) => {
    let card = document.createElement("div");
    card.className = "card mb-4";
    card.id = obj.id;
    // cl(card)
    card.innerHTML = `
    <div class="card-header">
    <h3>${obj.title}</h3>
    </div>
    <div class="card-body">
        <p class="m-0">${obj.body}</p>
    </div>
    <div class="card-footer">
        <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
        <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
    </div>
                     `
        postContainer.append(card);      
}

//  default method GET 

const fetchAllPosts = () => {
    //  loader show 
    loader.classList.remove("d-none");
    fetch(postUrl , {
        method : 'GET',
        body : null 
    })
    .then(res => res.json())
    .then(data => templating(data))
    .catch(err => cl(err))
    .finally(() => loader.classList.add('d-none'));
}

fetchAllPosts()

// adding posts with fetch api with post configuration 

const onAddPosts = (eve) => {
    eve.preventDefault();
    // cl("posts added")
    let postObj = {
        title : title.value,
        body : content.value,
        userId : userId.value
        // id : res.id
    }
    cl(postObj);
     //loader show
     loader.classList.remove("d-none");

    fetch(postUrl , {
        method : 'POST',
        body : JSON.stringify(postObj)
    })
    .then(res => {  
        return res.json();
    })
    .then(res => {
        cl(res)
        postObj.id = res.id;
        prependPost(postObj)
        snackbarMsg(`post created successfully with id ${postObj.id} !!!` , "success" , 2000)
    })
    .catch((err) => {
        cl(err);
        snackbarMsg(`something went wrong  !!!` , "error" , 2000)

    })
    .finally(() => {
        //loader hides 
     loader.classList.add("d-none");
     postForm.reset();
    })
}

const onUpdatePost = () => {
    // updated id
    let updateId = localStorage.getItem("editId")
    // cl(updateId)

    let updateUrl = `${baseUrl}/posts/${updateId}`
    let updatedObj = {
        title : title.value,
        body : content.value,
        userId : userId.value
    }
    cl(updatedObj);
    // loader show 
    loader.classList.remove('d-none')
    // fetch api 
    fetch(updateUrl , {
        method : 'PATCH',
        body : JSON.stringify(updatedObj)
    })
    .then(res => res.json())
    .then(data => {
        // cl(data)
        // prependPost(updatedObj)
        let card = [...document.getElementById(updateId).children]
        card[0].innerHTML = ` <h3>${updatedObj.title}</h3>`;
        card[1].innerHTML = ` <p class="m-0">${updatedObj.body}</p>`;
          loader.classList.add('d-none');
        snackbarMsg(`post with id ${updateId} is updated successfully !!!`, "success" , 2000)
    })
    .catch(err => cl(err))
    .finally(() => {
         updatePostBtn.classList.add('d-none')
         addPostBtn.classList.remove('d-none')
         postForm.reset()
    })
}

postForm.addEventListener("submit" , onAddPosts);
updatePostBtn.addEventListener('click' , onUpdatePost)