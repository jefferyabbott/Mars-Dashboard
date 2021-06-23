let store = {
    selectedRover: '',
    roverData: {},
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state);
    
    // show images
    // if (Object.keys(state.roverData).length !== 0) {
    //     const imageContainer = document.getElementById('rover_images');
    //     state.roverData.forEach((r) => {
    //         const imgDiv = document.createElement('div');
    //         const imgElement = document.createElement('img');
    //         imgElement.src = r.img_src;
    //         imgElement.classList.add('roverImg');
    //         const camera = document.createElement('p');
    //         camera.textContent = r.camera.full_name

    //         imgDiv.appendChild(imgElement)
    //         imgDiv.appendChild(camera)
    //         imageContainer.appendChild(imgDiv);
    //     });
    // }
    
}

const showImages = (state) => {
    
    if (Object.keys(state.roverData).length !== 0) {
        let imageContent = `<div class="container">
        <div class="row">

      `
      state.roverData.forEach((r) => {
        imageContent += `<div class="col-lg-4">
        <img src="${r.img_src}" class="roverImg" alt="...">
      </div>`
      })
      imageContent +=  `
    </div></div>
        `
        return imageContent
    } else {
        return `<div>Please select a rover</div>`
    }

}

const displayRoverData = (rover) => {
    
    const allRovers = document.querySelectorAll('.roverLabel')
    allRovers.forEach((r) => {
        r.classList.remove('seletedRover');
    });

    store.selectedRover = rover 
    loadRoverImages(rover)


}

// generate menu
const roverLinks = (rovers) => {
    let roverList = ''
    rovers.forEach((r) => {
        roverList += `<li onclick="displayRoverData('${r}')"><p class="dropdown-item">${r}</p></li>`
    })
    return roverList
}

// create content
const App = (state) => {
    let { rovers } = state

    return `
        <header>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Mars Dashboard</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDarkDropdown" aria-controls="navbarNavDarkDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDarkDropdown">
      <ul class="navbar-nav">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Rovers
          </a>
          <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
          ${roverLinks(rovers)}
        </li>
      </ul>
    </div>
  </div>
</nav>


        </header>
        <hr/>
        <main>
            ${showImages(state)}
        </main>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS



// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

// ------------------------------------------------------  API CALLS

const loadRoverImages = (rover) => {
    let url = new URL(`http://localhost:3000/nasa?rover=${rover}`);
    fetch(url)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Oops! Something went wrong! Please try again.');
            }
        }).then(data => {
            const roverData = data.roverData.photos
            updateStore(store, {...store, roverData} );
        }).catch(error => {
            alert(error.message);
        });
}

